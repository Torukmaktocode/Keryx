"""Traduce un modulo SWORD RawLD (diccionario/temas) EN -> ES.

Uso:
    python scripts/translate_rawld.py --module tcr
    python scripts/translate_rawld.py --module tcr --check

Lee el par .idx/.dat del modulo, trocea por frases, protege entidades HTML,
traduce con el endpoint gratuito de Google (igual que translate_champlin.py)
y RECONSTRUYE los archivos ajustando offsets, con copia .bak y cache
reanudable en sword/.cache/translate_en_es_ld.json.

Cambia Lang=es en el .conf para que la app lo muestre como diccionario en
espanol.
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import struct
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parent.parent
SWORD = ROOT / "sword"
CACHE_DIR = SWORD / ".cache"
CACHE_FILE = CACHE_DIR / "translate_en_es_ld.json"

sys.path.insert(0, str(Path(__file__).resolve().parent))
from translate_champlin import (  # noqa: E402
    HAS_LETTER,
    ProgressBar,
    chunks,
    make_batches,
    protect_entities,
    restore_entities,
)

ENDPOINT = "https://clients5.google.com/translate_a/t"


def translate_batch(texts: list[str], retries: int = 6) -> list[str]:
    delay = 1.5
    last_error: Exception | None = None
    for attempt in range(retries):
        try:
            response = requests.get(
                ENDPOINT,
                params=[("client", "dict-chrome-ex"), ("sl", "en"), ("tl", "es")]
                + [("q", t) for t in texts],
                headers={"User-Agent": "Mozilla/5.0"},
                timeout=60,
            )
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, str):
                    data = [data]
                if isinstance(data, list) and len(data) == len(texts):
                    if all(isinstance(i, str) for i in data):
                        return list(data)
            raise ValueError("respuesta inesperada")
        except Exception as error:  # noqa: BLE001
            last_error = error
        if attempt == retries - 1:
            break
        time.sleep(delay)
        delay = min(delay * 2, 30.0)
    raise RuntimeError(f"fallo de traduccion: {last_error}")


def load_cache() -> dict[str, str]:
    if CACHE_FILE.exists():
        try:
            return json.loads(CACHE_FILE.read_text(encoding="utf-8"))
        except (ValueError, OSError):
            return {}
    return {}


_save_lock = threading.Lock()
_pending_saves = [0]


def save_cache(cache: dict[str, str], force: bool = False) -> None:
    with _save_lock:
        _pending_saves[0] += 1
        if not force and _pending_saves[0] % 10 != 0:
            return
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    with _save_lock:
        tmp = CACHE_FILE.with_suffix(".json.tmp")
        tmp.write_text(json.dumps(cache, ensure_ascii=False), encoding="utf-8")
        try:
            tmp.replace(CACHE_FILE)
        except OSError:
            time.sleep(0.2)
            try:
                tmp.replace(CACHE_FILE)
            except OSError:
                pass  # lo reintenta el siguiente save



def read_entries(idx: bytes, dat: bytes, raw4: bool) -> list[tuple[str, str]]:
    entry = 8 if raw4 else 6
    out: list[tuple[str, str]] = []
    for i in range(len(idx) // entry):
        start = struct.unpack_from("<I", idx, i * entry)[0]
        size = (
            struct.unpack_from("<I", idx, i * entry + 4)[0]
            if raw4
            else struct.unpack_from("<H", idx, i * entry + 4)[0]
        )
        buf = dat[start : start + size]
        if not buf:
            out.append(("", ""))
            continue
        end = -1
        for j, b in enumerate(buf):
            if b in (0x0A, 0x5C, 0x0D):
                end = j
                break
        key = buf[: end if end >= 0 else len(buf)].decode("utf-8", errors="replace").strip("\r\\ ")
        text = buf[end + 1 :] if end >= 0 else b""
        out.append((key, text.decode("utf-8", errors="replace")))
    return out


def translate_text(text: str, cache: dict[str, str]) -> str:
    if not text.strip() or not HAS_LETTER.search(text):
        return text
    protected, saved = protect_entities(text)
    parts_out: list[str] = []
    for piece in chunks(protected):
        if not HAS_LETTER.search(piece):
            parts_out.append(piece)
            continue
        value = cache.get(piece)
        if value is None:
            value = translate_batch([piece])[0]
            cache[piece] = value
        parts_out.append(value)
    return restore_entities(" ".join(parts_out), saved)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--module", required=True)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    module = args.module

    conf = SWORD / "mods.d" / f"{module}.conf"
    if not conf.exists():
        print(f"No existe {conf}")
        return 1

    config: dict[str, str] = {}
    for line in conf.read_text(encoding="utf-8", errors="replace").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or line.startswith("["):
            continue
        if "=" in line:
            key, value = line.split("=", 1)
            if key.strip() == "DataPath" and "DataPath" not in config:
                config["DataPath"] = value.strip()
    data_path = config["DataPath"].replace("./", "").rstrip("/\\")
    module_dir = (SWORD / data_path).resolve().parent
    prefix = data_path.rsplit("/", 1)[-1]
    idx = module_dir / f"{prefix}.idx"
    dat = module_dir / f"{prefix}.dat"
    if not idx.exists() or not dat.exists():
        print(f"No existe {idx} o {dat}")
        return 1

    raw4 = "rawld4" in str(module_dir).lower()
    entries = read_entries(idx.read_bytes(), dat.read_bytes(), raw4)
    cache = load_cache()

    todo: list[str] = []
    for _key, text in entries:
        protected, _ = protect_entities(text)
        for piece in chunks(protected):
            if HAS_LETTER.search(piece) and piece not in cache:
                todo.append(piece)
    unique_todo = list(dict.fromkeys(todo))
    print(f"{module}: {len(entries)} entradas, {len(unique_todo)} fragmentos por traducir")

    if args.check:
        return 0
    if unique_todo:
        if not dat.with_suffix(dat.suffix + ".bak").exists():
            shutil.copy2(dat, dat.with_suffix(dat.suffix + ".bak"))
            shutil.copy2(idx, idx.with_suffix(idx.suffix + ".bak"))
        bar = ProgressBar(len(unique_todo), prefix=f"{module} ")
        batches = make_batches(unique_todo, 20, 4000)

        def push(batch: list[str]) -> bool:
            try:
                results = translate_batch(batch)
            except Exception:  # noqa: BLE001
                return False
            with _save_lock:
                for src, dst in zip(batch, results):
                    cache[src] = dst
            save_cache(cache)
            return True

        with ThreadPoolExecutor(max_workers=6) as pool:
            futures = {pool.submit(push, batch): len(batch) for batch in batches}
            done_failed = 0
            for future in as_completed(futures):
                if future.result():
                    bar.update(futures[future])
                else:
                    done_failed += futures[future]
        bar.close()
        if done_failed:
            print(f"{done_failed} fragmentos fallaron; reintentalo.")

    new_dat = bytearray()
    new_idx = bytearray()
    translated = 0
    for key, text in entries:
        new_text = translate_text(text, cache) if text else ""
        body = f"{key}\n{new_text}".encode("utf-8")
        if len(body) > 0xFFFF and not raw4:
            body = f"{key}\n{text}".encode("utf-8")
        offset = len(new_dat)
        new_dat += body
        if raw4:
            new_idx += struct.pack("<II", offset, len(body))
        else:
            new_idx += struct.pack("<IH", offset, len(body))
        if new_text != text:
            translated += 1
    dat.write_bytes(bytes(new_dat))
    idx.write_bytes(bytes(new_idx))

    conf_text = conf.read_text(encoding="utf-8", errors="replace")
    new_conf = re.sub(r"(?im)^(\s*Lang\s*=\s*).*$", r"\g<1>es", conf_text)
    if new_conf != conf_text:
        conf.write_text(new_conf, encoding="utf-8")

    save_cache(cache, force=True)
    print(f"Listo: {translated}/{len(entries)} entradas en espanol.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
