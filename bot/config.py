import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
if not BOT_TOKEN:
    # Fallback to current token if not in env
    BOT_TOKEN = "8995551134:AAHiRLlpMf7-f-b4BxTuokmrdHV0xCiQy0s"

BOT_NAME = os.getenv("BOT_NAME", "Digital AI").strip()
BOT_USERNAME = os.getenv("BOT_USERNAME", "produkdigitaltbot").replace("@", "").strip()
SUPPORT_USERNAME = os.getenv("SUPPORT_USERNAME", "digitalaishop").replace("@", "").strip()
LOG_CHANNEL = os.getenv("LOG_CHANNEL", "@digitalaishope").strip()

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

# ==============================================================================
# Telegram Custom Emoji IDs for Inline & Reply Keyboard Buttons
# Exact document IDs from Dragon Store bot (@dragonstorez_bot)
# ==============================================================================
MENU_ICONS = {
    "products": "5312361253610475399",
    "wallet": "5287780412746120236",
    "profile": "6017118468661317152",
    "history": "5431721976769027887",
    "language": "5287292843763713628",
    "support": "6181322172263308706",
    "referral": "6017118468661317152",
    "channel": "5330237710655306682"
}

# Payment & Deposit Configurations
BINANCE_ID = os.getenv("BINANCE_ID", "1279190934").strip()
BEP20_ADDRESS = os.getenv("BEP20_ADDRESS", "0x141b43fCDb8D17c09e7b4235b2527309db674A27").strip()
TRC20_ADDRESS = os.getenv("TRC20_ADDRESS", "TQTpRn6j1Pfwf38xP8CxqxJi18YX4v8Wcm").strip()
SOLANA_ADDRESS = os.getenv("SOLANA_ADDRESS", "7JKwQ81LiXgKw4ekSCurNeqXk3jYv3vDMJcDyCLyW64Y").strip()
TON_ADDRESS = os.getenv("TON_ADDRESS", "UQA2ka2a3umUuzmr3ymBM6x7FV3DZOLQ92fRsS_KdElex77P").strip()
QRIS_GATEWAY_API_KEY = os.getenv("QRIS_GATEWAY_API_KEY", "bp_live_kyVHMbynDFTis_ZyVTRPyfgbqedCJsNC").strip()
BORDERPAY_API_URL = os.getenv("BORDERPAY_API_URL", "https://borderpay.id/api/v1").strip()

UI_ICONS = {
    "back": "5206279843481674100",
    "contact_support": "5837153476328558089",
    "bep20": "6314536973860084922",
    "trc20": "6314596089789948392",
    "erc20": "5841643155966924395",
    "binance": "5843689746538173057",
    "qris": "6269053837131129030",
    "qty_minus": "6208479340670226073",
    "qty_plus": "6206427772231881680",
    "wallet": "5287780412746120236",
    "history": "5431721976769027887",
    "products": "5312361253610475399",
    "check": "6102856637343600044",
    "referral": "6017118468661317152",
    "channel": "5330237710655306682"
}

PRODUCT_ICONS = {
    "chatgpt": os.getenv("EMOJI_CHATGPT", "5877651964208091297"),
    "claude": os.getenv("EMOJI_CLAUDE", "6174520215376763867"),
    "gemini": os.getenv("EMOJI_GEMINI", "4963452447084251773"),
    "grok": os.getenv("EMOJI_GROK", "4963465482309994666"),
    "perplexity": os.getenv("EMOJI_PERPLEXITY", "6174854857753631984"),
    "kimi": os.getenv("EMOJI_KIMI", "4963226737962911778"),
    "cursor": os.getenv("EMOJI_CURSOR", "6273793612715138423"),
    "leonardo": os.getenv("EMOJI_LEONARDO", "5305422222842687016"),
    "lovable": os.getenv("EMOJI_LOVABLE", "6082309311936079345"),
    "manus": os.getenv("EMOJI_MANUS", "5371046346713221351"),
    "heygen": os.getenv("EMOJI_HEYGEN", "5870597514784150136"),
    "telegram": os.getenv("EMOJI_TELEGRAM", "5330237710655306682"),
    "poe": "5339471748607788643",
    "canva": "5879982576671657703",
    "capcut": "5364339557712020484",
    "remini": "5204396564746881357",
    "suno": "4963302410991701149",
    "tiktok": "5327982530702359565",
    "youtube": "5341357385279612709",
    "email": "5796209712009581332",
    "vpn": "5258074116824507668",
    "windows": "5979047775470358891"
}

PRODUCT_FALLBACK_ICONS = {
    "chatgpt": "🤖",
    "claude": "🧠",
    "gemini": "✨",
    "grok": "⚡",
    "perplexity": "🔍",
    "kimi": "🌙",
    "cursor": "💻",
    "poe": "🔮",
    "canva": "🎨",
    "capcut": "🎬",
    "remini": "📸",
    "suno": "🎵",
    "telegram": "⭐",
    "tiktok": "📱",
    "youtube": "▶️",
    "email": "✉️",
    "vpn": "🛡️",
    "windows": "🪟",
    "leonardo": "🖌️",
    "lovable": "💖",
    "manus": "🦾",
    "heygen": "🎥",
}

def get_product_custom_emoji_id(product_id: str) -> str | None:
    """
    Returns the custom emoji ID if set to a valid numeric string,
    otherwise returns None.
    """
    emoji_id = PRODUCT_ICONS.get(product_id)
    if emoji_id and isinstance(emoji_id, str):
        cleaned = emoji_id.strip()
        if cleaned.isdigit() and len(cleaned) > 0:
            return cleaned
    return None

def get_product_button_props(product_id: str, default_name: str) -> tuple:
    """
    Returns (button_text, icon_custom_emoji_id).
    """
    custom_id = get_product_custom_emoji_id(product_id)
    return default_name, custom_id

# ==============================================================================
# Telegram Premium Custom Emoji Tags Helper
# ==============================================================================
CUSTOM_EMOJIS = {
    "welcome": "5330237710655306682",     # 🌌 / ⭐ (Sparkle / Galaxy / Telegram)
    "products": "5312361253610475399",    # 🛍️ (Shopping bag / Products)
    "wallet": "5287780412746120236",      # 💰 (Money / Wallet)
    "diamond": "5287780412746120236",     # 💎 (Diamond / Balance)
    "dollar": "5287780412746120236",      # 💵 (Dollar / Price)
    "profile": "6017118468661317152",     # 👤 (Profile / User)
    "history": "5431721976769027887",     # 📜 (History / Orders)
    "receipt": "5431721976769027887",     # 🧾 (Receipt / Order ID)
    "id": "5431721976769027887",          # 🆔 (User ID / Order ID)
    "calendar": "5431721976769027887",    # 📅 (Date / Registered)
    "clock": "5431721976769027887",       # ⏰ / ⏱️ (Time / Hours)
    "language": "5287292843763713628",    # 🌐 (Language / Globe)
    "support": "6181322172263308706",     # ❗ (Support / Exclamation)
    "warning": "6181322172263308706",     # ⚠️ (Warning / Alert)
    "check": "6102856637343600044",       # ✅ (Checkmark / Success)
    "verified": "6102856637343600044",    # ☑️ (Verified badge)
    "shield": "6102856637343600044",      # 🛡️ (Shield / Warranty)
    "box": "5312361253610475399",         # 📦 (Box / Stock / Credentials)
    "key": "5979047775470358891",         # 🔑 (Key / Plan)
    "format": "5796209712009581332",      # 📋 (Format / Details)
    "coin": "5843689746538173057",        # 🪙 (Coin / Crypto / Binance)
    "qris": "6269053837131129030",        # 💳 (QRIS / Card)
    "cart": "5312361253610475399",        # 🛒 (Cart / Shop)
    "flash": "4963465482309994666",       # ⚡ (Flash / Instant)
    "sparkle": "4963452447084251773",     # ✨ (Sparkle / Magic)
    "celebrate": "5330237710655306682",   # 🎉 (Party / Celebration)
    "mail": "5796209712009581332",        # 📨 (Mail / Request)
    "bot": "5877651964208091297",         # 🤖 (Bot / AI)
    "order": "5330237710655306682",       # 👾 (Order tag)
    "folder": "5431721976769027887",      # 🗂️ (Folder / TxID)
}

def ce(name_or_id: str, fallback: str = "✨") -> str:
    """
    Wrap emoji into Telegram Premium custom emoji HTML tag:
    <tg-emoji emoji-id="EMOJI_ID">fallback</tg-emoji>
    """
    emoji_id = CUSTOM_EMOJIS.get(name_or_id, name_or_id)
    return f'<tg-emoji emoji-id="{emoji_id}">{fallback}</tg-emoji>'



