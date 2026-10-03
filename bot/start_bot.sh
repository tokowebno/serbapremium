#!/bin/bash
# Script to run ZELVA AI Telegram Bot

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ -f "$SCRIPT_DIR/venv/bin/python" ]; then
    PYTHON_EXEC="$SCRIPT_DIR/venv/bin/python"
else
    PYTHON_EXEC="python3"
fi

echo "🚀 Starting ZELVA AI Telegram Bot..."
exec "$PYTHON_EXEC" -u main.py
