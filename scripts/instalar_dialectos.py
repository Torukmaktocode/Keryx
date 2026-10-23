#!/usr/bin/env python3
"""
instalar_dialectos.py — Instala los modelos de DIALECTOS en CTranslate2.

Descarga de HuggingFace una vez y convierte a CTranslate2 (int8) para que el
daemon los use offline. Genera <raiz>/<dir>/ con el modelo + tokenizador.

Uso:
  python scripts/instalar_dialectos.py --raiz <userData>/traduccion/dialectos [--dialecto todo|quechua|mapudungun]

Requiere (una vez en la maquina): pip install torch --index-url https://download.pytorch.org/whl/cpu
  pip install transformers sentencepiece ctranslate2
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

ESPECIFICACIONES: dict[str, list[dict[str, str]]] = {
    # NLLB-200 distil 600M cubre spa_Latn <-> quy_Latn (quechua) en UN modelo.
    "quechua": [{"id": "facebook/nllb-200-distilled-600M", "out": "nllb-qu"}],
    # Mapudungun: m2m100 600M afinados por direccion (byumatrixlab, CC-BY-4.0).
    "mapudungun": [
        {"id": "byumatrixlab/mapudungun-nllb-600M-es-arn-standard-bpe", "out": "m2m-es-arn"},
        {"id": "byumatrixlab/mapudungun-nllb-600M-arn-es-standard-bpe", "out": "m2m-arn-es"},
    ],
}


def instalar(entrada: dict[str, str], raiz: Path) -> None:
    salida = raiz / entrada["out"]
    if (salida / "model.bin").exists():
        print(f"[ya instalado] {salida}")
        return
    from ctranslate2.converters import TransformersConverter
    from transformers import AutoTokenizer

    print(f"[descarga+conversion] {entrada['id']} -> {salida}")
    convertidor = TransformersConverter(entrada["id"], load_as_float16=False)
    convertidor.convert(str(salida), quantization="int8", force=True)
    salida.mkdir(parents=True, exist_ok=True)
    tok = AutoTokenizer.from_pretrained(entrada["id"])
    tok.save_pretrained(str(salida))
    print(f"[ok] {salida}")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--raiz", required=True, type=Path)
    parser.add_argument("--dialecto", default="todo", choices=["todo", *ESPECIFICACIONES.keys()])
    args = parser.parse_args()
    seleccion = (
        [s for lista in ESPECIFICACIONES.values() for s in lista]
        if args.dialecto == "todo"
        else ESPECIFICACIONES[args.dialecto]
    )
    for entrada in seleccion:
        try:
            instalar(entrada, args.raiz)
        except Exception as exc:  # noqa: BLE001
            print(f"[fallo] {entrada['id']}: {exc}", file=sys.stderr)
            return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
