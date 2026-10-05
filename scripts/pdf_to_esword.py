"""Convierte PDFs con capa de texto a modulos e-Sword (.dctx / SQLite).

Uso:
    python scripts/pdf_to_esword.py

Lee todos los PDFs de la carpeta "Enciclopeia Champlin" y genera un modulo
.dctx por PDF dentro de "esword/". Cada pagina del PDF se guarda como una
entrada del diccionario (Topic = "p.NNNN"), con el texto limpio en HTML.

Requiere: pymupdf  (pip install pymupdf)
"""
from __future__ import annotations

import html
import re
import sqlite3
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "Enciclopeia Champlin"
OUT = ROOT / "esword"

MODULES = {
    "Comentario AT": ("ChamplinAT", "Champlin - Antiguo Testamento Interpretado"),
    "Comentario NV": ("ChamplinNT", "Champlin - Nuevo Testamento Interpretado"),
    "teologia e filosofia": ("ChamplinEnc", "Champlin - Enciclopedia de Biblia, Teología y Filosofía"),
}


def clean(text: str) -> str:
    text = text.replace("\xad", "")
    text = (
        text.replace("\u2019", "'")
        .replace("\u2018", "'")
        .replace("\u201c", '"')
        .replace("\u201d", '"')
        .replace("\u2013", "-")
        .replace("\u2014", "-")
    )
    text = re.sub(r"-\n(?=[a-zà-ú])", "", text)
    text = re.sub(r"[ \t]*\n[ \t]*", " ", text)
    text = re.sub(r"\s{2,}", " ", text)
    return text.strip()


def page_text(page: pymupdf.Page) -> str:
    raw = page.get_text()
    lines = []
    for line in raw.split("\n"):
        stripped = line.strip()
        if not stripped:
            continue
        if re.fullmatch(r"\d{1,4}", stripped):
            continue
        lines.append(stripped)
    return clean(" ".join(lines))


def convert(pdf: Path, code: str, name: str, volume: str) -> Path:
    doc = pymupdf.open(pdf)
    out_path = OUT / f"{code}.dctx"
    if out_path.exists():
        out_path.unlink()
    con = sqlite3.connect(out_path)
    cur = con.cursor()
    cur.execute(
        "CREATE TABLE Details (Description NVARCHAR(255), Abbreviation NVARCHAR(50), "
        "Comments TEXT, Version INT, RightToLeft BOOL, OT BOOL, NT BOOL, Strong BOOL)"
    )
    cur.execute(
        f"INSERT INTO Details VALUES (?, ?, ?, 4, 0, 1, 1, 0)",
        (f"{name} {volume}".strip(), code, f"Convertido de {pdf.name}"),
    )
    cur.execute("CREATE TABLE Dictionary (Topic NVARCHAR(100), Definition TEXT)")
    cur.execute("CREATE INDEX idx_topic ON Dictionary (Topic)")

    rows = []
    for index in range(doc.page_count):
        body = page_text(doc[index])
        if len(body) < 30:
            continue
        definition = f"<p><b>Pagina {index + 1}</b></p><p>{html.escape(body)}</p>"
        rows.append((f"p.{index + 1:04d}", definition))
    cur.executemany("INSERT INTO Dictionary (Topic, Definition) VALUES (?, ?)", rows)
    con.commit()
    con.close()
    return out_path


def main() -> None:
    OUT.mkdir(exist_ok=True)
    total = 0
    for folder, (code_base, name) in MODULES.items():
        directory = SRC / folder
        if not directory.exists():
            continue
        pdfs = sorted(directory.glob("*.pdf"))
        for pdf in pdfs:
            match = re.search(r"(?:V\.|Vol\.-?)\s*0*(\d+)", pdf.name)
            volume = match.group(1) if match else "1"
            code = f"{code_base}{volume}"
            label = f"Vol. {volume}"
            path = convert(pdf, code, name, label)
            size = path.stat().st_size / (1024 * 1024)
            print(f"{pdf.name} -> {path.name} ({size:.1f} MB)")
            total += 1
    print(f"Listo. {total} modulos generados en {OUT}")


if __name__ == "__main__":
    main()
