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

python3 -m venv "$VENV"
# shellcheck disable=SC1091
source "$VENV/bin/activate"
pip install --upgrade pip
pip install "argostranslate==1.11.0" "pyinstaller"

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
