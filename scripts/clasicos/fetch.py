"""Descarga archivos de un item de Archive.org (resumible).

Uso:
    python scripts/clasicos/fetch.py <item-id> <destino> [--suffix _djvu.txt] [--include pat1,pat2]

Descarga todos los archivos del item que terminen en --suffix y, si se da
--include, cuyo nombre contenga alguna de las subcadenas indicadas.
Si el archivo ya existe con el tamaño correcto, se salta.
"""
from __future__ import annotations

import argparse
import json
import sys
import time
import urllib.request
from pathlib import Path

BASE = "https://archive.org"
UA = {"User-Agent": "keryx-clasicos-fetch/1.0"}


def get_json(url: str):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.load(resp)


def download(url: str, dest: Path, expected: int) -> None:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=600) as resp, dest.open("wb") as fh:
        while True:
            chunk = resp.read(1 << 20)
            if not chunk:
                break
            fh.write(chunk)
    if expected and dest.stat().st_size != expected:
        raise RuntimeError(f"tamaño inesperado: {dest.stat().st_size} != {expected}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("item")
    parser.add_argument("dest")
    parser.add_argument("--suffix", default="_djvu.txt")
    parser.add_argument("--include", default="")
    args = parser.parse_args()

    dest_dir = Path(args.dest)
    dest_dir.mkdir(parents=True, exist_ok=True)

    meta = get_json(f"{BASE}/metadata/{args.item}")
    filters = [s.strip() for s in args.include.split(",") if s.strip()]
    files = []
    for f in meta.get("files", []):
        name = f.get("name", "")
        if not name.endswith(args.suffix):
            continue
        if filters and not any(x in name for x in filters):
            continue
        files.append((name, int(f.get("size", 0))))

    if not files:
        print(f"Sin coincidencias en {args.item} para sufijo {args.suffix}")
        sys.exit(1)

    print(f"{len(files)} archivos por descargar desde {args.item}")
    ok = skipped = 0
    for name, size in files:
        dest = dest_dir / name
        if dest.exists() and (not size or dest.stat().st_size == size):
            skipped += 1
            continue
        for attempt in range(4):
            try:
                download(f"{BASE}/download/{args.item}/{urllib.request.quote(name)}", dest, size)
                ok += 1
                mb = dest.stat().st_size / 1e6
                print(f"  ok  {name} ({mb:.1f} MB)")
                break
            except Exception as exc:
                print(f"  reintento {attempt + 1} {name}: {exc}")
                time.sleep(3 * (attempt + 1))
        else:
            print(f"  FALLO {name}")
    print(f"Listo. nuevos={ok} existentes={skipped} de {len(files)}")


if __name__ == "__main__":
    main()
