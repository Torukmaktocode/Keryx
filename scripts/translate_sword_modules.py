"""Traduce al espanol modulos SWORD (zCom/zText) que estan en ingles.

Pensado para comentarios como CalvinCommentaries, Catena o Burkitt, pero
sirve para cualquier modulo de texto con bloques comprimidos (zlib).

Uso:
    python scripts/translate_sword_modules.py --list
    python scripts/translate_sword_modules.py --module calvincommentaries
    python scripts/translate_sword_modules.py --module burkitt catena
    python scripts/translate_sword_modules.py --all
    python scripts/translate_sword_modules.py --module burkitt --limit 40   (prueba)
    python scripts/translate_sword_modules.py --module burkitt --dry-run

Como funciona:
  1. Lee los .conf de "sword/mods.d" y localiza los modulos en ingles.
  2. Abre los archivos del modulo (.bzv/.bzs/.bzz o .czv/.czs/.czz):
       - indice de versiculos: 10 bytes por entrada (bloque, offset, tamano)
       - indice de bloques:    12 bytes por bloque (offset, tamano, sin comprimir)
       - datos: bloques comprimidos con zlib
  3. Descomprime cada bloque, extrae el texto, traduce solo los fragmentos de
     texto (dejando intactas las etiquetas OSIS/HTML) y vuelve a comprimir.
  4. Reescribe el modulo respetando su estructura, con copia .bak y cache para
     poder reanudar. Opcionalmente cambia Lang=en por Lang=es en el .conf.

Usa el endpoint gratuito de Google Translate (sin API key).
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import struct
import sys
import time
import zlib
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parent.parent
SWORD = ROOT / "sword"
MODS_D = SWORD / "mods.d"
CACHE_DIR = SWORD / ".cache"
CACHE_FILE = CACHE_DIR / "translate_en_es.json"

ENDPOINT = "https://clients5.google.com/translate_a/t"
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/126.0 Safari/537.36"
    )
}

TEXT_DRIVERS = {"zText", "RawText", "RawText4", "zCom", "RawCom", "RawCom4"}
TAG_RE = re.compile(r"(<[^>]+>)")
ENTITY_RE = re.compile(r"&(?:[a-zA-Z][a-zA-Z0-9]+|#\d+|#x[0-9a-fA-F]+);")
HAS_LETTER = re.compile(r"[A-Za-zÀ-ÖØ-öø-ÿ]")
SENT_RE = re.compile(r"(?<=[.!?;:])\s+")
MAX_SEG = 1800
VERSE_ENTRY = 10
BLOCK_ENTRY = 12


# --------------------------------------------------------------------------- #
# Cache
# --------------------------------------------------------------------------- #
def load_cache() -> dict[str, str]:
    if CACHE_FILE.exists():
        try:
            return json.loads(CACHE_FILE.read_text(encoding="utf-8"))
        except (ValueError, OSError):
            return {}
    return {}


def save_cache(cache: dict[str, str]) -> None:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    CACHE_FILE.write_text(json.dumps(cache, ensure_ascii=False), encoding="utf-8")


# --------------------------------------------------------------------------- #
# Traduccion (Google gratis)
# --------------------------------------------------------------------------- #
def translate_batch(texts: list[str], source: str, target: str, retries: int = 6) -> list[str]:
    params: list[tuple[str, str]] = [
        ("client", "dict-chrome-ex"),
        ("sl", source),
        ("tl", target),
    ]
    params.extend(("q", text) for text in texts)
    delay = 2.0
    for attempt in range(retries):
        try:
            response = requests.get(ENDPOINT, params=params, headers=HEADERS, timeout=45)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, str):
                    data = [data]
                if not isinstance(data, list) or len(data) != len(texts):
                    raise ValueError(f"respuesta inesperada ({len(data)} != {len(texts)})")
                return [str(item) for item in data]
            if response.status_code in (403, 429, 500, 502, 503):
                time.sleep(delay)
                delay = min(delay * 2, 60.0)
                continue
            response.raise_for_status()
        except Exception:
            if attempt == retries - 1:
                raise
            time.sleep(delay)
            delay = min(delay * 2, 60.0)
    raise RuntimeError("no se pudo traducir el lote")


def make_batches(texts: list[str], max_count: int, max_chars: int) -> list[list[str]]:
    batches: list[list[str]] = []
    current: list[str] = []
    size = 0
    for text in texts:
        if current and (len(current) >= max_count or size + len(text) > max_chars):
            batches.append(current)
            current = []
            size = 0
        current.append(text)
        size += len(text)
    if current:
        batches.append(current)
    return batches


# --------------------------------------------------------------------------- #
# Segmentacion del marcado
# --------------------------------------------------------------------------- #
def chunks(text: str) -> list[str]:
    """Divide un texto largo en trozos manejables de forma determinista."""
    if len(text) <= MAX_SEG:
        return [text]
    parts = SENT_RE.split(text)
    out: list[str] = []
    current = ""
    for part in parts:
        if current and len(current) + len(part) + 1 > MAX_SEG:
            out.append(current)
            current = part
        else:
            current = f"{current} {part}".strip() if current else part
    if current:
        out.append(current)
    return out


def protect_entities(text: str) -> tuple[str, list[str]]:
    saved: list[str] = []

    def repl(match: re.Match[str]) -> str:
        saved.append(match.group(0))
        return f"\u2980{len(saved) - 1}\u2980"

    return ENTITY_RE.sub(repl, text), saved


def restore_entities(text: str, saved: list[str]) -> str:
    for index, entity in enumerate(saved):
        text = text.replace(f"\u2980{index}\u2980", entity)
    return text


def translate_segment(segment: str, cache: dict[str, str], source: str, target: str) -> str:
    protected, saved = protect_entities(segment)
    pieces = chunks(protected)
    translated: list[str] = []
    for piece in pieces:
        if not HAS_LETTER.search(piece):
            translated.append(piece)
            continue
        value = cache.get(piece)
        if value is None:
            value = translate_batch([piece], source, target)[0]
            cache[piece] = value
        translated.append(value)
    return restore_entities(" ".join(translated), saved)


def translate_markup(html: str, cache: dict[str, str], source: str, target: str) -> str:
    parts = TAG_RE.split(html)
    out: list[str] = []
    for index, part in enumerate(parts):
        if index % 2 == 1:  # etiqueta
            out.append(part)
        elif part.strip() and HAS_LETTER.search(part):
            out.append(translate_segment(part, cache, source, target))
        else:
            out.append(part)
    return "".join(out)


def collect_segments(html: str) -> list[str]:
    parts = TAG_RE.split(html)
    result: list[str] = []
    for index, part in enumerate(parts):
        if index % 2 == 1 or not part.strip() or not HAS_LETTER.search(part):
            continue
        protected, _ = protect_entities(part)
        for piece in chunks(protected):
            if HAS_LETTER.search(piece):
                result.append(piece)
    return result


# --------------------------------------------------------------------------- #
# Formato SWORD
# --------------------------------------------------------------------------- #
def read_verse_index(path: Path) -> list[tuple[int, int, int]]:
    raw = path.read_bytes()
    count = len(raw) // VERSE_ENTRY
    return [struct.unpack_from("<IIH", raw, i * VERSE_ENTRY) for i in range(count)]


def read_block_index(path: Path) -> list[tuple[int, int, int]]:
    raw = path.read_bytes()
    count = len(raw) // BLOCK_ENTRY
    return [struct.unpack_from("<III", raw, i * BLOCK_ENTRY) for i in range(count)]


def inflate(raw: bytes) -> bytes:
    try:
        return zlib.decompress(raw)
    except zlib.error:
        return zlib.decompress(raw, -15)


def find_family(module_dir: Path, testament: str) -> dict[str, Path] | None:
    for ext in ("c", "b", "x"):
        verse = module_dir / f"{testament}.{ext}zv"
        if verse.exists():
            return {
                "v": verse,
                "s": module_dir / f"{testament}.{ext}zs",
                "z": module_dir / f"{testament}.{ext}zz",
            }
    return None


def parse_conf(path: Path) -> dict[str, str]:
    data: dict[str, str] = {}
    for raw_line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or line.startswith("["):
            continue
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        if key in data:
            continue
        data[key] = value.strip()
    return data


def module_dirs() -> list[dict[str, object]]:
    result: list[dict[str, object]] = []
    if not MODS_D.exists():
        return result
    for conf_path in sorted(MODS_D.glob("*.conf")):
        conf = parse_conf(conf_path)
        driver = conf.get("ModDrv", "")
        data_path = conf.get("DataPath", "")
        if driver not in TEXT_DRIVERS or not data_path:
            continue
        clean = data_path.replace("./", "").strip().rstrip("/\\")
        module_dir = (SWORD / clean).resolve()
        if not module_dir.is_dir():
            continue
        name = conf_path.stem
        result.append(
            {
                "name": name,
                "conf_path": conf_path,
                "conf": conf,
                "module_dir": module_dir,
                "lang": conf.get("Lang", "").lower(),
                "category": "Commentary" if "comments" in clean.lower() else "Bible",
                "driver": driver,
            }
        )
    return result


# --------------------------------------------------------------------------- #
# Proceso de un modulo
# --------------------------------------------------------------------------- #
def rebuild_family(
    fam: dict[str, Path],
    cache: dict[str, str],
    source: str,
    target: str,
    selected: set[int],
) -> int:
    """Reconstruye los bloques dando a cada entrada su propia copia de texto.

    Cada versiculo se escribe de forma independiente, de modo que las entradas
    solapadas o compartidas dejan de ser un problema: la app lee siempre por
    (bloque, offset, tamano) y aqui cada entrada recibe su propio offset.
    """
    entries = read_verse_index(fam["v"])
    blocks = read_block_index(fam["s"])
    data = fam["z"].read_bytes()

    by_block: dict[int, list[int]] = {}
    for index, (block, _offset, size) in enumerate(entries):
        if size == 0:
            continue
        by_block.setdefault(block, []).append(index)

    new_data = bytearray()
    new_blocks: list[tuple[int, int, int]] = []
    new_entries = list(entries)
    updated = 0

    for block in range(len(blocks)):
        comp_off, comp_size, uncomp_size = blocks[block]
        if block not in by_block:
            raw_comp = data[comp_off : comp_off + comp_size]
            new_off = len(new_data)
            new_data += raw_comp
            new_blocks.append((new_off, len(raw_comp), uncomp_size))
            continue

        raw = inflate(data[comp_off : comp_off + comp_size])
        out = bytearray()
        for index in by_block[block]:
            _b, offset, size = entries[index]
            original = raw[offset : offset + size]
            if index in selected:
                text = original.decode("utf-8", errors="replace")
                translated = translate_markup(text, cache, source, target).encode("utf-8")
                if len(translated) > 0xFFFF:
                    print(f"    aviso: entrada {index} demasiado larga, sin cambios")
                    translated = original
            else:
                translated = original
            start = len(out)
            out += translated
            new_entries[index] = (block, start, len(translated))

        compressed = zlib.compress(bytes(out), 9)
        new_off = len(new_data)
        new_data += compressed
        new_blocks.append((new_off, len(compressed), len(out)))
        updated += 1

    fam["v"].write_bytes(b"".join(struct.pack("<IIH", *e) for e in new_entries))
    fam["s"].write_bytes(b"".join(struct.pack("<III", *b) for b in new_blocks))
    fam["z"].write_bytes(bytes(new_data))
    return updated


def translate_module(
    info: dict[str, object],
    cache: dict[str, str],
    source: str,
    target: str,
    limit: int | None,
    batch_size: int,
    max_chars: int,
    sleep: float,
    dry_run: bool,
    set_lang: bool,
) -> int:
    name = str(info["name"])
    module_dir = info["module_dir"]
    assert isinstance(module_dir, Path)

    families = [find_family(module_dir, t) for t in ("ot", "nt")]
    families = [f for f in families if f]
    if not families:
        print(f"  {name}: no encontre archivos .bzz/.czz, omitido")
        return 0

    # Indices seleccionados por familia (todos si no hay --limit).
    selected_by_fam: list[set[int]] = []
    for fam in families:
        entries = read_verse_index(fam["v"])
        valid = [i for i, (_b, _o, size) in enumerate(entries) if size > 0]
        selected_by_fam.append(set(valid[:limit]) if limit else set(valid))

    # ---- Fase 1: recoger segmentos por traducir -------------------------- #
    pending: dict[str, None] = {}
    for fam, selected in zip(families, selected_by_fam):
        entries = read_verse_index(fam["v"])
        blocks = read_block_index(fam["s"])
        data = fam["z"].read_bytes()
        cache_blocks: dict[int, bytes] = {}
        for index in sorted(selected):
            block, offset, size = entries[index]
            raw = cache_blocks.get(block)
            if raw is None:
                comp_off, comp_size, _ = blocks[block]
                raw = inflate(data[comp_off : comp_off + comp_size])
                cache_blocks[block] = raw
            text = raw[offset : offset + size].decode("utf-8", errors="replace")
            for segment in collect_segments(text):
                if segment not in cache:
                    pending[segment] = None

    keys = list(pending.keys())
    print(f"  {name}: {len(keys)} fragmentos por traducir")

    if dry_run:
        return len(keys)

    for fam in families:
        for suffix in ("v", "s", "z"):
            backup = fam[suffix].with_suffix(fam[suffix].suffix + ".bak")
            if not backup.exists():
                shutil.copy2(fam[suffix], backup)

    if keys:
        batches = make_batches(keys, batch_size, max_chars)
        done = 0
        for index, batch in enumerate(batches, start=1):
            try:
                results = translate_batch(batch, source, target)
            except Exception as error:  # noqa: BLE001
                print(f"    lote {index}/{len(batches)} fallo: {error}")
                continue
            for src, dst in zip(batch, results):
                cache[src] = dst
            done += len(batch)
            save_cache(cache)
            print(f"    {done}/{len(keys)} traducidos (lote {index}/{len(batches)})")
            if sleep:
                time.sleep(sleep)

    # ---- Fase 2: reconstruir bloques ------------------------------------- #
    updated = 0
    for fam, selected in zip(families, selected_by_fam):
        updated += rebuild_family(fam, cache, source, target, selected)

    if set_lang:
        conf_path = info["conf_path"]
        assert isinstance(conf_path, Path)
        text = conf_path.read_text(encoding="utf-8", errors="replace")
        new_text = re.sub(r"(?im)^(\s*Lang\s*=\s*).*$", rf"\g<1>{target}", text)
        if new_text != text:
            conf_path.write_text(new_text, encoding="utf-8")
            print(f"  {name}: Lang -> {target}")

    print(f"  {name}: {updated} bloques reescritos")
    return updated


def main() -> None:
    parser = argparse.ArgumentParser(description="Traduce modulos SWORD EN->ES")
    parser.add_argument("--module", nargs="+", help="Uno o varios nombres de modulo (sin .conf)")
    parser.add_argument("--all", action="store_true", help="Todos los comentarios en ingles")
    parser.add_argument("--list", action="store_true", help="Solo lista los modulos disponibles")
    parser.add_argument("--source", default="en")
    parser.add_argument("--target", default="es")
    parser.add_argument("--limit", type=int, help="Limita entradas por testamento (prueba)")
    parser.add_argument("--batch-size", type=int, default=20)
    parser.add_argument("--max-chars", type=int, default=4000)
    parser.add_argument("--sleep", type=float, default=0.4)
    parser.add_argument("--dry-run", action="store_true", help="Cuenta sin traducir ni escribir")
    parser.add_argument("--keep-lang", action="store_true", help="No cambia Lang en el .conf")
    args = parser.parse_args()

    modules = module_dirs()
    if not modules:
        print(f"No encontre modulos SWORD en {SWORD}")
        return

    if args.list:
        print("Modulos SWORD de texto disponibles:")
        for info in modules:
            conf = info["conf"]
            assert isinstance(conf, dict)
            print(
                f"  {info['name']:<24} lang={info['lang'] or '?':<4} "
                f"cat={info['category']:<11} drv={info['driver']}"
            )
        return

    selected: list[dict[str, object]]
    if args.module:
        wanted = {m.lower() for m in args.module}
        selected = [m for m in modules if str(m["name"]).lower() in wanted]
        missing = wanted - {str(m["name"]).lower() for m in selected}
        for name in sorted(missing):
            print(f"No existe el modulo '{name}' (usa --list)")
    elif args.all:
        selected = [m for m in modules if m["lang"] == args.source and m["category"] == "Commentary"]
        if not selected:
            print("No hay comentarios en ingles pendientes de traducir.")
            return
    else:
        parser.error("indica --module NOMBRE, --all o --list")

    cache = load_cache()
    total = 0
    for info in selected:
        print(f"Traduciendo {info['name']} ({info['module_dir']})")
        total += translate_module(
            info,
            cache,
            args.source,
            args.target,
            args.limit,
            args.batch_size,
            args.max_chars,
            args.sleep,
            args.dry_run,
            not args.keep_lang,
        )
    save_cache(cache)
    if args.dry_run:
        print(f"Dry-run. {total} fragmentos pendientes en {len(selected)} modulo(s).")
    else:
        print(f"Listo. {total} bloques actualizados en {len(selected)} modulo(s).")


if __name__ == "__main__":
    sys.exit(main())
