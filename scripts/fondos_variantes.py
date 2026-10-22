#!/usr/bin/env python3
"""
fondos_variantes.py — Sub-agente de variantes de fondos (0 tokens).

Genera 4 variantes deterministas por cada fondo base:
  v1 Tono I    (rotación de tono +25°)
  v2 Tono II   (rotación de tono -25°)
  v3 Viñeta    (bordes oscurecidos)
  v4 Foco suave(blur suave + leve oscurecido y contraste)

Uso: python scripts/fondos_variantes.py
Requiere: pip install pillow
Salida: apps/desktop/src/renderer/src/assets/fondos/variantes/<base>.v<N>.jpg
"""

from __future__ import annotations

import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

REPO = Path(__file__).resolve().parents[1]
BASES = REPO / "apps" / "desktop" / "src" / "renderer" / "src" / "assets" / "fondos" / "bases"
VARIANTES = REPO / "apps" / "desktop" / "src" / "renderer" / "src" / "assets" / "fondos" / "variantes"

HUE_STEP = 25  # grados de rotación de tono
JPEG_QUALITY = 80


def hue_rotate(image: Image.Image, degrees: float) -> Image.Image:
    """Rota el tono manteniendo saturación y valor (determinista)."""
    hsv = image.convert("HSV")
    h, s, v = hsv.split()
    shift = int(round(degrees / 360 * 255))
    h = h.point(lambda x: (x + shift) % 256)
    return Image.merge("HSV", (h, s, v)).convert("RGB")


def vignette(image: Image.Image, strength: float = 0.62) -> Image.Image:
    """Oscurece los bordes con una máscara radial fija."""
    width, height = image.size
    mask = Image.new("L", (width, height), 0)
    draw = ImageDraw.Draw(mask)
    cx, cy = width / 2, height / 2
    max_r = (cx**2 + cy**2) ** 0.5
    step = 2
    for radius in range(int(max_r), 0, -step):
        draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(width // 6))
    dark = ImageEnhance.Brightness(image).enhance(1 - strength)
    return Image.composite(image, dark, mask)


def soft_focus(image: Image.Image) -> Image.Image:
    """Blur suave + leve contraste y oscurecido (lectura cómoda del texto)."""
    soft = image.filter(ImageFilter.GaussianBlur(3))
    soft = ImageEnhance.Contrast(soft).enhance(1.05)
    return ImageEnhance.Brightness(soft).enhance(0.94)


RECIPES = {
    1: lambda img: hue_rotate(img, HUE_STEP),
    2: lambda img: hue_rotate(img, -HUE_STEP),
    3: vignette,
    4: soft_focus,
}


def main() -> None:
    if not BASES.is_dir():
        raise SystemExit(f"No existe la carpeta de bases: {BASES}")
    VARIANTES.mkdir(parents=True, exist_ok=True)
    bases = sorted(BASES.glob("*.png"))
    total = 0
    for base in bases:
        with Image.open(base) as source:
            image = source.convert("RGB")
            for index, recipe in sorted(RECIPES.items()):
                variant = recipe(image.copy())
                out = VARIANTES / f"{base.stem}.v{index}.jpg"
                variant.save(out, "JPEG", quality=JPEG_QUALITY, optimize=True)
                total += 1
    print(f"Variantes generadas: {total} ({len(bases)} bases x {len(RECIPES)} recetas)")
    size = sum(os.path.getsize(p) for p in VARIANTES.glob("*.jpg"))
    print(f"Peso total variantes: {size / 1024 / 1024:.1f} MB")


if __name__ == "__main__":
    main()
