"""Instalador de corpus paralelos (Nivel 1 verificado) para lenguas nativas.

Descarga una vez (requiere Internet solo en la instalacion) los textos
biblicos publicados con licencia compatible y construye una base SQLite por
lengua alineada por referencia canonica (code, chapter, verse):

  arn  Mapudungun NT (arnNT, Wycliffe 2011)  CC BY-NC-ND 3.0
  gn   Nuevo Testamento Guaranipe (guiNT)    CC BY-NC-ND
  ayr  Aymar Bibliia 1986 (SBB, YouVersion)  licencia por confirmar
  bn   Bengali ERV (WBTC 2001)               licencia por confirmar
  quy  PENDIENTE: sin texto paralelo descargable fiable (PDF trocea palabras);
       se documenta y se deja al motor neural.

Uso:
  python instalar_corpus_dialectos.py --raiz <userData>/traduccion
  python instalar_corpus_dialectos.py --raiz <dir> --dialecto mapudungun
"""
import argparse
import os
import re
import shutil
import sqlite3
import sys
import urllib.request
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

BASE = "https://ebible.org/Scriptures"
REPO = "https://raw.githubusercontent.com/ChurchPresenter/Holy-Bible-XML-Format/master"

FUENTES = {
    "arn": {
        "tipo": "usfm",
        "url": f"{BASE}/arnNT_usfm.zip",
        "meta": {
            "fuente": "Nuevo Testamento en Mapudungun (arnNT)",
            "titular": "© 1997 Sociedades Bíblicas Unidas · © 2011 Wycliffe Bible Translators, Inc.",
            "licencia": "CC BY-NC-ND 3.0 (permite distribuir y citar sin alterar el texto)",
            "origen": "ebible.org",
            "lengua": "mapudungun",
            "variante": "mapudungun estandar (Wycliffe/Sociedad Biblica Chilena)",
            "cobertura": "NT",
        },
    },
    "gn": {
        "tipo": "usfm",
        "url": f"{BASE}/guiNT_usfm.zip",
        "meta": {
            "fuente": "Nuevo Testamento Guaranipe (guiNT)",
            "titular": "Sociedades Biblicas / ebible.org",
            "licencia": "CC BY-NC-ND (ver detalles en ebible.org/guiNT)",
            "origen": "ebible.org",
            "lengua": "guarani",
            "variante": "guarani paraguayo (Guaranipe)",
            "cobertura": "NT",
        },
    },
    "ayr": {
        "tipo": "xml",
        "url": f"{REPO}/Aymara1986Bible.xml",
        "meta": {
            "fuente": "Aymar Bibliia 1986 (AYBOL1986)",
            "titular": "Sociedad Biblica Boliviana, 1986",
            "licencia": "por confirmar (edicion de 1986, disponible en YouVersion)",
            "origen": "bible.com/2251 (AYBOL1986) via ChurchPresenter XML",
            "lengua": "aymara",
            "variante": "aymara central",
            "cobertura": "Biblia completa",
        },
    },
    "bn": {
        "tipo": "xml",
        "url": f"{REPO}/BengaliBible.xml",
        "meta": {
            "fuente": "Bengali Easy to Read Version (WBTC 2001)",
            "titular": "World Bible Translation Center, 2001",
            "licencia": "por confirmar (WBTC)",
            "origen": "ChurchPresenter Holy-Bible-XML-Format",
            "lengua": "bengali",
            "variante": "bengali estandar",
            "cobertura": "Biblia completa",
        },
    },
    "gn-at": {
        "tipo": "xml",
        "url": f"{REPO}/Guarani1996Bible.xml",
        "fusar_con": "gn",
        "solo_testamento": "Old",
        "meta": {
            "fuente": "AT Guaraní: Biblia Guaraní DC 2006 (GDC2006)",
            "titular": "© Sociedad Bíblica Paraguaya, 1996",
            "licencia": "por confirmar (uso citado, no altera el texto)",
            "origen": "bible.com/3374 (GDC2006) via ChurchPresenter XML",
            "lengua": "guarani",
            "variante": "guarani paraguayo (GDC2006, misma variante que guiNT)",
            "cobertura": "AT (GDC2006) + NT (guiNT Wycliffe)",
        },
    },
}

DIALECTO_A_LANG = {
    "mapudungun": ["arn"],
    "guarani": ["gn", "gn-at"],
    "aymara": ["ayr"],
    "bengali": ["bn"],
}

CODIGOS = [
    "Gen", "Exod", "Lev", "Num", "Deut", "Josh", "Judg", "Ruth", "1Sam", "2Sam",
    "1Kgs", "2Kgs", "1Chr", "2Chr", "Ezra", "Neh", "Esth", "Job", "Ps", "Prov",
    "Eccl", "Song", "Isa", "Jer", "Lam", "Ezek", "Dan", "Hos", "Joel", "Amos",
    "Obad", "Jonah", "Mic", "Nah", "Hab", "Zeph", "Hag", "Zech", "Mal",
    "Matt", "Mark", "Luke", "John", "Acts", "Rom", "1Cor", "2Cor", "Gal", "Eph",
    "Phil", "Col", "1Thess", "2Thess", "1Tim", "2Tim", "Titus", "Phlm", "Heb",
    "Jas", "1Pet", "2Pet", "1John", "2John", "3John", "Jude", "Rev",
]

USFM_A_CODE = {
    "GEN": "Gen", "EXO": "Exod", "LEV": "Lev", "NUM": "Num", "DEU": "Deut",
    "JOS": "Josh", "JDG": "Judg", "RUT": "Ruth", "1SA": "1Sam", "2SA": "2Sam",
    "1KI": "1Kgs", "2KI": "2Kgs", "1CH": "1Chr", "2CH": "2Chr", "EZR": "Ezra",
    "NEH": "Neh", "EST": "Esth", "JOB": "Job", "PSA": "Ps", "PRO": "Prov",
    "ECC": "Eccl", "SNG": "Song", "ISA": "Isa", "JER": "Jer", "LAM": "Lam",
    "EZK": "Ezek", "DAN": "Dan", "HOS": "Hos", "JOL": "Joel", "AMO": "Amos",
    "OBA": "Obad", "JON": "Jonah", "MIC": "Mic", "NAM": "Nah", "HAB": "Hab",
    "ZEP": "Zeph", "HAG": "Hag", "ZEC": "Zech", "MAL": "Mal",
    "MAT": "Matt", "MRK": "Mark", "LUK": "Luke", "JHN": "John", "ACT": "Acts",
    "ROM": "Rom", "1CO": "1Cor", "2CO": "2Cor", "GAL": "Gal", "EPH": "Eph",
    "PHP": "Phil", "COL": "Col", "1TH": "1Thess", "2TH": "2Thess", "1TI": "1Tim",
    "2TI": "2Tim", "TIT": "Titus", "PHM": "Phlm", "HEB": "Heb", "JAS": "Jas",
    "1PE": "1Pet", "2PE": "2Pet", "1JN": "1John", "2JN": "2John", "3JN": "3John",
    "JUD": "Jude", "REV": "Rev",
}

MARKER_FOOTNOTE = re.compile(r"\\[fx] .*?\\[fx]\*", re.DOTALL)
MARKER_RESTO = re.compile(r"\\[a-z0-9]+(-\w+)?\*?")
MARKER_ATTR = re.compile(r"\|[^\n]*")
SALTO_CAP = re.compile(r"\\c (\d+)")
SALTO_VER = re.compile(r"\\v (\d+)")


def descargar(url: str, destino: Path) -> Path:
    if destino.exists() and destino.stat().st_size > 0:
        return destino
    destino.parent.mkdir(parents=True, exist_ok=True)
    print(f"  descargando {url}")
    req = urllib.request.Request(url, headers={"User-Agent": "Keryx/0.4"})
    with urllib.request.urlopen(req, timeout=180) as r, open(destino, "wb") as f:
        shutil.copyfileobj(r, f)
    return destino


def limpiar(texto: str) -> str:
    texto = MARKER_ATTR.sub("", texto)
    texto = MARKER_RESTO.sub(" ", texto)
    return " ".join(texto.split())


def parsear_usfm(ruta: Path) -> dict[str, list[tuple[int, int, str]]]:
    crudo = ruta.read_text(encoding="utf-8", errors="replace")
    crudo = MARKER_FOOTNOTE.sub(" ", crudo)
    id_m = re.search(r"\\id (\w{3})", crudo)
    if not id_m:
        return {}
    code = USFM_A_CODE.get(id_m.group(1))
    if not code:
        return {}
    texto = SALTO_CAP.sub(r"\n\1CH\n", crudo)
    texto = SALTO_VER.sub(r"\n\1VE\n", texto)
    versos: list[tuple[int, int, str]] = []
    cap = 0
    ver = 0
    buf: list[str] = []
    for linea in texto.splitlines():
        linea = linea.strip()
        if not linea:
            continue
        if linea.endswith("CH") and linea[:-2].isdigit():
            if cap and ver and buf:
                t = limpiar(" ".join(buf))
                if t:
                    versos.append((cap, ver, t))
            cap = int(linea[:-2].strip())
            ver = 0
            buf = []
        elif linea.endswith("VE") and linea[:-2].isdigit():
            if cap and ver and buf:
                t = limpiar(" ".join(buf))
                if t:
                    versos.append((cap, ver, t))
            ver = int(linea[:-2].strip())
            buf = []
        elif cap and ver:
            buf.append(linea)
    if cap and ver and buf:
        t = limpiar(" ".join(buf))
        if t:
            versos.append((cap, ver, t))
    return {code: versos} if versos else {}


def parsear_xml(ruta: Path, solo_testamento: str = "") -> dict[str, list[tuple[int, int, str]]]:
    arbol = ET.parse(ruta)
    raiz = arbol.getroot()
    salida: dict[str, list[tuple[int, int, str]]] = {}
    for n_test in raiz.iter("testament"):
        nombre = (n_test.get("name") or "").lower()
        if solo_testamento and solo_testamento.lower() not in nombre:
            continue
        for n_book in n_test.iter("book"):
            ordinal = int(n_book.get("number"))
            if not 1 <= ordinal <= 66:
                continue
            code = CODIGOS[ordinal - 1]
            pares: list[tuple[int, int, str]] = []
            for n_ch in n_book.iter("chapter"):
                cap = int(n_ch.get("number"))
                for n_ver in n_ch.iter("verse"):
                    if n_ver.text is None:
                        continue
                    t = " ".join((n_ver.text or "").split())
                    if t:
                        pares.append((cap, int(n_ver.get("number")), t))
            if pares:
                salida[code] = pares
    return salida


def construir(lang: str, conf: dict, raiz: Path) -> bool:
    tipo = conf["tipo"]
    url = conf["url"]
    fusar_con = conf.get("fusar_con", lang)
    fuentes = raiz / "corpus" / "_fuentes"
    db_ruta = raiz / "corpus" / f"{fusar_con}.db"
    libros: dict[str, list[tuple[int, int, str]]] = {}

    if tipo == "usfm":
        archivo = descargar(url, fuentes / Path(url).name)
        with zipfile.ZipFile(archivo) as z:
            z.extractall(fuentes / f"{lang}_usfm")
        for ruta in sorted((fuentes / f"{lang}_usfm").rglob("*")):
            if ruta.suffix.lower() in (".usfm", ".sfm", ".txt"):
                libros.update(parsear_usfm(ruta))
    elif tipo == "xml":
        archivo = descargar(url, fuentes / Path(url).name)
        libros = parsear_xml(archivo, conf.get("solo_testamento", ""))
    else:
        return False

    fusion = fusar_con != lang
    if fusion:
        libros_existentes: set[str] = set()
        if db_ruta.exists():
            con = sqlite3.connect(db_ruta)
            libros_existentes = {r[0] for r in con.execute("SELECT DISTINCT code FROM versos")}
            con.close()
        libros = {c: pares for c, pares in libros.items() if c not in libros_existentes}
        if not libros:
            print(f"  [ya cubierto] {fusar_con}.db contiene todo el corpus de {lang}")
            return True

    total = sum(len(v) for v in libros.values())
    if total < 100:
        print(f"  [ERROR] {lang}: corpus insuficiente ({total} versos)")
        return False

    db_ruta.parent.mkdir(parents=True, exist_ok=True)
    if fusion and db_ruta.exists():
        con = sqlite3.connect(db_ruta)
        con.executemany(
            "INSERT OR REPLACE INTO versos (code, chapter, verse, text) VALUES (?, ?, ?, ?)",
            [(code, c, v, t) for code, pares in libros.items() for c, v, t in pares],
        )
        for clave, valor in conf["meta"].items():
            con.execute("INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)", (clave, valor))
        con.commit()
        con.close()
        print(f"  [OK] fusion en {fusar_con}.db: +{total} versos (AT), {len(libros)} libros")
        return True

    if db_ruta.exists():
        db_ruta.unlink()
    con = sqlite3.connect(db_ruta)
    con.executescript(
        "CREATE TABLE versos (code TEXT NOT NULL, chapter INTEGER NOT NULL, "
        "verse INTEGER NOT NULL, text TEXT NOT NULL, "
        "PRIMARY KEY (code, chapter, verse));"
        "CREATE TABLE meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);"
    )
    con.executemany(
        "INSERT INTO versos (code, chapter, verse, text) VALUES (?, ?, ?, ?)",
        [(code, c, v, t) for code, pares in libros.items() for c, v, t in pares],
    )
    con.executemany(
        "INSERT INTO meta (key, value) VALUES (?, ?)", list(conf["meta"].items())
    )
    con.commit()
    con.close()

    print(f"  [OK] {lang}.db: {total} versos, {len(libros)} libros, {conf['meta']['fuente']}")
    return True


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--raiz", required=True)
    parser.add_argument("--dialecto", default="todo")
    args = parser.parse_args()

    raiz = Path(args.raiz)
    print(f"corpus -> {raiz / 'corpus'}")
    ok = 0
    langs = (
        DIALECTO_A_LANG[args.dialecto]
        if args.dialecto in DIALECTO_A_LANG
        else list(FUENTES)
    )
    for lang in langs:
        if lang in FUENTES and construir(lang, FUENTES[lang], raiz):
            ok += 1

    print("PENDIENTE: quy (quechua ayacucho) - sin texto paralelo descargable")
    print("fiable (el PDF oficial trocea palabras); queda al motor neural hasta")
    print("hallar USFM/JSON limpio con licencia compatible.")
    total_disponibles = len(FUENTES)
    if ok == 0:
        print("Ningun corpus construido")
        return 1
    print(f"listo: {ok}/{total_disponibles} corpus")
    return 0


if __name__ == "__main__":
    sys.exit(main())
