"""
ZELVA AI - Multi-Language Strings Localization
English (EN) & Bahasa Indonesia (ID)
"""

MESSAGES = {
    "en": {
        "start_text": "<b>ZELVA AI</b>\n\nAI tools & digital products.\nChoose an option below.",
        "btn_products": "Products",
        "btn_wallet": "My Wallet",
        "btn_orders": "My Orders",
        "btn_profile": "Profile",
        "btn_promotions": "Promotions",
        "btn_referral": "Referral",
        "btn_support": "Support",
        "btn_faq": "FAQ",
        "btn_language": "Language",
        "btn_about": "About",
        "btn_back_menu": "← Back to Menu",
        "btn_back_products": "← Back to Products",
        "btn_deposit": "Deposit",
        "btn_history": "Transaction History",
        "btn_browse": "Browse Products",
        "btn_share_ref": "Share Referral Link",
        "btn_contact_support": "Contact Support (@{support})",
        
        "catalog_text": "<b>AI Products</b>\n\nChoose a service to view available plans.",
        "product_plans_prompt": "<b>{name}</b>\n\n{description}\n\nChoose a plan:",
        
        "order_summary": (
            "<b>Order Summary</b>\n\n"
            "Product: <b>{product}</b>\n"
            "Plan: <b>{plan}</b> ({duration})\n"
            "Total Price: <b>{price}</b>\n"
            "Your Balance: <b>{balance}</b>\n\n"
            "Choose a payment method below:"
        ),
        "btn_pay_balance": "💳 Pay with Balance ({price})",
        "btn_pay_instant": "📲 Instant Payment (QRIS / Crypto)",
        "btn_pay_manual": "💬 Order via Support",
        "btn_cancel": "← Cancel",
        
        "insufficient_balance": "Insufficient balance. Required: {required}. Your balance: {balance}. Please deposit first.",
        "order_success": (
            "<b>Payment Successful</b>\n\n"
            "Order ID: <code>#{order_id}</code>\n"
            "Product: <b>{product}</b> ({plan})\n"
            "Amount Paid: <b>{price}</b>\n\n"
            "Your order is being processed automatically. Credentials will be sent here shortly.\n"
            "If you need assistance, contact @{support}."
        ),
        
        "wallet_text": (
            "<b>My Wallet</b>\n\n"
            "User ID: <code>{user_id}</code>\n"
            "Current Balance: <b>{balance}</b>\n\n"
            "Deposit funds to enable instant automated checkout."
        ),
        "deposit_text": (
            "<b>Deposit Funds</b>\n\n"
            "Select a deposit amount or contact support for custom top up:"
        ),
        
        "orders_empty": "<b>My Orders</b>\n\nNo orders yet.",
        "orders_list": "<b>My Orders</b>\n\n{list}",
        
        "profile_text": (
            "<b>Profile</b>\n\n"
            "User ID: <code>{user_id}</code>\n"
            "Username: @{username}\n"
            "Balance: <b>{balance}</b>\n"
            "Total Orders: <b>{total_orders}</b>\n"
            "Language: <b>English</b>"
        ),
        
        "referral_text": (
            "<b>Referral Program</b>\n\n"
            "Invite friends to ZELVA AI and earn <b>5% commission</b> on their purchases.\n\n"
            "Your Referral Link:\n"
            "<code>{link}</code>\n\n"
            "Statistics:\n"
            "• Referred Users: <b>{count}</b>\n"
            "• Total Earnings: <b>{earnings}</b>"
        ),
        
        "promotions_text": (
            "<b>Promotions</b>\n\n"
            "Active Deals:\n"
            "• <b>ZELVA10</b> — 10% discount on all subscriptions.\n"
            "• <b>ChatGPT + Claude Duo</b> — Special bundle deal.\n\n"
            "Contact @{support} to apply voucher codes."
        ),
        
        "support_text": (
            "<b>Customer Support</b>\n\n"
            "Need assistance with an order, account setup, or warranty?\n"
            "Our official support team is available 24/7.\n\n"
            "Support: @{support}\n"
            "Response Time: Within minutes"
        ),
        
        "faq_text": (
            "<b>FAQ</b>\n\n"
            "<b>How to order?</b>\n"
            "Select Products from the menu, choose your AI service and plan, then complete payment.\n\n"
            "<b>How long does delivery take?</b>\n"
            "Orders are processed instantly within 1-5 minutes.\n\n"
            "<b>Is there a warranty?</b>\n"
            "Yes, 100% full replacement warranty for the entire subscription duration.\n\n"
            "<b>How to contact support?</b>\n"
            "Reach out to @{support} anytime."
        ),
        
        "language_text": "<b>Language / Bahasa</b>\n\nSelect your preferred language:",
        "lang_updated": "Language updated to English.",
        
        "about_text": (
            "<b>ZELVA AI</b>\n\n"
            "Global digital store for AI tools, digital products, and subscriptions.\n\n"
            "Bot: @{bot}\n"
            "Support: @{support}"
        )
    },
    
    "id": {
        "start_text": "<b>ZELVA AI</b>\n\nLayanan AI tools & produk digital.\nPilih menu di bawah ini.",
        "btn_products": "Products",
        "btn_wallet": "My Wallet",
        "btn_orders": "My Orders",
        "btn_profile": "Profile",
        "btn_promotions": "Promotions",
        "btn_referral": "Referral",
        "btn_support": "Support",
        "btn_faq": "FAQ",
        "btn_language": "Language",
        "btn_about": "About",
        "btn_back_menu": "← Kembali ke Menu",
        "btn_back_products": "← Kembali ke Produk",
        "btn_deposit": "Isi Saldo",
        "btn_history": "Riwayat Transaksi",
        "btn_browse": "Jelajahi Produk",
        "btn_share_ref": "Bagikan Link Referral",
        "btn_contact_support": "Hubungi Support (@{support})",
        
        "catalog_text": "<b>AI Products</b>\n\nPilih layanan untuk melihat paket dan harga.",
        "product_plans_prompt": "<b>{name}</b>\n\n{description}\n\nPilih paket langganan:",
        
        "order_summary": (
            "<b>Ringkasan Pesanan</b>\n\n"
            "Produk: <b>{product}</b>\n"
            "Paket: <b>{plan}</b> ({duration})\n"
            "Total Tagihan: <b>{price}</b>\n"
            "Saldo Wallet Kamu: <b>{balance}</b>\n\n"
            "Pilih metode pembayaran di bawah:"
        ),
        "btn_pay_balance": "💳 Bayar dengan Saldo ({price})",
        "btn_pay_instant": "📲 Bayar via QRIS / E-Wallet",
        "btn_pay_manual": "💬 Pesan Manual via CS",
        "btn_cancel": "← Batalkan",
        
        "insufficient_balance": "Saldo wallet tidak cukup. Dibutuhkan: {required}. Saldo kamu: {balance}. Silakan Top Up saldo terlebih dahulu.",
        "order_success": (
            "<b>Pembayaran Berhasil</b>\n\n"
            "Order ID: <code>#{order_id}</code>\n"
            "Produk: <b>{product}</b> ({plan})\n"
            "Total Terpotong: <b>{price}</b>\n\n"
            "Pesanan sedang diproses otomatis. Detail akun/akses akan segera dikirimkan ke chat ini.\n"
            "Jika ada kendala, hubungi admin @{support}."
        ),
        
        "wallet_text": (
            "<b>My Wallet</b>\n\n"
            "User ID: <code>{user_id}</code>\n"
            "Saldo Saat Ini: <b>{balance}</b>\n\n"
            "Gunakan saldo wallet untuk pembelian otomatis dan instan tanpa antri."
        ),
        "deposit_text": (
            "<b>Top Up Saldo</b>\n\n"
            "Pilih nominal top up di bawah atau hubungi admin CS:"
        ),
        
        "orders_empty": "<b>My Orders</b>\n\nBelum ada pesanan.",
        "orders_list": "<b>My Orders</b>\n\n{list}",
        
        "profile_text": (
            "<b>Profile</b>\n\n"
            "User ID: <code>{user_id}</code>\n"
            "Username: @{username}\n"
            "Saldo Wallet: <b>{balance}</b>\n"
            "Total Pesanan: <b>{total_orders}</b>\n"
            "Bahasa: <b>Bahasa Indonesia</b>"
        ),
        
        "referral_text": (
            "<b>Program Referral</b>\n\n"
            "Ajak teman kamu ke ZELVA AI dan dapatkan <b>komisi 5%</b> dari setiap pembelian mereka.\n\n"
            "Link Referral Kamu:\n"
            "<code>{link}</code>\n\n"
            "Statistik:\n"
            "• Teman Terdaftar: <b>{count} Orang</b>\n"
            "• Total Komisi: <b>{earnings}</b>"
        ),
        
        "promotions_text": (
            "<b>Promotions</b>\n\n"
            "Promo Aktif:\n"
            "• <b>ZELVA10</b> — Diskon 10% semua produk AI.\n"
            "• <b>Paket Duo ChatGPT + Claude</b> — Potongan harga spesial.\n\n"
            "Hubungi admin @{support} untuk klaim voucher."
        ),
        
        "support_text": (
            "<b>Customer Support</b>\n\n"
            "Butuh bantuan pesanan, panduan login, atau klaim garansi?\n"
            "Tim support resmi kami siap melayani 24/7.\n\n"
            "Admin CS: @{support}\n"
            "Waktu Respon: 1-5 Menit"
        ),
        
        "faq_text": (
            "<b>FAQ</b>\n\n"
            "<b>Bagaimana cara membeli?</b>\n"
            "Pilih menu Products, pilih aplikasi yang diinginkan, pilih paket, lalu selesaikan pembayaran.\n\n"
            "<b>Berapa lama proses pengiriman?</b>\n"
            "Pesanan diproses instan dalam 1-5 menit.\n\n"
            "<b>Apakah ada garansi?</b>\n"
            "Ya, garansi 100% full replacement selama durasi langganan aktif.\n\n"
            "<b>Bagaimana menghubungi CS?</b>\n"
            "Klik tombol Support untuk chat langsung dengan admin @{support}."
        ),
        
        "language_text": "<b>Language / Bahasa</b>\n\nPilih bahasa yang ingin digunakan:",
        "lang_updated": "Bahasa berhasil diubah ke Bahasa Indonesia.",
        
        "about_text": (
            "<b>ZELVA AI</b>\n\nToko digital global untuk AI tools, produk digital, dan langganan online.\n\nBot: @{bot}\nSupport: @{support}"
        )
    }
}

def t(key: str, lang: str = "en", **kwargs) -> str:
    lang_dict = MESSAGES.get(lang, MESSAGES["en"])
    template = lang_dict.get(key, MESSAGES["en"].get(key, key))
    if kwargs:
        try:
            return template.format(**kwargs)
        except Exception:
            return template
    return template

def format_price(amount_usd: float, amount_idr: int, lang: str = "en") -> str:
    if lang == "id":
        return f"Rp {amount_idr:,}".replace(",", ".")
    return f"${amount_usd:.2f}"
