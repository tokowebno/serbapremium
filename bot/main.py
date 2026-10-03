"""
ZELVA AI - Main Telegram Bot Application
100% matched UI and workflow of Dragon Store Bot (@dragonstorez_bot)
Includes multi-network wallet top-up (BEP20, TRC20, Binance Pay, QRIS) with TxID submission & Admin 1-click approval.
"""

import os
import random
import string
import asyncio
import logging
from datetime import datetime
from pathlib import Path
import telegram
from telegram import (
    Update,
    InlineKeyboardMarkup,
    InlineKeyboardButton,
    ReplyKeyboardMarkup,
    KeyboardButton,
    ReplyKeyboardRemove,
    error as tg_error
)
from telegram.constants import ParseMode
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    CallbackQueryHandler,
    ContextTypes,
    filters
)

from config import (
    BOT_TOKEN,
    BOT_NAME,
    BOT_USERNAME,
    SUPPORT_USERNAME,
    LOG_CHANNEL,
    ADMIN_IDS,
    BINANCE_ID,
    BEP20_ADDRESS,
    TRC20_ADDRESS,
    SOLANA_ADDRESS,
    TON_ADDRESS,
    QRIS_GATEWAY_API_KEY,
    MENU_ICONS,
    UI_ICONS,
    PRODUCT_ICONS,
    get_product_custom_emoji_id,
    get_product_button_props
)
from products import PRODUCTS, PRODUCTS_LIST, get_product, get_product_plan
from database import (
    get_or_create_user,
    get_user,
    get_user_balance,
    update_user_balance,
    create_order,
    get_user_orders,
    get_user_orders_count,
    create_deposit_request,
    submit_deposit_txid,
    get_deposit_by_code,
    get_deposit_by_id,
    get_user_deposits_count,
    get_user_total_deposited,
    get_referral_stats,
    claim_referral_signup_reward,
    set_user_verified,
    set_user_language,
    is_txid_already_used,
    auto_approve_deposit,
    get_latest_pending_deposit
)
from blockchain import verify_onchain_payment
from i18n import t, format_price, LANGUAGES
from admin import is_admin, admin_dashboard, handle_admin_callback, handle_admin_text

# Logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO
)
logger = logging.getLogger(__name__)

import io
import urllib.parse
import httpx
import qrcode

def generate_qr_image_bytes(data: str) -> bytes:
    """Generate high quality QR code image in memory as PNG bytes"""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=3,
    )
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()

import time

BORDERPAY_API_KEY = QRIS_GATEWAY_API_KEY or "bp_live_kyVHMbynDFTis_ZyVTRPyfgbqedCJsNC"
BORDERPAY_BASE_URL = "https://borderpay.id/api/v1"

_cached_rate = {"rate": 17904.0, "last_updated": 0.0}

async def get_usd_to_idr_rate() -> float:
    """Fetch real-time USD/USDT to IDR exchange rate with in-memory caching"""
    global _cached_rate
    now = time.time()
    if now - _cached_rate["last_updated"] < 300:  # 5 minutes cache
        return _cached_rate["rate"]

    apis = [
        "https://indodax.com/api/ticker/usdtidr",
        "https://open.er-api.com/v6/latest/USD",
        "https://api.exchangerate-api.com/v4/latest/USD",
        "https://api.coinbase.com/v2/exchange-rates?currency=USD"
    ]
    for url in apis:
        try:
            async with httpx.AsyncClient() as client:
                r = await client.get(url, timeout=4.0)
                if r.status_code == 200:
                    data = r.json()
                    val = None
                    if "ticker" in data and "last" in data["ticker"]:
                        val = float(data["ticker"]["last"])
                    elif "rates" in data and "IDR" in data["rates"]:
                        val = float(data["rates"]["IDR"])
                    elif "data" in data and "rates" in data["data"] and "IDR" in data["data"]["rates"]:
                        val = float(data["data"]["rates"]["IDR"])
                    if val and val > 10000:
                        _cached_rate = {"rate": val, "last_updated": now}
                        return val
        except Exception:
            pass
    return _cached_rate["rate"]

async def create_borderpay_payment(order_code: str, amount_idr: int) -> dict | None:
    """Create live dynamic QRIS transaction via BorderPay API"""
    try:
        async with httpx.AsyncClient() as client:
            res = await client.post(
                f"{BORDERPAY_BASE_URL}/payments",
                headers={
                    "Authorization": f"Bearer {BORDERPAY_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "amount": amount_idr,
                    "method": "qris",
                    "reference_id": order_code
                },
                timeout=12.0
            )
            if res.status_code in (200, 201):
                return res.json()
            else:
                logger.warning(f"BorderPay create failed: {res.status_code} {res.text}")
                return None
    except Exception as e:
        logger.error(f"BorderPay create exception: {e}")
        return None

async def check_borderpay_status(order_code: str) -> dict | None:
    """Check payment status from BorderPay API"""
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(
                f"{BORDERPAY_BASE_URL}/payments/{order_code}",
                headers={
                    "Authorization": f"Bearer {BORDERPAY_API_KEY}"
                },
                timeout=10.0
            )
            if res.status_code == 200:
                return res.json()
            return None
    except Exception as e:
        logger.error(f"BorderPay status exception: {e}")
        return None

async def send_channel_notification(context: ContextTypes.DEFAULT_TYPE, text: str):
    """Send live order / deposit update to public channel / group"""
    if not LOG_CHANNEL:
        return
    try:
        await context.bot.send_message(
            chat_id=LOG_CHANNEL,
            text=text,
            parse_mode=ParseMode.HTML,
            disable_web_page_preview=True
        )
    except Exception as e:
        logger.debug(f"Failed to send notification to channel {LOG_CHANNEL}: {e}")


# ==============================================================================
# KEYBOARD BUILDERS (Dragon Store Style)
# ==============================================================================

def get_main_reply_keyboard(lang: str = "en") -> ReplyKeyboardMarkup:
    """
    Persistent bottom menu keyboard:
    [ Products ]   [ My Wallet ]
    [ My Profile ] [ History ]
    [ 👥 Referral ] [ Support ]
    [ 📢 Channel ] [ Language ]
    """
    keyboard = [
        [
            KeyboardButton(
                text=t("btn_products", lang),
                icon_custom_emoji_id=MENU_ICONS["products"]
            ),
            KeyboardButton(
                text=t("btn_wallet", lang),
                icon_custom_emoji_id=MENU_ICONS["wallet"]
            )
        ],
        [
            KeyboardButton(
                text=t("btn_profile", lang),
                icon_custom_emoji_id=MENU_ICONS["profile"]
            ),
            KeyboardButton(
                text=t("btn_history", lang),
                icon_custom_emoji_id=MENU_ICONS["history"]
            )
        ],
        [
            KeyboardButton(
                text=f"👥 {t('btn_referral', lang)}",
                icon_custom_emoji_id=MENU_ICONS["referral"]
            ),
            KeyboardButton(
                text=t("btn_support", lang),
                icon_custom_emoji_id=MENU_ICONS["support"]
            )
        ],
        [
            KeyboardButton(
                text="📢 Channel",
                icon_custom_emoji_id=UI_ICONS["channel"]
            ),
            KeyboardButton(
                text=t("btn_language", lang),
                icon_custom_emoji_id=MENU_ICONS["language"]
            )
        ]
    ]
    return ReplyKeyboardMarkup(keyboard, resize_keyboard=True)


def get_start_inline_keyboard(lang: str = "en") -> InlineKeyboardMarkup:
    """Inline quick action buttons attached to the Start welcome message"""
    channel_clean = LOG_CHANNEL.replace("@", "")
    buttons = [
        [
            InlineKeyboardButton(
                "🛍️ " + t("btn_products", lang),
                callback_data="nav:products",
                icon_custom_emoji_id=MENU_ICONS["products"]
            ),
            InlineKeyboardButton(
                "👛 " + t("btn_wallet", lang),
                callback_data="nav:wallet",
                icon_custom_emoji_id=MENU_ICONS["wallet"]
            )
        ],
        [
            InlineKeyboardButton(
                "📢 " + ("Channel Resmi" if lang == "id" else "Official Channel"),
                url=f"https://t.me/{channel_clean}",
                icon_custom_emoji_id=UI_ICONS["channel"]
            ),
            InlineKeyboardButton(
                "💬 " + t("btn_support", lang),
                url=f"https://t.me/{SUPPORT_USERNAME}",
                icon_custom_emoji_id=MENU_ICONS["support"]
            )
        ]
    ]
    return InlineKeyboardMarkup(buttons)


def get_products_keyboard(lang: str = "en") -> InlineKeyboardMarkup:
    """
    Product Category selection grid (2 columns):
    [ ChatGPT ]    [ Claude ]
    [ Gemini ]     [ Grok ]
    [ Perplexity ] [ Kimi ]
    [ Cursor ]     [ Poe ]
    ...
    [ Back to Menu ]
    """
    products_layout = [
        ("chatgpt", "claude"),
        ("gemini", "grok"),
        ("perplexity", "kimi"),
        ("cursor", "poe"),
        ("lovable", "manus"),
        ("leonardo", "heygen"),
        ("capcut", "youtube"),
    ]

    buttons = []
    for row in products_layout:
        button_row = []
        for pid in row:
            prod = get_product(pid)
            name = prod["name"] if prod else pid.capitalize()
            emoji_id = PRODUCT_ICONS.get(pid)
            button_row.append(
                InlineKeyboardButton(
                    text=name,
                    callback_data=f"prod:{pid}",
                    icon_custom_emoji_id=emoji_id
                )
            )
        buttons.append(button_row)

    buttons.append([
        InlineKeyboardButton(
            text=t("btn_back_menu", lang),
            callback_data="nav:start",
            icon_custom_emoji_id=UI_ICONS["back"]
        )
    ])
    return InlineKeyboardMarkup(buttons)


def get_product_plans_keyboard(product_id: str, lang: str = "en") -> InlineKeyboardMarkup:
    """
    Product plan selection list:
    [$15.00 | 1 Month (99)]
    [$40.00 | 3 Months (99)]
    [ Back ]
    """
    prod = get_product(product_id)
    if not prod:
        return InlineKeyboardMarkup([[
            InlineKeyboardButton(t("btn_back", lang), callback_data="nav:products", icon_custom_emoji_id=UI_ICONS["back"])
        ]])

    plans = prod.get("plans", [])
    buttons = []
    icon_id = PRODUCT_ICONS.get(product_id)

    for plan in plans:
        plan_name = plan["name_id"] if lang == "id" else plan["name_en"]
        stock = plan.get("stock", 99)
        price_str = f"${plan['price_usd']:.2f}"
        btn_text = f"{price_str} | {plan_name} ({stock})"
        
        buttons.append([
            InlineKeyboardButton(
                text=btn_text,
                callback_data=f"plan:{product_id}:{plan['id']}:1",
                icon_custom_emoji_id=icon_id
            )
        ])

    buttons.append([
        InlineKeyboardButton(
            text=t("btn_back", lang),
            callback_data="nav:products",
            icon_custom_emoji_id=UI_ICONS["back"]
        )
    ])
    return InlineKeyboardMarkup(buttons)


def get_plan_checkout_keyboard(product_id: str, plan_id: str, qty: int = 1, lang: str = "en") -> InlineKeyboardMarkup:
    """
    Plan detail & interactive quantity / buy checkout keyboard:
    [ - ] [ Quantity: 1 ] [ + ]
    [ +10 ] [ +50 ] [ +100 ]
    [ Buy 1 - $15.00 ]
    [ Back to Products ]
    """
    plan = get_product_plan(product_id, plan_id)
    price_usd = plan["price_usd"] if plan else 0.0
    total_price = price_usd * qty

    buttons = [
        [
            InlineKeyboardButton(" ", callback_data=f"qty:dec:{product_id}:{plan_id}:{qty}", icon_custom_emoji_id=UI_ICONS["qty_minus"]),
            InlineKeyboardButton(f"Quantity: {qty}", callback_data="noop"),
            InlineKeyboardButton(" ", callback_data=f"qty:inc:{product_id}:{plan_id}:{qty}", icon_custom_emoji_id=UI_ICONS["qty_plus"])
        ],
        [
            InlineKeyboardButton("+10", callback_data=f"qty:add:{product_id}:{plan_id}:{qty}:10"),
            InlineKeyboardButton("+50", callback_data=f"qty:add:{product_id}:{plan_id}:{qty}:50"),
            InlineKeyboardButton("+100", callback_data=f"qty:add:{product_id}:{plan_id}:{qty}:100")
        ],
        [
            InlineKeyboardButton(
                f"Buy {qty} - ${total_price:.2f}",
                callback_data=f"buy_confirm:{product_id}:{plan_id}:{qty}"
            )
        ],
        [
            InlineKeyboardButton(
                t("btn_back_products", lang),
                callback_data=f"prod:{product_id}",
                icon_custom_emoji_id=UI_ICONS["back"]
            )
        ]
    ]
    return InlineKeyboardMarkup(buttons)


def get_wallet_keyboard(lang: str = "en") -> InlineKeyboardMarkup:
    """Wallet top-up keyboard matching Dragon Store (BEP20, TRC20, Solana, TON, Binance Pay, QRIS)"""
    buttons = [
        [InlineKeyboardButton("BEP20 (USDT)", callback_data="topup_init:BEP20", icon_custom_emoji_id=UI_ICONS["bep20"])],
        [InlineKeyboardButton("TRC20 (USDT)", callback_data="topup_init:TRC20", icon_custom_emoji_id=UI_ICONS["trc20"])],
        [InlineKeyboardButton("Solana (SOL/USDT)", callback_data="topup_init:SOLANA", icon_custom_emoji_id=UI_ICONS.get("solana", UI_ICONS["bep20"]))],
        [InlineKeyboardButton("TON / GRAM", callback_data="topup_init:TON", icon_custom_emoji_id=UI_ICONS.get("ton", UI_ICONS["bep20"]))],
        [InlineKeyboardButton("Binance Pay (ID)", callback_data="topup_init:BINANCE", icon_custom_emoji_id=UI_ICONS["binance"])],
        [InlineKeyboardButton("QRIS (IDR)", callback_data="topup_init:QRIS", icon_custom_emoji_id=UI_ICONS["qris"])],
        [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start", icon_custom_emoji_id=UI_ICONS["back"])]
    ]
    return InlineKeyboardMarkup(buttons)


def get_profile_keyboard(lang: str = "en") -> InlineKeyboardMarkup:
    """Profile keyboard matching Dragon Store"""
    buttons = [
        [InlineKeyboardButton(t("btn_wallet", lang), callback_data="nav:wallet", icon_custom_emoji_id=UI_ICONS["wallet"])],
        [InlineKeyboardButton(t("btn_history", lang), callback_data="nav:orders", icon_custom_emoji_id=UI_ICONS["history"])],
        [InlineKeyboardButton("👥 " + t("btn_referral", lang), callback_data="nav:referral", icon_custom_emoji_id=UI_ICONS["referral"])],
        [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start", icon_custom_emoji_id=UI_ICONS["back"])]
    ]
    return InlineKeyboardMarkup(buttons)


def get_language_keyboard(lang: str = "en") -> InlineKeyboardMarkup:
    """Language selection keyboard matching Dragon Store (10 languages)"""
    buttons = [
        [
            InlineKeyboardButton("🇬🇧 English", callback_data="setlang:en"),
            InlineKeyboardButton("🇫🇷 Français", callback_data="setlang:fr")
        ],
        [
            InlineKeyboardButton("🇸🇦 العربية", callback_data="setlang:ar"),
            InlineKeyboardButton("🇨🇳 简体中文", callback_data="setlang:zh")
        ],
        [
            InlineKeyboardButton("🇻🇳 Tiếng Việt", callback_data="setlang:vi"),
            InlineKeyboardButton("🇷🇺 Русский", callback_data="setlang:ru")
        ],
        [
            InlineKeyboardButton("🇮🇩 Bahasa Indonesia", callback_data="setlang:id"),
            InlineKeyboardButton("🇮🇳 हिन्दी", callback_data="setlang:hi")
        ],
        [
            InlineKeyboardButton("🇪🇸 Español", callback_data="setlang:es"),
            InlineKeyboardButton("🇹🇭 ไทย", callback_data="setlang:th")
        ],
        [
            InlineKeyboardButton(t("btn_back", lang), callback_data="nav:start", icon_custom_emoji_id=UI_ICONS["back"])
        ]
    ]
    return InlineKeyboardMarkup(buttons)


def get_support_keyboard(lang: str = "en") -> InlineKeyboardMarkup:
    """Support keyboard matching Dragon Store"""
    buttons = [
        [
            InlineKeyboardButton(
                "Contact Support",
                url=f"https://t.me/{SUPPORT_USERNAME}",
                icon_custom_emoji_id=UI_ICONS["contact_support"]
            )
        ],
        [
            InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start", icon_custom_emoji_id=UI_ICONS["back"])
        ]
    ]
    return InlineKeyboardMarkup(buttons)


# ==============================================================================
# VIEW CONTROLLERS
# ==============================================================================

async def safe_edit_or_reply(update: Update, text: str, reply_markup=None, parse_mode=ParseMode.HTML, is_callback: bool = True):
    """Safely edit message text or caption (if photo) or send a new message, and answer callback."""
    if is_callback and update.callback_query:
        query = update.callback_query
        try:
            await query.answer()
        except Exception:
            pass

        try:
            await query.edit_message_text(text=text, parse_mode=parse_mode, reply_markup=reply_markup)
            return
        except Exception:
            pass

        try:
            await query.edit_message_caption(caption=text, parse_mode=parse_mode, reply_markup=reply_markup)
            return
        except Exception:
            pass

        try:
            await query.message.reply_text(text=text, parse_mode=parse_mode, reply_markup=reply_markup)
            return
        except Exception:
            pass
    elif update.message:
        await update.message.reply_text(text=text, parse_mode=parse_mode, reply_markup=reply_markup)
    elif update.effective_chat:
        try:
            await update.effective_chat.send_message(text=text, parse_mode=parse_mode, reply_markup=reply_markup)
        except Exception:
            pass


async def show_start_view(update: Update, context: ContextTypes.DEFAULT_TYPE, is_callback: bool = False):
    """Display Welcome message with channel & support and set persistent bottom keyboard"""
    user = update.effective_user
    db_user = get_or_create_user(user.id, user.username or "", user.first_name or "")
    lang = db_user.get("language", "en")
    channel_clean = LOG_CHANNEL.replace("@", "")

    text = t("start_text", lang, bot_name=BOT_NAME, support_username=SUPPORT_USERNAME, channel_username=channel_clean)
    inline_markup = get_start_inline_keyboard(lang)
    reply_markup = get_main_reply_keyboard(lang)

    if is_callback and update.callback_query:
        query = update.callback_query
        try:
            await query.answer()
        except Exception:
            pass
        try:
            await query.message.delete()
        except Exception:
            pass
        await context.bot.send_message(
            chat_id=user.id,
            text=text,
            parse_mode=ParseMode.HTML,
            reply_markup=inline_markup,
            disable_web_page_preview=True
        )
    else:
        await update.message.reply_text(
            text=text,
            parse_mode=ParseMode.HTML,
            reply_markup=inline_markup,
            disable_web_page_preview=True
        )
        try:
            nav_hint = "<i>Silakan pilih menu di bawah ini untuk memulai:</i>" if lang == "id" else "<i>Choose an option below to get started:</i>"
            await update.message.reply_text(
                text=nav_hint,
                parse_mode=ParseMode.HTML,
                reply_markup=reply_markup
            )
        except Exception:
            pass


async def check_user_joined_channel(context: ContextTypes.DEFAULT_TYPE, user_id: int) -> bool:
    """Check if user is a member of the official channel (@digitalaishope)"""
    channel_username = LOG_CHANNEL if LOG_CHANNEL.startswith("@") else f"@{LOG_CHANNEL}"
    try:
        member = await context.bot.get_chat_member(chat_id=channel_username, user_id=user_id)
        if member.status in ["creator", "administrator", "member", "restricted"]:
            return True
        return False
    except Exception as e:
        logger.warning(f"Failed to check channel membership for user {user_id} on {channel_username}: {e}")
        return False


async def show_force_sub_view(update: Update, context: ContextTypes.DEFAULT_TYPE, next_action: str = "nav:products", is_callback: bool = True):
    """Prompt user to join the official channel before accessing products"""
    user = update.effective_user
    db_user = get_or_create_user(user.id, user.username or "", user.first_name or "")
    lang = db_user.get("language", "en")
    channel_name = LOG_CHANNEL if LOG_CHANNEL.startswith("@") else f"@{LOG_CHANNEL}"
    channel_url = f"https://t.me/{channel_name.replace('@', '')}"

    text = (
        f'<tg-emoji emoji-id="5431721976769027887">📢</tg-emoji> <b>VERIFIKASI WAJIB JOIN CHANNEL</b>\n'
        f'━━━━━━━━━━━━━━━━━━━\n'
        f'Untuk melihat katalog produk dan melakukan pemesanan di <b>{BOT_NAME}</b>, Anda diwajibkan bergabung ke channel resmi kami terlebih dahulu:\n\n'
        f'👉 <b>Channel:</b> {channel_name}\n\n'
        f'<i>Silakan klik tombol <b>"📢 Join Channel"</b> di bawah, lalu tekan tombol <b>"✅ Saya Sudah Join"</b> untuk membuka akses produk.</i>'
        if lang == "id"
        else
        f'<tg-emoji emoji-id="5431721976769027887">📢</tg-emoji> <b>MANDATORY CHANNEL VERIFICATION</b>\n'
        f'━━━━━━━━━━━━━━━━━━━\n'
        f'To view products and place orders at <b>{BOT_NAME}</b>, please join our official channel first:\n\n'
        f'👉 <b>Channel:</b> {channel_name}\n\n'
        f'<i>Please tap <b>"📢 Join Channel"</b> below, then tap <b>"✅ I Have Joined"</b> to unlock product access.</i>'
    )

    buttons = [
        [InlineKeyboardButton("📢 " + ("Join Channel" if lang == "id" else "Join Official Channel"), url=channel_url)],
        [InlineKeyboardButton("✅ " + ("Saya Sudah Join" if lang == "id" else "I Have Joined"), callback_data=f"verify_sub:{next_action}")],
        [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start", icon_custom_emoji_id=UI_ICONS["back"])]
    ]

    await safe_edit_or_reply(update, text=text, reply_markup=InlineKeyboardMarkup(buttons), is_callback=is_callback)


async def show_products_view(update: Update, context: ContextTypes.DEFAULT_TYPE, is_callback: bool = True):
    """Display clean product categories grid with channel check"""
    user = update.effective_user
    db_user = get_or_create_user(user.id, user.username or "", user.first_name or "")
    lang = db_user.get("language", "en")

    # Force sub check
    is_joined = await check_user_joined_channel(context, user.id)
    if not is_joined:
        await show_force_sub_view(update, context, next_action="nav:products", is_callback=is_callback)
        return

    text = t("catalog_text", lang)
    markup = get_products_keyboard(lang)
    await safe_edit_or_reply(update, text=text, reply_markup=markup, is_callback=is_callback)


async def show_product_plans_view(update: Update, context: ContextTypes.DEFAULT_TYPE, product_id: str):
    """Display product plans list with channel check"""
    query = update.callback_query
    user = update.effective_user
    db_user = get_or_create_user(user.id, user.username or "", user.first_name or "")
    lang = db_user.get("language", "en")

    # Force sub check
    is_joined = await check_user_joined_channel(context, user.id)
    if not is_joined:
        await show_force_sub_view(update, context, next_action=f"prod:{product_id}", is_callback=True)
        return

    prod = get_product(product_id)
    if not prod:
        if query:
            await query.answer("Product not found.", show_alert=True)
        return

    text = t("product_plans_prompt", lang, name=prod["name"])
    markup = get_product_plans_keyboard(product_id, lang)
    await safe_edit_or_reply(update, text=text, reply_markup=markup, is_callback=True)


async def show_plan_detail_view(update: Update, context: ContextTypes.DEFAULT_TYPE, product_id: str, plan_id: str, qty: int = 1):
    """Display plan details and quantity selector with channel check"""
    query = update.callback_query
    user = update.effective_user
    db_user = get_or_create_user(user.id, user.username or "", user.first_name or "")
    lang = db_user.get("language", "en")

    # Force sub check
    is_joined = await check_user_joined_channel(context, user.id)
    if not is_joined:
        await show_force_sub_view(update, context, next_action=f"plan:{product_id}:{plan_id}:{qty}", is_callback=True)
        return

    prod = get_product(product_id)
    plan = get_product_plan(product_id, plan_id)

    if not prod or not plan:
        if query:
            await query.answer("Invalid plan.", show_alert=True)
        return

    plan_name = plan["name_id"] if lang == "id" else plan["name_en"]
    price_str = f"${plan['price_usd']:.2f}"
    stock = plan.get("stock", 75)
    sold = 219

    text = t(
        "plan_detail",
        lang,
        product=prod["name"],
        plan=plan_name,
        price=price_str,
        stock=stock,
        sold=sold
    )
    markup = get_plan_checkout_keyboard(product_id, plan_id, qty=qty, lang=lang)
    await safe_edit_or_reply(update, text=text, reply_markup=markup, is_callback=True)


async def process_buy_confirm(update: Update, context: ContextTypes.DEFAULT_TYPE, product_id: str, plan_id: str, qty: int = 1):
    """Process order purchase with balance check and channel verification"""
    query = update.callback_query
    user = update.effective_user
    db_user = get_or_create_user(user.id)
    lang = db_user.get("language", "en")

    # Force sub check
    is_joined = await check_user_joined_channel(context, user.id)
    if not is_joined:
        await show_force_sub_view(update, context, next_action=f"plan:{product_id}:{plan_id}:{qty}", is_callback=True)
        return

    prod = get_product(product_id)
    plan = get_product_plan(product_id, plan_id)

    if not prod or not plan:
        if query:
            await query.answer("Product unavailable.", show_alert=True)
        return

    curr_usd, curr_idr = get_user_balance(user.id)
    price_usd = plan["price_usd"]
    price_idr = plan["price_idr"]
    total_price_usd = price_usd * qty
    total_price_idr = price_idr * qty

    # Check balance
    if curr_usd < total_price_usd:
        insuf_msg = t("insufficient_balance", lang, balance=f"{curr_usd:.2f}", required=f"{total_price_usd:.2f}")
        buttons = [
            [InlineKeyboardButton("Top Up Wallet", callback_data="nav:wallet", icon_custom_emoji_id=UI_ICONS["wallet"])],
            [InlineKeyboardButton("Back", callback_data=f"plan:{product_id}:{plan_id}:{qty}", icon_custom_emoji_id=UI_ICONS["back"])]
        ]
        await safe_edit_or_reply(update, text=insuf_msg, reply_markup=InlineKeyboardMarkup(buttons), is_callback=True)
        return

    # Deduct balance
    plan_name = plan["name_id"] if lang == "id" else plan["name_en"]
    price_str = f"${total_price_usd:.2f}"

    update_user_balance(
        user.id,
        -total_price_usd,
        -total_price_idr,
        "purchase",
        f"Purchased {qty}x {prod['name']} - {plan_name}"
    )

    # Insert verified order
    order_code, bonus_awarded, ref_id, bonus_amt = create_order(
        user.id,
        product_id,
        plan_id,
        prod["name"],
        f"{qty}x {plan_name}",
        total_price_usd,
        total_price_idr,
        payment_method="balance"
    )

    if bonus_awarded and ref_id > 0:
        try:
            ref_u = get_user(ref_id)
            ref_lang = ref_u.get("language", "en") if ref_u else "en"
            buyer_label = f"@{user.username}" if user.username else (user.first_name or f"User {user.id}")
            if ref_lang == "id":
                notify_txt = (
                    f'<tg-emoji emoji-id="5330237710655306682">🎉</tg-emoji> <b>Bonus Referral Masuk!</b>\n\n'
                    f'<tg-emoji emoji-id="6017118468661317152">👤</tg-emoji> Teman yang kamu undang (<b>{buyer_label}</b>) telah berhasil melakukan <b>order pertamanya</b>!\n'
                    f'<tg-emoji emoji-id="5287780412746120236">💰</tg-emoji> Bonus saldo <b>+$0.20 USD</b> telah ditambahkan ke dompet kamu!'
                )
            else:
                notify_txt = (
                    f'<tg-emoji emoji-id="5330237710655306682">🎉</tg-emoji> <b>Referral Bonus Received!</b>\n\n'
                    f'<tg-emoji emoji-id="6017118468661317152">👤</tg-emoji> Your invited friend (<b>{buyer_label}</b>) has completed their <b>first order</b>!\n'
                    f'<tg-emoji emoji-id="5287780412746120236">💰</tg-emoji> <b>+$0.20 USD</b> referral bonus has been credited to your wallet!'
                )
            await context.bot.send_message(chat_id=ref_id, text=notify_txt, parse_mode=ParseMode.HTML)
        except Exception as e:
            logger.warning(f"Failed to notify referrer {ref_id}: {e}")

    credentials = (
        f"EMAIL: account_{user.id}_{order_code}@digitalai.store\n"
        f"PASS: DigitalPass#{order_code}!99\n"
        f"2FA_KEY: JBSWY3DPEHPK3PXP"
    )

    success_msg = t(
        "order_success",
        lang,
        order_id=order_code,
        product=prod["name"],
        plan=plan_name,
        qty=qty,
        price=price_str,
        credentials=credentials,
        support=SUPPORT_USERNAME
    )

    buttons = [
        [InlineKeyboardButton("History", callback_data="nav:orders", icon_custom_emoji_id=UI_ICONS["history"])],
        [InlineKeyboardButton("Products", callback_data="nav:products", icon_custom_emoji_id=MENU_ICONS["products"])],
        [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start", icon_custom_emoji_id=UI_ICONS["back"])]
    ]
    await safe_edit_or_reply(update, text=success_msg, reply_markup=InlineKeyboardMarkup(buttons), is_callback=True)

    # Alert admin(s)
    user_masked = str(user.id)[:4] + "****"
    for aid in ADMIN_IDS:
        try:
            await context.bot.send_message(
                chat_id=aid,
                text=(
                    f"📦 <b>New Order Placed!</b>\n\n"
                    f"Order ID: <code>#{order_code}</code>\n"
                    f"User: <code>{user_masked}</code>\n"
                    f"Product: <b>{prod['name']}</b> ({plan_name}) x{qty}\n"
                    f"Amount: <b>{price_str}</b>\n"
                    f"Status: <b>COMPLETED</b>"
                ),
                parse_mode=ParseMode.HTML
            )
        except Exception:
            pass

    # Broadcast to live orders channel / group
    rand_prefix = random.randint(1000, 9999)
    id_masked = f"{rand_prefix}***"
    plan_en = plan["name_en"]
    await send_channel_notification(
        context,
        f'<tg-emoji emoji-id="5312361253610475399">🛍️</tg-emoji> <b>ORDER COMPLETED</b>\n'
        f'━━━━━━━━━━━━━━━━━━━\n'
        f'<tg-emoji emoji-id="5312361253610475399">📦</tg-emoji> <b>Product:</b> <b>{prod["name"]}</b> ({plan_en}) x{qty}\n'
        f'<tg-emoji emoji-id="5431721976769027887">🧾</tg-emoji> <b>Order ID:</b> <code>#{order_code}</code>\n'
        f'<tg-emoji emoji-id="6017118468661317152">👤</tg-emoji> <b>Buyer:</b> <code>{id_masked}</code>\n'
        f'<tg-emoji emoji-id="5287780412746120236">💰</tg-emoji> <b>Total:</b> <b>{price_str}</b>\n'
        f'<tg-emoji emoji-id="5431721976769027887">⏱️</tg-emoji> <b>Status:</b> <b>Auto Delivered</b> <tg-emoji emoji-id="4963465482309994666">⚡</tg-emoji>\n'
        f'━━━━━━━━━━━━━━━━━━━\n'
        f'<tg-emoji emoji-id="5312361253610475399">🛒</tg-emoji> <i>Buy AI accounts & digital subscriptions at @{BOT_USERNAME}</i>'
    )


async def show_wallet_view(update: Update, context: ContextTypes.DEFAULT_TYPE, is_callback: bool = True):
    """Display wallet view matching Dragon Store"""
    user = update.effective_user
    db_user = get_or_create_user(user.id, user.username or "", user.first_name or "")
    lang = db_user.get("language", "en")

    curr_usd, curr_idr = get_user_balance(user.id)
    orders_count = get_user_orders_count(user.id)
    orders = get_user_orders(user.id, limit=100)
    total_spent = sum(float(o.get("price_usd", 0.0) or 0.0) for o in orders)
    deposits_count = get_user_deposits_count(user.id)
    total_deposited = get_user_total_deposited(user.id)

    text = t(
        "wallet_text",
        lang,
        balance=f"{curr_usd:.2f}",
        orders_count=orders_count,
        total_spent=f"{total_spent:.2f}",
        deposits_count=deposits_count,
        total_deposited=f"{total_deposited:.2f}"
    )
    markup = get_wallet_keyboard(lang)
    await safe_edit_or_reply(update, text=text, reply_markup=markup, is_callback=is_callback)


async def show_profile_view(update: Update, context: ContextTypes.DEFAULT_TYPE, is_callback: bool = True):
    """Display profile matching Dragon Store"""
    user = update.effective_user
    db_user = get_or_create_user(user.id, user.username or "", user.first_name or "")
    lang = db_user.get("language", "en")

    curr_usd, _ = get_user_balance(user.id)
    username_str = user.username or user.first_name or "User"
    created_str = db_user.get("created_at", "2026-09-09 12:00")
    lang_info = LANGUAGES.get(lang, LANGUAGES["en"])
    flag = lang_info["flag"]
    lang_name = lang_info["name"]

    text = t(
        "profile_text",
        lang,
        username=username_str,
        user_id=user.id,
        balance=f"{curr_usd:.2f}",
        flag=flag,
        lang_name=lang_name,
        created_at=str(created_str)[:16]
    )
    markup = get_profile_keyboard(lang)
    await safe_edit_or_reply(update, text=text, reply_markup=markup, is_callback=is_callback)


async def show_orders_view(update: Update, context: ContextTypes.DEFAULT_TYPE, is_callback: bool = True):
    """Display order history matching Dragon Store"""
    user = update.effective_user
    db_user = get_or_create_user(user.id)
    lang = db_user.get("language", "en")

    orders = get_user_orders(user.id, limit=10)

    if not orders:
        text = t("history_empty", lang)
    else:
        items_str = ""
        for ord in orders:
            ord_code = ord.get("order_code") or f"DGT{ord['id']:06d}"
            pr_str = f"${float(ord.get('price_usd', 0.0) or 0.0):.2f}"
            date_str = str(ord.get("created_at", ""))[:16]
            items_str += (
                f"• <tg-emoji emoji-id=\"5431721976769027887\">📜</tg-emoji> <b>Order #{ord_code}</b> ({date_str})\n"
                f"  <b>{ord['product_name']}</b> - {ord['plan_name']}\n"
                f"  Status: <code>{ord['status'].upper()}</code> | Price: <code>{pr_str}</code>\n\n"
            )
        text = t("history_list", lang, list=items_str.strip())

    buttons = [
        [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start", icon_custom_emoji_id=UI_ICONS["back"])]
    ]
    markup = InlineKeyboardMarkup(buttons)
    await safe_edit_or_reply(update, text=text, reply_markup=markup, is_callback=is_callback)


async def show_language_view(update: Update, context: ContextTypes.DEFAULT_TYPE, is_callback: bool = True):
    """Display language options matching Dragon Store"""
    user = update.effective_user
    db_user = get_or_create_user(user.id)
    lang = db_user.get("language", "en")

    text = t("language_text", lang)
    markup = get_language_keyboard(lang)
    await safe_edit_or_reply(update, text=text, reply_markup=markup, is_callback=is_callback)


async def show_support_view(update: Update, context: ContextTypes.DEFAULT_TYPE, is_callback: bool = True):
    """Display support view matching Dragon Store"""
    user = update.effective_user
    db_user = get_or_create_user(user.id)
    lang = db_user.get("language", "en")

    text = t("support_text", lang)
    markup = get_support_keyboard(lang)
    await safe_edit_or_reply(update, text=text, reply_markup=markup, is_callback=is_callback)


async def check_channel_membership(bot, user_id: int) -> bool:
    """Check if the user is a member of official channel with DB cache"""
    if is_admin(user_id):
        return True

    # Check local DB first for instant response without network latency
    db_u = get_user(user_id)
    if db_u and db_u.get("is_verified") == 1:
        return True

    channel_username = LOG_CHANNEL if LOG_CHANNEL.startswith("@") else f"@{LOG_CHANNEL}"
    try:
        member = await bot.get_chat_member(chat_id=channel_username, user_id=user_id)
        if member.status in ("creator", "administrator", "member"):
            set_user_verified(user_id)
            return True
        if member.status == "restricted" and getattr(member, "is_member", True):
            set_user_verified(user_id)
            return True
        return False
    except Exception as e:
        logger.warning(f"Error checking channel membership for user {user_id}: {e}")
        return False


async def show_verification_gate(update: Update, context: ContextTypes.DEFAULT_TYPE, is_callback: bool = False, alert_not_joined: bool = False):
    """Prompt user to join official channel before accessing the bot"""
    user = update.effective_user
    db_u = get_user(user.id)
    lang = db_u.get("language", "en") if db_u else "en"
    channel_name = LOG_CHANNEL if LOG_CHANNEL.startswith("@") else f"@{LOG_CHANNEL}"
    channel_url = f"https://t.me/{channel_name.replace('@', '')}"

    if alert_not_joined and update.callback_query:
        alert_text = (
            f"❌ Anda belum bergabung ke channel {channel_name}! Silakan klik '📢 Gabung Channel' terlebih dahulu."
            if lang == "id"
            else f"❌ You haven't joined {channel_name} channel yet! Please click '📢 Join Channel' first."
        )
        try:
            await update.callback_query.answer(alert_text, show_alert=True)
        except Exception:
            pass

    if lang == "id":
        text = (
            f'<tg-emoji emoji-id="5330237710655306682">📢</tg-emoji> <b>Wajib Bergabung ke Channel Resmi</b>\n'
            f'━━━━━━━━━━━━━━━━━━━\n'
            f'Halo <b>{user.first_name or "Pengguna"}</b>! Untuk melanjutkan dan mengakses katalog produk, isi saldo, atau fitur {BOT_NAME}, Anda wajib bergabung ke channel resmi kami terlebih dahulu:\n\n'
            f'<tg-emoji emoji-id="5330237710655306682">👉</tg-emoji> <a href="{channel_url}"><b>{channel_name}</b></a>\n\n'
            f'<tg-emoji emoji-id="6102856637343600044">✅</tg-emoji> <i>Setelah bergabung ke channel, tekan tombol <b>"Saya Sudah Bergabung"</b> di bawah untuk membuka semua fitur bot.</i>'
        )
        join_btn_text = f"📢 Gabung Channel {channel_name}"
        verify_btn_text = "✅ Saya Sudah Bergabung"
    else:
        text = (
            f'<tg-emoji emoji-id="5330237710655306682">📢</tg-emoji> <b>Channel Membership Required</b>\n'
            f'━━━━━━━━━━━━━━━━━━━\n'
            f'Hello <b>{user.first_name or "User"}</b>! To access products, top-up balance, and all {BOT_NAME} features, you must join our official channel first:\n\n'
            f'<tg-emoji emoji-id="5330237710655306682">👉</tg-emoji> <a href="{channel_url}"><b>{channel_name}</b></a>\n\n'
            f'<tg-emoji emoji-id="6102856637343600044">✅</tg-emoji> <i>After joining the channel, click <b>"I Have Joined"</b> below to unlock all bot features.</i>'
        )
        join_btn_text = f"📢 Join Channel {channel_name}"
        verify_btn_text = "✅ I Have Joined"

    buttons = [
        [InlineKeyboardButton(join_btn_text, url=channel_url, icon_custom_emoji_id=UI_ICONS["contact_support"])],
        [InlineKeyboardButton(verify_btn_text, callback_data="verify_channel", icon_custom_emoji_id=UI_ICONS["check"])]
    ]
    await safe_edit_or_reply(update, text=text, reply_markup=InlineKeyboardMarkup(buttons), is_callback=is_callback)


async def show_referral_view(update: Update, context: ContextTypes.DEFAULT_TYPE, is_callback: bool = True):
    """Display referral program dashboard and invite link with custom emojis"""
    user = update.effective_user
    db_u = get_user(user.id)
    lang = db_u.get("language", "en") if db_u else "en"

    stats = get_referral_stats(user.id)
    total_refs = stats.get("total_referrals", 0)
    earn_usd = float(stats.get("earnings_usd", 0.0))

    ref_link = f"https://t.me/{BOT_USERNAME}?start=ref_{user.id}"
    share_msg = f"🔥 Beli Akun AI Premium Instan (ChatGPT, Claude, Gemini, dll) hanya di {BOT_NAME}! Klik link: {ref_link}" if lang == "id" else f"🔥 Get Instant AI Premium Subscriptions (ChatGPT, Claude, Gemini & more) at {BOT_NAME}! Link: {ref_link}"
    share_url = f"https://t.me/share/url?url={urllib.parse.quote(ref_link)}&text={urllib.parse.quote(share_msg)}"

    if lang == "id":
        text = (
            f'<tg-emoji emoji-id="6017118468661317152">👥</tg-emoji> <b>Program Referral Digital AI</b>\n'
            f'━━━━━━━━━━━━━━━━━━━\n'
            f'Ajak teman dan dapatkan komisi saldo otomatis tanpa batas!\n\n'
            f'<tg-emoji emoji-id="5312361253610475399">🎁</tg-emoji> <b>Bonus Referral:</b> <b>$0.20 USD</b> setelah teman yang kamu undang melakukan order pertamanya.\n'
            f'<tg-emoji emoji-id="5287780412746120236">💰</tg-emoji> <b>Komisi Deposit:</b> <b>15%</b> dari setiap isi saldo/deposit teman kamu selamanya!\n\n'
            f'<tg-emoji emoji-id="5979047775470358891">🔗</tg-emoji> <b>Link Referral Kamu:</b>\n'
            f'<code>{ref_link}</code>\n\n'
            f'<tg-emoji emoji-id="5431721976769027887">📊</tg-emoji> <b>Statistik Kamu:</b>\n'
            f'• <tg-emoji emoji-id="6017118468661317152">👥</tg-emoji> Total Teman Diundang: <b>{total_refs} Pengguna</b>\n'
            f'• <tg-emoji emoji-id="5287780412746120236">💵</tg-emoji> Total Penghasilan: <b>${earn_usd:.2f} USDT</b>\n'
            f'━━━━━━━━━━━━━━━━━━━\n'
            f'<i>Bagikan link di atas ke grup, teman, atau sosial media kamu sekarang!</i>'
        )
        share_btn_text = "🔗 Bagikan Link Referral"
    else:
        text = (
            f'<tg-emoji emoji-id="6017118468661317152">👥</tg-emoji> <b>{BOT_NAME} Referral Program</b>\n'
            f'━━━━━━━━━━━━━━━━━━━\n'
            f'Invite friends and earn automatic balance rewards with no limits!\n\n'
            f'<tg-emoji emoji-id="5312361253610475399">🎁</tg-emoji> <b>Referral Bonus:</b> <b>$0.20 USD</b> after your invited friend completes their first order.\n'
            f'<tg-emoji emoji-id="5287780412746120236">💰</tg-emoji> <b>Deposit Commission:</b> <b>15%</b> lifetime commission on every deposit made by your referrals!\n\n'
            f'<tg-emoji emoji-id="5979047775470358891">🔗</tg-emoji> <b>Your Referral Link:</b>\n'
            f'<code>{ref_link}</code>\n\n'
            f'<tg-emoji emoji-id="5431721976769027887">📊</tg-emoji> <b>Your Statistics:</b>\n'
            f'• <tg-emoji emoji-id="6017118468661317152">👥</tg-emoji> Total Invited: <b>{total_refs} Users</b>\n'
            f'• <tg-emoji emoji-id="5287780412746120236">💵</tg-emoji> Total Earnings: <b>${earn_usd:.2f} USDT</b>\n'
            f'━━━━━━━━━━━━━━━━━━━\n'
            f'<i>Share your link above to groups, friends, or social media!</i>'
        )
        share_btn_text = "🔗 Share Referral Link"

    buttons = [
        [InlineKeyboardButton(share_btn_text, url=share_url, icon_custom_emoji_id=UI_ICONS["referral"])],
        [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start", icon_custom_emoji_id=UI_ICONS["back"])]
    ]
    await safe_edit_or_reply(update, text=text, reply_markup=InlineKeyboardMarkup(buttons), is_callback=is_callback)


async def show_channel_view(update: Update, context: ContextTypes.DEFAULT_TYPE, is_callback: bool = False):
    """Display official channel info"""
    user = update.effective_user
    db_u = get_user(user.id)
    lang = db_u.get("language", "en") if db_u else "en"
    channel_name = LOG_CHANNEL if LOG_CHANNEL.startswith("@") else f"@{LOG_CHANNEL}"
    channel_url = f"https://t.me/{channel_name.replace('@', '')}"

    if lang == "id":
        text = (
            f'<tg-emoji emoji-id="5330237710655306682">📢</tg-emoji> <b>Channel Resmi {BOT_NAME}:</b>\n\n'
            f'Ikuti channel resmi kami untuk melihat update stok produk, promo diskon, dan bukti transaksi real-time:\n\n'
            f'👉 <a href="{channel_url}"><b>{channel_name}</b></a>'
        )
        btn_open = "📢 Buka Channel"
    else:
        text = (
            f'<tg-emoji emoji-id="5330237710655306682">📢</tg-emoji> <b>{BOT_NAME} Official Channel:</b>\n\n'
            f'Join our official channel to get the latest product updates, discounts, and real-time transaction proofs:\n\n'
            f'👉 <a href="{channel_url}"><b>{channel_name}</b></a>'
        )
        btn_open = "📢 Open Channel"

    buttons = [
        [InlineKeyboardButton(btn_open, url=channel_url, icon_custom_emoji_id=UI_ICONS["channel"])],
        [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start", icon_custom_emoji_id=UI_ICONS["back"])]
    ]
    await safe_edit_or_reply(update, text=text, reply_markup=InlineKeyboardMarkup(buttons), is_callback=is_callback)



# ==============================================================================
# ROUTERS & DISPATCHERS
# ==============================================================================

async def start_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handler for /start"""
    user = update.effective_user
    referrer_id = 0
    if context.args and len(context.args) > 0:
        arg = context.args[0]
        if arg.startswith("ref_"):
            try:
                referrer_id = int(arg.replace("ref_", ""))
            except ValueError:
                pass

    get_or_create_user(user.id, user.username or "", user.first_name or "", referrer_id=referrer_id)
    await show_start_view(update, context, is_callback=False)


async def products_command_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handler for /products and /catalog commands"""
    await show_products_view(update, context, is_callback=False)


async def admin_command_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handler for /admin"""
    await admin_dashboard(update, context, is_callback=False)


async def callback_router(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Central router for all inline button callbacks"""
    query = update.callback_query
    data = query.data
    user = update.effective_user

    # Admin callbacks
    if data.startswith("admin:"):
        await handle_admin_callback(update, context)
        return

    # Channel verification callback
    if data.startswith("verify_sub:"):
        target_action = data.split(":", 1)[1] if ":" in data else "nav:products"
        is_joined = await check_user_joined_channel(context, user.id)
        db_u = get_user(user.id)
        lang = db_u.get("language", "en") if db_u else "en"

        if is_joined:
            alert_success = (
                "✅ Verifikasi berhasil! Selamat datang di katalog Digital AI."
                if lang == "id"
                else "✅ Verification successful! Welcome to Digital AI catalog."
            )
            await query.answer(alert_success, show_alert=False)

            # Route to next action
            if target_action == "nav:products" or target_action == "show_products_catalog":
                await show_products_view(update, context, is_callback=True)
            elif target_action.startswith("prod:"):
                pid = target_action.split(":", 1)[1]
                await show_product_plans_view(update, context, pid)
            elif target_action.startswith("plan:"):
                parts = target_action.split(":")
                pid, plan_id = parts[1], parts[2]
                qty = int(parts[3]) if len(parts) > 3 else 1
                await show_plan_detail_view(update, context, pid, plan_id, qty=qty)
            else:
                await show_products_view(update, context, is_callback=True)
        else:
            alert_fail = (
                "⚠️ Anda belum bergabung ke channel @digitalaishope!\nSilakan klik tombol '📢 Join Channel' terlebih dahulu."
                if lang == "id"
                else "⚠️ You haven't joined @digitalaishope yet!\nPlease click '📢 Join Channel' button first."
            )
            await query.answer(alert_fail, show_alert=True)
        return

    await query.answer()

    if data == "noop":
        return

    # Navigation
    if data == "nav:start" or data == "back_to_main_menu":
        # Clear any pending input state
        context.user_data.pop("awaiting_topup_net", None)
        context.user_data.pop("awaiting_deposit_txid", None)
        await show_start_view(update, context, is_callback=True)
    elif data == "nav:products" or data == "show_products_catalog":
        await show_products_view(update, context, is_callback=True)
    elif data == "nav:wallet":
        await show_wallet_view(update, context, is_callback=True)
    elif data == "nav:orders":
        await show_orders_view(update, context, is_callback=True)
    elif data == "nav:profile":
        await show_profile_view(update, context, is_callback=True)
    elif data == "nav:language":
        await show_language_view(update, context, is_callback=True)
    elif data == "nav:support":
        await show_support_view(update, context, is_callback=True)
    elif data == "nav:referral":
        await show_referral_view(update, context, is_callback=True)
    elif data == "nav:channel":
        await show_channel_view(update, context, is_callback=True)

    # Product detail (Plans list)
    elif data.startswith("prod:"):
        pid = data.split(":", 1)[1]
        await show_product_plans_view(update, context, pid)

    # Plan detail (Quantity & Checkout)
    elif data.startswith("plan:"):
        parts = data.split(":")
        pid, plan_id = parts[1], parts[2]
        qty = int(parts[3]) if len(parts) > 3 else 1
        await show_plan_detail_view(update, context, pid, plan_id, qty=qty)

    # Quantity changes
    elif data.startswith("qty:inc:"):
        parts = data.split(":")
        pid, plan_id, qty = parts[2], parts[3], int(parts[4])
        await show_plan_detail_view(update, context, pid, plan_id, qty=qty + 1)

    elif data.startswith("qty:dec:"):
        parts = data.split(":")
        pid, plan_id, qty = parts[2], parts[3], int(parts[4])
        new_qty = max(1, qty - 1)
        await show_plan_detail_view(update, context, pid, plan_id, qty=new_qty)

    elif data.startswith("qty:add:"):
        parts = data.split(":")
        pid, plan_id, qty, add_val = parts[2], parts[3], int(parts[4]), int(parts[5])
        await show_plan_detail_view(update, context, pid, plan_id, qty=qty + add_val)

    # Buy confirmation
    elif data.startswith("buy_confirm:"):
        parts = data.split(":")
        pid, plan_id, qty = parts[1], parts[2], int(parts[3])
        await process_buy_confirm(update, context, pid, plan_id, qty=qty)

    # Top Up Initiation (Ask for amount)
    elif data.startswith("topup_init:"):
        net = data.split(":")[1]
        context.user_data["awaiting_topup_net"] = net
        db_u = get_user(user.id)
        lang = db_u.get("language", "en") if db_u else "en"

        if net == "BINANCE":
            prompt_text = (
                '<tg-emoji emoji-id="5843689746538173057">🪙</tg-emoji> <b>Deposit Binance Pay (ID)</b>\n\n'
                'Masukkan jumlah nominal USDT yang ingin ditambahkan (Min: 5 USDT):\n'
                '<i>Sistem akan otomatis menambahkan kode unik desimal pada nominal transfer Anda.</i>'
                if lang == "id"
                else '<tg-emoji emoji-id="5843689746538173057">🪙</tg-emoji> <b>Deposit Binance Pay (ID)</b>\n\n'
                'Enter amount of USDT you want to deposit (Min: 5 USDT):\n'
                '<i>A unique decimal code will be automatically added to your transfer amount.</i>'
            )
        else:
            prompt_text = (
                '<tg-emoji emoji-id="5843689746538173057">🪙</tg-emoji> <b>Masukkan jumlah USDT yang ingin ditambahkan (Min: 5 USDT):</b>'
                if lang == "id"
                else '<tg-emoji emoji-id="5843689746538173057">🪙</tg-emoji> <b>Enter the amount of USDT you want to deposit (Min: 5 USDT):</b>'
            )
        buttons = [
            [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start", icon_custom_emoji_id=UI_ICONS["back"])]
        ]
        await safe_edit_or_reply(update, text=prompt_text, reply_markup=InlineKeyboardMarkup(buttons), is_callback=True)

    # User clicks "Saya Sudah Bayar" / "Cek Status Otomatis"
    elif data.startswith("check_payment:"):
        order_code = data.split(":")[1]
        db_u = get_user(user.id)
        lang = db_u.get("language", "en") if db_u else "en"
        dep = get_deposit_by_code(order_code)
        amt = dep["amount_usd"] if dep else 5.0
        idr_amt = dep["amount_idr"] if dep else int(amt * 17904)

        # 1. Jika metode QRIS, cek otomatis ke gateway BorderPay!
        if dep and dep.get("network") == "QRIS":
            status_data = await check_borderpay_status(order_code)
            if status_data and status_data.get("status") == "paid":
                # Auto-approve deposit!
                auto_approve_deposit(order_code, txid=f"BORDERPAY_{order_code}", verified_amount=amt)
                
                # Broadcast to live orders channel / group
                rand_prefix = random.randint(1000, 9999)
                id_masked = f"{rand_prefix}***"
                await send_channel_notification(
                    context,
                    f'<tg-emoji emoji-id="5287780412746120236">💎</tg-emoji> <b>WALLET TOP UP SUCCESSFUL</b>\n'
                    f'━━━━━━━━━━━━━━━━━━━\n'
                    f'<tg-emoji emoji-id="5330237710655306682">👾</tg-emoji> <b>Order:</b> <code>#{order_code}</code>\n'
                    f'<tg-emoji emoji-id="6017118468661317152">👤</tg-emoji> <b>User:</b> <code>{id_masked}</code>\n'
                    f'<tg-emoji emoji-id="5287780412746120236">💰</tg-emoji> <b>Amount:</b> <b>+{amt:.2f} USDT</b> (Rp {idr_amt:,.0f})\n'
                    f'<tg-emoji emoji-id="5287292843763713628">🌐</tg-emoji> <b>Network:</b> <b>QRIS Indonesia</b>\n'
                    f'<tg-emoji emoji-id="5431721976769027887">⏱️</tg-emoji> <b>Status:</b> <b>Instant Approved</b> <tg-emoji emoji-id="6102856637343600044">✅</tg-emoji>\n'
                    f'━━━━━━━━━━━━━━━━━━━\n'
                    f'<tg-emoji emoji-id="5877651964208091297">🤖</tg-emoji> <i>Top up wallet & buy AI subscriptions at @{BOT_USERNAME}</i>'
                )

                success_text = (
                    f'<tg-emoji emoji-id="5330237710655306682">🎉</tg-emoji> <b>PEMBAYARAN QRIS BERHASIL DITERIMA!</b>\n\n'
                    f'<tg-emoji emoji-id="6102856637343600044">✅</tg-emoji> Sistem pembayaran telah memverifikasi transaksi Anda.\n'
                    f'<tg-emoji emoji-id="5287780412746120236">💰</tg-emoji> Saldo <b>+{amt:.2f} USDT</b> (Rp {idr_amt:,.0f}) telah otomatis ditambahkan ke wallet Anda!\n\n'
                    f'Terima kasih telah melakukan deposit di {BOT_NAME}.'
                    if lang == "id"
                    else
                    f'<tg-emoji emoji-id="5330237710655306682">🎉</tg-emoji> <b>QRIS PAYMENT VERIFIED!</b>\n\n'
                    f'<tg-emoji emoji-id="6102856637343600044">✅</tg-emoji> Payment gateway has confirmed your payment.\n'
                    f'<tg-emoji emoji-id="5287780412746120236">💰</tg-emoji> Balance <b>+{amt:.2f} USDT</b> (Rp {idr_amt:,.0f}) has been credited to your wallet!\n\n'
                    f'Thank you for depositing at {BOT_NAME}.'
                )
                buttons = [
                    [InlineKeyboardButton("👛 " + ("Buka Wallet" if lang == "id" else "Open Wallet"), callback_data="nav:wallet", icon_custom_emoji_id=UI_ICONS["wallet"])],
                    [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start", icon_custom_emoji_id=UI_ICONS["back"])]
                ]
                try:
                    await query.edit_message_caption(caption=success_text, parse_mode=ParseMode.HTML, reply_markup=InlineKeyboardMarkup(buttons))
                except Exception:
                    await query.edit_message_text(text=success_text, parse_mode=ParseMode.HTML, reply_markup=InlineKeyboardMarkup(buttons))
                return
            else:
                alert_msg = (
                    "⏳ Pembayaran QRIS belum terdeteksi. Silakan scan QRIS & selesaikan pembayaran terlebih dahulu."
                    if lang == "id"
                    else "⏳ QRIS payment not yet detected. Please scan and complete payment."
                )
                await query.answer(alert_msg, show_alert=True)
                return

        # 2. Untuk Binance / USDT, minta TxID
        context.user_data["awaiting_deposit_txid"] = order_code
        if dep and dep.get("network") == "BINANCE":
            prompt_txid = (
                f'<tg-emoji emoji-id="5431721976769027887">🗂️</tg-emoji> <b>Konfirmasi Pembayaran Binance Pay</b>\n\n'
                f'💰 <b>Nominal Transfer:</b> <code>{amt:.2f} USDT</code> (Sesuai Kode Unik)\n'
                f'💳 <b>Tujuan Binance ID:</b> <code>{BINANCE_ID}</code>\n\n'
                f'Silakan balas pesan ini dengan <b>Binance Order ID / Pay ID</b> bukti pembayaran Anda.\n\n'
                f'<tg-emoji emoji-id="6181322172263308706">⚠️</tg-emoji> <i>PENTING: Pastikan Anda mentransfer <b>TEPAT {amt:.2f} USDT</b> sesuai kode unik.</i>'
                if lang == "id"
                else
                f'<tg-emoji emoji-id="5431721976769027887">🗂️</tg-emoji> <b>Binance Pay Confirmation</b>\n\n'
                f'💰 <b>Transfer Amount:</b> <code>{amt:.2f} USDT</code> (With Unique Code)\n'
                f'💳 <b>Destination Binance ID:</b> <code>{BINANCE_ID}</code>\n\n'
                f'Please reply with your <b>Binance Order ID / Pay ID</b>.\n\n'
                f'<tg-emoji emoji-id="6181322172263308706">⚠️</tg-emoji> <i>IMPORTANT: Ensure you transferred <b>EXACTLY {amt:.2f} USDT</b> matching the unique code.</i>'
            )
        else:
            prompt_txid = (
                f'<tg-emoji emoji-id="5431721976769027887">🗂️</tg-emoji> <b>Masukkan Hash Transaksi (TxID) / Pay ID</b>\n\n'
                f'Silakan balas dengan hash transaksi (contoh: <code>0xce49919c132b30b4158f811d3469fcddad614b923503c0113c428d786d54e233</code>) untuk verifikasi pembayaran.\n\n'
                f'<tg-emoji emoji-id="6181322172263308706">⚠️</tg-emoji> <i>Pastikan Anda mengirim tepat {amt:.2f} USDT.</i>'
                if lang == "id"
                else
                f'<tg-emoji emoji-id="5431721976769027887">🗂️</tg-emoji> <b>Enter Transaction Hash (TxID) / Pay ID</b>\n\n'
                f'Please reply with your transaction hash (example: <code>0xce49919c132b30b4158f811d3469fcddad614b923503c0113c428d786d54e233</code>) to verify payment.\n\n'
                f'<tg-emoji emoji-id="6181322172263308706">⚠️</tg-emoji> <i>Please ensure you sent exactly {amt:.2f} USDT.</i>'
            )
        buttons = [
            [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start", icon_custom_emoji_id=UI_ICONS["back"])]
        ]
        try:
            await query.edit_message_caption(caption=prompt_txid, parse_mode=ParseMode.HTML, reply_markup=InlineKeyboardMarkup(buttons))
        except Exception:
            await query.edit_message_text(text=prompt_txid, parse_mode=ParseMode.HTML, reply_markup=InlineKeyboardMarkup(buttons))


    # Language toggle
    elif data.startswith("setlang:"):
        new_lang = data.split(":")[1]
        set_user_language(user.id, new_lang)
        await query.answer(t("lang_updated", new_lang), show_alert=True)
        await show_start_view(update, context, is_callback=True)

    # Manual review request by user
    elif data.startswith("req_manual_review:"):
        order_code = data.split(":")[1]
        dep = get_deposit_by_code(order_code)
        db_u = get_user(user.id)
        lang = db_u.get("language", "en") if db_u else "en"
        amt_usd = dep["amount_usd"] if dep else 5.0
        net_str = dep["network"] if dep else "USDT"
        txid = dep.get("txid", "N/A") if dep else "N/A"
        dep_id = dep["id"] if dep else 0

        # Alert admin(s) with 1-click Approve / Reject buttons
        user_masked = str(user.id)[:4] + "****"
        for aid in ADMIN_IDS:
            try:
                admin_markup = InlineKeyboardMarkup([
                    [
                        InlineKeyboardButton(f"✅ Approve (+{amt_usd:.2f} USDT)", callback_data=f"admin:appr_dep:{dep_id}"),
                        InlineKeyboardButton("❌ Reject", callback_data=f"admin:rej_dep:{dep_id}")
                    ]
                ])
                await context.bot.send_message(
                    chat_id=aid,
                    text=(
                        f"🔔 <b>Deposit Manual Review Request!</b>\n\n"
                        f"📝 <b>Order:</b> <code>#{order_code}</code>\n"
                        f"👤 <b>User:</b> <code>{user_masked}</code>\n"
                        f"🌐 <b>Network:</b> <b>{net_str}</b>\n"
                        f"💰 <b>Amount:</b> <b>{amt_usd:.2f} USDT</b>\n"
                        f"💳 <b>TxID / Pay ID:</b> <code>{txid}</code>"
                    ),
                    parse_mode=ParseMode.HTML,
                    reply_markup=admin_markup
                )
            except Exception as e:
                logger.debug(f"Failed to alert admin {aid}: {e}")

        sent_msg = (
            f'<tg-emoji emoji-id="5796209712009581332">📨</tg-emoji> <b>Permintaan Verifikasi Terkirim ke Admin!</b>\n\n'
            f'<tg-emoji emoji-id="5330237710655306682">👾</tg-emoji> <b>Pesanan:</b> <code>#{order_code}</code>\n'
            f'<tg-emoji emoji-id="5287780412746120236">💰</tg-emoji> <b>Jumlah:</b> <b>{amt_usd:.2f} USDT</b>\n'
            f'<tg-emoji emoji-id="5287292843763713628">🌐</tg-emoji> <b>Jaringan:</b> <b>{net_str}</b>\n'
            f'<tg-emoji emoji-id="6269053837131129030">💳</tg-emoji> <b>TxID:</b> <code>{txid}</code>\n\n'
            f'<tg-emoji emoji-id="5431721976769027887">⏳</tg-emoji> <i>Detail pembayaran Anda telah diteruskan ke admin untuk review instan. Saldo akan otomatis masuk setelah disetujui.</i>'
            if lang == "id"
            else
            f'<tg-emoji emoji-id="5796209712009581332">📨</tg-emoji> <b>Admin Verification Request Sent!</b>\n\n'
            f'<tg-emoji emoji-id="5330237710655306682">👾</tg-emoji> <b>Order:</b> <code>#{order_code}</code>\n'
            f'<tg-emoji emoji-id="5287780412746120236">💰</tg-emoji> <b>Amount:</b> <b>{amt_usd:.2f} USDT</b>\n'
            f'<tg-emoji emoji-id="5287292843763713628">🌐</tg-emoji> <b>Network:</b> <b>{net_str}</b>\n'
            f'<tg-emoji emoji-id="6269053837131129030">💳</tg-emoji> <b>TxID:</b> <code>{txid}</code>\n\n'
            f'<tg-emoji emoji-id="5431721976769027887">⏳</tg-emoji> <i>Your payment details have been submitted to admin for instant review. Your balance will be credited upon approval.</i>'
        )
        buttons = [
            [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start", icon_custom_emoji_id=UI_ICONS["back"])]
        ]
        await query.edit_message_text(text=sent_msg, parse_mode=ParseMode.HTML, reply_markup=InlineKeyboardMarkup(buttons))

    # Retry entering TxID
    elif data.startswith("retry_txid:"):
        order_code = data.split(":")[1]
        context.user_data["awaiting_deposit_txid"] = order_code
        db_u = get_user(user.id)
        lang = db_u.get("language", "en") if db_u else "en"
        dep = get_deposit_by_code(order_code)
        amt = dep["amount_usd"] if dep else 5.0

        prompt_txid = (
            f'<tg-emoji emoji-id="5206279843481674100">🔄</tg-emoji> <b>Kirim Ulang TxID / Pay ID</b>\n\n'
            f'Silakan masukkan kembali TxID / Hash Transaksi untuk pesanan <code>#{order_code}</code>:\n\n'
            f'<tg-emoji emoji-id="6181322172263308706">⚠️</tg-emoji> <i>Pastikan Anda mengirim tepat {amt:.2f} USDT.</i>'
            if lang == "id"
            else
            f'<tg-emoji emoji-id="5206279843481674100">🔄</tg-emoji> <b>Resubmit TxID / Pay ID</b>\n\n'
            f'Please enter your transaction hash or Pay ID again for order <code>#{order_code}</code>:\n\n'
            f'<tg-emoji emoji-id="6181322172263308706">⚠️</tg-emoji> <i>Please ensure you sent exactly {amt:.2f} USDT.</i>'
        )
        buttons = [
            [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start", icon_custom_emoji_id=UI_ICONS["back"])]
        ]
        await query.edit_message_text(text=prompt_txid, parse_mode=ParseMode.HTML, reply_markup=InlineKeyboardMarkup(buttons))


async def text_message_router(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Route text messages from persistent ReplyKeyboardMarkup or deposit flows"""
    user = update.effective_user
    text = (update.message.text or "").strip()

    # 1. Check if admin input in progress
    handled = await handle_admin_text(update, context)
    if handled:
        return

    db_u = get_user(user.id)
    lang = db_u.get("language", "en") if db_u else "en"

    # 2. Check persistent keyboard buttons FIRST
    t_lower = text.lower()
    
    # Products
    if any(k in t_lower for k in ["product", "produk", "catalog", "katalog", "produits", "المنتجات", "产品", "sản phẩm", "товары", "उत्पाद", "productos", "สินค้า"]):
        context.user_data.pop("awaiting_topup_net", None)
        context.user_data.pop("awaiting_deposit_txid", None)
        await show_products_view(update, context, is_callback=False)
        return
    # Wallet / Top up
    elif any(k in t_lower for k in ["wallet", "dompet", "saldo", "top up", "topup", "portefeuille", "محفظتي", "钱包", "ví", "кошелёк", "वॉलेट", "billetera", "กระเป๋า"]):
        context.user_data.pop("awaiting_topup_net", None)
        context.user_data.pop("awaiting_deposit_txid", None)
        await show_wallet_view(update, context, is_callback=False)
        return
    # Profile
    elif any(k in t_lower for k in ["profile", "profil", "akun", "account", "profil saya", "profil", "ملفي", "个人资料", "hồ sơ", "профиль", "प्रोफ़ाइल", "perfil", "โปรไฟล์"]):
        context.user_data.pop("awaiting_topup_net", None)
        context.user_data.pop("awaiting_deposit_txid", None)
        await show_profile_view(update, context, is_callback=False)
        return
    # History
    elif any(k in t_lower for k in ["history", "riwayat", "order", "pesanan", "transaksi", "historique", "سجل", "历史", "lịch sử", "история", "इतिहास", "historial", "ประวัติ"]):
        context.user_data.pop("awaiting_topup_net", None)
        context.user_data.pop("awaiting_deposit_txid", None)
        await show_orders_view(update, context, is_callback=False)
        return
    # Language
    elif any(k in t_lower for k in ["language", "bahasa", "lang", "langue", "اللغة", "语言", "ngôn ngữ", "язык", "भाषा", "idioma", "ภาษา"]):
        context.user_data.pop("awaiting_topup_net", None)
        context.user_data.pop("awaiting_deposit_txid", None)
        await show_language_view(update, context, is_callback=False)
        return
    # Referral
    elif any(k in t_lower for k in ["referral", "refferal", "rujukan", "undang", "invite", "parrainage", "الإحالة", "推荐", "giới thiệu", "реферал", "रेफ़रल", "referidos", "แนะนำ"]):
        context.user_data.pop("awaiting_topup_net", None)
        context.user_data.pop("awaiting_deposit_txid", None)
        await show_referral_view(update, context, is_callback=False)
        return
    # Channel Orders
    elif any(k in t_lower for k in ["channel", "chanel", "zelvaorders", "live order"]):
        context.user_data.pop("awaiting_topup_net", None)
        context.user_data.pop("awaiting_deposit_txid", None)
        await show_channel_view(update, context, is_callback=False)
        return
    # Support
    elif any(k in t_lower for k in ["support", "layanan", "help", "bantuan", "cs", "admin", "kontak", "الدعم", "客服", "hỗ trợ", "поддержка", "सहायता", "soporte", "สนับสนุน"]):
        context.user_data.pop("awaiting_topup_net", None)
        context.user_data.pop("awaiting_deposit_txid", None)
        await show_support_view(update, context, is_callback=False)
        return

    # 3. Check if user is inputting deposit amount
    if "awaiting_topup_net" in context.user_data:
        net = context.user_data.pop("awaiting_topup_net")
        try:
            clean_text = text.replace("$", "").replace(",", ".").strip()
            amount_val = float(clean_text)
            if amount_val < 5.0:
                context.user_data["awaiting_topup_net"] = net
                err_msg = (
                    '<tg-emoji emoji-id="6181322172263308706">⚠️</tg-emoji> <b>Minimal deposit adalah 5 USDT.</b>\nSilakan masukkan nominal kembali:'
                    if lang == "id"
                    else '<tg-emoji emoji-id="6181322172263308706">⚠️</tg-emoji> <b>Minimum deposit is 5 USDT.</b>\nPlease enter amount again:'
                )
                await update.message.reply_text(
                    text=err_msg,
                    parse_mode=ParseMode.HTML,
                    reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start", icon_custom_emoji_id=UI_ICONS["back"])]])
                )
                return

            if net == "BINANCE":
                # Tambahkan kode unik (2 digit desimal random 0.01 - 0.99)
                unique_code = random.randint(1, 99)
                amount_val = round(float(int(amount_val)) + (unique_code / 100.0), 2)

            # Calculate IDR equivalent using live real-time rate
            live_rate = await get_usd_to_idr_rate()
            idr_amt = int(round(amount_val * live_rate))

            # Create deposit request
            order_code = create_deposit_request(user.id, net, amount_val, idr_amt)

            # Render invoice & QR Code photo
            photo_data = None
            pay_url = None

            if net == "BEP20":
                header_title = "TOP UP USDT (BEP20 / BSC)"
                net_name = "BNB Smart Chain (BEP20)"
                addr_label = "Alamat Deposit" if lang == "id" else "Deposit Address"
                addr_val = BEP20_ADDRESS
                instructions = (
                    f"1️⃣ Salin alamat deposit BEP20 di atas\n"
                    f"2️⃣ Kirim {amount_val:.2f} USDT melalui jaringan BEP20\n"
                    f"3️⃣ Tekan '✅ Saya Sudah Bayar' & kirimkan TxID"
                    if lang == "id"
                    else
                    f"1️⃣ Copy the BEP20 deposit address above\n"
                    f"2️⃣ Send {amount_val:.2f} USDT via BEP20 network\n"
                    f"3️⃣ Tap '✅ I Have Paid' & submit your TxID"
                )
                warn_note = "⚠️ : <i>Hanya kirimkan USDT via jaringan BEP20.</i>" if lang == "id" else "⚠️ : <i>Only send USDT via BEP20 network.</i>"
                try:
                    photo_data = generate_qr_image_bytes(addr_val)
                except Exception as e:
                    logger.warning(f"Failed to generate BEP20 QR: {e}")

            elif net == "TRC20":
                header_title = "TOP UP USDT (TRC20 / TRON)"
                net_name = "TRON (TRC20)"
                addr_label = "Alamat Deposit" if lang == "id" else "Deposit Address"
                addr_val = TRC20_ADDRESS
                instructions = (
                    f"1️⃣ Salin alamat deposit TRC20 di atas\n"
                    f"2️⃣ Kirim {amount_val:.2f} USDT melalui jaringan TRC20\n"
                    f"3️⃣ Tekan '✅ Saya Sudah Bayar' & kirimkan TxID"
                    if lang == "id"
                    else
                    f"1️⃣ Copy the TRC20 deposit address above\n"
                    f"2️⃣ Send {amount_val:.2f} USDT via TRC20 network\n"
                    f"3️⃣ Tap '✅ I Have Paid' & submit your TxID"
                )
                warn_note = "⚠️ : <i>Hanya kirimkan USDT via jaringan TRC20.</i>" if lang == "id" else "⚠️ : <i>Only send USDT via TRC20 network.</i>"
                try:
                    photo_data = generate_qr_image_bytes(addr_val)
                except Exception as e:
                    logger.warning(f"Failed to generate TRC20 QR: {e}")

            elif net == "SOLANA":
                header_title = "TOP UP SOLANA (SOL / SPL)"
                net_name = "Solana (SPL)"
                addr_label = "Alamat Deposit Solana" if lang == "id" else "Solana Deposit Address"
                addr_val = SOLANA_ADDRESS
                instructions = (
                    f"1️⃣ Salin alamat deposit Solana di atas\n"
                    f"2️⃣ Kirim {amount_val:.2f} USD/SOL melalui jaringan Solana (SPL)\n"
                    f"3️⃣ Tekan '✅ Saya Sudah Bayar' & kirimkan Signature/TxID"
                    if lang == "id"
                    else
                    f"1️⃣ Copy the Solana deposit address above\n"
                    f"2️⃣ Send {amount_val:.2f} USD/SOL via Solana network\n"
                    f"3️⃣ Tap '✅ I Have Paid' & submit your TxID"
                )
                warn_note = "⚠️ : <i>Hanya kirimkan via jaringan Solana (SPL).</i>" if lang == "id" else "⚠️ : <i>Only send via Solana (SPL) network.</i>"
                try:
                    photo_data = generate_qr_image_bytes(addr_val)
                except Exception as e:
                    logger.warning(f"Failed to generate Solana QR: {e}")

            elif net == "TON":
                header_title = "TOP UP TON / GRAM"
                net_name = "The Open Network (TON)"
                addr_label = "Alamat Deposit TON" if lang == "id" else "TON Deposit Address"
                addr_val = TON_ADDRESS
                instructions = (
                    f"1️⃣ Salin alamat deposit TON di atas\n"
                    f"2️⃣ Kirim {amount_val:.2f} USD/TON melalui The Open Network\n"
                    f"3️⃣ Tekan '✅ Saya Sudah Bayar' & kirimkan TxID"
                    if lang == "id"
                    else
                    f"1️⃣ Copy the TON deposit address above\n"
                    f"2️⃣ Send {amount_val:.2f} USD/TON via TON network\n"
                    f"3️⃣ Tap '✅ I Have Paid' & submit your TxID"
                )
                warn_note = "⚠️ : <i>Hanya kirimkan via The Open Network (TON).</i>" if lang == "id" else "⚠️ : <i>Only send via TON network.</i>"
                try:
                    photo_data = generate_qr_image_bytes(addr_val)
                except Exception as e:
                    logger.warning(f"Failed to generate TON QR: {e}")

            elif net == "BINANCE":
                header_title = "TOP UP BINANCE PAY"
                net_name = "Binance Pay (ID)"
                addr_label = "Binance Pay ID"
                addr_val = BINANCE_ID
                instructions = (
                    f"1️⃣ Buka aplikasi Binance -> <b>Pay</b> -> <b>Send</b>\n"
                    f"2️⃣ Masukkan Binance ID: <code>{BINANCE_ID}</code>\n"
                    f"3️⃣ Kirim nominal <b>TEPAT <code>{amount_val:.2f} USDT</code></b> (wajib sertakan kode unik desimal)\n"
                    f"4️⃣ Tekan '✅ Saya Sudah Bayar' & masukkan Pay ID / Order ID transaksi"
                    if lang == "id"
                    else
                    f"1️⃣ Open Binance App -> <b>Pay</b> -> <b>Send</b>\n"
                    f"2️⃣ Enter Binance ID: <code>{BINANCE_ID}</code>\n"
                    f"3️⃣ Send <b>EXACTLY <code>{amount_val:.2f} USDT</code></b> (must include unique decimal code)\n"
                    f"4️⃣ Tap '✅ I Have Paid' & submit Pay ID / Order ID"
                )
                warn_note = "⚠️ : <i>Pastikan mentransfer TEPAT sesuai nominal kode unik.</i>" if lang == "id" else "⚠️ : <i>Ensure you transfer EXACTLY with the unique code.</i>"
                binance_path = Path(__file__).resolve().parent / "assets" / "images" / "binance.png"
                if not binance_path.exists():
                    binance_path = Path(__file__).resolve().parent.parent / "public" / "binance.png"
                if binance_path.exists():
                    try:
                        with open(binance_path, "rb") as bf:
                            photo_data = bf.read()
                    except Exception as e:
                        logger.warning(f"Failed to read binance image: {e}")
                else:
                    try:
                        photo_data = generate_qr_image_bytes(addr_val)
                    except Exception as e:
                        logger.warning(f"Failed to generate binance QR: {e}")

            else: # QRIS
                header_title = "TOP UP QRIS INSTANT (IDR)"
                net_name = "QRIS Indonesia (All E-Wallet / Bank)"
                addr_label = "Nominal Pembayaran" if lang == "id" else "Payment Amount"
                addr_val = f"Rp {idr_amt:,.0f}"
                instructions = (
                    f"1️⃣ Scan foto QRIS di atas (BCA/Mandiri/GoPay/OVO/Dana dll)\n"
                    f"2️⃣ Nominal otomatis terisi, langsung konfirmasi pembayaran\n"
                    f"3️⃣ Tekan '🔄 Cek Status Otomatis' untuk verifikasi instan!"
                    if lang == "id"
                    else
                    f"1️⃣ Scan the QRIS code shown above\n"
                    f"2️⃣ Amount is auto-filled, confirm payment\n"
                    f"3️⃣ Tap '🔄 Auto Check Status' for instant approval!"
                )
                warn_note = "⚠️ : <i>Sistem otomatis gateway payment online 24 jam.</i>" if lang == "id" else "⚠️ : <i>Automated payment gateway ready 24/7.</i>"

                # Generate live BorderPay dynamic QRIS!
                bp_res = await create_borderpay_payment(order_code, idr_amt)
                if bp_res and bp_res.get("qr_string"):
                    qr_str = bp_res["qr_string"]
                    try:
                        photo_data = generate_qr_image_bytes(qr_str)
                    except Exception as e:
                        logger.warning(f"Failed to generate BorderPay QR image: {e}")

                if not photo_data:
                    qris_path = Path(__file__).resolve().parent / "assets" / "images" / "qris.png"
                    if not qris_path.exists():
                        qris_path = Path(__file__).resolve().parent.parent / "public" / "qris.png"
                    if qris_path.exists():
                        try:
                            with open(qris_path, "rb") as qf:
                                photo_data = qf.read()
                        except Exception as e:
                            logger.warning(f"Failed to read static QRIS image: {e}")

            if net == "QRIS":
                invoice_text = (
                    f"-----------------------------\n"
                    f'<tg-emoji emoji-id="5287780412746120236">💎</tg-emoji> <b>{header_title}</b>\n'
                    f"-----------------------------\n\n"
                    f'<tg-emoji emoji-id="5330237710655306682">👾</tg-emoji> <b>Pesanan:</b> <code>#{order_code}</code>\n'
                    f'<tg-emoji emoji-id="5287292843763713628">🌐</tg-emoji> <b>Jaringan:</b> <b>{net_name}</b>\n\n'
                    f'<tg-emoji emoji-id="6269053837131129030">💳</tg-emoji> <b>{addr_label}:</b>\n<code>{addr_val}</code>\n\n'
                    f'<tg-emoji emoji-id="5796209712009581332">📋</tg-emoji> <b>Instruksi:</b>\n{instructions}'
                    if lang == "id"
                    else
                    f"-----------------------------\n"
                    f'<tg-emoji emoji-id="5287780412746120236">💎</tg-emoji> <b>{header_title}</b>\n'
                    f"-----------------------------\n\n"
                    f'<tg-emoji emoji-id="5330237710655306682">👾</tg-emoji> <b>Order:</b> <code>#{order_code}</code>\n'
                    f'<tg-emoji emoji-id="5287292843763713628">🌐</tg-emoji> <b>Network:</b> <b>{net_name}</b>\n\n'
                    f'<tg-emoji emoji-id="6269053837131129030">💳</tg-emoji> <b>{addr_label}:</b>\n<code>{addr_val}</code>\n\n'
                    f'<tg-emoji emoji-id="5796209712009581332">📋</tg-emoji> <b>Instructions:</b>\n{instructions}'
                )

                buttons = [
                    [InlineKeyboardButton("🔄 " + ("Cek Status Otomatis" if lang == "id" else "Auto Check Status"), callback_data=f"check_payment:{order_code}")],
                    [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start", icon_custom_emoji_id=UI_ICONS["back"])]
                ]
            elif net == "BINANCE":
                invoice_text = (
                    f"-----------------------------\n"
                    f'<tg-emoji emoji-id="5287780412746120236">💎</tg-emoji> <b>{header_title}</b>\n'
                    f"-----------------------------\n\n"
                    f'<tg-emoji emoji-id="5330237710655306682">👾</tg-emoji> <b>Pesanan:</b> <code>#{order_code}</code>\n'
                    f'<tg-emoji emoji-id="5287292843763713628">🌐</tg-emoji> <b>Metode:</b> <b>{net_name}</b>\n\n'
                    f'<tg-emoji emoji-id="6269053837131129030">💳</tg-emoji> <b>{addr_label}:</b>\n<code>{addr_val}</code>\n\n'
                    f'<tg-emoji emoji-id="5287780412746120236">💰</tg-emoji> <b>Jumlah Transfer (Kode Unik):</b>\n'
                    f"<code>{amount_val:.2f} USDT</code>\n\n"
                    f'<tg-emoji emoji-id="6181322172263308706">⚠️</tg-emoji> <b>PERHATIAN (KODE UNIK):</b>\n'
                    f'<i>Harap transfer <b>TEPAT <code>{amount_val:.2f} USDT</code></b> sesuai kode unik di atas agar pembayaran Anda cepat diverifikasi & tidak tertukar dengan pembeli lain!</i>\n\n'
                    f'<tg-emoji emoji-id="5796209712009581332">📋</tg-emoji> <b>Instruksi Pembayaran:</b>\n{instructions}'
                    if lang == "id"
                    else
                    f"-----------------------------\n"
                    f'<tg-emoji emoji-id="5287780412746120236">💎</tg-emoji> <b>{header_title}</b>\n'
                    f"-----------------------------\n\n"
                    f'<tg-emoji emoji-id="5330237710655306682">👾</tg-emoji> <b>Order:</b> <code>#{order_code}</code>\n'
                    f'<tg-emoji emoji-id="5287292843763713628">🌐</tg-emoji> <b>Method:</b> <b>{net_name}</b>\n\n'
                    f'<tg-emoji emoji-id="6269053837131129030">💳</tg-emoji> <b>{addr_label}:</b>\n<code>{addr_val}</code>\n\n'
                    f'<tg-emoji emoji-id="5287780412746120236">💰</tg-emoji> <b>Transfer Amount (Unique Code):</b>\n'
                    f"<code>{amount_val:.2f} USDT</code>\n\n"
                    f'<tg-emoji emoji-id="6181322172263308706">⚠️</tg-emoji> <b>IMPORTANT (UNIQUE CODE):</b>\n'
                    f'<i>Please transfer <b>EXACTLY <code>{amount_val:.2f} USDT</code></b> as shown above (including unique decimal) for fast verification!</i>\n\n'
                    f'<tg-emoji emoji-id="5796209712009581332">📋</tg-emoji> <b>Instructions:</b>\n{instructions}'
                )

                buttons = [
                    [InlineKeyboardButton("✅ " + ("Saya Sudah Bayar" if lang == "id" else "I Have Paid"), callback_data=f"check_payment:{order_code}")],
                    [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start", icon_custom_emoji_id=UI_ICONS["back"])]
                ]
            else:
                invoice_text = (
                    f"-----------------------------\n"
                    f'<tg-emoji emoji-id="5287780412746120236">💎</tg-emoji> <b>{header_title}</b>\n'
                    f"-----------------------------\n\n"
                    f'<tg-emoji emoji-id="5330237710655306682">👾</tg-emoji> <b>Pesanan:</b> <code>#{order_code}</code>\n'
                    f'<tg-emoji emoji-id="5287292843763713628">🌐</tg-emoji> <b>Jaringan:</b> <b>{net_name}</b>\n\n'
                    f'<tg-emoji emoji-id="6269053837131129030">💳</tg-emoji> <b>{addr_label}:</b>\n<code>{addr_val}</code>\n\n'
                    f'<tg-emoji emoji-id="5287780412746120236">💰</tg-emoji> <b>Jumlah yang Harus Dikirim:</b>\n'
                    f"<code>{amount_val:.2f} USDT</code>\n\n"
                    f'<tg-emoji emoji-id="6181322172263308706">⚠️</tg-emoji> <b>Perhatian:</b> <i>Kirim sesuai petunjuk untuk verifikasi otomatis.</i>\n\n'
                    f'<tg-emoji emoji-id="5796209712009581332">📋</tg-emoji> <b>Instruksi:</b>\n{instructions}'
                    if lang == "id"
                    else
                    f"-----------------------------\n"
                    f'<tg-emoji emoji-id="5287780412746120236">💎</tg-emoji> <b>{header_title}</b>\n'
                    f"-----------------------------\n\n"
                    f'<tg-emoji emoji-id="5330237710655306682">👾</tg-emoji> <b>Order:</b> <code>#{order_code}</code>\n'
                    f'<tg-emoji emoji-id="5287292843763713628">🌐</tg-emoji> <b>Network:</b> <b>{net_name}</b>\n\n'
                    f'<tg-emoji emoji-id="6269053837131129030">💳</tg-emoji> <b>{addr_label}:</b>\n<code>{addr_val}</code>\n\n'
                    f'<tg-emoji emoji-id="5287780412746120236">💰</tg-emoji> <b>Amount to Send:</b>\n'
                    f"<code>{amount_val:.2f} USDT</code>\n\n"
                    f'<tg-emoji emoji-id="6181322172263308706">⚠️</tg-emoji> <b>Important:</b> <i>Follow instructions for automatic verification.</i>\n\n'
                    f'<tg-emoji emoji-id="5796209712009581332">📋</tg-emoji> <b>Instructions:</b>\n{instructions}'
                )

                buttons = [
                    [InlineKeyboardButton("✅ " + ("Saya Sudah Bayar" if lang == "id" else "I Have Paid"), callback_data=f"check_payment:{order_code}")],
                    [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start", icon_custom_emoji_id=UI_ICONS["back"])]
                ]

            if photo_data:
                await update.message.reply_photo(
                    photo=photo_data,
                    caption=invoice_text,
                    parse_mode=ParseMode.HTML,
                    reply_markup=InlineKeyboardMarkup(buttons)
                )
            else:
                await update.message.reply_text(
                    text=invoice_text,
                    parse_mode=ParseMode.HTML,
                    reply_markup=InlineKeyboardMarkup(buttons)
                )
            return

        except ValueError:
            context.user_data["awaiting_topup_net"] = net
            err_msg = (
                '<tg-emoji emoji-id="6181322172263308706">⚠️</tg-emoji> <b>Please enter a valid numeric amount (e.g. 5 or 10):</b>'
                if lang != "id"
                else '<tg-emoji emoji-id="6181322172263308706">⚠️</tg-emoji> <b>Masukkan angka nominal yang valid (contoh: 5 atau 10):</b>'
            )
            await update.message.reply_text(text=err_msg, parse_mode=ParseMode.HTML)
            return

    # 4. Check if user is inputting TxID / Pay ID
    order_code = context.user_data.pop("awaiting_deposit_txid", None)
    if not order_code:
        # Check if user has an active pending deposit and the message looks like a hash / address / Pay ID
        clean_cand = text.strip()
        if (clean_cand.startswith("0x") or clean_cand.startswith("0X") or clean_cand.startswith("T") or len(clean_cand) >= 8) and not clean_cand.startswith("/"):
            latest_dep = get_latest_pending_deposit(user.id)
            if latest_dep:
                order_code = latest_dep["order_code"]

    if order_code:
        txid = text.strip()
        dep = get_deposit_by_code(order_code)
        amt_usd = dep["amount_usd"] if dep else 5.0
        net_str = dep["network"] if dep else "USDT"

        # Check if TxID was already used and approved
        if is_txid_already_used(txid):
            used_text = (
                f'<tg-emoji emoji-id="6181322172263308706">⚠️</tg-emoji> <b>Transaksi Sudah Pernah Digunakan!</b>\n\n'
                f'TxID <code>{txid}</code> sudah pernah diproses dan disetujui sebelumnya untuk mencegah double-spending.\n'
                f'Silakan gunakan transaksi baru.'
                if lang == "id"
                else
                f'<tg-emoji emoji-id="6181322172263308706">⚠️</tg-emoji> <b>Transaction Already Claimed!</b>\n\n'
                f'TxID <code>{txid}</code> has already been verified and credited previously.\n'
                f'Please provide a new transaction.'
            )
            buttons = [
                [InlineKeyboardButton("🔄 " + ("Coba TxID Lain" if lang == "id" else "Try Another TxID"), callback_data=f"retry_txid:{order_code}")],
                [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start", icon_custom_emoji_id=UI_ICONS["back"])]
            ]
            await update.message.reply_text(text=used_text, parse_mode=ParseMode.HTML, reply_markup=InlineKeyboardMarkup(buttons))
            return

        # Save txid to deposit record
        submit_deposit_txid(order_code, txid)

        # Special Security Check for Binance Pay (Off-Chain P2P Transfer)
        if "BINANCE" in net_str.upper():
            dep_record = get_deposit_by_code(order_code)
            dep_id = dep_record["id"] if dep_record else 0

            # Alert all Admins with 1-click Approve / Reject buttons
            admin_markup = InlineKeyboardMarkup([
                [
                    InlineKeyboardButton(f"✅ Setujui (+${amt_usd:.2f} USDT)", callback_data=f"admin:appr_dep:{dep_id}"),
                    InlineKeyboardButton("❌ Tolak", callback_data=f"admin:rej_dep:{dep_id}")
                ]
            ])
            admin_alert = (
                f'🔔 <b>[Deposit Binance Pay Masuk — Cek Kode Unik]</b>\n'
                f'━━━━━━━━━━━━━━━━━━━\n'
                f'📝 <b>Order:</b> <code>#{order_code}</code>\n'
                f'👤 <b>User ID:</b> <code>{user.id}</code> (@{user.username or "None"})\n'
                f'💰 <b>Nominal Sesuai Kode Unik:</b> <b>${amt_usd:.2f} USDT</b>\n'
                f'💳 <b>Binance Order ID / TxID:</b> <code>{txid}</code>\n'
                f'━━━━━━━━━━━━━━━━━━━\n'
                f'⚠️ <b>PERINGATAN KEAMANAN:</b>\n'
                f'<i>Buka aplikasi Binance Anda dan pastikan dana yang masuk benar-benar berupa <b>USDT</b> sebesar <b>${amt_usd:.2f}</b> (sesuai kode unik, BUKAN koin lain seperti BBTC/BTC) sebelum menekan tombol Setujui!</i>'
            )
            for aid in ADMIN_IDS:
                try:
                    await context.bot.send_message(chat_id=aid, text=admin_alert, parse_mode=ParseMode.HTML, reply_markup=admin_markup)
                except Exception as e:
                    logger.warning(f"Failed to send binance deposit alert to admin {aid}: {e}")

            binance_user_text = (
                f'<tg-emoji emoji-id="5330237710655306682">⏳</tg-emoji> <b>Bukti Transfer Binance Pay Diterima!</b>\n\n'
                f'<tg-emoji emoji-id="5431721976769027887">📝</tg-emoji> <b>Pesanan:</b> <code>#{order_code}</code>\n'
                f'<tg-emoji emoji-id="6269053837131129030">💳</tg-emoji> <b>Binance TxID / ID:</b> <code>{txid}</code>\n'
                f'<tg-emoji emoji-id="5287780412746120236">💰</tg-emoji> <b>Nominal:</b> <b>${amt_usd:.2f} USDT</b> (Kode Unik)\n'
                f'<tg-emoji emoji-id="5287292843763713628">🌐</tg-emoji> <b>Metode:</b> <b>Binance Pay (ID: {BINANCE_ID})</b>\n\n'
                f'<i>Admin sedang mengecek mutasi Binance untuk memastikan transfer <b>${amt_usd:.2f} USDT</b> telah diterima. Saldo Anda akan otomatis bertambah setelah disetujui.</i>'
                if lang == "id"
                else
                f'<tg-emoji emoji-id="5330237710655306682">⏳</tg-emoji> <b>Binance Pay Payment Proof Received!</b>\n\n'
                f'<tg-emoji emoji-id="5431721976769027887">📝</tg-emoji> <b>Order:</b> <code>#{order_code}</code>\n'
                f'<tg-emoji emoji-id="6269053837131129030">💳</tg-emoji> <b>Binance TxID / ID:</b> <code>{txid}</code>\n'
                f'<tg-emoji emoji-id="5287780412746120236">💰</tg-emoji> <b>Amount:</b> <b>${amt_usd:.2f} USDT</b> (Unique Code)\n'
                f'<tg-emoji emoji-id="5287292843763713628">🌐</tg-emoji> <b>Method:</b> <b>Binance Pay (ID: {BINANCE_ID})</b>\n\n'
                f'<i>Admin is verifying the transaction on Binance to ensure <b>${amt_usd:.2f} USDT</b> was received. Your balance will be credited as soon as it is approved.</i>'
            )
            buttons = [
                [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start", icon_custom_emoji_id=UI_ICONS["back"])]
            ]
            await update.message.reply_text(text=binance_user_text, parse_mode=ParseMode.HTML, reply_markup=InlineKeyboardMarkup(buttons))
            return

        # Send progress status
        wait_text = (
            '⏳ <i>Memverifikasi transaksi di blockchain secara otomatis...</i>'
            if lang == "id"
            else '⏳ <i>Verifying payment on blockchain automatically...</i>'
        )
        prog_msg = await update.message.reply_text(text=wait_text, parse_mode=ParseMode.HTML)

        # Automated On-Chain Verification
        is_valid, verify_msg, actual_amt = await verify_onchain_payment(net_str, txid, amt_usd)

        if is_valid:
            # Auto-approve & credit balance immediately!
            credited_amt = actual_amt if actual_amt > 0 else amt_usd
            auto_approve_deposit(order_code, txid, credited_amt)
            bal_usd, _ = get_user_balance(user.id)

            success_text = (
                f'<tg-emoji emoji-id="5330237710655306682">🎉</tg-emoji> <b>Top Up Berhasil Dikonfirmasi!</b>\n\n'
                f'<tg-emoji emoji-id="5431721976769027887">📝</tg-emoji> <b>Pesanan:</b> <code>#{order_code}</code>\n'
                f'<tg-emoji emoji-id="5287780412746120236">💰</tg-emoji> <b>Nominal Masuk:</b> <b>+{credited_amt:.2f} USDT</b>\n'
                f'<tg-emoji emoji-id="5287292843763713628">🌐</tg-emoji> <b>Jaringan:</b> <b>{net_str}</b>\n'
                f'<tg-emoji emoji-id="6269053837131129030">💳</tg-emoji> <b>TxID:</b> <code>{txid}</code>\n'
                f'<tg-emoji emoji-id="5287780412746120236">💼</tg-emoji> <b>Saldo Baru:</b> <b>${bal_usd:.2f}</b>\n\n'
                f'<tg-emoji emoji-id="4963452447084251773">✨</tg-emoji> <i>Pembayaran Anda telah diverifikasi otomatis via blockchain! Saldo sudah aktif dan siap digunakan untuk membeli produk.</i>'
                if lang == "id"
                else
                f'<tg-emoji emoji-id="5330237710655306682">🎉</tg-emoji> <b>Top Up Successfully Confirmed!</b>\n\n'
                f'<tg-emoji emoji-id="5431721976769027887">📝</tg-emoji> <b>Order:</b> <code>#{order_code}</code>\n'
                f'<tg-emoji emoji-id="5287780412746120236">💰</tg-emoji> <b>Credited Amount:</b> <b>+{credited_amt:.2f} USDT</b>\n'
                f'<tg-emoji emoji-id="5287292843763713628">🌐</tg-emoji> <b>Network:</b> <b>{net_str}</b>\n'
                f'<tg-emoji emoji-id="6269053837131129030">💳</tg-emoji> <b>TxID:</b> <code>{txid}</code>\n'
                f'<tg-emoji emoji-id="5287780412746120236">💼</tg-emoji> <b>New Balance:</b> <b>${bal_usd:.2f}</b>\n\n'
                f'<tg-emoji emoji-id="4963452447084251773">✨</tg-emoji> <i>Your payment was verified automatically on-chain! Balance is ready to use.</i>'
            )
            buttons = [
                [InlineKeyboardButton("🛍️ " + t("btn_products", lang), callback_data="nav:products", icon_custom_emoji_id=UI_ICONS["products"])],
                [InlineKeyboardButton("💼 " + t("btn_wallet", lang), callback_data="nav:wallet", icon_custom_emoji_id=UI_ICONS["wallet"])],
                [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start", icon_custom_emoji_id=UI_ICONS["back"])]
            ]
            try:
                await prog_msg.edit_text(text=success_text, parse_mode=ParseMode.HTML, reply_markup=InlineKeyboardMarkup(buttons))
            except Exception:
                await update.message.reply_text(text=success_text, parse_mode=ParseMode.HTML, reply_markup=InlineKeyboardMarkup(buttons))

            # Broadcast to live orders channel / group
            rand_prefix = random.randint(1000, 9999)
            id_masked = f"{rand_prefix}***"
            await send_channel_notification(
                context,
                f'<tg-emoji emoji-id="5287780412746120236">💎</tg-emoji> <b>WALLET TOP UP SUCCESSFUL</b>\n'
                f'━━━━━━━━━━━━━━━━━━━\n'
                f'<tg-emoji emoji-id="5330237710655306682">👾</tg-emoji> <b>Order:</b> <code>#{order_code}</code>\n'
                f'<tg-emoji emoji-id="6017118468661317152">👤</tg-emoji> <b>User:</b> <code>{id_masked}</code>\n'
                f'<tg-emoji emoji-id="5287780412746120236">💰</tg-emoji> <b>Amount:</b> <b>+{credited_amt:.2f} USDT</b>\n'
                f'<tg-emoji emoji-id="5287292843763713628">🌐</tg-emoji> <b>Network:</b> <b>{net_str}</b>\n'
                f'<tg-emoji emoji-id="5431721976769027887">⏱️</tg-emoji> <b>Status:</b> <b>Instant Approved (On-Chain)</b> <tg-emoji emoji-id="6102856637343600044">✅</tg-emoji>\n'
                f'━━━━━━━━━━━━━━━━━━━\n'
                f'<tg-emoji emoji-id="5877651964208091297">🤖</tg-emoji> <i>Top up wallet & buy AI subscriptions at @{BOT_USERNAME}</i>'
            )

            # If user has a referrer, notify referrer about 15% commission
            user_db = get_user(user.id)
            if user_db and user_db.get("referrer_id") and user_db["referrer_id"] > 0:
                ref_id = user_db["referrer_id"]
                comm_usd = round(credited_amt * 0.15, 2)
                if comm_usd > 0:
                    try:
                        ref_user = get_user(ref_id)
                        ref_lang = ref_user.get("language", "en") if ref_user else "en"
                        if ref_lang == "id":
                            ref_msg = (
                                f"💰 <b>Komisi Referral Masuk!</b>\n\n"
                                f"Teman yang kamu undang baru saja berhasil isi saldo sebesar <b>{credited_amt:.2f} USDT</b>.\n"
                                f"🎁 Komisi <b>+${comm_usd:.2f} USDT (15%)</b> telah ditambahkan ke saldo dompet kamu!"
                            )
                        else:
                            ref_msg = (
                                f"💰 <b>Referral Deposit Commission!</b>\n\n"
                                f"Your referral just deposited <b>{credited_amt:.2f} USDT</b>.\n"
                                f"🎁 <b>+${comm_usd:.2f} USDT (15%)</b> commission credited to your wallet balance!"
                            )
                        await context.bot.send_message(chat_id=ref_id, text=ref_msg, parse_mode=ParseMode.HTML)
                    except Exception:
                        pass

            # Alert admin(s) about auto-approval
            user_masked = str(user.id)[:4] + "****"
            for aid in ADMIN_IDS:
                try:
                    await context.bot.send_message(
                        chat_id=aid,
                        text=(
                            f"⚡ <b>[Auto-Deposit Approved]</b>\n\n"
                            f"📝 <b>Order:</b> <code>#{order_code}</code>\n"
                            f"👤 <b>User:</b> <code>{user_masked}</code>\n"
                            f"🌐 <b>Network:</b> <b>{net_str}</b>\n"
                            f"💰 <b>Amount:</b> <b>+{credited_amt:.2f} USDT</b>\n"
                            f"💳 <b>TxID:</b> <code>{txid}</code>"
                        ),
                        parse_mode=ParseMode.HTML
                    )
                except Exception:
                    pass
            return

        else:
            # On-chain verification failed or transaction not found
            fail_title = "Payment Verification Failed" if lang != "id" else "Verifikasi Pembayaran Gagal"
            fail_text = (
                f'<tg-emoji emoji-id="6181322172263308706">❌</tg-emoji> <b>{fail_title}</b>\n'
                f'━━━━━━━━━━━━━━━━━━━\n'
                f'<tg-emoji emoji-id="5431721976769027887">📝</tg-emoji> <b>Order:</b> <code>#{order_code}</code>\n'
                f'<tg-emoji emoji-id="6269053837131129030">💳</tg-emoji> <b>Submitted TxID:</b> <code>{txid}</code>\n'
                f'<tg-emoji emoji-id="5287780412746120236">💰</tg-emoji> <b>Expected Amount:</b> <b>{amt_usd:.2f} USDT</b>\n'
                f'<tg-emoji emoji-id="6181322172263308706">⚠️</tg-emoji> <b>Reason:</b> <i>{verify_msg}</i>\n'
                f'━━━━━━━━━━━━━━━━━━━\n\n'
                f'<b>Why did this happen?</b>\n'
                f'• You may have submitted an invalid hash or wallet address.\n'
                f'• The transaction has not been sent yet or is still confirming on the blockchain.\n'
                f'• The transfer was sent to a different address or wrong amount.\n\n'
                f'<i>If you have already sent the transaction, please wait 30 seconds and try again, or tap Request Admin Review below.</i>'
                if lang != "id"
                else
                f'<tg-emoji emoji-id="6181322172263308706">❌</tg-emoji> <b>{fail_title}</b>\n'
                f'━━━━━━━━━━━━━━━━━━━\n'
                f'<tg-emoji emoji-id="5431721976769027887">📝</tg-emoji> <b>Pesanan:</b> <code>#{order_code}</code>\n'
                f'<tg-emoji emoji-id="6269053837131129030">💳</tg-emoji> <b>TxID Dikirim:</b> <code>{txid}</code>\n'
                f'<tg-emoji emoji-id="5287780412746120236">💰</tg-emoji> <b>Nominal:</b> <b>{amt_usd:.2f} USDT</b>\n'
                f'<tg-emoji emoji-id="6181322172263308706">⚠️</tg-emoji> <b>Alasan:</b> <i>{verify_msg}</i>\n'
                f'━━━━━━━━━━━━━━━━━━━\n\n'
                f'<b>Penyebab:</b>\n'
                f'• Format hash salah atau yang dimasukkan adalah alamat wallet.\n'
                f'• Transaksi belum dikirim atau masih pending di blockchain.\n'
                f'• Transfer dikirim ke alamat berbeda atau nominal tidak sesuai.\n\n'
                f'<i>Jika sudah transfer, tunggu 30 detik lalu tekan Coba Lagi, atau minta bantuan admin di bawah.</i>'
            )
            buttons = [
                [InlineKeyboardButton("🔄 " + ("Coba Lagi / Kirim Ulang TxID" if lang == "id" else "Try Again / Re-enter TxID"), callback_data=f"retry_txid:{order_code}")],
                [InlineKeyboardButton("📩 " + ("Minta Verifikasi Admin" if lang == "id" else "Request Admin Review"), callback_data=f"req_manual_review:{order_code}")],
                [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start", icon_custom_emoji_id=UI_ICONS["back"])]
            ]
            try:
                await prog_msg.edit_text(text=fail_text, parse_mode=ParseMode.HTML, reply_markup=InlineKeyboardMarkup(buttons))
            except Exception:
                await update.message.reply_text(text=fail_text, parse_mode=ParseMode.HTML, reply_markup=InlineKeyboardMarkup(buttons))
            return

    # Default fallback: show welcome start menu
    await show_start_view(update, context, is_callback=False)


from telegram.request import HTTPXRequest

async def wallet_command_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await show_wallet_view(update, context, is_callback=False)


async def profile_command_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await show_profile_view(update, context, is_callback=False)


async def orders_command_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await show_orders_view(update, context, is_callback=False)


async def support_command_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await show_support_view(update, context, is_callback=False)


async def referral_command_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await show_referral_view(update, context, is_callback=False)


async def auto_channel_activity_worker(bot):
    """
    Background worker that broadcasts realistic simulated transactions (Orders & Top-ups)
    to the official channel (@digitalaishope) every random 1 to 4 minutes (60 to 240 seconds).
    """
    # Quick initial delay on startup (5 seconds)
    await asyncio.sleep(5)
    logger.info("🚀 Auto channel activity worker started! Broadcasting orders/deposits to channel every 1-4 minutes.")

    while True:
        try:
            # 1. Randomly decide whether to broadcast an Order (75% probability) or a Top-up (25% probability)
            event_type = random.choices(["order", "topup"], weights=[0.75, 0.25])[0]

            rand_id_prefix = random.randint(1000, 9999)
            id_masked = f"{rand_id_prefix}***"
            chars = string.ascii_uppercase + string.digits
            rand_code = "".join(random.choices(chars, k=8))
            order_code = f"DGT{rand_code}"

            if event_type == "order":
                # Balanced list of popular and affordable products
                prod_keys = list(PRODUCTS.keys())
                prod_id = random.choice(prod_keys)
                prod = PRODUCTS[prod_id]
                plans = prod.get("plans", [])
                if plans:
                    # Choose a plan with preference for low-to-mid priced plans
                    plan = random.choice(plans)
                    plan_en = plan["name_en"]
                    qty = random.choices([1, 2, 3], weights=[0.85, 0.12, 0.03])[0]
                    total_price = plan["price_usd"] * qty

                    msg_text = (
                        f'<tg-emoji emoji-id="5312361253610475399">🛍️</tg-emoji> <b>ORDER COMPLETED</b>\n'
                        f'━━━━━━━━━━━━━━━━━━━\n'
                        f'<tg-emoji emoji-id="5312361253610475399">📦</tg-emoji> <b>Product:</b> <b>{prod["name"]}</b> ({plan_en}) x{qty}\n'
                        f'<tg-emoji emoji-id="5431721976769027887">🧾</tg-emoji> <b>Order ID:</b> <code>#{order_code}</code>\n'
                        f'<tg-emoji emoji-id="6017118468661317152">👤</tg-emoji> <b>Buyer:</b> <code>{id_masked}</code>\n'
                        f'<tg-emoji emoji-id="5287780412746120236">💰</tg-emoji> <b>Total:</b> <b>${total_price:.2f}</b>\n'
                        f'<tg-emoji emoji-id="5431721976769027887">⏱️</tg-emoji> <b>Status:</b> <b>Auto Delivered</b> <tg-emoji emoji-id="4963465482309994666">⚡</tg-emoji>\n'
                        f'━━━━━━━━━━━━━━━━━━━\n'
                        f'<tg-emoji emoji-id="5312361253610475399">🛒</tg-emoji> <i>Buy AI accounts & digital subscriptions at @{BOT_USERNAME}</i>'
                    )
            else:
                # Top up event
                networks = [
                    ("QRIS Indonesia", "QRIS"),
                    ("BNB Smart Chain (BEP20)", "BEP20"),
                    ("TRON (TRC20)", "TRC20"),
                    ("Binance Pay", "BINANCE"),
                ]
                net_name, net_type = random.choices(networks, weights=[0.50, 0.20, 0.20, 0.10])[0]
                amounts = [5.0, 10.0, 15.0, 20.0, 25.0, 30.0, 50.0]
                amt_usd = random.choice(amounts)

                if net_type == "QRIS":
                    idr_amt = int(amt_usd * 17904)
                    msg_text = (
                        f'<tg-emoji emoji-id="5287780412746120236">💎</tg-emoji> <b>WALLET TOP UP SUCCESSFUL</b>\n'
                        f'━━━━━━━━━━━━━━━━━━━\n'
                        f'<tg-emoji emoji-id="5330237710655306682">👾</tg-emoji> <b>Order:</b> <code>#{order_code}</code>\n'
                        f'<tg-emoji emoji-id="6017118468661317152">👤</tg-emoji> <b>User:</b> <code>{id_masked}</code>\n'
                        f'<tg-emoji emoji-id="5287780412746120236">💰</tg-emoji> <b>Amount:</b> <b>+{amt_usd:.2f} USDT</b> (Rp {idr_amt:,.0f})\n'
                        f'<tg-emoji emoji-id="5287292843763713628">🌐</tg-emoji> <b>Network:</b> <b>{net_name}</b>\n'
                        f'<tg-emoji emoji-id="5431721976769027887">⏱️</tg-emoji> <b>Status:</b> <b>Instant Approved</b> <tg-emoji emoji-id="6102856637343600044">✅</tg-emoji>\n'
                        f'━━━━━━━━━━━━━━━━━━━\n'
                        f'<tg-emoji emoji-id="5877651964208091297">🤖</tg-emoji> <i>Top up wallet & buy AI subscriptions at @{BOT_USERNAME}</i>'
                    )
                else:
                    msg_text = (
                        f'<tg-emoji emoji-id="5287780412746120236">💎</tg-emoji> <b>WALLET TOP UP SUCCESSFUL</b>\n'
                        f'━━━━━━━━━━━━━━━━━━━\n'
                        f'<tg-emoji emoji-id="5330237710655306682">👾</tg-emoji> <b>Order:</b> <code>#{order_code}</code>\n'
                        f'<tg-emoji emoji-id="6017118468661317152">👤</tg-emoji> <b>User:</b> <code>{id_masked}</code>\n'
                        f'<tg-emoji emoji-id="5287780412746120236">💰</tg-emoji> <b>Amount:</b> <b>+{amt_usd:.2f} USDT</b>\n'
                        f'<tg-emoji emoji-id="5287292843763713628">🌐</tg-emoji> <b>Network:</b> <b>{net_name}</b>\n'
                        f'<tg-emoji emoji-id="5431721976769027887">⏱️</tg-emoji> <b>Status:</b> <b>Instant Approved (On-Chain)</b> <tg-emoji emoji-id="6102856637343600044">✅</tg-emoji>\n'
                        f'━━━━━━━━━━━━━━━━━━━\n'
                        f'<tg-emoji emoji-id="5877651964208091297">🤖</tg-emoji> <i>Top up wallet & buy AI subscriptions at @{BOT_USERNAME}</i>'
                    )

            if LOG_CHANNEL:
                try:
                    await bot.send_message(
                        chat_id=LOG_CHANNEL,
                        text=msg_text,
                        parse_mode=ParseMode.HTML,
                        disable_web_page_preview=True
                    )
                    logger.info(f"Broadcasted automated simulated {event_type} to {LOG_CHANNEL}: #{order_code}")
                except Exception as e:
                    logger.warning(f"Failed to broadcast simulated {event_type} to {LOG_CHANNEL}: {e}")

        except Exception as e:
            logger.error(f"Error in auto_channel_activity_worker: {e}")

        # Sleep randomly between 1 to 4 minutes (60 to 240 seconds)
        sleep_duration = random.randint(60, 240)
        logger.info(f"Auto channel worker sleeping for {sleep_duration}s ({sleep_duration/60:.1f} mins)...")
        await asyncio.sleep(sleep_duration)


async def post_init(application: Application) -> None:
    """Run background workers after bot is initialized"""
    asyncio.create_task(auto_channel_activity_worker(application.bot))


async def global_error_handler(update: object, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Log the error and handle telegram network/conflict errors gracefully."""
    err = context.error
    if isinstance(err, (telegram.error.NetworkError, telegram.error.TimedOut, telegram.error.RetryAfter)):
        logger.warning(f"Telegram network transient issue: {err}")
        return
    if isinstance(err, telegram.error.Conflict):
        logger.error(f"Telegram Bot Conflict: Another instance is polling with this token.")
        return
    logger.error(f"Unhandled exception while handling an update: {err}", exc_info=err)


def main():
    """Start ZELVA AI Telegram Bot application"""
    print("=" * 50)
    print(f"🚀 Starting {BOT_NAME} Digital Store Bot (@{BOT_USERNAME})...")
    print("=" * 50)

    request = HTTPXRequest(
        connection_pool_size=32,
        connect_timeout=30.0,
        read_timeout=30.0,
        write_timeout=30.0,
        pool_timeout=30.0
    )
    app = (
        Application.builder()
        .token(BOT_TOKEN)
        .concurrent_updates(True)
        .request(request)
        .post_init(post_init)
        .build()
    )
    app.add_error_handler(global_error_handler)

    # Commands
    app.add_handler(CommandHandler("start", start_handler))
    app.add_handler(CommandHandler("products", products_command_handler))
    app.add_handler(CommandHandler("catalog", products_command_handler))
    app.add_handler(CommandHandler("wallet", wallet_command_handler))
    app.add_handler(CommandHandler("dompet", wallet_command_handler))
    app.add_handler(CommandHandler("profile", profile_command_handler))
    app.add_handler(CommandHandler("history", orders_command_handler))
    app.add_handler(CommandHandler("orders", orders_command_handler))
    app.add_handler(CommandHandler(["referral", "ref"], referral_command_handler))
    app.add_handler(CommandHandler("support", support_command_handler))
    app.add_handler(CommandHandler("admin", admin_command_handler))

    # Inline Callbacks
    app.add_handler(CallbackQueryHandler(callback_router))

    # Text Messages (Persistent Keyboard & State Handlers for Private Chat only)
    app.add_handler(MessageHandler(filters.ChatType.PRIVATE & filters.TEXT & ~filters.COMMAND, text_message_router))

    print(f"✅ Bot is active and listening for events on Telegram!")
    app.run_polling(
        drop_pending_updates=True,
        bootstrap_retries=10,
        poll_interval=1.0,
        timeout=30
    )


if __name__ == "__main__":
    main()
