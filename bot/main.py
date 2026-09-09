"""
ZELVA AI - Main Telegram Bot Application
Clean, modern, professional digital store for AI tools & digital subscriptions.
"""

import os
import logging
from pathlib import Path
from telegram import (
    Update,
    InlineKeyboardMarkup,
    InlineKeyboardButton,
    InputMediaPhoto
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

from config import BOT_TOKEN, BOT_NAME, BOT_USERNAME, SUPPORT_USERNAME, ADMIN_IDS, IMAGES_DIR
from products import PRODUCTS, PRODUCTS_LIST, get_product, get_product_plan
from database import (
    get_or_create_user,
    get_user,
    get_user_balance,
    update_user_balance,
    create_order,
    get_user_orders,
    get_user_orders_count,
    get_referral_stats,
    set_user_language
)
from i18n import t, format_price
from admin import is_admin, admin_dashboard, handle_admin_callback, handle_admin_text

# Logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# --- Keyboards ---

def get_main_menu_keyboard(lang: str = "en") -> InlineKeyboardMarkup:
    """
    Main 2-column inline keyboard:
    Products          My Wallet
    My Orders         Profile
    Promotions        Referral
    Support           FAQ
    Language          About
    """
    buttons = [
        [
            InlineKeyboardButton(t("btn_products", lang), callback_data="nav:products"),
            InlineKeyboardButton(t("btn_wallet", lang), callback_data="nav:wallet")
        ],
        [
            InlineKeyboardButton(t("btn_orders", lang), callback_data="nav:orders"),
            InlineKeyboardButton(t("btn_profile", lang), callback_data="nav:profile")
        ],
        [
            InlineKeyboardButton(t("btn_promotions", lang), callback_data="nav:promotions"),
            InlineKeyboardButton(t("btn_referral", lang), callback_data="nav:referral")
        ],
        [
            InlineKeyboardButton(t("btn_support", lang), callback_data="nav:support"),
            InlineKeyboardButton(t("btn_faq", lang), callback_data="nav:faq")
        ],
        [
            InlineKeyboardButton(t("btn_language", lang), callback_data="nav:language"),
            InlineKeyboardButton(t("btn_about", lang), callback_data="nav:about")
        ]
    ]
    return InlineKeyboardMarkup(buttons)

def get_products_keyboard(lang: str = "en") -> InlineKeyboardMarkup:
    """
    2-column clean product selection buttons
    """
    buttons = [
        [
            InlineKeyboardButton("ChatGPT", callback_data="prod:chatgpt"),
            InlineKeyboardButton("Claude", callback_data="prod:claude")
        ],
        [
            InlineKeyboardButton("Gemini", callback_data="prod:gemini"),
            InlineKeyboardButton("Grok", callback_data="prod:grok")
        ],
        [
            InlineKeyboardButton("Perplexity", callback_data="prod:perplexity"),
            InlineKeyboardButton("Kimi", callback_data="prod:kimi")
        ],
        [
            InlineKeyboardButton("Cursor", callback_data="prod:cursor"),
            InlineKeyboardButton("Leonardo", callback_data="prod:leonardo")
        ],
        [
            InlineKeyboardButton("Lovable", callback_data="prod:lovable"),
            InlineKeyboardButton("Manus", callback_data="prod:manus")
        ],
        [
            InlineKeyboardButton("HeyGen", callback_data="prod:heygen"),
            InlineKeyboardButton("Telegram", callback_data="prod:telegram")
        ],
        [
            InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start")
        ]
    ]
    return InlineKeyboardMarkup(buttons)

def get_product_plans_keyboard(product_id: str, lang: str = "en") -> InlineKeyboardMarkup:
    """Plan selection buttons for a specific product"""
    prod = get_product(product_id)
    if not prod:
        return InlineKeyboardMarkup([[InlineKeyboardButton(t("btn_back_products", lang), callback_data="nav:products")]])

    plans = prod.get("plans", [])
    buttons = []
    current_row = []

    for plan in plans:
        plan_name = plan["name_id"] if lang == "id" else plan["name_en"]
        price_str = format_price(plan["price_usd"], plan["price_idr"], lang)
        btn_text = f"{plan_name} ({price_str})"
        current_row.append(InlineKeyboardButton(btn_text, callback_data=f"buy:{product_id}:{plan['id']}"))

        if len(current_row) == 2:
            buttons.append(current_row)
            current_row = []

    if current_row:
        buttons.append(current_row)

    buttons.append([
        InlineKeyboardButton(t("btn_back_products", lang), callback_data="nav:products"),
        InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start")
    ])
    return InlineKeyboardMarkup(buttons)

# --- Navigation & Display Handlers ---

async def show_start_view(update: Update, context: ContextTypes.DEFAULT_TYPE, is_callback: bool = False):
    """Display ZELVA AI main header banner + main menu"""
    user = update.effective_user
    db_user = get_or_create_user(user.id, user.username or "", user.first_name or "")
    lang = db_user.get("language", "en")

    banner_path = IMAGES_DIR / "main_banner.png"
    text = t("start_text", lang)
    markup = get_main_menu_keyboard(lang)

    if is_callback and update.callback_query:
        query = update.callback_query
        try:
            if banner_path.exists():
                with open(banner_path, "rb") as f:
                    if query.message.photo:
                        await query.edit_message_media(
                            media=InputMediaPhoto(media=f, caption=text, parse_mode=ParseMode.HTML),
                            reply_markup=markup
                        )
                    else:
                        await query.message.delete()
                        await query.message.reply_photo(photo=f, caption=text, parse_mode=ParseMode.HTML, reply_markup=markup)
            else:
                await query.edit_message_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)
        except Exception as e:
            logger.debug(f"Error updating start view: {e}")
            if banner_path.exists():
                with open(banner_path, "rb") as f:
                    await query.message.reply_photo(photo=f, caption=text, parse_mode=ParseMode.HTML, reply_markup=markup)
    else:
        if banner_path.exists():
            with open(banner_path, "rb") as f:
                await update.message.reply_photo(photo=f, caption=text, parse_mode=ParseMode.HTML, reply_markup=markup)
        else:
            await update.message.reply_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)

async def show_products_view(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Display clean product catalog banner + 2-column product buttons"""
    query = update.callback_query
    user = update.effective_user
    db_user = get_or_create_user(user.id, user.username or "", user.first_name or "")
    lang = db_user.get("language", "en")

    banner_path = IMAGES_DIR / "catalog_banner.png"
    text = t("catalog_text", lang)
    markup = get_products_keyboard(lang)

    if banner_path.exists():
        with open(banner_path, "rb") as f:
            if query.message.photo:
                await query.edit_message_media(
                    media=InputMediaPhoto(media=f, caption=text, parse_mode=ParseMode.HTML),
                    reply_markup=markup
                )
            else:
                await query.message.delete()
                await query.message.reply_photo(photo=f, caption=text, parse_mode=ParseMode.HTML, reply_markup=markup)
    else:
        if query.message.photo:
            await query.message.delete()
            await query.message.reply_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)
        else:
            await query.edit_message_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)

async def show_product_detail_view(update: Update, context: ContextTypes.DEFAULT_TYPE, product_id: str):
    """Display individual product logo/card photo + plan selection"""
    query = update.callback_query
    user = update.effective_user
    db_user = get_or_create_user(user.id, user.username or "", user.first_name or "")
    lang = db_user.get("language", "en")

    prod = get_product(product_id)
    if not prod:
        await query.answer("Product not found.", show_alert=True)
        return

    img_path = IMAGES_DIR / f"{product_id}.png"
    desc = prod["description_id"] if lang == "id" else prod["description_en"]
    text = t("product_plans_prompt", lang, name=prod["name"], description=desc)
    markup = get_product_plans_keyboard(product_id, lang)

    if img_path.exists():
        with open(img_path, "rb") as f:
            if query.message.photo:
                await query.edit_message_media(
                    media=InputMediaPhoto(media=f, caption=text, parse_mode=ParseMode.HTML),
                    reply_markup=markup
                )
            else:
                await query.message.delete()
                await query.message.reply_photo(photo=f, caption=text, parse_mode=ParseMode.HTML, reply_markup=markup)
    else:
        if query.message.photo:
            await query.message.delete()
            await query.message.reply_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)
        else:
            await query.edit_message_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)

async def show_order_summary_view(update: Update, context: ContextTypes.DEFAULT_TYPE, product_id: str, plan_id: str):
    """Display order checkout summary and payment methods"""
    query = update.callback_query
    user = update.effective_user
    db_user = get_or_create_user(user.id, user.username or "", user.first_name or "")
    lang = db_user.get("language", "en")

    prod = get_product(product_id)
    plan = get_product_plan(product_id, plan_id)

    if not prod or not plan:
        await query.answer("Invalid plan.", show_alert=True)
        return

    plan_name = plan["name_id"] if lang == "id" else plan["name_en"]
    price_str = format_price(plan["price_usd"], plan["price_idr"], lang)
    curr_usd, curr_idr = get_user_balance(user.id)
    bal_str = format_price(curr_usd, curr_idr, lang)

    text = t(
        "order_summary",
        lang,
        product=prod["name"],
        plan=plan_name,
        duration=plan["duration"],
        price=price_str,
        balance=bal_str
    )

    buttons = [
        [InlineKeyboardButton(t("btn_pay_balance", lang, price=price_str), callback_data=f"pay:bal:{product_id}:{plan_id}")],
        [InlineKeyboardButton(t("btn_pay_instant", lang), callback_data=f"pay:inst:{product_id}:{plan_id}")],
        [InlineKeyboardButton(t("btn_pay_manual", lang), url=f"https://t.me/{SUPPORT_USERNAME}")],
        [InlineKeyboardButton(t("btn_cancel", lang), callback_data=f"prod:{product_id}")]
    ]
    markup = InlineKeyboardMarkup(buttons)

    if query.message.photo:
        await query.message.delete()
        await query.message.reply_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)
    else:
        await query.edit_message_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)

async def process_balance_payment(update: Update, context: ContextTypes.DEFAULT_TYPE, product_id: str, plan_id: str):
    """Deduct balance atomically and generate verified order"""
    query = update.callback_query
    user = update.effective_user
    db_user = get_or_create_user(user.id)
    lang = db_user.get("language", "en")

    prod = get_product(product_id)
    plan = get_product_plan(product_id, plan_id)

    if not prod or not plan:
        await query.answer("Product unavailable.", show_alert=True)
        return

    curr_usd, curr_idr = get_user_balance(user.id)
    price_usd = plan["price_usd"]
    price_idr = plan["price_idr"]

    # Check balance
    if (lang == "id" and curr_idr < price_idr) or (lang != "id" and curr_usd < price_usd):
        req_str = format_price(price_usd, price_idr, lang)
        bal_str = format_price(curr_usd, curr_idr, lang)
        msg = t("insufficient_balance", lang, required=req_str, balance=bal_str)
        await query.answer(msg, show_alert=True)
        return

    # Deduct balance
    plan_name = plan["name_id"] if lang == "id" else plan["name_en"]
    price_str = format_price(price_usd, price_idr, lang)

    update_user_balance(
        user.id,
        -price_usd,
        -price_idr,
        "purchase",
        f"Purchased {prod['name']} - {plan_name}"
    )

    # Insert verified order
    order_id = create_order(
        user.id,
        product_id,
        plan_id,
        prod["name"],
        plan_name,
        price_usd,
        price_idr,
        payment_method="balance"
    )

    success_msg = t(
        "order_success",
        lang,
        order_id=order_id,
        product=prod["name"],
        plan=plan_name,
        price=price_str,
        support=SUPPORT_USERNAME
    )

    buttons = [
        [InlineKeyboardButton(t("btn_orders", lang), callback_data="nav:orders")],
        [InlineKeyboardButton(t("btn_browse", lang), callback_data="nav:products")],
        [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start")]
    ]
    await query.edit_message_text(text=success_msg, parse_mode=ParseMode.HTML, reply_markup=InlineKeyboardMarkup(buttons))

    # Alert admin(s)
    for aid in ADMIN_IDS:
        try:
            await context.bot.send_message(
                chat_id=aid,
                text=(
                    f"📦 <b>New Order Placed!</b>\n\n"
                    f"Order ID: <code>#{order_id}</code>\n"
                    f"User: <code>{user.id}</code> (@{user.username or 'No username'})\n"
                    f"Product: <b>{prod['name']}</b> ({plan_name})\n"
                    f"Amount: <b>{price_str}</b>\n"
                    f"Status: <b>PROCESSING</b>"
                ),
                parse_mode=ParseMode.HTML
            )
        except Exception:
            pass

async def show_wallet_view(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Display wallet balance and deposit options"""
    query = update.callback_query
    user = update.effective_user
    db_user = get_or_create_user(user.id, user.username or "", user.first_name or "")
    lang = db_user.get("language", "en")

    curr_usd, curr_idr = get_user_balance(user.id)
    bal_str = format_price(curr_usd, curr_idr, lang)

    text = t("wallet_text", lang, user_id=user.id, balance=bal_str)

    buttons = [
        [
            InlineKeyboardButton(t("btn_deposit", lang), callback_data="nav:deposit"),
            InlineKeyboardButton(t("btn_history", lang), callback_data="nav:orders")
        ],
        [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start")]
    ]
    markup = InlineKeyboardMarkup(buttons)

    if query.message.photo:
        await query.message.delete()
        await query.message.reply_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)
    else:
        await query.edit_message_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)

async def show_deposit_view(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Display deposit amount choices"""
    query = update.callback_query
    user = update.effective_user
    db_user = get_or_create_user(user.id)
    lang = db_user.get("language", "en")

    text = t("deposit_text", lang)

    if lang == "id":
        buttons = [
            [
                InlineKeyboardButton("Rp 25.000", callback_data="dep:25000"),
                InlineKeyboardButton("Rp 50.000", callback_data="dep:50000")
            ],
            [
                InlineKeyboardButton("Rp 100.000", callback_data="dep:100000"),
                InlineKeyboardButton("Rp 250.000", callback_data="dep:250000")
            ],
            [InlineKeyboardButton(t("btn_contact_support", lang, support=SUPPORT_USERNAME), url=f"https://t.me/{SUPPORT_USERNAME}")],
            [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:wallet")]
        ]
    else:
        buttons = [
            [
                InlineKeyboardButton("$5.00", callback_data="dep:5"),
                InlineKeyboardButton("$10.00", callback_data="dep:10")
            ],
            [
                InlineKeyboardButton("$25.00", callback_data="dep:25"),
                InlineKeyboardButton("$50.00", callback_data="dep:50")
            ],
            [InlineKeyboardButton(t("btn_contact_support", lang, support=SUPPORT_USERNAME), url=f"https://t.me/{SUPPORT_USERNAME}")],
            [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:wallet")]
        ]

    await query.edit_message_text(text=text, parse_mode=ParseMode.HTML, reply_markup=InlineKeyboardMarkup(buttons))

async def show_orders_view(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Display user's recent orders"""
    query = update.callback_query
    user = update.effective_user
    db_user = get_or_create_user(user.id)
    lang = db_user.get("language", "en")

    orders = get_user_orders(user.id, limit=6)

    if not orders:
        text = t("orders_empty", lang)
        buttons = [
            [InlineKeyboardButton(t("btn_browse", lang), callback_data="nav:products")],
            [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start")]
        ]
    else:
        items_str = ""
        for ord in orders:
            status_tag = f"[{ord['status'].upper()}]"
            pr_str = format_price(ord["price_usd"], ord["price_idr"], lang)
            items_str += (
                f"• <b>Order #{ord['id']}</b> {status_tag}\n"
                f"  {ord['product_name']} ({ord['plan_name']}) — <code>{pr_str}</code>\n\n"
            )
        text = t("orders_list", lang, list=items_str.strip())
        buttons = [
            [InlineKeyboardButton(t("btn_browse", lang), callback_data="nav:products")],
            [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start")]
        ]

    markup = InlineKeyboardMarkup(buttons)
    if query.message.photo:
        await query.message.delete()
        await query.message.reply_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)
    else:
        await query.edit_message_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)

async def show_profile_view(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Display user profile info"""
    query = update.callback_query
    user = update.effective_user
    db_user = get_or_create_user(user.id, user.username or "", user.first_name or "")
    lang = db_user.get("language", "en")

    orders_count = get_user_orders_count(user.id)
    curr_usd, curr_idr = get_user_balance(user.id)
    bal_str = format_price(curr_usd, curr_idr, lang)
    username_str = user.username or "Not set"

    text = t(
        "profile_text",
        lang,
        user_id=user.id,
        username=username_str,
        balance=bal_str,
        total_orders=orders_count
    )

    buttons = [
        [
            InlineKeyboardButton(t("btn_referral", lang), callback_data="nav:referral"),
            InlineKeyboardButton(t("btn_deposit", lang), callback_data="nav:deposit")
        ],
        [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start")]
    ]
    markup = InlineKeyboardMarkup(buttons)

    if query.message.photo:
        await query.message.delete()
        await query.message.reply_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)
    else:
        await query.edit_message_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)

async def show_referral_view(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Display referral link and commission statistics"""
    query = update.callback_query
    user = update.effective_user
    db_user = get_or_create_user(user.id)
    lang = db_user.get("language", "en")

    bot_me = await context.bot.get_me()
    ref_link = f"https://t.me/{bot_me.username}?start=ref_{user.id}"
    stats = get_referral_stats(user.id)
    earn_str = format_price(stats["earnings_usd"], stats["earnings_idr"], lang)

    text = t(
        "referral_text",
        lang,
        link=ref_link,
        count=stats["total_referrals"],
        earnings=earn_str
    )

    share_url = f"https://t.me/share/url?url={ref_link}&text=Buy%20premium%20AI%20tools%20on%20ZELVA%20AI%20Store"
    buttons = [
        [InlineKeyboardButton(t("btn_share_ref", lang), url=share_url)],
        [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start")]
    ]
    markup = InlineKeyboardMarkup(buttons)

    if query.message.photo:
        await query.message.delete()
        await query.message.reply_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)
    else:
        await query.edit_message_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)

async def show_promotions_view(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Display active promotions"""
    query = update.callback_query
    user = update.effective_user
    db_user = get_or_create_user(user.id)
    lang = db_user.get("language", "en")

    text = t("promotions_text", lang, support=SUPPORT_USERNAME)
    buttons = [
        [InlineKeyboardButton(t("btn_browse", lang), callback_data="nav:products")],
        [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start")]
    ]
    markup = InlineKeyboardMarkup(buttons)

    if query.message.photo:
        await query.message.delete()
        await query.message.reply_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)
    else:
        await query.edit_message_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)

async def show_support_view(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Display official support contact"""
    query = update.callback_query
    user = update.effective_user
    db_user = get_or_create_user(user.id)
    lang = db_user.get("language", "en")

    text = t("support_text", lang, support=SUPPORT_USERNAME)
    buttons = [
        [InlineKeyboardButton(t("btn_contact_support", lang, support=SUPPORT_USERNAME), url=f"https://t.me/{SUPPORT_USERNAME}")],
        [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start")]
    ]
    markup = InlineKeyboardMarkup(buttons)

    if query.message.photo:
        await query.message.delete()
        await query.message.reply_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)
    else:
        await query.edit_message_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)

async def show_faq_view(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Display simple FAQ"""
    query = update.callback_query
    user = update.effective_user
    db_user = get_or_create_user(user.id)
    lang = db_user.get("language", "en")

    text = t("faq_text", lang, support=SUPPORT_USERNAME)
    buttons = [
        [InlineKeyboardButton(t("btn_contact_support", lang, support=SUPPORT_USERNAME), url=f"https://t.me/{SUPPORT_USERNAME}")],
        [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start")]
    ]
    markup = InlineKeyboardMarkup(buttons)

    if query.message.photo:
        await query.message.delete()
        await query.message.reply_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)
    else:
        await query.edit_message_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)

async def show_language_view(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Display language options"""
    query = update.callback_query
    user = update.effective_user
    db_user = get_or_create_user(user.id)
    lang = db_user.get("language", "en")

    text = t("language_text", lang)
    buttons = [
        [
            InlineKeyboardButton("English (EN)", callback_data="setlang:en"),
            InlineKeyboardButton("Bahasa Indonesia (ID)", callback_data="setlang:id")
        ],
        [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start")]
    ]
    markup = InlineKeyboardMarkup(buttons)

    if query.message.photo:
        await query.message.delete()
        await query.message.reply_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)
    else:
        await query.edit_message_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)

async def show_about_view(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Display about information"""
    query = update.callback_query
    user = update.effective_user
    db_user = get_or_create_user(user.id)
    lang = db_user.get("language", "en")

    text = t("about_text", lang, bot=BOT_USERNAME, support=SUPPORT_USERNAME)
    buttons = [
        [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:start")]
    ]
    markup = InlineKeyboardMarkup(buttons)

    if query.message.photo:
        await query.message.delete()
        await query.message.reply_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)
    else:
        await query.edit_message_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)

# --- Main Dispatcher & Handlers ---

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

    await query.answer()

    # Navigation
    if data == "nav:start":
        await show_start_view(update, context, is_callback=True)
    elif data == "nav:products":
        await show_products_view(update, context)
    elif data == "nav:wallet":
        await show_wallet_view(update, context)
    elif data == "nav:deposit":
        await show_deposit_view(update, context)
    elif data == "nav:orders":
        await show_orders_view(update, context)
    elif data == "nav:profile":
        await show_profile_view(update, context)
    elif data == "nav:promotions":
        await show_promotions_view(update, context)
    elif data == "nav:referral":
        await show_referral_view(update, context)
    elif data == "nav:support":
        await show_support_view(update, context)
    elif data == "nav:faq":
        await show_faq_view(update, context)
    elif data == "nav:language":
        await show_language_view(update, context)
    elif data == "nav:about":
        await show_about_view(update, context)

    # Product detail
    elif data.startswith("prod:"):
        pid = data.split(":", 1)[1]
        await show_product_detail_view(update, context, pid)

    # Plan order summary
    elif data.startswith("buy:"):
        parts = data.split(":")
        pid, plan_id = parts[1], parts[2]
        await show_order_summary_view(update, context, pid, plan_id)

    # Payment execution
    elif data.startswith("pay:bal:"):
        parts = data.split(":")
        pid, plan_id = parts[2], parts[3]
        await process_balance_payment(update, context, pid, plan_id)

    elif data.startswith("pay:inst:"):
        parts = data.split(":")
        pid, plan_id = parts[2], parts[3]
        prod = get_product(pid)
        plan = get_product_plan(pid, plan_id)
        db_u = get_user(user.id)
        lang = db_u.get("language", "en") if db_u else "en"
        pr_str = format_price(plan["price_usd"], plan["price_idr"], lang) if plan else "$0.00"

        text = (
            f"<b>Instant Payment</b>\n\n"
            f"Product: <b>{prod['name'] if prod else pid}</b>\n"
            f"Amount: <b>{pr_str}</b>\n\n"
            f"To complete your order via QRIS, E-Wallet, or Crypto, please transfer and send receipt to @{SUPPORT_USERNAME}."
        )
        buttons = [
            [InlineKeyboardButton(t("btn_contact_support", lang, support=SUPPORT_USERNAME), url=f"https://t.me/{SUPPORT_USERNAME}")],
            [InlineKeyboardButton(t("btn_back_products", lang), callback_data=f"prod:{pid}")]
        ]
        await query.edit_message_text(text=text, parse_mode=ParseMode.HTML, reply_markup=InlineKeyboardMarkup(buttons))

    # Deposit requests
    elif data.startswith("dep:"):
        amt = data.split(":")[1]
        db_u = get_user(user.id)
        lang = db_u.get("language", "en") if db_u else "en"
        amt_str = f"Rp {int(amt):,}".replace(",", ".") if lang == "id" else f"${amt}.00"
        
        text = (
            f"<b>Deposit Request</b>\n\n"
            f"Amount: <b>{amt_str}</b>\n"
            f"User ID: <code>{user.id}</code>\n\n"
            f"Please contact @{SUPPORT_USERNAME} with your User ID to credit your account immediately."
        )
        buttons = [
            [InlineKeyboardButton(t("btn_contact_support", lang, support=SUPPORT_USERNAME), url=f"https://t.me/{SUPPORT_USERNAME}")],
            [InlineKeyboardButton(t("btn_back_menu", lang), callback_data="nav:wallet")]
        ]
        await query.edit_message_text(text=text, parse_mode=ParseMode.HTML, reply_markup=InlineKeyboardMarkup(buttons))

    # Language toggle
    elif data.startswith("setlang:"):
        new_lang = data.split(":")[1]
        set_user_language(user.id, new_lang)
        await query.answer(t("lang_updated", new_lang), show_alert=True)
        await show_start_view(update, context, is_callback=True)

async def text_message_router(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle text inputs and admin inputs"""
    # Check if admin input in progress
    handled = await handle_admin_text(update, context)
    if handled:
        return

    # Default fallback: return to start
    await show_start_view(update, context, is_callback=False)

def main():
    """Start ZELVA AI Telegram Bot application"""
    print("=" * 50)
    print(f"🚀 Starting {BOT_NAME} Digital Store Bot (@{BOT_USERNAME})...")
    print("=" * 50)

    app = Application.builder().token(BOT_TOKEN).build()

    # Commands
    app.add_handler(CommandHandler("start", start_handler))
    app.add_handler(CommandHandler("admin", admin_command_handler))

    # Inline Callbacks
    app.add_handler(CallbackQueryHandler(callback_router))

    # Text Messages
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, text_message_router))

    print(f"✅ Bot is active and listening for events on Telegram!")
    app.run_polling(drop_pending_updates=True)

if __name__ == "__main__":
    main()
