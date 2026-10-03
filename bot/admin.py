"""
ZELVA AI - Admin Panel & Management Module
Restricted to authorized Telegram Admin IDs.
Configured with Telegram Premium Custom Emojis (<tg-emoji>)
"""

import random
import logging
from telegram import Update, InlineKeyboardMarkup, InlineKeyboardButton
from telegram.constants import ParseMode
from telegram.ext import ContextTypes

from config import ADMIN_IDS, LOG_CHANNEL, BOT_USERNAME, UI_ICONS
from database import get_admin_stats, get_all_users, update_user_balance, get_connection

logger = logging.getLogger(__name__)

def is_admin(user_id: int) -> bool:
    return user_id in ADMIN_IDS

async def admin_dashboard(update: Update, context: ContextTypes.DEFAULT_TYPE, is_callback: bool = False):
    """Display admin main dashboard"""
    user_id = update.effective_user.id
    if not is_admin(user_id):
        if is_callback:
            await update.callback_query.answer("Unauthorized access.", show_alert=True)
        else:
            await update.message.reply_text("Access denied. Admin rights required.")
        return

    stats = get_admin_stats()
    
    text = (
        '<b><tg-emoji emoji-id="5877651964208091297">🤖</tg-emoji> Digital AI — Admin Dashboard</b>\n'
        '━━━━━━━━━━━━━━━━━━━\n'
        f'<tg-emoji emoji-id="6017118468661317152">👥</tg-emoji> Total Users: <b>{stats["total_users"]}</b>\n'
        f'<tg-emoji emoji-id="5312361253610475399">📦</tg-emoji> Total Orders: <b>{stats["total_orders"]}</b>\n'
        f'<tg-emoji emoji-id="5287780412746120236">💰</tg-emoji> Total Revenue: <b>${stats["revenue_usd"]:.2f}</b> (Rp {stats["revenue_idr"]:,})\n'.replace(",", ".") +
        '━━━━━━━━━━━━━━━━━━━\n'
        'Select an administrative action below:'
    )

    buttons = [
        [
            InlineKeyboardButton("📊 Recent Orders", callback_data="admin:orders"),
            InlineKeyboardButton("👥 User List", callback_data="admin:users")
        ],
        [
            InlineKeyboardButton("💳 Adjust Balance", callback_data="admin:balance_prompt"),
            InlineKeyboardButton("📢 Broadcast Message", callback_data="admin:broadcast_prompt")
        ],
        [InlineKeyboardButton("🔄 Refresh Stats", callback_data="admin:refresh")]
    ]
    markup = InlineKeyboardMarkup(buttons)

    if is_callback and update.callback_query:
        query = update.callback_query
        if query.message.photo:
            await query.message.delete()
            await query.message.reply_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)
        else:
            await query.edit_message_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)
    else:
        await update.message.reply_text(text=text, parse_mode=ParseMode.HTML, reply_markup=markup)

async def handle_admin_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Route admin inline button queries"""
    query = update.callback_query
    await query.answer()
    user_id = query.from_user.id
    
    if not is_admin(user_id):
        await query.answer("Unauthorized.", show_alert=True)
        return

    data = query.data

    if data == "admin:refresh":
        await admin_dashboard(update, context, is_callback=True)

    elif data == "admin:orders":
        stats = get_admin_stats()
        orders = stats.get("recent_orders", [])
        
        text = '<b><tg-emoji emoji-id="5431721976769027887">📜</tg-emoji> Recent Customer Orders:</b>\n━━━━━━━━━━━━━━━━━━━\n'
        if not orders:
            text += "No orders recorded yet."
        else:
            for ord in orders:
                ord_code = ord.get("order_code") or f"DGT{ord['id']:06d}"
                status_emoji = '<tg-emoji emoji-id="6102856637343600044">✅</tg-emoji>' if ord["status"] == "completed" else "⏳"
                text += (
                    f"{status_emoji} <b>Order #{ord_code}</b> — User <code>{ord['user_id']}</code>\n"
                    f"   Product: {ord['product_name']} ({ord['plan_name']})\n"
                    f"   Price: ${ord['price_usd']:.2f} (Rp {ord['price_idr']:,})\n".replace(",", ".") +
                    f"   Status: <b>{ord['status'].upper()}</b>\n\n"
                )
        
        buttons = [[InlineKeyboardButton("← Back to Dashboard", callback_data="admin:refresh")]]
        await query.edit_message_text(text=text, parse_mode=ParseMode.HTML, reply_markup=InlineKeyboardMarkup(buttons))

    elif data == "admin:users":
        users = get_all_users()
        text = f'<b><tg-emoji emoji-id="6017118468661317152">👥</tg-emoji> Registered Users ({len(users)}):</b>\n━━━━━━━━━━━━━━━━━━━\n'
        for u in users[:15]:
            username_str = f"@{u['username']}" if u['username'] else "No username"
            text += f"• <code>{u['user_id']}</code> | {username_str} | Bal: ${u['balance_usd']:.2f}\n"
        
        if len(users) > 15:
            text += f"\n<i>...and {len(users)-15} more users.</i>"

        buttons = [[InlineKeyboardButton("← Back to Dashboard", callback_data="admin:refresh")]]
        await query.edit_message_text(text=text, parse_mode=ParseMode.HTML, reply_markup=InlineKeyboardMarkup(buttons))

    elif data == "admin:broadcast_prompt":
        context.user_data["admin_state"] = "awaiting_broadcast"
        text = (
            '<b><tg-emoji emoji-id="6181322172263308706">📢</tg-emoji> Broadcast Message Mode</b>\n\n'
            'Please send the message you would like to broadcast to all registered bot users in your next reply.\n\n'
            'Type <code>/cancel</code> to abort.'
        )
        buttons = [[InlineKeyboardButton("← Cancel", callback_data="admin:refresh")]]
        await query.edit_message_text(text=text, parse_mode=ParseMode.HTML, reply_markup=InlineKeyboardMarkup(buttons))

    elif data == "admin:balance_prompt":
        context.user_data["admin_state"] = "awaiting_balance_input"
        text = (
            '<b><tg-emoji emoji-id="5287780412746120236">💳</tg-emoji> Adjust User Balance</b>\n\n'
            'Send user ID, amount USD, and amount IDR in the format:\n'
            '<code>USER_ID AMOUNT_USD AMOUNT_IDR</code>\n\n'
            'Example to add $10 (Rp 150.000) to user 12345678:\n'
            '<code>12345678 10 150000</code>\n\n'
            'Type <code>/cancel</code> to abort.'
        )
        buttons = [[InlineKeyboardButton("← Cancel", callback_data="admin:refresh")]]
        await query.edit_message_text(text=text, parse_mode=ParseMode.HTML, reply_markup=InlineKeyboardMarkup(buttons))

    elif data.startswith("admin:appr_dep:"):
        from database import approve_deposit, get_user_balance
        dep_id = int(data.split(":")[2])
        success, dep = approve_deposit(dep_id)
        if success and dep:
            uid = dep["user_id"]
            amt = float(dep["amount_usd"] or 0.0)
            curr_usd, _ = get_user_balance(uid)
            await query.edit_message_text(
                f'<tg-emoji emoji-id="6102856637343600044">✅</tg-emoji> <b>DEPOSIT APPROVED</b> by admin\n'
                f'Order: <code>#{dep["order_code"]}</code>\n'
                f'User: <code>{uid}</code>\n'
                f'Network: <b>{dep["network"]}</b>\n'
                f'Amount: <b>+{amt:.2f} USDT</b>\n'
                f'TxID: <code>{dep["txid"]}</code>',
                parse_mode=ParseMode.HTML
            )
            try:
                await context.bot.send_message(
                    chat_id=uid,
                    text=(
                        f'<tg-emoji emoji-id="5330237710655306682">🎉</tg-emoji> <b>Deposit Approved!</b>\n\n'
                        f'Amount of <b>{amt:.2f} USDT</b> has been added to your wallet balance.\n'
                        f'<tg-emoji emoji-id="5287780412746120236">💎</tg-emoji> Current balance: <b>{curr_usd:.2f} USDT</b>.\n\n'
                        f'Thank you for shopping with us!'
                    ),
                    parse_mode=ParseMode.HTML
                )
            except Exception:
                pass

            # Notify referrer if exists
            try:
                from database import get_user
                u_db = get_user(uid)
                if u_db and u_db.get("referrer_id") and u_db["referrer_id"] > 0:
                    ref_id = u_db["referrer_id"]
                    comm_usd = round(amt * 0.15, 2)
                    if comm_usd > 0:
                        ref_u = get_user(ref_id)
                        ref_lang = ref_u.get("language", "en") if ref_u else "en"
                        if ref_lang == "id":
                            ref_txt = (
                                f"💰 <b>Komisi Referral Masuk!</b>\n\n"
                                f"Teman yang kamu undang baru saja berhasil isi saldo sebesar <b>{amt:.2f} USDT</b>.\n"
                                f"🎁 Komisi <b>+${comm_usd:.2f} USDT (15%)</b> telah ditambahkan ke saldo dompet kamu!"
                            )
                        else:
                            ref_txt = (
                                f"💰 <b>Referral Deposit Commission!</b>\n\n"
                                f"Your referral just completed a deposit of <b>{amt:.2f} USDT</b>.\n"
                                f"🎁 <b>+${comm_usd:.2f} USDT (15%)</b> commission credited to your wallet balance!"
                            )
                        await context.bot.send_message(chat_id=ref_id, text=ref_txt, parse_mode=ParseMode.HTML)
            except Exception:
                pass

            # Broadcast to live orders channel / group
            if LOG_CHANNEL:
                try:
                    rand_prefix = random.randint(1000, 9999)
                    id_masked = f"{rand_prefix}***"
                    await context.bot.send_message(
                        chat_id=LOG_CHANNEL,
                        text=(
                            f'<tg-emoji emoji-id="5287780412746120236">💎</tg-emoji> <b>WALLET TOP UP SUCCESSFUL</b>\n'
                            f'━━━━━━━━━━━━━━━━━━━\n'
                            f'<tg-emoji emoji-id="5330237710655306682">👾</tg-emoji> <b>Order:</b> <code>#{dep["order_code"]}</code>\n'
                            f'<tg-emoji emoji-id="6017118468661317152">👤</tg-emoji> <b>User:</b> <code>{id_masked}</code>\n'
                            f'<tg-emoji emoji-id="5287780412746120236">💰</tg-emoji> <b>Amount:</b> <b>+{amt:.2f} USDT</b>\n'
                            f'<tg-emoji emoji-id="5287292843763713628">🌐</tg-emoji> <b>Network:</b> <b>{dep["network"]}</b>\n'
                            f'<tg-emoji emoji-id="5431721976769027887">⏱️</tg-emoji> <b>Status:</b> <b>Instant Approved</b> <tg-emoji emoji-id="6102856637343600044">✅</tg-emoji>\n'
                            f'━━━━━━━━━━━━━━━━━━━\n'
                            f'<tg-emoji emoji-id="5877651964208091297">🤖</tg-emoji> <i>Top up wallet & buy AI subscriptions at @{BOT_USERNAME}</i>'
                        ),
                        parse_mode=ParseMode.HTML,
                        disable_web_page_preview=True
                    )
                except Exception:
                    pass
        else:
            await query.answer("Deposit already processed.", show_alert=True)

    elif data.startswith("admin:rej_dep:"):
        from database import reject_deposit
        dep_id = int(data.split(":")[2])
        success, dep = reject_deposit(dep_id)
        if success and dep:
            uid = dep["user_id"]
            amt = float(dep["amount_usd"] or 0.0)
            await query.edit_message_text(
                f'<tg-emoji emoji-id="6181322172263308706">❌</tg-emoji> <b>DEPOSIT REJECTED</b> by admin\n'
                f'Order: <code>#{dep["order_code"]}</code>\n'
                f'User: <code>{uid}</code>\n'
                f'Amount: <b>{amt:.2f} USDT</b>',
                parse_mode=ParseMode.HTML
            )
            try:
                await context.bot.send_message(
                    chat_id=uid,
                    text=(
                        f'<tg-emoji emoji-id="6181322172263308706">⚠️</tg-emoji> <b>Top Up Ditolak</b>\n\n'
                        f'Pesanan top-up <code>#{dep["order_code"]}</code> ({amt:.2f} USDT) tidak dapat diverifikasi.\n'
                        f'Silakan hubungi customer support jika ini adalah kesalahan.'
                    ),
                    parse_mode=ParseMode.HTML
                )
            except Exception:
                pass
        else:
            await query.answer("Deposit already processed.", show_alert=True)

async def handle_admin_text(update: Update, context: ContextTypes.DEFAULT_TYPE) -> bool:
    """Handle broadcast messages or balance adjustments from admin"""
    user_id = update.effective_user.id
    if not is_admin(user_id):
        return False

    state = context.user_data.get("admin_state")
    if not state:
        return False

    text = update.message.text.strip()
    if text == "/cancel":
        context.user_data["admin_state"] = None
        await update.message.reply_text("Admin action cancelled.")
        return True

    if state == "awaiting_broadcast":
        context.user_data["admin_state"] = None
        users = get_all_users()
        sent_count = 0
        
        await update.message.reply_text(f"🚀 Sending broadcast to {len(users)} users...")
        for u in users:
            try:
                await context.bot.send_message(
                    chat_id=u["user_id"],
                    text=f'<tg-emoji emoji-id="6181322172263308706">📢</tg-emoji> <b>Announcement from Digital AI:</b>\n\n{text}',
                    parse_mode=ParseMode.HTML
                )
                sent_count += 1
            except Exception as e:
                logger.debug(f"Failed to send broadcast to {u['user_id']}: {e}")
                
        await update.message.reply_text(f'<tg-emoji emoji-id="6102856637343600044">✅</tg-emoji> Broadcast complete! Delivered to {sent_count}/{len(users)} users.')
        return True

    elif state == "awaiting_balance_input":
        context.user_data["admin_state"] = None
        parts = text.split()
        if len(parts) < 2:
            await update.message.reply_text("❌ Invalid format. Use: <code>USER_ID AMOUNT_USD AMOUNT_IDR</code>")
            return True
            
        try:
            target_uid = int(parts[0])
            amount_usd = float(parts[1])
            amount_idr = int(parts[2]) if len(parts) > 2 else int(amount_usd * 15500)
            
            new_usd, new_idr = update_user_balance(
                target_uid, amount_usd, amount_idr, "admin_adjustment", f"Admin balance update by {user_id}"
            )
            
            await update.message.reply_text(
                f'<tg-emoji emoji-id="6102856637343600044">✅</tg-emoji> Balance updated for User <code>{target_uid}</code>!\n'
                f'New Balance: <b>${new_usd:.2f}</b> (Rp {new_idr:,})'.replace(",", ".")
            )
            
            # Notify user
            try:
                await context.bot.send_message(
                    chat_id=target_uid,
                    text=f'<tg-emoji emoji-id="5287780412746120236">💳</tg-emoji> <b>Wallet Credited!</b>\nYour wallet has been credited with <b>${amount_usd:.2f}</b> (Rp {amount_idr:,}).\nCurrent Balance: <b>${new_usd:.2f}</b>'.replace(",", "."),
                    parse_mode=ParseMode.HTML
                )
            except Exception:
                pass
                
        except Exception as e:
            await update.message.reply_text(f"❌ Error adjusting balance: {e}")
            
        return True

    return False
