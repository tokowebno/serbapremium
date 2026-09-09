"""
ZELVA AI - Database Management Module
SQLite database for users, balances, orders, transactions, and admin analytics.
"""

import sqlite3
from datetime import datetime
from config import DB_PATH

def get_connection():
    conn = sqlite3.connect(DB_PATH, timeout=20.0)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_connection() as conn:
        cursor = conn.cursor()
        
        # Users
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY,
                username TEXT,
                first_name TEXT,
                balance_usd REAL DEFAULT 0.0,
                balance_idr INTEGER DEFAULT 0,
                language TEXT DEFAULT 'en',
                referrer_id INTEGER DEFAULT 0,
                referral_earnings_usd REAL DEFAULT 0.0,
                referral_earnings_idr INTEGER DEFAULT 0,
                is_admin INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Orders
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                product_id TEXT,
                plan_id TEXT,
                product_name TEXT,
                plan_name TEXT,
                price_usd REAL DEFAULT 0.0,
                price_idr INTEGER DEFAULT 0,
                currency TEXT DEFAULT 'USD',
                status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'cancelled'
                payment_method TEXT DEFAULT 'balance',
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (user_id)
            )
        """)
        
        # Transactions / Wallet History
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                amount_usd REAL DEFAULT 0.0,
                amount_idr INTEGER DEFAULT 0,
                currency TEXT DEFAULT 'USD',
                type TEXT, -- 'deposit', 'purchase', 'referral', 'refund', 'admin_adjustment'
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (user_id)
            )
        """)
        
        # Product Stock Overrides (admin can disable/enable)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS product_overrides (
                product_id TEXT PRIMARY KEY,
                is_active INTEGER DEFAULT 1,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        conn.commit()

def get_or_create_user(user_id: int, username: str = "", first_name: str = "", referrer_id: int = 0) -> dict:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE user_id = ?", (user_id,))
        row = cursor.fetchone()
        
        if row:
            cursor.execute(
                "UPDATE users SET username = ?, first_name = ? WHERE user_id = ?",
                (username or row["username"], first_name or row["first_name"], user_id)
            )
            conn.commit()
            cursor.execute("SELECT * FROM users WHERE user_id = ?", (user_id,))
            return dict(cursor.fetchone())
        else:
            ref = referrer_id if (referrer_id and referrer_id != user_id) else 0
            cursor.execute(
                """INSERT INTO users (user_id, username, first_name, balance_usd, balance_idr, language, referrer_id)
                   VALUES (?, ?, ?, 0.0, 0, 'en', ?)""",
                (user_id, username, first_name, ref)
            )
            conn.commit()
            cursor.execute("SELECT * FROM users WHERE user_id = ?", (user_id,))
            return dict(cursor.fetchone())

def get_user(user_id: int) -> dict | None:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE user_id = ?", (user_id,))
        row = cursor.fetchone()
        return dict(row) if row else None

def set_user_language(user_id: int, lang: str):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET language = ? WHERE user_id = ?", (lang, user_id))
        conn.commit()

def get_user_balance(user_id: int) -> tuple[float, int]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT balance_usd, balance_idr FROM users WHERE user_id = ?", (user_id,))
        row = cursor.fetchone()
        if row:
            return float(row["balance_usd"] or 0.0), int(row["balance_idr"] or 0)
        return 0.0, 0

def update_user_balance(user_id: int, delta_usd: float, delta_idr: int, tx_type: str, description: str) -> tuple[float, int]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT balance_usd, balance_idr FROM users WHERE user_id = ?", (user_id,))
        row = cursor.fetchone()
        curr_usd = float(row["balance_usd"] or 0.0) if row else 0.0
        curr_idr = int(row["balance_idr"] or 0) if row else 0
        
        new_usd = max(0.0, curr_usd + delta_usd)
        new_idr = max(0, curr_idr + delta_idr)
        
        cursor.execute(
            "UPDATE users SET balance_usd = ?, balance_idr = ? WHERE user_id = ?",
            (new_usd, new_idr, user_id)
        )
        cursor.execute(
            """INSERT INTO transactions (user_id, amount_usd, amount_idr, type, description)
               VALUES (?, ?, ?, ?, ?)""",
            (user_id, delta_usd, delta_idr, tx_type, description)
        )
        conn.commit()
        return new_usd, new_idr

def create_order(user_id: int, product_id: str, plan_id: str, product_name: str, plan_name: str, price_usd: float, price_idr: int, payment_method: str = "balance") -> int:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO orders (user_id, product_id, plan_id, product_name, plan_name, price_usd, price_idr, status, payment_method)
               VALUES (?, ?, ?, ?, ?, ?, ?, 'processing', ?)""",
            (user_id, product_id, plan_id, product_name, plan_name, price_usd, price_idr, payment_method)
        )
        order_id = cursor.lastrowid
        
        # Calculate 5% referral commission
        cursor.execute("SELECT referrer_id FROM users WHERE user_id = ?", (user_id,))
        u = cursor.fetchone()
        if u and u["referrer_id"] and u["referrer_id"] > 0:
            referrer_id = u["referrer_id"]
            comm_usd = round(price_usd * 0.05, 2)
            comm_idr = int(price_idr * 0.05)
            if comm_usd > 0 or comm_idr > 0:
                cursor.execute(
                    """UPDATE users SET balance_usd = balance_usd + ?, balance_idr = balance_idr + ?,
                                       referral_earnings_usd = referral_earnings_usd + ?, referral_earnings_idr = referral_earnings_idr + ?
                       WHERE user_id = ?""",
                    (comm_usd, comm_idr, comm_usd, comm_idr, referrer_id)
                )
                cursor.execute(
                    """INSERT INTO transactions (user_id, amount_usd, amount_idr, type, description)
                       VALUES (?, ?, ?, 'referral', ?)""",
                    (referrer_id, comm_usd, comm_idr, f"Referral commission from Order #{order_id} ({product_name})")
                )
                
        conn.commit()
        return order_id

def get_user_orders(user_id: int, limit: int = 10) -> list[dict]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
            (user_id, limit)
        )
        return [dict(row) for row in cursor.fetchall()]

def get_user_orders_count(user_id: int) -> int:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) as cnt FROM orders WHERE user_id = ?", (user_id,))
        row = cursor.fetchone()
        return row["cnt"] if row else 0

def get_referral_stats(user_id: int) -> dict:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) as total_ref FROM users WHERE referrer_id = ?", (user_id,))
        total_ref = cursor.fetchone()["total_ref"]
        
        cursor.execute("SELECT referral_earnings_usd, referral_earnings_idr FROM users WHERE user_id = ?", (user_id,))
        row = cursor.fetchone()
        earn_usd = float(row["referral_earnings_usd"] or 0.0) if row else 0.0
        earn_idr = int(row["referral_earnings_idr"] or 0) if row else 0
        return {"total_referrals": total_ref, "earnings_usd": earn_usd, "earnings_idr": earn_idr}

def get_admin_stats() -> dict:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) as total_users FROM users")
        total_users = cursor.fetchone()["total_users"]
        
        cursor.execute("SELECT COUNT(*) as total_orders FROM orders")
        total_orders = cursor.fetchone()["total_orders"]
        
        cursor.execute("SELECT SUM(price_usd) as revenue_usd, SUM(price_idr) as revenue_idr FROM orders WHERE status IN ('processing', 'completed')")
        rev = cursor.fetchone()
        rev_usd = float(rev["revenue_usd"] or 0.0)
        rev_idr = int(rev["revenue_idr"] or 0)
        
        cursor.execute("SELECT * FROM orders ORDER BY created_at DESC LIMIT 5")
        recent_orders = [dict(r) for r in cursor.fetchall()]
        
        return {
            "total_users": total_users,
            "total_orders": total_orders,
            "revenue_usd": rev_usd,
            "revenue_idr": rev_idr,
            "recent_orders": recent_orders
        }

def get_all_users() -> list[dict]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT user_id, username, first_name, balance_usd, balance_idr, created_at FROM users")
        return [dict(r) for r in cursor.fetchall()]

# Initialize database
init_db()
