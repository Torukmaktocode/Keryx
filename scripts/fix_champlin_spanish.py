"""Corrige los titulos (metadatos) de los modulos Champlin a espanol.

Uso:
    python scripts/fix_champlin_spanish.py

Recorre los modulos Champlin de "esword/" y actualiza la columna
Details.Description de cada .dctx con su titulo en espanol. No toca el
contenido ni usa IA: es una simple sustitucion determinista.
"""
from __future__ import annotations

import re
import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "esword"

SPANISH_NAMES = {
    "ChamplinAT": "Champlin - Antiguo Testamento Interpretado",
    "ChamplinNT": "Champlin - Nuevo Testamento Interpretado",
    "ChamplinEnc": "Champlin - Enciclopedia de Biblia, Teología y Filosofía",
}

CODE_RE = re.compile(r"^(Champlin(?:AT|NT|Enc))(\d+)$")


def fix_file(path: Path) -> str | None:
    match = CODE_RE.match(path.stem)
    if not match:
        return None
    prefix, volume = match.group(1), int(match.group(2))
    name = SPANISH_NAMES.get(prefix)
    if not name:
        return None
    title = f"{name} Vol. {volume}"
    con = sqlite3.connect(path)
    try:
        cur = con.cursor()
        current = cur.execute("SELECT Description FROM Details LIMIT 1").fetchone()
        if current and current[0] == title:
            return None
        cur.execute("UPDATE Details SET Description = ?", (title,))
        con.commit()
    finally:
        con.close()
    return title


def main() -> None:
    if not OUT.exists():
        print(f"No existe {OUT}")
        return
    total = 0
    for path in sorted(OUT.glob("Champlin*.dct*")):
        try:
            title = fix_file(path)
        except sqlite3.DatabaseError as error:
            print(f"{path.name}: omitido ({error})")
            continue
        if title:
            print(f"{path.name} -> {title}")
            total += 1
    print(f"Listo. {total} modulos actualizados a espanol.")


if __name__ == "__main__":
    sys.exit(main())
