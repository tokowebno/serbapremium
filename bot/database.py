"""
ZELVA AI - Database Management Module
SQLite database with automatic schema migration for users, balances, orders, deposits, transactions, and admin analytics.
"""

import sqlite3
import secrets
import string
from datetime import datetime
from config import DB_PATH

def get_connection():
    conn = sqlite3.connect(DB_PATH, timeout=20.0)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_connection() as conn:
        cursor = conn.cursor()
        
        # 1. Users
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
        
        # Check and migrate any missing columns in 'users' table
        cursor.execute("PRAGMA table_info(users)")
        existing_cols = {row["name"] for row in cursor.fetchall()}
        
        columns_to_add = [
            ("balance_usd", "REAL DEFAULT 0.0"),
            ("balance_idr", "INTEGER DEFAULT 0"),
            ("language", "TEXT DEFAULT 'en'"),
            ("referrer_id", "INTEGER DEFAULT 0"),
            ("referral_reward_claimed", "INTEGER DEFAULT 0"),
            ("referral_earnings_usd", "REAL DEFAULT 0.0"),
            ("referral_earnings_idr", "INTEGER DEFAULT 0"),
            ("is_verified", "INTEGER DEFAULT 0"),
            ("is_admin", "INTEGER DEFAULT 0"),
        ]
        
        for col_name, col_def in columns_to_add:
            if col_name not in existing_cols:
                try:
                    cursor.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_def}")
                except Exception:
                    pass

        # 2. Orders
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_code TEXT,
                user_id INTEGER,
                product_id TEXT,
                plan_id TEXT,
                product_name TEXT,
                plan_name TEXT,
                price_usd REAL DEFAULT 0.0,
                price_idr INTEGER DEFAULT 0,
                currency TEXT DEFAULT 'USD',
                status TEXT DEFAULT 'completed',
                payment_method TEXT DEFAULT 'balance',
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (user_id)
            )
        """)
        
        cursor.execute("PRAGMA table_info(orders)")
        existing_order_cols = {row["name"] for row in cursor.fetchall()}
        if "order_code" not in existing_order_cols:
            try:
                cursor.execute("ALTER TABLE orders ADD COLUMN order_code TEXT")
            except Exception:
                pass

        # 3. Deposits / Top-Up Requests
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS deposits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_code TEXT UNIQUE,
                user_id INTEGER,
                network TEXT,
                amount_usd REAL DEFAULT 0.0,
                amount_idr INTEGER DEFAULT 0,
                txid TEXT DEFAULT '',
                status TEXT DEFAULT 'pending_payment',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (user_id)
            )
        """)

        # 4. Transactions / Wallet History
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                amount_usd REAL DEFAULT 0.0,
                amount_idr INTEGER DEFAULT 0,
                currency TEXT DEFAULT 'USD',
                type TEXT,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (user_id)
            )
        """)
        
        # 5. Product Stock Overrides
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS product_overrides (
                product_id TEXT PRIMARY KEY,
                is_active INTEGER DEFAULT 1,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        conn.commit()

def generate_order_code(prefix: str = "DIGITAL") -> str:
    chars = string.ascii_uppercase + string.digits
    rand = "".join(secrets.choice(chars) for _ in range(8))
    return f"{prefix}{rand}"

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
                """INSERT INTO users (user_id, username, first_name, balance_usd, balance_idr, language, referrer_id, referral_reward_claimed, is_verified)
                   VALUES (?, ?, ?, 0.0, 0, 'en', ?, 0, 0)""",
                (user_id, username, first_name, ref)
            )
            conn.commit()
            cursor.execute("SELECT * FROM users WHERE user_id = ?", (user_id,))
            return dict(cursor.fetchone())

def claim_referral_signup_reward(user_id: int) -> tuple[bool, int, float]:
    """
    Credit $0.20 USD to referrer once the invited user verifies channel membership.
    Ensures reward is only claimed once.
    Returns (reward_credited, referrer_id, bonus_amount)
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT referrer_id, referral_reward_claimed, username, first_name FROM users WHERE user_id = ?", (user_id,))
        row = cursor.fetchone()
        if not row:
            return False, 0, 0.0
        
        ref_id = row["referrer_id"]
        claimed = row["referral_reward_claimed"]
        
        cursor.execute("UPDATE users SET is_verified = 1 WHERE user_id = ?", (user_id,))
        
        if ref_id and ref_id > 0 and ref_id != user_id and not claimed:
            BONUS_USD = 0.20
            BONUS_IDR = int(BONUS_USD * 17904)
            cursor.execute(
                """UPDATE users 
                   SET balance_usd = balance_usd + ?, 
                       balance_idr = balance_idr + ?, 
                       referral_earnings_usd = referral_earnings_usd + ?, 
                       referral_earnings_idr = referral_earnings_idr + ? 
                   WHERE user_id = ?""",
                (BONUS_USD, BONUS_IDR, BONUS_USD, BONUS_IDR, ref_id)
            )
            cursor.execute(
                "UPDATE users SET referral_reward_claimed = 1 WHERE user_id = ?",
                (user_id,)
            )
            u_label = f"@{row['username']}" if row['username'] else f"User {row['first_name'] or user_id}"
            cursor.execute(
                """INSERT INTO transactions (user_id, amount_usd, amount_idr, type, description)
                   VALUES (?, ?, ?, 'referral_invite', ?)""",
                (ref_id, BONUS_USD, BONUS_IDR, f"Referral signup reward ($0.20) for verified invite {u_label}")
            )
            conn.commit()
            return True, ref_id, BONUS_USD
        else:
            conn.commit()
            return False, 0, 0.0

def set_user_verified(user_id: int):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET is_verified = 1 WHERE user_id = ?", (user_id,))
        conn.commit()

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

def create_order(user_id: int, product_id: str, plan_id: str, product_name: str, plan_name: str, price_usd: float, price_idr: int, payment_method: str = "balance") -> tuple[str, bool, int, float]:
    order_code = generate_order_code("DIGITAL")
    bonus_awarded = False
    ref_id = 0
    bonus_usd = 0.20
    bonus_idr = int(bonus_usd * 17904)

    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO orders (order_code, user_id, product_id, plan_id, product_name, plan_name, price_usd, price_idr, status, payment_method)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'completed', ?)""",
            (order_code, user_id, product_id, plan_id, product_name, plan_name, price_usd, price_idr, payment_method)
        )
        order_id = cursor.lastrowid
        
        # Check referrer and first order referral bonus
        cursor.execute("SELECT referrer_id, referral_reward_claimed, username, first_name FROM users WHERE user_id = ?", (user_id,))
        u = cursor.fetchone()
        if u and u["referrer_id"] and u["referrer_id"] > 0 and u["referrer_id"] != user_id:
            ref_id = u["referrer_id"]
            claimed = u["referral_reward_claimed"]
            u_label = f"@{u['username']}" if u['username'] else f"User {u['first_name'] or user_id}"

            # If this is their first order and referral reward not yet claimed:
            if not claimed:
                cursor.execute(
                    """UPDATE users 
                       SET balance_usd = balance_usd + ?, 
                           balance_idr = balance_idr + ?, 
                           referral_earnings_usd = referral_earnings_usd + ?, 
                           referral_earnings_idr = referral_earnings_idr + ?,
                           referral_reward_claimed = 1
                       WHERE user_id = ?""",
                    (bonus_usd, bonus_idr, bonus_usd, bonus_idr, ref_id)
                )
                cursor.execute(
                    """INSERT INTO transactions (user_id, amount_usd, amount_idr, type, description)
                       VALUES (?, ?, ?, 'referral_order_bonus', ?)""",
                    (ref_id, bonus_usd, bonus_idr, f"Referral reward ($0.20) for first order by {u_label}")
                )
                bonus_awarded = True

            # 15% Referral Order Commission
            comm_usd = round(price_usd * 0.15, 2)
            comm_idr = int(price_idr * 0.15)
            if comm_usd > 0 or comm_idr > 0:
                cursor.execute(
                    """UPDATE users SET balance_usd = balance_usd + ?, balance_idr = balance_idr + ?,
                                       referral_earnings_usd = referral_earnings_usd + ?, referral_earnings_idr = referral_earnings_idr + ?
                       WHERE user_id = ?""",
                    (comm_usd, comm_idr, comm_usd, comm_idr, ref_id)
                )
                cursor.execute(
                    """INSERT INTO transactions (user_id, amount_usd, amount_idr, type, description)
                       VALUES (?, ?, ?, 'referral', ?)""",
                    (ref_id, comm_usd, comm_idr, f"15% Referral commission from Order #{order_code} ({product_name})")
                )
                
        conn.commit()
        return order_code, bonus_awarded, ref_id, bonus_usd

def create_deposit_request(user_id: int, network: str, amount_usd: float, amount_idr: int = 0) -> str:
    order_code = generate_order_code()
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO deposits (order_code, user_id, network, amount_usd, amount_idr, status)
               VALUES (?, ?, ?, ?, ?, 'pending_payment')""",
            (order_code, user_id, network, amount_usd, amount_idr)
        )
        conn.commit()
        return order_code

def submit_deposit_txid(order_code: str, txid: str) -> bool:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """UPDATE deposits SET txid = ?, status = 'pending_verification' WHERE order_code = ?""",
            (txid, order_code)
        )
        conn.commit()
        return cursor.rowcount > 0

def is_txid_already_used(txid: str) -> bool:
    clean_tx = txid.strip().lower()
    if not clean_tx:
        return False
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM deposits WHERE LOWER(txid) = ? AND status = 'approved'", (clean_tx,))
        return cursor.fetchone() is not None

def auto_approve_deposit(order_code: str, txid: str, verified_amount: float) -> tuple[bool, dict | None]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM deposits WHERE order_code = ?", (order_code,))
        row = cursor.fetchone()
        if not row or row["status"] == "approved":
            return False, None
        
        dep = dict(row)
        user_id = dep["user_id"]
        amt_usd = float(verified_amount or dep["amount_usd"] or 0.0)
        amt_idr = int(amt_usd * 17904)
        
        cursor.execute("UPDATE deposits SET txid = ?, status = 'approved', amount_usd = ? WHERE order_code = ?", (txid, amt_usd, order_code))
        cursor.execute(
            "UPDATE users SET balance_usd = balance_usd + ?, balance_idr = balance_idr + ? WHERE user_id = ?",
            (amt_usd, amt_idr, user_id)
        )
        cursor.execute(
            """INSERT INTO transactions (user_id, amount_usd, amount_idr, type, description)
               VALUES (?, ?, ?, 'deposit', ?)""",
            (user_id, amt_usd, amt_idr, f"Automated on-chain deposit #{order_code} ({dep['network']})")
        )

        # 15% Referral Deposit Commission
        cursor.execute("SELECT referrer_id, username, first_name FROM users WHERE user_id = ?", (user_id,))
        u_info = cursor.fetchone()
        if u_info and u_info["referrer_id"] and u_info["referrer_id"] > 0:
            ref_id = u_info["referrer_id"]
            comm_usd = round(amt_usd * 0.15, 2)
            comm_idr = int(amt_idr * 0.15)
            if comm_usd > 0:
                cursor.execute(
                    """UPDATE users 
                       SET balance_usd = balance_usd + ?, 
                           balance_idr = balance_idr + ?,
                           referral_earnings_usd = referral_earnings_usd + ?,
                           referral_earnings_idr = referral_earnings_idr + ?
                       WHERE user_id = ?""",
                    (comm_usd, comm_idr, comm_usd, comm_idr, ref_id)
                )
                u_label = f"@{u_info['username']}" if u_info['username'] else f"User {u_info['first_name'] or user_id}"
                cursor.execute(
                    """INSERT INTO transactions (user_id, amount_usd, amount_idr, type, description)
                       VALUES (?, ?, ?, 'referral_deposit', ?)""",
                    (ref_id, comm_usd, comm_idr, f"15% Deposit referral commission from {u_label} (#{order_code})")
                )

        conn.commit()
        cursor.execute("SELECT * FROM deposits WHERE order_code = ?", (order_code,))
        return True, dict(cursor.fetchone())

def get_deposit_by_code(order_code: str) -> dict | None:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM deposits WHERE order_code = ?", (order_code,))
        row = cursor.fetchone()
        return dict(row) if row else None

def get_deposit_by_id(dep_id: int) -> dict | None:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM deposits WHERE id = ?", (dep_id,))
        row = cursor.fetchone()
        return dict(row) if row else None

def get_latest_pending_deposit(user_id: int) -> dict | None:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM deposits WHERE user_id = ? AND status = 'pending' ORDER BY id DESC LIMIT 1",
            (user_id,)
        )
        row = cursor.fetchone()
        return dict(row) if row else None

def approve_deposit(dep_id: int) -> tuple[bool, dict | None]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM deposits WHERE id = ?", (dep_id,))
        row = cursor.fetchone()
        if not row or row["status"] == "approved":
            return False, None
        
        dep = dict(row)
        user_id = dep["user_id"]
        amt_usd = float(dep["amount_usd"] or 0.0)
        amt_idr = int(dep["amount_idr"] or 0)
        
        cursor.execute("UPDATE deposits SET status = 'approved' WHERE id = ?", (dep_id,))
        cursor.execute(
            "UPDATE users SET balance_usd = balance_usd + ?, balance_idr = balance_idr + ? WHERE user_id = ?",
            (amt_usd, amt_idr, user_id)
        )
        cursor.execute(
            """INSERT INTO transactions (user_id, amount_usd, amount_idr, type, description)
               VALUES (?, ?, ?, 'deposit', ?)""",
            (user_id, amt_usd, amt_idr, f"Deposit approved #{dep['order_code']} ({dep['network']})")
        )

        # 15% Referral Deposit Commission
        cursor.execute("SELECT referrer_id, username, first_name FROM users WHERE user_id = ?", (user_id,))
        u_info = cursor.fetchone()
        if u_info and u_info["referrer_id"] and u_info["referrer_id"] > 0:
            ref_id = u_info["referrer_id"]
            comm_usd = round(amt_usd * 0.15, 2)
            comm_idr = int(amt_idr * 0.15)
            if comm_usd > 0:
                cursor.execute(
                    """UPDATE users 
                       SET balance_usd = balance_usd + ?, 
                           balance_idr = balance_idr + ?,
                           referral_earnings_usd = referral_earnings_usd + ?,
                           referral_earnings_idr = referral_earnings_idr + ?
                       WHERE user_id = ?""",
                    (comm_usd, comm_idr, comm_usd, comm_idr, ref_id)
                )
                u_label = f"@{u_info['username']}" if u_info['username'] else f"User {u_info['first_name'] or user_id}"
                cursor.execute(
                    """INSERT INTO transactions (user_id, amount_usd, amount_idr, type, description)
                       VALUES (?, ?, ?, 'referral_deposit', ?)""",
                    (ref_id, comm_usd, comm_idr, f"15% Deposit referral commission from {u_label} (#{dep['order_code']})")
                )

        conn.commit()
        return True, dep

def reject_deposit(dep_id: int) -> tuple[bool, dict | None]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM deposits WHERE id = ?", (dep_id,))
        row = cursor.fetchone()
        if not row or row["status"] in ("approved", "rejected"):
            return False, None
        
        cursor.execute("UPDATE deposits SET status = 'rejected' WHERE id = ?", (dep_id,))
        conn.commit()
        return True, dict(row)

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

def get_user_deposits_count(user_id: int) -> int:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) as cnt FROM deposits WHERE user_id = ? AND status = 'approved'", (user_id,))
        row = cursor.fetchone()
        return row["cnt"] if row else 0

def get_user_total_deposited(user_id: int) -> float:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT SUM(amount_usd) as total FROM deposits WHERE user_id = ? AND status = 'approved'", (user_id,))
        row = cursor.fetchone()
        return float(row["total"] or 0.0) if row and row["total"] else 0.0

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
