#!/usr/bin/env python3
"""
traductor_daemon.py — Sub-agente de traducción (0 tokens IA de pago).

Daemon JSON-lines sobre stdin/stdout que expone Argos Translate (CTranslate2,
redes neuronales OFFLINE en el dispositivo). Protocolo:

  -> {"id": 1, "op": "translate", "source": "en", "target": "es", "text": "..."}
  <- {"id": 1, "ok": true, "text": "..."}

  -> {"id": 2, "op": "pairs"}
  <- {"id": 2, "ok": true, "pairs": ["en>es", ...]}

  -> {"id": 3, "op": "install", "source": "en", "target": "fr"}
  <- {"id": 3, "ok": true, "pairs": [...]}          (descarga el paquete 1 vez)

  -> {"id": 4, "op": "translate", ...}              (pivote automático por
  <- {"id": 4, "ok": true, "text": "..."}            inglés si no hay par directo)

Errores: {"id": N, "ok": false, "error": "mensaje"}. Una respuesta por línea,
UTF-8 estricto. El directorio de datos se fija con ARGOS_DATA_DIR (el padre
apunta a userData de la app para que las descargas vivan con Keryx).

Requiere: pip install argostranslate (una vez, en la máquina del usuario).
"""

from __future__ import annotations

import json
import sys
from typing import Any, Dict, Optional, Tuple


def respond(payload: Dict[str, Any]) -> None:
    sys.stdout.write(json.dumps(payload, ensure_ascii=False) + "\n")
    sys.stdout.flush()


class Motor:
    """Carga perezosa de Argos + caché de traductores por par."""

    def __init__(self) -> None:
        self._langs: Optional[Dict[str, Any]] = None
        self._translators: Dict[Tuple[str, str], Any] = {}

    def idiomas(self) -> Dict[str, Any]:
        if self._langs is None:
            from argostranslate import translate

            self._langs = {lang.code: lang for lang in translate.get_installed_languages()}
        return self._langs

    def pares(self) -> list[str]:
        idiomas = self.idiomas()
        pares: list[str] = []
        for desde, desde_lang in idiomas.items():
            for hasta, hasta_lang in idiomas.items():
                if desde == hasta:
                    continue
                try:
                    if desde_lang.get_translation(hasta_lang) is not None:
                        pares.append(f"{desde}>{hasta}")
                except Exception:
                    continue
        return sorted(pares)

    def traductor(self, source: str, target: str):
        clave = (source, target)
        if clave not in self._translators:
            idiomas = self.idiomas()
            desde = idiomas.get(source)
            hasta = idiomas.get(target)
            if desde is None or hasta is None:
                raise RuntimeError(
                    f"Paquete de idioma no instalado: {source} o {target}. Instala primero el par."
                )
            tr = desde.get_translation(hasta)
            if tr is None:
                raise RuntimeError(f"Par {source}>{target} no instalado (pivote por 'en' si aplica).")
            self._translators[clave] = tr
        return self._translators[clave]

    def traducir(self, source: str, target: str, text: str) -> str:
        if not text.strip():
            return text
        return str(self.traductor(source, target).translate(text))

    def instalar(self, source: str, target: str) -> list[str]:
        from argostranslate import package

        remoto = {(p.from_code, p.to_code): p for p in package.get_available_packages()}
        directo = remoto.get((source, target))
        pasos: list[Tuple[str, str]] = []
        if directo is not None:
            pasos = [(source, target)]
        else:
            # Pivote por inglés: source>en + en>target.
            for par in [(source, "en"), ("en", target)]:
                if remoto.get(par) is not None:
                    pasos.append(par)
            if not pasos:
                raise RuntimeError(f"Sin paquete disponible para {source}>{target}.")
        for par in pasos:
            if par not in remoto:
                continue
            instalado = False
            try:
                instalado = any(
                    p.from_code == par[0] and p.to_code == par[1]
                    for p in package.get_installed_packages()
                )
            except Exception:
                instalado = False
            if instalado:
                continue
            pkg = remoto[par]
            package.install_from_path(pkg.download())
        self._langs = None
        self._translators.clear()
        return self.pares()


def main() -> None:
    motor = Motor()
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            req = json.loads(line)
            req_id = req.get("id")
            op = req.get("op", "translate")
            if op == "pairs":
                respond({"id": req_id, "ok": True, "pairs": motor.pares()})
            elif op == "install":
                pairs = motor.instalar(req["source"], req["target"])
                respond({"id": req_id, "ok": True, "pairs": pairs})
            elif op == "translate":
                text = motor.traducir(req["source"], req["target"], req["text"])
                respond({"id": req_id, "ok": True, "text": text})
            else:
                respond({"id": req_id, "ok": False, "error": f"Operación desconocida: {op}"})
        except Exception as exc:
            respond({"id": req.get("id"), "ok": False, "error": str(exc)})


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        pass
