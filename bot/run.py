"""
ZELVA AI - Bot Process Runner & Supervisor
Ensures single-instance execution and proper detached background running.
"""

import sys
import os
import fcntl
import subprocess
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
LOCK_FILE = BASE_DIR / "bot.lock"
LOG_FILE = BASE_DIR / "bot.log"
PYTHON_BIN = BASE_DIR / "venv" / "bin" / "python"
MAIN_SCRIPT = BASE_DIR / "main.py"


def main():
    lock_fd = open(LOCK_FILE, "w")
    try:
        fcntl.flock(lock_fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except IOError:
        print("Bot is already running (locked by another process). Exiting.")
        sys.exit(0)

    print("🚀 Starting ZELVA AI bot...")
    with open(LOG_FILE, "a") as log_out:
        proc = subprocess.Popen(
            [str(PYTHON_BIN), "-u", str(MAIN_SCRIPT)],
            cwd=str(BASE_DIR),
            stdout=log_out,
            stderr=subprocess.STDOUT
        )
        print(f"✅ Bot started with PID {proc.pid}. Logging to {LOG_FILE}")
        proc.wait()


if __name__ == "__main__":
    main()
