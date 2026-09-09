import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
if not BOT_TOKEN:
    # Fallback to current token if not in env
    BOT_TOKEN = "8995551134:AAHiRLlpMf7-f-b4BxTuokmrdHV0xCiQy0s"

BOT_NAME = os.getenv("BOT_NAME", "ZELVA AI").strip()
BOT_USERNAME = os.getenv("BOT_USERNAME", "zelvaibot").replace("@", "").strip()
SUPPORT_USERNAME = os.getenv("SUPPORT_USERNAME", "zelvasupport").replace("@", "").strip()

# Admin IDs list from env (comma-separated e.g. "12345678,87654321")
raw_admins = os.getenv("ADMIN_IDS", os.getenv("ADMIN_ID", "0"))
ADMIN_IDS = []
for a in raw_admins.split(","):
    a_clean = a.strip()
    if a_clean.isdigit() and int(a_clean) > 0:
        ADMIN_IDS.append(int(a_clean))

DEFAULT_LANGUAGE = os.getenv("DEFAULT_LANGUAGE", "en").strip().lower()
CURRENCY = os.getenv("CURRENCY", "USD").strip().upper()

DB_PATH = BASE_DIR / os.getenv("DB_PATH", "data/zelva.db")
ASSETS_DIR = BASE_DIR / "assets"
IMAGES_DIR = ASSETS_DIR / "images"
LOGOS_DIR = ASSETS_DIR / "logos"

DB_PATH.parent.mkdir(parents=True, exist_ok=True)
IMAGES_DIR.mkdir(parents=True, exist_ok=True)
LOGOS_DIR.mkdir(parents=True, exist_ok=True)
