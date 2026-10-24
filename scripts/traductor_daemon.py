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

  -> {"id": 5, "op": "translate_batch", "source": "es", "target": "en",
      "items": ["...", "..."]}                      (un capitulo entero en UNA
  <- {"id": 5, "ok": true, "texts": ["...", "..."]}  llamada; mismo orden)

Errores: {"id": N, "ok": false, "error": "mensaje"}. Una respuesta por línea,
UTF-8 estricto. El directorio de datos se fija con ARGOS_DATA_DIR (el padre
apunta a userData de la app para que las descargas vivan con Keryx).

Requiere: pip install argostranslate (una vez, en la máquina del usuario).
"""

from __future__ import annotations

import json
import os
import sys
import threading
from concurrent.futures import ThreadPoolExecutor
from typing import Any, Dict, Optional, Tuple

STDOUT_LOCK = threading.Lock()
CANDADO_INIT = threading.Lock()


def respond(payload: Dict[str, Any]) -> None:
    with STDOUT_LOCK:
        sys.stdout.write(json.dumps(payload, ensure_ascii=False) + "\n")
        sys.stdout.flush()


def configurar_velocidad() -> None:
    """CTranslate2: int8 + workers paralelos (env KERYX_MT_INTER/INTRA/COMPUTE).

    Bench medido (capitulo de 36 versiculos es>en, 20 nucleos):
    camino Argos verso a verso ~6000 ms; lote unico int8 inter=20 intra=1
    beam=4 ~1370 ms con la MISMA calidad de beam 4.
    """
    try:
        from argostranslate import settings

        settings.inter_threads = int(os.environ.get("KERYX_MT_INTER", "8"))
        settings.intra_threads = int(os.environ.get("KERYX_MT_INTRA", "1"))
        settings.compute_type = os.environ.get("KERYX_MT_COMPUTE", "int8")
    except Exception:
        pass


# ── Lenguas nativas (sub-agente de codigo, 0 tokens IA) ──────────────────────
# Modelos CTranslate2 instalados una vez con scripts/instalar_dialectos.py en
# KERYX_DIALECTOS_DIR. Un NLLB-200-600M cubre quechua/aymara/bengali/guarani;
# mapudungun usa los m2m100 de byumatrixlab (por direccion).

DIALECTOS_NLLB: Dict[str, str] = {
    "qu": "quy_Latn",
    "ay": "ayr_Latn",
    "bn": "ben_Beng",
    "gn": "grn_Latn",
}

# Guard anti-degeneracion (codigo determinista, 0 IA): los modelos de bajas
# recursos a veces colapsan a repeticiones ("Dio Dio Dio..."). Se detecta por
# n-gramas y se reintenta greedy; si persiste, se devuelve el ORIGINAL
# (principio del repo: si el modulo no da el dato, la seccion no existe).


def salida_degenerada(original: str, traducido: str) -> bool:
    if not traducido or not traducido.strip():
        return True
    if len(original.strip()) > 30 and len(traducido.strip()) < 3:
        return True
    palabras = [p for p in traducido.lower().split() if len(p) >= 2]
    if len(palabras) >= 6:
        for i in range(len(palabras) - 4):
            gramo = tuple(palabras[i : i + 2])
            if sum(1 for j in range(len(palabras) - 1) if tuple(palabras[j : j + 2]) == gramo) >= 5:
                return True
    for palabra in palabras:
        if palabras.count(palabra) >= 8:
            return True
    return False


def normalizar_salida(texto: str) -> str:
    return " ".join(texto.split())


class Dialectos:
    """Modelos CTranslate2 crudos con receta NLLB: [src]+piezas+[</s>] y
    target_prefix=[<tgt>]. Import perezoso (transformers pesa ~2 s)."""

    def __init__(self) -> None:
        self._modelos: Dict[Tuple[str, str, str], Tuple[Any, Any]] = {}

    def raiz(self) -> str:
        return os.environ.get("KERYX_DIALECTOS_DIR", "")

    def par(self, source: str, target: str) -> Optional[Tuple[str, str, str]]:
        """Devuelve (dir_modelo, token_src, token_tgt) si hay dialecto directo."""
        raiz = self.raiz()
        if not raiz:
            return None
        if source == "es" and target in DIALECTOS_NLLB:
            return (os.path.join(raiz, "nllb-qu"), "spa_Latn", DIALECTOS_NLLB[target])
        if target == "es" and source in DIALECTOS_NLLB:
            return (os.path.join(raiz, "nllb-qu"), DIALECTOS_NLLB[source], "spa_Latn")
        if source == "es" and target == "arn":
            return (os.path.join(raiz, "m2m-es-arn"), "spa_Latn", "arn_Latn")
        if target == "es" and source == "arn":
            return (os.path.join(raiz, "m2m-arn-es"), "arn_Latn", "spa_Latn")
        return None

    def disponible(self, source: str, target: str) -> bool:
        return self.par(source, target) is not None

    def modelo(self, dir_path: str) -> Tuple[Any, Any]:
        clave = (dir_path, "modelo")
        if clave not in self._modelos:
            with CANDADO_INIT:
                if clave not in self._modelos:
                    from ctranslate2 import Translator
                    from transformers import AutoTokenizer

                    tok = AutoTokenizer.from_pretrained(dir_path)
                    translator = Translator(dir_path, device="cpu", compute_type="int8")
                    translator.load_model()
                    self._modelos[clave] = (tok, translator)
        return self._modelos[clave]

    def traducir(self, dir_path: str, source_lang: str, target_lang: str, text: str) -> str:
        tok, translator = self.modelo(dir_path)

        def inferir(beam: int) -> str:
            res = translator.translate_batch(
                [[source_lang] + tok.tokenize(text) + ["</s>"]],
                beam_size=beam,
                num_hypotheses=1,
                return_scores=False,
                target_prefix=[[target_lang]],
            )
            hip = res[0].hypotheses[0]
            if hip and hip[0] in (source_lang, target_lang):
                hip = hip[1:]
            return tok.decode(tok.convert_tokens_to_ids(hip)).strip()

        salida = normalizar_salida(inferir(4))
        if salida_degenerada(text, salida):
            salida = normalizar_salida(inferir(1))
            if salida_degenerada(text, salida):
                return text
        return salida

    def lote(self, dir_path: str, source_lang: str, target_lang: str, textos: list[str]) -> list[str]:
        tok, translator = self.modelo(dir_path)
        tokenized = []
        validas: list[int] = []
        for index, texto in enumerate(textos):
            if texto.strip():
                tokenized.append([source_lang] + tok.tokenize(texto) + ["</s>"])
                validas.append(index)

        def inferir(beam: int) -> Dict[int, str]:
            res = translator.translate_batch(
                tokenized,
                beam_size=beam,
                num_hypotheses=1,
                return_scores=False,
                target_prefix=[[target_lang]] * len(tokenized),
            )
            decodas: Dict[int, str] = {}
            for pos, r in enumerate(res):
                hip = r.hypotheses[0]
                if hip and hip[0] in (source_lang, target_lang):
                    hip = hip[1:]
                decodas[validas[pos]] = normalizar_salida(tok.decode(tok.convert_tokens_to_ids(hip)).strip())
            return decodas

        decodas = inferir(2)
        for index in validas:
            if salida_degenerada(textos[index], decodas.get(index, "")):
                decodas.update({k: v for k, v in inferir(1).items() if k == index})
                if salida_degenerada(textos[index], decodas.get(index, "")):
                    decodas[index] = textos[index]
        return [decodas.get(index, texto) for index, texto in enumerate(textos)]


class Motor:
    """Carga perezosa de Argos + caché de traductores por par."""

    def __init__(self) -> None:
        self._langs: Optional[Dict[str, Any]] = None
        self._translators: Dict[Tuple[str, str], Any] = {}
        self.dialectos = Dialectos()

    def idiomas(self) -> Dict[str, Any]:
        if self._langs is None:
            with CANDADO_INIT:
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
        for desde in ["es", "qu", "ay", "bn", "gn", "arn"]:
            for hasta in ["es", "qu", "ay", "bn", "gn", "arn"]:
                if desde != hasta and self.dialectos.disponible(desde, hasta):
                    pares.append(f"{desde}>{hasta}")
        return sorted(pares)

    def traductor(self, source: str, target: str):
        clave = (source, target)
        if clave not in self._translators:
            with CANDADO_INIT:
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

    @staticmethod
    def _base(tr: Any) -> Any:
        """Desenvuelve CachedTranslation -> PackageTranslation real."""
        base = tr
        while hasattr(base, "underlying"):
            base = base.underlying
        return base

    def hay_argos(self, source: str, target: str) -> bool:
        try:
            self.traductor(source, target)
            return True
        except Exception:
            return False

    def lote(self, source: str, target: str, items: list[str]) -> list[str]:
        """Lote rapido: TODAS las frases de TODOS los items en UNA llamada
        a CTranslate2 (paraleliza workers); con pivote por 'en' si no hay
        par directo; cae al camino lento/identidad si todo falla."""
        textos = [str(item) for item in items]
        par = self.dialectos.par(source, target)
        if par is not None:
            try:
                return self.dialectos.lote(par[0], par[1], par[2], textos)
            except Exception:
                pass
        nativos = {"qu", "ay", "bn", "arn", "gn"}
        if source in nativos and target != "es":
            # dialecto -> es (modelo nativo) y luego es -> X (argos)
            par_es = self.dialectos.par(source, "es")
            paso = textos
            if par_es is not None:
                try:
                    paso = self.dialectos.lote(par_es[0], par_es[1], par_es[2], textos)
                except Exception:
                    paso = textos
            if not self.hay_argos("es", target):
                return paso if source == "es" else textos
            return self._lote_argos("es", target, paso)
        if target in nativos and source != "es":
            # X -> es (argos) y luego es -> dialecto (modelo nativo)
            if self.hay_argos(source, "es"):
                paso = self._lote_argos(source, "es", textos)
            else:
                paso = textos
            par_es = self.dialectos.par("es", target)
            if par_es is None:
                return textos
            try:
                return self.dialectos.lote(par_es[0], par_es[1], par_es[2], paso)
            except Exception:
                return paso
        return self._lote_argos(source, target, textos)

    def _lote_argos(self, source: str, target: str, textos: list[str]) -> list[str]:
        try:
            return self._lote_directo(source, target, textos)
        except Exception:
            pass
        if source != "en" and target != "en" and self.hay_argos("en", target):
            try:
                paso = self._lote_directo(source, "en", textos)
                return self._lote_directo("en", target, paso)
            except Exception:
                pass
        return [self.traducir(source, target, texto) for texto in textos]

    def _lote_directo(self, source: str, target: str, textos: list[str]) -> list[str]:
        traductor = self.traductor(source, target)
        try:
            from argostranslate import settings

            base = self._base(traductor)
            if base.translator is None:
                base.hypotheses("carga", 1)
            pkg = base.pkg
            sentencizer = base.sentencizer
            frases: list[str] = []
            por_item: list[int] = []
            for texto in textos:
                partes = sentencizer.split_sentences(texto) if texto.strip() else []
                por_item.append(len(partes))
                frases.extend(partes)
            decodas: list[str] = []
            if frases:
                tokenized = [pkg.tokenizer.encode(s) for s in frases]
                target_prefix = None
                if pkg.target_prefix != "":
                    target_prefix = [[pkg.target_prefix]] * len(tokenized)
                res = base.translator.translate_batch(
                    tokenized,
                    target_prefix=target_prefix,
                    replace_unknowns=True,
                    max_batch_size=settings.batch_size,
                    batch_type="tokens",
                    beam_size=settings.beam_size,
                    num_hypotheses=1,
                    length_penalty=0.2,
                    return_scores=False,
                )
                decodas = [pkg.tokenizer.decode(r.hypotheses[0]) if r.hypotheses else "" for r in res]
            salida: list[str] = []
            index = 0
            for texto, n in zip(textos, por_item):
                if n:
                    valor = " ".join(decodas[index : index + n]).strip()
                    if pkg.target_prefix != "" and valor.startswith(pkg.target_prefix):
                        valor = valor[len(pkg.target_prefix) :]
                    salida.append(valor)
                    index += n
                else:
                    salida.append(texto)
            return salida
        except Exception:
            return [texto if texto.strip() else texto for texto in textos]

    def traducir(self, source: str, target: str, text: str) -> str:
        if not text.strip():
            return text
        par = self.dialectos.par(source, target)
        if par is not None:
            try:
                return self.dialectos.traducir(par[0], par[1], par[2], text)
            except Exception:
                pass
        nativos = {"qu", "ay", "bn", "arn", "gn"}
        if source in nativos and target != "es":
            par_es = self.dialectos.par(source, "es")
            paso = text
            if par_es is not None:
                try:
                    paso = self.dialectos.traducir(par_es[0], par_es[1], par_es[2], text)
                except Exception:
                    paso = text
            if not self.hay_argos("es", target):
                return text
            return self.traducir("es", target, paso)
        if target in nativos and source != "es":
            if self.hay_argos(source, "es"):
                paso = self.traducir(source, "es", text)
            else:
                paso = text
            par_es = self.dialectos.par("es", target)
            if par_es is None:
                return text
            try:
                return self.dialectos.traducir(par_es[0], par_es[1], par_es[2], paso)
            except Exception:
                return paso
        try:
            return str(self.traductor(source, target).translate(text))
        except Exception:
            pass
        if source != "en" and target != "en" and self.hay_argos(source, "en") and self.hay_argos("en", target):
            try:
                paso = self.traducir(source, "en", text)
                if paso.strip():
                    return str(self.traducir("en", target, paso))
            except Exception:
                pass
        return text

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


def atender(motor: "Motor", req: Dict[str, Any]) -> None:
    """Despacha una peticion y responde por stdout (thread-safe via candado)."""
    try:
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
        elif op == "translate_batch":
            source = req["source"]
            target = req["target"]
            respond(
                {
                    "id": req_id,
                    "ok": True,
                    "texts": motor.lote(source, target, req.get("items", [])),
                }
            )
        else:
            respond({"id": req_id, "ok": False, "error": f"Operación desconocida: {op}"})
    except Exception as exc:
        respond({"id": req.get("id"), "ok": False, "error": str(exc)})


def main() -> None:
    configurar_velocidad()
    motor = Motor()
    pesado = ThreadPoolExecutor(max_workers=1)
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            req = json.loads(line)
        except Exception:
            continue
        op = req.get("op", "translate")
        if op in ("translate", "translate_batch"):
            # Inference en hilos (CTranslate2 libera el GIL): el hilo lector
            # sigue atendiendo pairs/errores al instante aunque haya un lote
            # de un capitulo entero en curso — el status nunca miente.
            pesado.submit(atender, motor, req)
        else:
            atender(motor, req)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        pass
