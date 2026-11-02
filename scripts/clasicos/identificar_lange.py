"""Identifica el contenido de cada volumen Cornell de Lange buscando el titulo del libro.

Uso:
    python scripts/clasicos/identificar_lange.py
Escribe esword/clasicos-src/lange/manifest-cornell.tsv
"""
from __future__ import annotations

import concurrent.futures
import json
import re
import urllib.request
from pathlib import Path

IDS = [
    "cu31924092344229", "cu31924092344237", "cu31924092344245", "cu31924092344252",
    "cu31924092344260", "cu31924092344278", "cu31924092344294", "cu31924092344302",
    "cu31924092344310", "cu31924092344328", "cu31924092344336", "cu31924092344344",
    "cu31924092344351", "cu31924092344377", "cu31924092344393", "cu31924092344401",
    "cu31924092342769", "cu31924092342777", "cu31924092342785", "cu31924092342793",
    "cu31924092344203", "cu31924092344211",
]
UA = {"User-Agent": "keryx-clasicos/1.0"}
KEYWORDS = [
    "GENESIS", "EXODUS", "LEVITICUS", "NUMBERS", "DEUTERONOMY", "JOSHUA", "JUDGES",
    "RUTH", "SAMUEL", "KINGS", "CHRONICLES", "EZRA", "NEHEMIAH", "ESTHER", "JOB",
    "PSALMS", "PROVERBS", "ECCLESIASTES", "SOLOMON", "ISAIAH", "JEREMIAH",
    "LAMENTATIONS", "EZEKIEL", "DANIEL", "MINOR PROPHETS", "APOCRYPHA",
    "MATTHEW", "MARK", "LUKE", "JOHN", "ACTS", "ROMANS", "CORINTHIANS",
    "GALATIANS", "EPHESIANS", "PHILIPPIANS", "COLOSSIANS", "THESSALONIANS",
    "TIMOTHY", "TITUS", "PHILEMON", "HEBREWS", "JAMES", "PETER", "JUDE",
    "REVELATION",
]


def probe(item: str) -> str:
    meta = json.load(urllib.request.urlopen(f"https://archive.org/metadata/{item}", timeout=60))
    txt = next(f["name"] for f in meta["files"] if f["name"].endswith("_djvu.txt"))
    chunks = []
    for start in (4000, 40000):
        req = urllib.request.Request(
            f"https://archive.org/download/{item}/{txt}",
            headers={**UA, "Range": f"bytes={start}-{start + 30000}"},
        )
        chunks.append(urllib.request.urlopen(req, timeout=60).read().decode("utf-8", "replace"))
    head = re.sub(r"\s+", " ", " ".join(chunks)).upper()
    found = [kw for kw in KEYWORDS if kw in head]
    return f"{item}\t{txt}\t{','.join(found[:6])}"


def main() -> None:
    out = Path("esword/clasicos-src/lange/manifest-cornell.tsv")
    out.parent.mkdir(parents=True, exist_ok=True)
    with out.open("w", encoding="utf-8") as fh, concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        for result in pool.map(probe, IDS):
            fh.write(result + "\n")
            print(result, flush=True)


if __name__ == "__main__":
    main()
