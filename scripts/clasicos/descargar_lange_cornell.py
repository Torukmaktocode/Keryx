"""Descarga los 22 volumenes Cornell de Lange (djvu.txt) en paralelo."""
from __future__ import annotations

import concurrent.futures
import json
import time
import urllib.request
from pathlib import Path

IDS = [
    "cu31924092344203", "cu31924092344211", "cu31924092344229", "cu31924092344237",
    "cu31924092344245", "cu31924092344252", "cu31924092344260", "cu31924092344278",
    "cu31924092344294", "cu31924092344302", "cu31924092344310", "cu31924092344328",
    "cu31924092344336", "cu31924092344344", "cu31924092344351", "cu31924092344377",
    "cu31924092344393", "cu31924092344401", "cu31924092342769", "cu31924092342777",
    "cu31924092342785", "cu31924092342793",
]
DEST = Path("esword/clasicos-src/lange")
UA = {"User-Agent": "keryx-clasicos/1.0"}


def fetch(item: str) -> str:
    dest = DEST / f"{item}_djvu.txt"
    meta = json.load(urllib.request.urlopen(f"https://archive.org/metadata/{item}", timeout=60))
    entry = next(f for f in meta["files"] if f["name"].endswith("_djvu.txt"))
    size = int(entry.get("size", 0))
    if dest.exists() and (not size or dest.stat().st_size == size):
        return f"skip {item}"
    for attempt in range(4):
        try:
            req = urllib.request.Request(f"https://archive.org/download/{item}/{entry['name']}", headers=UA)
            with urllib.request.urlopen(req, timeout=900) as resp, dest.open("wb") as fh:
                while chunk := resp.read(1 << 20):
                    fh.write(chunk)
            if size and dest.stat().st_size != size:
                raise RuntimeError("tamaño incorrecto")
            return f"ok   {item} ({dest.stat().st_size / 1e6:.1f} MB)"
        except Exception as exc:
            time.sleep(3 * (attempt + 1))
            last = exc
    return f"FALLO {item}: {last}"


def main() -> None:
    DEST.mkdir(parents=True, exist_ok=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        for result in pool.map(fetch, IDS):
            print(result, flush=True)


if __name__ == "__main__":
    main()
