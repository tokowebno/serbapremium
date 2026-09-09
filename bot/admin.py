"""
ZELVA AI - Admin Panel & Management Module
Restricted to authorized Telegram Admin IDs.
"""

import logging
from telegram import Update, InlineKeyboardMarkup, InlineKeyboardButton
from telegram.constants import ParseMode
from telegram.ext import ContextTypes

from config import ADMIN_IDS
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
        "<b>ZELVA AI — Admin Dashboard</b>\n"
        "━━━━━━━━━━━━━━━━━━━\n"
        f"👥 Total Users: <b>{stats['total_users']}</b>\n"
        f"📦 Total Orders: <b>{stats['total_orders']}</b>\n"
        f"💰 Total Revenue: <b>${stats['revenue_usd']:.2f}</b> (Rp {stats['revenue_idr']:,})\n".replace(",", ".") +
        "━━━━━━━━━━━━━━━━━━━\n"
        "Select an administrative action below:"
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
        
        text = "<b>Recent Customer Orders:</b>\n━━━━━━━━━━━━━━━━━━━\n"
        if not orders:
            text += "No orders recorded yet."
        else:
            for ord in orders:
                status_emoji = "✅" if ord["status"] == "completed" else "⏳"
                text += (
                    f"{status_emoji} <b>Order #{ord['id']}</b> — User <code>{ord['user_id']}</code>\n"
                    f"   Product: {ord['product_name']} ({ord['plan_name']})\n"
                    f"   Price: ${ord['price_usd']:.2f} (Rp {ord['price_idr']:,})\n".replace(",", ".") +
                    f"   Status: <b>{ord['status'].upper()}</b>\n\n"
                )
        
        buttons = [[InlineKeyboardButton("← Back to Dashboard", callback_data="admin:refresh")]]
        await query.edit_message_text(text=text, parse_mode=ParseMode.HTML, reply_markup=InlineKeyboardMarkup(buttons))

    elif data == "admin:users":
        users = get_all_users()
        text = f"<b>Registered Users ({len(users)}):</b>\n━━━━━━━━━━━━━━━━━━━\n"
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
            "<b>📢 Broadcast Message Mode</b>\n\n"
            "Please send the message you would like to broadcast to all registered bot users in your next reply.\n\n"
            "Type <code>/cancel</code> to abort."
        )
        buttons = [[InlineKeyboardButton("← Cancel", callback_data="admin:refresh")]]
        await query.edit_message_text(text=text, parse_mode=ParseMode.HTML, reply_markup=InlineKeyboardMarkup(buttons))

    elif data == "admin:balance_prompt":
        context.user_data["admin_state"] = "awaiting_balance_input"
        text = (
            "<b>💳 Adjust User Balance</b>\n\n"
            "Send user ID, amount USD, and amount IDR in the format:\n"
            "<code>USER_ID AMOUNT_USD AMOUNT_IDR</code>\n\n"
            "Example to add $10 (Rp 150.000) to user 12345678:\n"
            "<code>12345678 10 150000</code>\n\n"
            "Type <code>/cancel</code> to abort."
        )
        buttons = [[InlineKeyboardButton("← Cancel", callback_data="admin:refresh")]]
        await query.edit_message_text(text=text, parse_mode=ParseMode.HTML, reply_markup=InlineKeyboardMarkup(buttons))

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
                    text=f"📢 <b>Announcement from ZELVA AI:</b>\n\n{text}",
                    parse_mode=ParseMode.HTML
                )
                sent_count += 1
            except Exception as e:
                logger.debug(f"Failed to send broadcast to {u['user_id']}: {e}")
                
        await update.message.reply_text(f"✅ Broadcast complete! Delivered to {sent_count}/{len(users)} users.")
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
                f"✅ Balance updated for User <code>{target_uid}</code>!\n"
                f"New Balance: <b>${new_usd:.2f}</b> (Rp {new_idr:,})".replace(",", ".")
            )
            
            # Notify user
            try:
                await context.bot.send_message(
                    chat_id=target_uid,
                    text=f"💳 <b>Wallet Credited!</b>\nYour wallet has been credited with <b>${amount_usd:.2f}</b> (Rp {amount_idr:,}).\nCurrent Balance: <b>${new_usd:.2f}</b>".replace(",", "."),
                    parse_mode=ParseMode.HTML
                )
            except Exception:
                pass
                
        except Exception as e:
            await update.message.reply_text(f"❌ Error adjusting balance: {e}")
            
        return True

    return False
