#!/usr/bin/env bash
# daemon-pyinstaller.sh — congela el daemon de traduccion con PyInstaller
# para que el instalador NO exija Python en la maquina del usuario.
#
# Salida: scripts/dist/keryx-daemon/ (onedir; se copia a apps/desktop/build/daemon
# para que electron-builder lo embarque en extraResources).
#
# Uso: bash scripts/daemon-pyinstaller.sh   (requiere python3 + pip)
set -euo pipefail

RAIZ="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$RAIZ/scripts/dist"
VENV="$RAIZ/build/daemon-venv"

# Si el caller ya activo un venv (p. ej. el x64 bajo Rosetta del CI), se
# respeta: PyInstaller debe usar el interprete del caller tal cual.
if [ -z "${VIRTUAL_ENV:-}" ]; then
  python3 -m venv "$VENV"
  # shellcheck disable=SC1091
  source "$VENV/bin/activate"
fi
pip install --upgrade pip
# torch por arquitectura: PyTorch dejo de publicar wheels x64 de mac desde
# 2.3, y 2.8+ exige macOS 14. x64 (Mac Intel) usa 2.2.2; arm64 usa 2.7.1.
PYTHON_ARCH="$(python -c 'import platform; print(platform.machine())')"
if [ "$PYTHON_ARCH" = "x86_64" ]; then
  TORCH_PIN="torch==2.2.2"
else
  TORCH_PIN="torch==2.7.1"
fi
pip install "$TORCH_PIN" "argostranslate==1.11.0" "pyinstaller"

cd "$RAIZ/scripts"
# spacy queda FUERA del freeze: sbd.py lo importa en try/except (spacy=None)
# y el descargador de modelos de spaCy lanza pip con sys.executable dentro del
# binario congelado — el daemon se re-ejecuta a si mismo y muere en silencio.
pyinstaller --noconfirm --clean --onedir --name keryx-daemon \
  --collect-all argostranslate \
  --collect-all ctranslate2 \
  --collect-all sentencepiece \
  --collect-all sacremoses \
  --collect-all stanza \
  --exclude-module spacy \
  traductor_daemon.py

echo "listo: $DIST/keryx-daemon/"
