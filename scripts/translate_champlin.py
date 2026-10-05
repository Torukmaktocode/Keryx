"""Traduce el contenido de los modulos Champlin de portugues a espanol.

Uso:
    python scripts/translate_champlin.py --check            # diagnostico, no traduce
    python scripts/translate_champlin.py --module ChamplinAT1
    python scripts/translate_champlin.py --all
    python scripts/translate_champlin.py --all --workers 12 --batch-size 40
    python scripts/translate_champlin.py --all --force      # vuelve a traducir todo
    python scripts/translate_champlin.py --module ChamplinAT1 --limit 20

Usa el endpoint gratuito de Google Translate (sin API key ni tokens de IA).
Trocea los textos largos en frases, protege las entidades HTML para no
romperlas, guarda una cache reanudable y hace copia .bak antes de escribir.

Rendimiento:
  - Traduce varios lotes en paralelo (--workers, por defecto 8).
  - Barra de progreso en vivo con velocidad y ETA.
  - Cache persistente que se guarda periodicamente para poder reanudar.

Garantias:
  - Si un lote falla se reporta y el proceso termina con codigo != 0.
  - Las traducciones se aplican al .dctx desde la cache incluso sin red.
  - `--check` informa cuantas entradas siguen en portugues.
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import sqlite3
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "esword"
CACHE_DIR = OUT / ".cache"
CACHE_FILE = CACHE_DIR / "translate_pt_es.json"

# Endpoint primario: acepta varias "q" y devuelve una lista plana de traducciones.
ENDPOINT_BATCH = "https://clients5.google.com/translate_a/t"
# Respaldo: devuelve estructura anidada; se normaliza en _parse_response.
ENDPOINT_SINGLE = "https://translate.googleapis.com/translate_a/single"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/126.0 Safari/537.36"
    )
}

TAG_RE = re.compile(r"(<[^>]+>)")
ENTITY_RE = re.compile(r"&(?:[a-zA-Z][a-zA-Z0-9]+|#\d+|#x[0-9a-fA-F]+);")
HAS_LETTER = re.compile(r"[A-Za-zÀ-ÖØ-öø-ÿ]")
SENT_RE = re.compile(r"(?<=[.!?;:])\s+")

MAX_SEG = 1500
PLACEHOLDER = "\u2980{}\u2980"

# Marcadores que delatan que un texto sigue en portugues.
PT_MARKERS = ("ção", "ções", "não", "ê ", "ã ", "õ ", "à ", "é ", "ç")

_cache_lock = threading.Lock()


# --------------------------------------------------------------------------- #
# Barra de progreso
# --------------------------------------------------------------------------- #
class ProgressBar:
    def __init__(self, total: int, prefix: str = "") -> None:
        self.total = max(total, 1)
        self.n = 0
        self.prefix = prefix
        self.start = time.time()
        self._last = 0.0

    def update(self, step: int = 1) -> None:
        self.n += step
        now = time.time()
        if now - self._last < 0.1 and self.n < self.total:
            return
        self._last = now
        ratio = min(self.n / self.total, 1.0)
        width = 30
        filled = int(width * ratio)
        bar = "#" * filled + "-" * (width - filled)
        elapsed = now - self.start
        rate = self.n / elapsed if elapsed > 0 else 0.0
        eta = (self.total - self.n) / rate if rate > 0 else 0.0
        sys.stdout.write(
            f"\r{self.prefix}[{bar}] {ratio * 100:5.1f}% "
            f"{self.n}/{self.total} {rate:6.1f}/s ETA {eta:5.0f}s"
        )
        sys.stdout.flush()

    def close(self) -> None:
        if self.n < self.total:
            self.update(self.total - self.n)
        sys.stdout.write("\n")
        sys.stdout.flush()


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
    tmp = CACHE_FILE.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(cache, ensure_ascii=False), encoding="utf-8")
    tmp.replace(CACHE_FILE)


# --------------------------------------------------------------------------- #
# Traduccion (Google gratis)
# --------------------------------------------------------------------------- #
def _parse_response(data: object, expected: int) -> list[str] | None:
    if isinstance(data, str):
        data = [data]
    if not isinstance(data, list) or len(data) != expected:
        return None
    result: list[str] = []
    for item in data:
        if isinstance(item, str):
            result.append(item)
        elif isinstance(item, list) and item and isinstance(item[0], str):
            result.append(item[0])
        else:
            return None
    return result


def translate_batch(
    texts: list[str], source: str, target: str, retries: int = 6
) -> list[str]:
    delay = 1.5
    last_error: Exception | None = None
    for attempt in range(retries):
        try:
            response = requests.get(
                ENDPOINT_BATCH,
                params=[("client", "dict-chrome-ex"), ("sl", source), ("tl", target)]
                + [("q", text) for text in texts],
                headers=HEADERS,
                timeout=60,
            )
            if response.status_code == 200:
                parsed = _parse_response(response.json(), len(texts))
                if parsed is not None:
                    return parsed
                last_error = ValueError("respuesta con formato inesperado")
            elif response.status_code in (403, 429, 500, 502, 503):
                last_error = RuntimeError(f"HTTP {response.status_code}")
            else:
                response.raise_for_status()
        except Exception as error:  # noqa: BLE001
            last_error = error

        if attempt == retries - 1:
            break
        time.sleep(delay)
        delay = min(delay * 2, 30.0)

    if len(texts) == 1:
        try:
            response = requests.get(
                ENDPOINT_SINGLE,
                params=[
                    ("client", "gtx"),
                    ("dt", "t"),
                    ("sl", source),
                    ("tl", target),
                    ("q", texts[0]),
                ],
                headers=HEADERS,
                timeout=60,
            )
            response.raise_for_status()
            data = response.json()
            translated = "".join(segment[0] for segment in data[0] if segment and segment[0])
            if translated:
                return [translated]
        except Exception as error:  # noqa: BLE001
            last_error = error

    raise RuntimeError(f"no se pudo traducir el lote: {last_error}")


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


def translate_batches_concurrent(
    keys: list[str],
    cache: dict[str, str],
    source: str,
    target: str,
    batch_size: int,
    max_chars: int,
    workers: int,
    sleep: float,
    progress: ProgressBar | None,
) -> int:
    """Traduce en paralelo y actualiza la cache. Devuelve el numero de fallos."""
    batches = make_batches(keys, batch_size, max_chars)
    failures = 0
    since_save = 0

    def work(batch: list[str]) -> tuple[list[str], list[str] | None, Exception | None]:
        try:
            return batch, translate_batch(batch, source, target), None
        except Exception as error:  # noqa: BLE001
            return batch, None, error

    with ThreadPoolExecutor(max_workers=max(1, workers)) as pool:
        futures = [pool.submit(work, batch) for batch in batches]
        for future in as_completed(futures):
            batch, results, error = future.result()
            if error is not None:
                failures += 1
                if progress:
                    progress.close()
                print(f"  fallo un lote: {error}", flush=True)
                if progress:
                    progress.start = time.time()
                    progress._last = 0.0
                    progress.update(0)
            else:
                with _cache_lock:
                    for src, dst in zip(batch, results or []):
                        cache[src] = dst
                    since_save += 1
                    if since_save >= 25:
                        save_cache(cache)
                        since_save = 0
            if progress:
                progress.update(len(batch))
            if sleep:
                time.sleep(sleep)

    with _cache_lock:
        save_cache(cache)
    return failures


# --------------------------------------------------------------------------- #
# Segmentacion del marcado
# --------------------------------------------------------------------------- #
def chunks(text: str, max_seg: int = MAX_SEG) -> list[str]:
    """Divide un texto largo en trozos manejables (por frases)."""
    if len(text) <= max_seg:
        return [text]
    parts = SENT_RE.split(text)
    out: list[str] = []
    current = ""
    for part in parts:
        if current and len(current) + len(part) + 1 > max_seg:
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
        return PLACEHOLDER.format(len(saved) - 1)

    return ENTITY_RE.sub(repl, text), saved


def restore_entities(text: str, saved: list[str]) -> str:
    for index, entity in enumerate(saved):
        text = text.replace(PLACEHOLDER.format(index), entity)
    return text


def translate_node(
    text: str,
    cache: dict[str, str],
    source: str,
    target: str,
    offline: bool,
) -> str:
    protected, saved = protect_entities(text)
    translated: list[str] = []
    for piece in chunks(protected):
        if not HAS_LETTER.search(piece):
            translated.append(piece)
            continue
        value = cache.get(piece)
        if value is None:
            if offline:
                translated.append(piece)
                continue
            value = translate_batch([piece], source, target)[0]
            cache[piece] = value
        translated.append(value)
    return restore_entities(" ".join(translated), saved)


def translate_html(
    definition: str,
    cache: dict[str, str],
    source: str,
    target: str,
    offline: bool,
) -> str:
    parts = TAG_RE.split(definition or "")
    out: list[str] = []
    for index, part in enumerate(parts):
        if index % 2 == 1:  # etiqueta HTML
            out.append(part)
        elif part.strip() and HAS_LETTER.search(part):
            out.append(translate_node(part, cache, source, target, offline))
        else:
            out.append(part)
    return "".join(out)


def collect_segments(definition: str, cache: dict[str, str]) -> list[str]:
    parts = TAG_RE.split(definition or "")
    result: list[str] = []
    for index, part in enumerate(parts):
        if index % 2 == 1 or not part.strip() or not HAS_LETTER.search(part):
            continue
        protected, _ = protect_entities(part)
        for piece in chunks(protected):
            if HAS_LETTER.search(piece) and piece not in cache:
                result.append(piece)
    return result


# --------------------------------------------------------------------------- #
# Proceso
# --------------------------------------------------------------------------- #
def looks_portuguese(text: str) -> bool:
    return any(marker in text for marker in PT_MARKERS)


def check_module(path: Path) -> tuple[int, int]:
    con = sqlite3.connect(path)
    try:
        rows = con.execute("SELECT Definition FROM Dictionary").fetchall()
    finally:
        con.close()
    total = len(rows)
    pt = sum(1 for (definition,) in rows if looks_portuguese(definition or ""))
    return total, pt


def process_module(
    path: Path,
    cache: dict[str, str],
    source: str,
    target: str,
    limit: int | None,
    batch_size: int,
    max_chars: int,
    sleep: float,
    workers: int,
    force: bool,
) -> tuple[int, int]:
    con = sqlite3.connect(path)
    cur = con.cursor()
    rows = cur.execute("SELECT rowid, Definition FROM Dictionary ORDER BY rowid").fetchall()
    if limit:
        rows = rows[:limit]

    parsed: list[tuple[int, str]] = []
    pending: dict[str, None] = {}
    for rowid, definition in rows:
        definition = definition or ""
        parsed.append((rowid, definition))
        for segment in collect_segments(definition, cache):
            if force or segment not in cache:
                pending[segment] = None

    keys = list(pending.keys())
    print(f"{path.name}: {len(rows)} entradas, {len(keys)} fragmentos por traducir", flush=True)

    failures = 0
    if keys:
        backup = path.with_suffix(path.suffix + ".bak")
        if not backup.exists():
            shutil.copy2(path, backup)
        bar = ProgressBar(len(keys), prefix=f"{path.stem} ")
        failures = translate_batches_concurrent(
            keys, cache, source, target, batch_size, max_chars, workers, sleep, bar
        )
        bar.close()

    updated = 0
    for rowid, definition in parsed:
        translated = translate_html(definition, cache, source, target, offline=True)
        if translated != definition:
            cur.execute(
                "UPDATE Dictionary SET Definition = ? WHERE rowid = ?",
                (translated, rowid),
            )
            updated += 1
    con.commit()
    con.close()
    return updated, failures


def main() -> int:
    parser = argparse.ArgumentParser(description="Traduce modulos Champlin PT->ES")
    parser.add_argument("--module", help="Modulo a traducir, ej. ChamplinAT1")
    parser.add_argument("--all", action="store_true", help="Traduce todos los Champlin")
    parser.add_argument("--check", action="store_true", help="Solo diagnostico, no traduce")
    parser.add_argument("--source", default="pt")
    parser.add_argument("--target", default="es")
    parser.add_argument("--limit", type=int, help="Limita el numero de entradas (prueba)")
    parser.add_argument("--batch-size", type=int, default=40)
    parser.add_argument("--max-chars", type=int, default=5000)
    parser.add_argument("--workers", type=int, default=8, help="Lotes en paralelo")
    parser.add_argument("--sleep", type=float, default=0.0, help="Pausa entre peticiones")
    parser.add_argument("--force", action="store_true", help="Vuelve a traducir lo ya traducido")
    args = parser.parse_args()

    if args.module:
        paths = [OUT / f"{args.module}.dctx"]
    elif args.all or args.check:
        paths = sorted(OUT.glob("Champlin*.dctx"))
    else:
        parser.error("indica --module NOMBRE, --all o --check")

    if args.check:
        total_pt = 0
        for path in paths:
            if not path.exists():
                print(f"No existe {path.name}")
                continue
            total, pt = check_module(path)
            total_pt += pt
            print(f"{path.name}: {total} entradas, {pt} aun en portugues")
        print(f"Total pendiente: {total_pt} entradas.")
        return 0

    cache = load_cache()
    total = 0
    failures = 0
    try:
        for path in paths:
            if not path.exists():
                print(f"No existe {path.name}")
                continue
            try:
                updated, failed = process_module(
                    path,
                    cache,
                    args.source,
                    args.target,
                    args.limit,
                    args.batch_size,
                    args.max_chars,
                    args.sleep,
                    args.workers,
                    args.force,
                )
                total += updated
                failures += failed
            except Exception as error:  # noqa: BLE001
                failures += 1
                print(f"{path.name}: error fatal: {error}", flush=True)
    except KeyboardInterrupt:
        print("\nInterrumpido: guardando cache...", flush=True)
    finally:
        save_cache(cache)

    print(f"Listo. {total} entradas actualizadas en {len(paths)} modulo(s).", flush=True)
    if failures:
        print(f"ADVERTENCIA: {failures} lote(s)/modulo(s) fallaron; reintenta el script.", flush=True)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
