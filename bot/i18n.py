"""
ZELVA AI - Multi-Language Strings Localization
10 Supported Languages matching Dragon Store Bot (@dragonstorez_bot)
Configured with Telegram Premium Custom Emojis (<tg-emoji>)
"""

LANGUAGES = {
    "en": {"flag": "🇬🇧", "name": "English"},
    "fr": {"flag": "🇫🇷", "name": "Français"},
    "ar": {"flag": "🇸🇦", "name": "العربية"},
    "zh": {"flag": "🇨🇳", "name": "简体中文"},
    "vi": {"flag": "🇻🇳", "name": "Tiếng Việt"},
    "ru": {"flag": "🇷🇺", "name": "Русский"},
    "id": {"flag": "🇮🇩", "name": "Bahasa Indonesia"},
    "hi": {"flag": "🇮🇳", "name": "हिन्दी"},
    "es": {"flag": "🇪🇸", "name": "Español"},
    "th": {"flag": "🇹🇭", "name": "ไทย"},
}

# Custom Emoji IDs
E_WELCOME = '<tg-emoji emoji-id="5330237710655306682">🌌</tg-emoji>'
E_PRODUCTS = '<tg-emoji emoji-id="5312361253610475399">🛍️</tg-emoji>'
E_WALLET = '<tg-emoji emoji-id="5287780412746120236">💰</tg-emoji>'
E_DIAMOND = '<tg-emoji emoji-id="5287780412746120236">💎</tg-emoji>'
E_PRICE = '<tg-emoji emoji-id="5287780412746120236">💵</tg-emoji>'
E_PROFILE = '<tg-emoji emoji-id="6017118468661317152">👤</tg-emoji>'
E_HISTORY = '<tg-emoji emoji-id="5431721976769027887">📜</tg-emoji>'
E_LANGUAGE = '<tg-emoji emoji-id="5287292843763713628">🌐</tg-emoji>'
E_SUPPORT = '<tg-emoji emoji-id="6181322172263308706">❗</tg-emoji>'
E_WARNING = '<tg-emoji emoji-id="6181322172263308706">⚠️</tg-emoji>'
E_CHECK = '<tg-emoji emoji-id="6102856637343600044">✅</tg-emoji>'
E_VERIFIED = '<tg-emoji emoji-id="6102856637343600044">☑️</tg-emoji>'
E_SHIELD = '<tg-emoji emoji-id="6102856637343600044">🛡️</tg-emoji>'
E_BOX = '<tg-emoji emoji-id="5312361253610475399">📦</tg-emoji>'
E_KEY = '<tg-emoji emoji-id="5979047775470358891">🔑</tg-emoji>'
E_FORMAT = '<tg-emoji emoji-id="5796209712009581332">📋</tg-emoji>'
E_ROBOT = '<tg-emoji emoji-id="5877651964208091297">🤖</tg-emoji>'
E_ID = '<tg-emoji emoji-id="5431721976769027887">🆔</tg-emoji>'
E_CALENDAR = '<tg-emoji emoji-id="5431721976769027887">📅</tg-emoji>'
E_CLOCK = '<tg-emoji emoji-id="5431721976769027887">⏰</tg-emoji>'

MESSAGES = {
    "en": {
        "start_text": f"{E_WELCOME} <b>Welcome to {{bot_name}} !</b>\n\n📢 <b>Official Channel:</b> @{{channel_username}}\n💬 <b>Support:</b> @{{support_username}}\n\nPlease choose an option below to get started:",
        "btn_products": "Products",
        "btn_wallet": "My Wallet",
        "btn_profile": "My Profile",
        "btn_history": "History",
        "btn_referral": "Referral",
        "btn_language": "Language",
        "btn_support": "Support",
        "btn_back_menu": "Back to Menu",
        "btn_back_products": "Back to Products",
        "btn_back": "Back",
        "catalog_text": f"{E_PRODUCTS} <b>Select a Product Category:</b>\n<i>Please choose one of the services below to view available plans and pricing:</i>",
        "product_plans_prompt": f"{E_ROBOT} <b>{{name}} Plans & Pricing:</b>\n<i>Please choose a plan below to view details and purchase:</i>",
        "plan_detail": f"{E_ROBOT} <b>{{product}} - {{plan}}</b>\n{E_PRICE} <b>Price:</b> {{price}}\n{E_SHIELD} <b>Warranty:</b> Full day\n{E_BOX} <b>Stock:</b> {{stock}} accounts\n{E_PRODUCTS} <b>Sold:</b> {{sold}} accounts\n\n<b>Description:</b>\n{E_KEY} Plan: {{plan}} Subscription\n{E_KEY} Type: Pre-made Account (Ready to use)\n{E_FORMAT} Format: Email | Password | 2FA\n{E_KEY} Access: Full Access / Instant Delivery",
        "wallet_text": f"{E_WALLET} <b>Your Wallet</b>\n\n{E_DIAMOND} <b>Balance:</b> {{balance}} USDT\n\n{E_PRODUCTS} <b>Total Purchases:</b> {{orders_count}} Orders ({{total_spent}} USDT)\n\n{E_WALLET} <b>Total Deposits:</b> {{deposits_count}} Deposits ({{total_deposited}} USDT)\n\n<i>Choose an option to top up your wallet:</i>",
        "profile_text": f"{E_PROFILE} <b>My Profile</b>\n\n{E_PROFILE} <b>Username:</b> @{{username}} {E_VERIFIED}\n\n{E_ID} <b>User ID:</b> <code>{{user_id}}</code>\n\n{E_DIAMOND} <b>Balance:</b> {{balance}} USDT\n\n{E_LANGUAGE} <b>Language:</b> {{flag}} {{lang_name}}\n\n{E_CALENDAR} <b>Registered:</b> {{created_at}}",
        "history_empty": f"{E_HISTORY} <b>Order History</b>\n\n<i>You haven't made any purchases yet.</i>",
        "history_list": f"{E_HISTORY} <b>Order History</b>\n\n{{list}}",
        "language_text": f"{E_LANGUAGE} <b>Choose your language:</b>",
        "lang_updated": "Language updated to English.",
        "support_text": f"{E_SUPPORT} <b>Customer Support</b>\n\nIf you need assistance, have questions about your order, or encounter any issues, please contact our support team:\n\n{E_CLOCK} <b>Support Hours:</b> 24/7 Available",
        "insufficient_balance": f"{E_WARNING} <b>Insufficient Balance</b>\n\nYour balance: <b>{{balance}} USDT</b>\nRequired: <b>{{required}} USDT</b>\n\nPlease top up your wallet to complete this purchase.",
        "order_success": f"{E_CHECK} <b>Purchase Successful!</b>\n\nOrder ID: <code>#{{order_id}}</code>\nProduct: <b>{{product}}</b> ({{plan}})\nQuantity: <b>{{qty}}</b>\nTotal Amount: <b>{{price}}</b>\n\n{E_BOX} <b>Account Credentials / Access:</b>\n<code>{{credentials}}</code>\n\nThank you for shopping with us! If you need warranty support, contact @{{support}}."
    },
    "fr": {
        "start_text": f"{E_WELCOME} <b>Bienvenue sur {{bot_name}} !</b>\n\n📢 <b>Canal Officiel :</b> @{{channel_username}}\n💬 <b>Support :</b> @{{support_username}}\n\nVeuillez choisir une option ci-dessous pour commencer :",
        "btn_products": "Products",
        "btn_wallet": "My Wallet",
        "btn_profile": "My Profile",
        "btn_history": "History",
        "btn_referral": "Parrainage",
        "btn_language": "Language",
        "btn_support": "Support",
        "btn_back_menu": "Back to Menu",
        "btn_back_products": "Back to Products",
        "btn_back": "Back",
        "catalog_text": f"{E_PRODUCTS} <b>Sélectionnez une catégorie :</b>\n<i>Veuillez choisir un service ci-dessous pour voir les formules et tarifs :</i>",
        "product_plans_prompt": f"{E_ROBOT} <b>Formules et tarifs {{name}} :</b>\n<i>Veuillez choisir une formule pour voir les détails et acheter :</i>",
        "plan_detail": f"{E_ROBOT} <b>{{product}} - {{plan}}</b>\n{E_PRICE} <b>Prix :</b> {{price}}\n{E_SHIELD} <b>Garantie :</b> Journée complète\n{E_BOX} <b>Stock :</b> {{stock}} comptes\n{E_PRODUCTS} <b>Vendus :</b> {{sold}} comptes\n\n<b>Description :</b>\n{E_KEY} Formule : Abonnement {{plan}}\n{E_KEY} Type : Compte pré-configuré (Prêt à l'emploi)\n{E_FORMAT} Format : Email | Mot de passe | 2FA\n{E_KEY} Accès : Accès complet / Livraison instantanée",
        "wallet_text": f"{E_WALLET} <b>Votre Portefeuille</b>\n\n{E_DIAMOND} <b>Solde :</b> {{balance}} USDT\n\n{E_PRODUCTS} <b>Total des achats :</b> {{orders_count}} Commandes ({{total_spent}} USDT)\n\n{E_WALLET} <b>Total des dépôts :</b> {{deposits_count}} Dépôts ({{total_deposited}} USDT)\n\n<i>Choisissez une option pour recharger votre portefeuille :</i>",
        "profile_text": f"{E_PROFILE} <b>Mon Profil</b>\n\n{E_PROFILE} <b>Nom d'utilisateur :</b> @{{username}} {E_VERIFIED}\n\n{E_ID} <b>ID Utilisateur :</b> <code>{{user_id}}</code>\n\n{E_DIAMOND} <b>Solde :</b> {{balance}} USDT\n\n{E_LANGUAGE} <b>Langue :</b> {{flag}} {{lang_name}}\n\n{E_CALENDAR} <b>Inscrit le :</b> {{created_at}}",
        "history_empty": f"{E_HISTORY} <b>Historique des commandes</b>\n\n<i>Vous n'avez pas encore effectué d'achat.</i>",
        "history_list": f"{E_HISTORY} <b>Historique des commandes</b>\n\n{{list}}",
        "language_text": f"{E_LANGUAGE} <b>Choisissez votre langue :</b>",
        "lang_updated": "Langue mise à jour en Français.",
        "support_text": f"{E_SUPPORT} <b>Service Client</b>\n\nSi vous avez besoin d'aide ou des questions, contactez notre équipe :\n\n{E_CLOCK} <b>Horaires :</b> Disponible 24/7",
        "insufficient_balance": f"{E_WARNING} <b>Solde Insuffisant</b>\n\nVotre solde : <b>{{balance}} USDT</b>\nRequis : <b>{{required}} USDT</b>\n\nVeuillez recharger votre portefeuille.",
        "order_success": f"{E_CHECK} <b>Achat Réussi !</b>\n\nID Commande : <code>#{{order_id}}</code>\nProduit : <b>{{product}}</b> ({{plan}})\nQuantité : <b>{{qty}}</b>\nTotal : <b>{{price}}</b>\n\n{E_BOX} <b>Identifiants / Accès :</b>\n<code>{{credentials}}</code>\n\nMerci de votre confiance ! Support : @{{support}}."
    },
    "ar": {
        "start_text": f"{E_WELCOME} <b>مرحبًا بك في {{bot_name}} !</b>\n\n📢 <b>القناة الرسمية :</b> @{{channel_username}}\n💬 <b>الدعم الفني :</b> @{{support_username}}\n\nيرجى اختيار أحد الخيارات أدناه للبدء:",
        "btn_products": "Products",
        "btn_wallet": "My Wallet",
        "btn_profile": "My Profile",
        "btn_history": "History",
        "btn_referral": "الإحالة",
        "btn_language": "Language",
        "btn_support": "Support",
        "btn_back_menu": "Back to Menu",
        "btn_back_products": "Back to Products",
        "btn_back": "Back",
        "catalog_text": f"{E_PRODUCTS} <b>اختر فئة المنتج:</b>\n<i>يرجى اختيار إحدى الخدمات أدناه لعرض الخطط والأسعار المتاحة:</i>",
        "product_plans_prompt": f"{E_ROBOT} <b>خطط وأسعار {{name}}:</b>\n<i>يرجى اختيار خطة أدناه لعرض التفاصيل والشراء:</i>",
        "plan_detail": f"{E_ROBOT} <b>{{product}} - {{plan}}</b>\n{E_PRICE} <b>السعر:</b> {{price}}\n{E_SHIELD} <b>الضمان:</b> يوم كامل\n{E_BOX} <b>المخزون:</b> {{stock}} حساب\n{E_PRODUCTS} <b>المباع:</b> {{sold}} حساب\n\n<b>الوصف:</b>\n{E_KEY} الخطة: اشتراك {{plan}}\n{E_KEY} النوع: حساب جاهز للاستخدام\n{E_FORMAT} التنسيق: بريد إلكتروني | كلمة مرور | 2FA\n{E_KEY} الوصول: وصول كامل / تسليم فوري",
        "wallet_text": f"{E_WALLET} <b>محفظتك</b>\n\n{E_DIAMOND} <b>الرصيد:</b> {{balance}} USDT\n\n{E_PRODUCTS} <b>إجمالي المشتريات:</b> {{orders_count}} طلبات ({{total_spent}} USDT)\n\n{E_WALLET} <b>إجمالي الإيداعات:</b> {{deposits_count}} إيداعات ({{total_deposited}} USDT)\n\n<i>اختر خيارًا لشحن محفظتك:</i>",
        "profile_text": f"{E_PROFILE} <b>ملفي الشخصي</b>\n\n{E_PROFILE} <b>اسم المستخدم:</b> @{{username}} {E_VERIFIED}\n\n{E_ID} <b>معرف المستخدم:</b> <code>{{user_id}}</code>\n\n{E_DIAMOND} <b>الرصيد:</b> {{balance}} USDT\n\n{E_LANGUAGE} <b>اللغة:</b> {{flag}} {{lang_name}}\n\n{E_CALENDAR} <b>تاريخ التسجيل:</b> {{created_at}}",
        "history_empty": f"{E_HISTORY} <b>سجل الطلبات</b>\n\n<i>لم تقم بأي عمليات شراء بعد.</i>",
        "history_list": f"{E_HISTORY} <b>سجل الطلبات</b>\n\n{{list}}",
        "language_text": f"{E_LANGUAGE} <b>اختر لغتك:</b>",
        "lang_updated": "تم تغيير اللغة إلى العربية.",
        "support_text": f"{E_SUPPORT} <b>خدمة العملاء</b>\n\nإذا كنت بحاجة إلى مساعدة، تواصل مع فريق الدعم:\n\n{E_CLOCK} <b>ساعات العمل:</b> متاح 24/7",
        "insufficient_balance": f"{E_WARNING} <b>الرصيد غير كافٍ</b>\n\nرصيدك: <b>{{balance}} USDT</b>\nالمطلوب: <b>{{required}} USDT</b>\n\nيرجى شحن محفظتك.",
        "order_success": f"{E_CHECK} <b>تم الشراء بنجاح!</b>\n\nرقم الطلب: <code>#{{order_id}}</code>\nالمنتج: <b>{{product}}</b> ({{plan}})\nالكمية: <b>{{qty}}</b>\nالإجمالي: <b>{{price}}</b>\n\n{E_BOX} <b>بيانات الحساب / الوصول:</b>\n<code>{{credentials}}</code>\n\nشكرًا لتسوقك معنا! للدعم: @{{support}}."
    },
    "zh": {
        "start_text": f"{E_WELCOME} <b>欢迎来到 {{bot_name}} ！</b>\n\n📢 <b>官方频道：</b> @{{channel_username}}\n💬 <b>在线客服：</b> @{{support_username}}\n\n请在下方选择一个选项开始：",
        "btn_products": "Products",
        "btn_wallet": "My Wallet",
        "btn_profile": "My Profile",
        "btn_history": "History",
        "btn_referral": "推荐奖励",
        "btn_language": "Language",
        "btn_support": "Support",
        "btn_back_menu": "Back to Menu",
        "btn_back_products": "Back to Products",
        "btn_back": "Back",
        "catalog_text": f"{E_PRODUCTS} <b>选择产品类别：</b>\n<i>请在下方选择一项服务以查看套餐与价格：</i>",
        "product_plans_prompt": f"{E_ROBOT} <b>{{name}} 套餐与价格：</b>\n<i>请选择下方套餐以查看详情并购买：</i>",
        "plan_detail": f"{E_ROBOT} <b>{{product}} - {{plan}}</b>\n{E_PRICE} <b>价格：</b> {{price}}\n{E_SHIELD} <b>保修：</b> 全天质保\n{E_BOX} <b>库存：</b> {{stock}} 个账号\n{E_PRODUCTS} <b>已售：</b> {{sold}} 个账号\n\n<b>描述：</b>\n{E_KEY} 套餐：{{plan}} 订阅\n{E_KEY} 类型：现成账号（即买即用）\n{E_FORMAT} 格式：邮箱 | 密码 | 2FA\n{E_KEY} 权限：独享全权 / 自动即时发货",
        "wallet_text": f"{E_WALLET} <b>我的钱包</b>\n\n{E_DIAMOND} <b>余额：</b> {{balance}} USDT\n\n{E_PRODUCTS} <b>总购买：</b> {{orders_count}} 笔订单 ({{total_spent}} USDT)\n\n{E_WALLET} <b>总充值：</b> {{deposits_count}} 笔 ({{total_deposited}} USDT)\n\n<i>请选择充值方式：</i>",
        "profile_text": f"{E_PROFILE} <b>个人中心</b>\n\n{E_PROFILE} <b>用户名：</b> @{{username}} {E_VERIFIED}\n\n{E_ID} <b>用户ID：</b> <code>{{user_id}}</code>\n\n{E_DIAMOND} <b>余额：</b> {{balance}} USDT\n\n{E_LANGUAGE} <b>语言：</b> {{flag}} {{lang_name}}\n\n{E_CALENDAR} <b>注册时间：</b> {{created_at}}",
        "history_empty": f"{E_HISTORY} <b>购买历史</b>\n\n<i>您尚未购买过任何产品。</i>",
        "history_list": f"{E_HISTORY} <b>购买历史</b>\n\n{{list}}",
        "language_text": f"{E_LANGUAGE} <b>选择您的语言：</b>",
        "lang_updated": "语言已更新为简体中文。",
        "support_text": f"{E_SUPPORT} <b>客户支持</b>\n\n如果您需要帮助或有任何疑问，请联系我们的客服团队：\n\n{E_CLOCK} <b>在线时间：</b> 24/7 全天候",
        "insufficient_balance": f"{E_WARNING} <b>余额不足</b>\n\n当前余额：<b>{{balance}} USDT</b>\n所需金额：<b>{{required}} USDT</b>\n\n请先充值您的钱包。",
        "order_success": f"{E_CHECK} <b>购买成功！</b>\n\n订单号：<code>#{{order_id}}</code>\n商品：<b>{{product}}</b> ({{plan}})\n数量：<b>{{qty}}</b>\n总计：<b>{{price}}</b>\n\n{E_BOX} <b>账号信息 / 卡密：</b>\n<code>{{credentials}}</code>\n\n感谢您的惠顾！售后支持：@{{support}}."
    },
    "vi": {
        "start_text": f"{E_WELCOME} <b>Chào mừng bạn đến với {{bot_name}} !</b>\n\n📢 <b>Kênh chính thức:</b> @{{channel_username}}\n💬 <b>Hỗ trợ:</b> @{{support_username}}\n\nVui lòng chọn một tùy chọn bên dưới để bắt đầu:",
        "btn_products": "Products",
        "btn_wallet": "My Wallet",
        "btn_profile": "My Profile",
        "btn_history": "History",
        "btn_referral": "Giới thiệu",
        "btn_language": "Language",
        "btn_support": "Support",
        "btn_back_menu": "Back to Menu",
        "btn_back_products": "Back to Products",
        "btn_back": "Back",
        "catalog_text": f"{E_PRODUCTS} <b>Chọn danh mục sản phẩm:</b>\n<i>Vui lòng chọn một dịch vụ bên dưới để xem các gói và giá:</i>",
        "product_plans_prompt": f"{E_ROBOT} <b>Gói dịch vụ & Giá {{name}}:</b>\n<i>Vui lòng chọn gói bên dưới để xem chi tiết và mua hàng:</i>",
        "plan_detail": f"{E_ROBOT} <b>{{product}} - {{plan}}</b>\n{E_PRICE} <b>Giá:</b> {{price}}\n{E_SHIELD} <b>Bảo hành:</b> Toàn thời gian\n{E_BOX} <b>Kho:</b> {{stock}} tài khoản\n{E_PRODUCTS} <b>Đã bán:</b> {{sold}} tài khoản\n\n<b>Mô tả:</b>\n{E_KEY} Gói: Đăng ký {{plan}}\n{E_KEY} Loại: Tài khoản sẵn có (Sử dụng ngay)\n{E_FORMAT} Định dạng: Email | Mật khẩu | 2FA\n{E_KEY} Quyền truy cập: Toàn quyền / Giao hàng tự động",
        "wallet_text": f"{E_WALLET} <b>Ví của bạn</b>\n\n{E_DIAMOND} <b>Số dư:</b> {{balance}} USDT\n\n{E_PRODUCTS} <b>Tổng đơn hàng:</b> {{orders_count}} Đơn ({{total_spent}} USDT)\n\n{E_WALLET} <b>Tổng nạp:</b> {{deposits_count}} Lần ({{total_deposited}} USDT)\n\n<i>Chọn phương thức để nạp tiền vào ví:</i>",
        "profile_text": f"{E_PROFILE} <b>Hồ sơ của tôi</b>\n\n{E_PROFILE} <b>Tên người dùng:</b> @{{username}} {E_VERIFIED}\n\n{E_ID} <b>ID Người dùng:</b> <code>{{user_id}}</code>\n\n{E_DIAMOND} <b>Số dư:</b> {{balance}} USDT\n\n{E_LANGUAGE} <b>Ngôn ngữ:</b> {{flag}} {{lang_name}}\n\n{E_CALENDAR} <b>Ngày đăng ký:</b> {{created_at}}",
        "history_empty": f"{E_HISTORY} <b>Lịch sử đơn hàng</b>\n\n<i>Bạn chưa thực hiện giao dịch nào.</i>",
        "history_list": f"{E_HISTORY} <b>Lịch sử đơn hàng</b>\n\n{{list}}",
        "language_text": f"{E_LANGUAGE} <b>Chọn ngôn ngữ của bạn:</b>",
        "lang_updated": "Đã cập nhật ngôn ngữ sang Tiếng Việt.",
        "support_text": f"{E_SUPPORT} <b>Hỗ trợ khách hàng</b>\n\nNếu bạn cần trợ giúp hoặc có thắc mắc, vui lòng liên hệ đội ngũ hỗ trợ:\n\n{E_CLOCK} <b>Thời gian hỗ trợ:</b> 24/7 Trực tuyến",
        "insufficient_balance": f"{E_WARNING} <b>Số dư không đủ</b>\n\nSố dư của bạn: <b>{{balance}} USDT</b>\nYêu cầu: <b>{{required}} USDT</b>\n\nVui lòng nạp thêm tiền vào ví.",
        "order_success": f"{E_CHECK} <b>Mua hàng thành công!</b>\n\nMã đơn hàng: <code>#{{order_id}}</code>\nSản phẩm: <b>{{product}}</b> ({{plan}})\nSố lượng: <b>{{qty}}</b>\nTổng thanh toán: <b>{{price}}</b>\n\n{E_BOX} <b>Thông tin tài khoản / Đăng nhập:</b>\n<code>{{credentials}}</code>\n\nCảm ơn quý khách! Hỗ trợ: @{{support}}."
    },
    "ru": {
        "start_text": f"{E_WELCOME} <b>Добро пожаловать в {{bot_name}} !</b>\n\n📢 <b>Официальный канал:</b> @{{channel_username}}\n💬 <b>Поддержка:</b> @{{support_username}}\n\nПожалуйста, выберите нужный пункт меню ниже:",
        "btn_products": "Products",
        "btn_wallet": "My Wallet",
        "btn_profile": "My Profile",
        "btn_history": "History",
        "btn_referral": "Рефералы",
        "btn_language": "Language",
        "btn_support": "Support",
        "btn_back_menu": "Back to Menu",
        "btn_back_products": "Back to Products",
        "btn_back": "Back",
        "catalog_text": f"{E_PRODUCTS} <b>Выберите категорию товаров :</b>\n<i>Выберите сервис ниже, чтобы просмотреть доступные тарифы и цены:</i>",
        "product_plans_prompt": f"{E_ROBOT} <b>Тарифы и цены {{name}} :</b>\n<i>Выберите тариф ниже для просмотра подробностей и покупки:</i>",
        "plan_detail": f"{E_ROBOT} <b>{{product}} - {{plan}}</b>\n{E_PRICE} <b>Цена :</b> {{price}}\n{E_SHIELD} <b>Гарантия :</b> Полный срок\n{E_BOX} <b>В наличии :</b> {{stock}} аккаунтов\n{E_PRODUCTS} <b>Продано :</b> {{sold}} аккаунтов\n\n<b>Описание :</b>\n{E_KEY} Тариф : Подписка {{plan}}\n{E_KEY} Тип : Готовый аккаунт (Сразу к использованию)\n{E_FORMAT} Формат : Email | Пароль | 2FA\n{E_KEY} Доступ : Полный доступ / Моментальная выдача",
        "wallet_text": f"{E_WALLET} <b>Ваш кошелек</b>\n\n{E_DIAMOND} <b>Баланс :</b> {{balance}} USDT\n\n{E_PRODUCTS} <b>Всего покупок :</b> {{orders_count}} заказов ({{total_spent}} USDT)\n\n{E_WALLET} <b>Всего пополнений :</b> {{deposits_count}} ({{total_deposited}} USDT)\n\n<i>Выберите способ пополнения кошелька :</i>",
        "profile_text": f"{E_PROFILE} <b>Мой профиль</b>\n\n{E_PROFILE} <b>Имя пользователя :</b> @{{username}} {E_VERIFIED}\n\n{E_ID} <b>ID пользователя :</b> <code>{{user_id}}</code>\n\n{E_DIAMOND} <b>Баланс :</b> {{balance}} USDT\n\n{E_LANGUAGE} <b>Язык :</b> {{flag}} {{lang_name}}\n\n{E_CALENDAR} <b>Регистрация :</b> {{created_at}}",
        "history_empty": f"{E_HISTORY} <b>История заказов</b>\n\n<i>У вас пока нет покупок.</i>",
        "history_list": f"{E_HISTORY} <b>История заказов</b>\n\n{{list}}",
        "language_text": f"{E_LANGUAGE} <b>Выберите язык :</b>",
        "lang_updated": "Язык изменен на Русский.",
        "support_text": f"{E_SUPPORT} <b>Служба поддержки</b>\n\nЕсли вам нужна помощь или возникли вопросы, свяжитесь с поддержкой:\n\n{E_CLOCK} <b>Время работы :</b> 24/7 онлайн",
        "insufficient_balance": f"{E_WARNING} <b>Недостаточно средств</b>\n\nВаш баланс : <b>{{balance}} USDT</b>\nТребуется : <b>{{required}} USDT</b>\n\nПожалуйста, пополните кошелек.",
        "order_success": f"{E_CHECK} <b>Оплата прошла успешно!</b>\n\nЗаказ : <code>#{{order_id}}</code>\nТовар : <b>{{product}}</b> ({{plan}})\nКоличество : <b>{{qty}}</b>\nСумма : <b>{{price}}</b>\n\n{E_BOX} <b>Данные аккаунта / Ключ :</b>\n<code>{{credentials}}</code>\n\nСпасибо за покупку! Поддержка : @{{support}}."
    },
    "id": {
        "start_text": f"{E_WELCOME} <b>Selamat Datang di {{bot_name}} !</b>\n\n📢 <b>Official Channel:</b> @{{channel_username}}\n💬 <b>Bantuan Support:</b> @{{support_username}}\n\nSilakan pilih menu di bawah ini untuk memulai:",
        "btn_products": "Products",
        "btn_wallet": "My Wallet",
        "btn_profile": "My Profile",
        "btn_history": "History",
        "btn_referral": "Referral",
        "btn_language": "Language",
        "btn_support": "Support",
        "btn_back_menu": "Back to Menu",
        "btn_back_products": "Back to Products",
        "btn_back": "Back",
        "catalog_text": f"{E_PRODUCTS} <b>Pilih Kategori Produk:</b>\n<i>Silakan pilih salah satu layanan di bawah ini untuk melihat paket & harga:</i>",
        "product_plans_prompt": f"{E_ROBOT} <b>Paket & Harga {{name}}:</b>\n<i>Silakan pilih paket di bawah ini untuk melihat detail dan membeli:</i>",
        "plan_detail": f"{E_ROBOT} <b>{{product}} - {{plan}}</b>\n{E_PRICE} <b>Harga:</b> {{price}}\n{E_SHIELD} <b>Garansi:</b> Full day\n{E_BOX} <b>Stok:</b> {{stock}} akun\n{E_PRODUCTS} <b>Terjual:</b> {{sold}} akun\n\n<b>Deskripsi:</b>\n{E_KEY} Paket: Langganan {{plan}}\n{E_KEY} Tipe: Akun Siap Pakai (Ready to use)\n{E_FORMAT} Format: Email | Password | 2FA\n{E_KEY} Akses: Full Access / Pengiriman Instan",
        "wallet_text": f"{E_WALLET} <b>Dompet Kamu</b>\n\n{E_DIAMOND} <b>Saldo:</b> {{balance}} USDT\n\n{E_PRODUCTS} <b>Total Pembelian:</b> {{orders_count}} Pesanan ({{total_spent}} USDT)\n\n{E_WALLET} <b>Total Deposit:</b> {{deposits_count}} Deposit ({{total_deposited}} USDT)\n\n<i>Pilih metode untuk isi ulang dompet kamu:</i>",
        "profile_text": f"{E_PROFILE} <b>Profil Saya</b>\n\n{E_PROFILE} <b>Username:</b> @{{username}} {E_VERIFIED}\n\n{E_ID} <b>User ID:</b> <code>{{user_id}}</code>\n\n{E_DIAMOND} <b>Saldo:</b> {{balance}} USDT\n\n{E_LANGUAGE} <b>Bahasa:</b> {{flag}} {{lang_name}}\n\n{E_CALENDAR} <b>Terdaftar:</b> {{created_at}}",
        "history_empty": f"{E_HISTORY} <b>Riwayat Pesanan</b>\n\n<i>Kamu belum memiliki riwayat pembelian.</i>",
        "history_list": f"{E_HISTORY} <b>Riwayat Pesanan</b>\n\n{{list}}",
        "language_text": f"{E_LANGUAGE} <b>Pilih bahasa kamu:</b>",
        "lang_updated": "Bahasa berhasil diubah ke Bahasa Indonesia.",
        "support_text": f"{E_SUPPORT} <b>Layanan Pelanggan</b>\n\nJika kamu membutuhkan bantuan atau pertanyaan, silakan hubungi tim support kami:\n\n{E_CLOCK} <b>Jam Operasional:</b> 24/7 Online",
        "insufficient_balance": f"{E_WARNING} <b>Saldo Tidak Mencukupi</b>\n\nSaldo kamu: <b>{{balance}} USDT</b>\nDibutuhkan: <b>{{required}} USDT</b>\n\nSilakan top up dompet kamu terlebih dahulu.",
        "order_success": f"{E_CHECK} <b>Pembelian Berhasil!</b>\n\nOrder ID: <code>#{{order_id}}</code>\nProduk: <b>{{product}}</b> ({{plan}})\nJumlah: <b>{{qty}}</b>\nTotal: <b>{{price}}</b>\n\n{E_BOX} <b>Akses / Akun:</b>\n<code>{{credentials}}</code>\n\nTerima kasih telah berbelanja! Bantuan: @{{support}}."
    },
    "hi": {
        "start_text": f"{E_WELCOME} <b>{{bot_name}} में आपका स्वागत है !</b>\n\n📢 <b>आधिकारिक चैनल:</b> @{{channel_username}}\n💬 <b>सहायता:</b> @{{support_username}}\n\nकृपया शुरू करने के लिए नीचे दिए गए विकल्पों में से चुनें:",
        "btn_products": "Products",
        "btn_wallet": "My Wallet",
        "btn_profile": "My Profile",
        "btn_history": "History",
        "btn_referral": "रेफ़रल",
        "btn_language": "Language",
        "btn_support": "Support",
        "btn_back_menu": "Back to Menu",
        "btn_back_products": "Back to Products",
        "btn_back": "Back",
        "catalog_text": f"{E_PRODUCTS} <b>उत्पाद श्रेणी चुनें:</b>\n<i>उपलब्ध प्लान और मूल्य देखने के लिए नीचे दी गई सेवाओं में से चुनें:</i>",
        "product_plans_prompt": f"{E_ROBOT} <b>{{name}} प्लान और कीमतें:</b>\n<i>विवरण देखने और खरीदने के लिए नीचे एक प्लान चुनें:</i>",
        "plan_detail": f"{E_ROBOT} <b>{{product}} - {{plan}}</b>\n{E_PRICE} <b>मूल्य:</b> {{price}}\n{E_SHIELD} <b>वारंटी:</b> पूर्ण दिवस\n{E_BOX} <b>स्टॉक:</b> {{stock}} खाते\n{E_PRODUCTS} <b>बिक्री:</b> {{sold}} खाते\n\n<b>विवरण:</b>\n{E_KEY} प्लान: {{plan}} सदस्यता\n{E_KEY} प्रकार: तैयार खाता (तुरंत उपयोग योग्य)\n{E_FORMAT} प्रारूप: ईमेल | पासवर्ड | 2FA\n{E_KEY} एक्सेस: पूर्ण पहुंच / तत्काल डिलीवरी",
        "wallet_text": f"{E_WALLET} <b>आपका वॉलेट</b>\n\n{E_DIAMOND} <b>शेष राशि:</b> {{balance}} USDT\n\n{E_PRODUCTS} <b>कुल खरीदारी:</b> {{orders_count}} ऑर्डर ({{total_spent}} USDT)\n\n{E_WALLET} <b>कुल जमा:</b> {{deposits_count}} जमा ({{total_deposited}} USDT)\n\n<i>वॉलेट टॉप-अप करने के लिए विकल्प चुनें:</i>",
        "profile_text": f"{E_PROFILE} <b>मेरी प्रोफ़ाइल</b>\n\n{E_PROFILE} <b>उपयोगकर्ता नाम:</b> @{{username}} {E_VERIFIED}\n\n{E_ID} <b>उपयोगकर्ता ID:</b> <code>{{user_id}}</code>\n\n{E_DIAMOND} <b>शेष राशि:</b> {{balance}} USDT\n\n{E_LANGUAGE} <b>भाषा:</b> {{flag}} {{lang_name}}\n\n{E_CALENDAR} <b>पंजीकृत:</b> {{created_at}}",
        "history_empty": f"{E_HISTORY} <b>ऑर्डर इतिहास</b>\n\n<i>आपने अभी तक कोई खरीदारी नहीं की है।</i>",
        "history_list": f"{E_HISTORY} <b>ऑर्डर इतिहास</b>\n\n{{list}}",
        "language_text": f"{E_LANGUAGE} <b>अपनी भाषा चुनें:</b>",
        "lang_updated": "भाषा हिन्दी में अपडेट कर दी गई है।",
        "support_text": f"{E_SUPPORT} <b>ग्राहक सहायता</b>\n\nयदि आपको सहायता की आवश्यकता है या कोई प्रश्न हैं, तो संपर्क करें:\n\n{E_CLOCK} <b>सहायता समय:</b> 24/7 उपलब्ध",
        "insufficient_balance": f"{E_WARNING} <b>अपर्याप्त शेष राशि</b>\n\nआपकी शेष राशि: <b>{{balance}} USDT</b>\nआवश्यक: <b>{{required}} USDT</b>\n\nकृपया अपना वॉलेट रिचार्ज करें।",
        "order_success": f"{E_CHECK} <b>खरीदारी सफल!</b>\n\nऑर्डर ID: <code>#{{order_id}}</code>\nउत्पाद: <b>{{product}}</b> ({{plan}})\nमात्रा: <b>{{qty}}</b>\nकुल राशि: <b>{{price}}</b>\n\n{E_BOX} <b>खाता क्रेडेंशियल / एक्सेस:</b>\n<code>{{credentials}}</code>\n\nखरीदारी के लिए धन्यवाद! सहायता: @{{support}}."
    },
    "es": {
        "start_text": f"{E_WELCOME} <b>¡Bienvenido a {{bot_name}}!</b>\n\n📢 <b>Canal Oficial:</b> @{{channel_username}}\n💬 <b>Soporte:</b> @{{support_username}}\n\nElija una opción a continuación para comenzar:",
        "btn_products": "Products",
        "btn_wallet": "My Wallet",
        "btn_profile": "My Profile",
        "btn_history": "History",
        "btn_referral": "Referidos",
        "btn_language": "Language",
        "btn_support": "Support",
        "btn_back_menu": "Back to Menu",
        "btn_back_products": "Back to Products",
        "btn_back": "Back",
        "catalog_text": f"{E_PRODUCTS} <b>Seleccione una categoría de producto:</b>\n<i>Elija uno de los servicios a continuación para ver los planes y precios:</i>",
        "product_plans_prompt": f"{E_ROBOT} <b>Planes y precios de {{name}}:</b>\n<i>Elija un plan a continuación para ver detalles y comprar:</i>",
        "plan_detail": f"{E_ROBOT} <b>{{product}} - {{plan}}</b>\n{E_PRICE} <b>Precio:</b> {{price}}\n{E_SHIELD} <b>Garantía:</b> Día completo\n{E_BOX} <b>Stock:</b> {{stock}} cuentas\n{E_PRODUCTS} <b>Vendidos:</b> {{sold}} cuentas\n\n<b>Descripción:</b>\n{E_KEY} Plan: Suscripción {{plan}}\n{E_KEY} Tipo: Cuenta preconfigurada (Lista para usar)\n{E_FORMAT} Formato: Correo | Contraseña | 2FA\n{E_KEY} Acceso: Acceso total / Entrega instantánea",
        "wallet_text": f"{E_WALLET} <b>Tu Billetera</b>\n\n{E_DIAMOND} <b>Saldo:</b> {{balance}} USDT\n\n{E_PRODUCTS} <b>Compras totales:</b> {{orders_count}} Pedidos ({{total_spent}} USDT)\n\n{E_WALLET} <b>Depósitos totales:</b> {{deposits_count}} Depósitos ({{total_deposited}} USDT)\n\n<i>Elige una opción para recargar tu saldo:</i>",
        "profile_text": f"{E_PROFILE} <b>Mi Perfil</b>\n\n{E_PROFILE} <b>Usuario:</b> @{{username}} {E_VERIFIED}\n\n{E_ID} <b>ID de Usuario:</b> <code>{{user_id}}</code>\n\n{E_DIAMOND} <b>Saldo:</b> {{balance}} USDT\n\n{E_LANGUAGE} <b>Idioma:</b> {{flag}} {{lang_name}}\n\n{E_CALENDAR} <b>Registrado:</b> {{created_at}}",
        "history_empty": f"{E_HISTORY} <b>Historial de pedidos</b>\n\n<i>Aún no has realizado ninguna compra.</i>",
        "history_list": f"{E_HISTORY} <b>Historial de pedidos</b>\n\n{{list}}",
        "language_text": f"{E_LANGUAGE} <b>Elige tu idioma:</b>",
        "lang_updated": "Idioma actualizado a Español.",
        "support_text": f"{E_SUPPORT} <b>Atención al Cliente</b>\n\nSi necesitas ayuda o tienes preguntas, comunícate con soporte:\n\n{E_CLOCK} <b>Horario:</b> Disponible 24/7",
        "insufficient_balance": f"{E_WARNING} <b>Saldo Insuficiente</b>\n\nTu saldo: <b>{{balance}} USDT</b>\nRequerido: <b>{{required}} USDT</b>\n\nPor favor recarga tu saldo.",
        "order_success": f"{E_CHECK} <b>¡Compra Exitosa!</b>\n\nID Pedido: <code>#{{order_id}}</code>\nProducto: <b>{{product}}</b> ({{plan}})\nCantidad: <b>{{qty}}</b>\nTotal: <b>{{price}}</b>\n\n{E_BOX} <b>Credenciales / Acceso:</b>\n<code>{{credentials}}</code>\n\n¡Gracias por tu compra! Soporte: @{{support}}."
    },
    "th": {
        "start_text": f"{E_WELCOME} <b>ยินดีต้อนรับสู่ {{bot_name}} !</b>\n\n📢 <b>ช่องทางการ:</b> @{{channel_username}}\n💬 <b>ฝ่ายสนับสนุน:</b> @{{support_username}}\n\nโปรดเลือกเมนูด้านล่างเพื่อเริ่มต้น:",
        "btn_products": "Products",
        "btn_wallet": "My Wallet",
        "btn_profile": "My Profile",
        "btn_history": "History",
        "btn_referral": "แนะนำเพื่อน",
        "btn_language": "Language",
        "btn_support": "Support",
        "btn_back_menu": "Back to Menu",
        "btn_back_products": "Back to Products",
        "btn_back": "Back",
        "catalog_text": f"{E_PRODUCTS} <b>เลือกหมวดหมู่สินค้า:</b>\n<i>โปรดเลือกบริการด้านล่างเพื่อดูแพ็กเกจและราคา:</i>",
        "product_plans_prompt": f"{E_ROBOT} <b>แพ็กเกจและราคา {{name}}:</b>\n<i>โปรดเลือกแพ็กเกจด้านล่างเพื่อดูรายละเอียดและสั่งซื้อ:</i>",
        "plan_detail": f"{E_ROBOT} <b>{{product}} - {{plan}}</b>\n{E_PRICE} <b>ราคา:</b> {{price}}\n{E_SHIELD} <b>การรับประกัน:</b> ตลอดอายุการใช้งาน\n{E_BOX} <b>สต็อก:</b> {{stock}} บัญชี\n{E_PRODUCTS} <b>ขายแล้ว:</b> {{sold}} บัญชี\n\n<b>รายละเอียด:</b>\n{E_KEY} แพ็กเกจ: สมาชิก {{plan}}\n{E_KEY} ประเภท: บัญชีพร้อมใช้งาน (ใช้งานได้ทันที)\n{E_FORMAT} รูปแบบ: อีเมล | รหัสผ่าน | 2FA\n{E_KEY} การเข้าถึง: เข้าถึงได้เต็มรูปแบบ / จัดส่งอัตโนมัติ",
        "wallet_text": f"{E_WALLET} <b>กระเป๋าเงินของคุณ</b>\n\n{E_DIAMOND} <b>ยอดเงินคงเหลือ:</b> {{balance}} USDT\n\n{E_PRODUCTS} <b>ยอดสั่งซื้อทั้งหมด:</b> {{orders_count}} รายการ ({{total_spent}} USDT)\n\n{E_WALLET} <b>ยอดฝากทั้งหมด:</b> {{deposits_count}} รายการ ({{total_deposited}} USDT)\n\n<i>เลือกช่องทางเพื่อเติมเงินเข้ากระเป๋า:</i>",
        "profile_text": f"{E_PROFILE} <b>โปรไฟล์ของฉัน</b>\n\n{E_PROFILE} <b>ชื่อผู้ใช้:</b> @{{username}} {E_VERIFIED}\n\n{E_ID} <b>รหัสผู้ใช้:</b> <code>{{user_id}}</code>\n\n{E_DIAMOND} <b>ยอดเงินคงเหลือ:</b> {{balance}} USDT\n\n{E_LANGUAGE} <b>ภาษา:</b> {{flag}} {{lang_name}}\n\n{E_CALENDAR} <b>ลงทะเบียนเมื่อ:</b> {{created_at}}",
        "history_empty": f"{E_HISTORY} <b>ประวัติการสั่งซื้อ</b>\n\n<i>คุณยังไม่มีประวัติการสั่งซื้อ</i>",
        "history_list": f"{E_HISTORY} <b>ประวัติการสั่งซื้อ</b>\n\n{{list}}",
        "language_text": f"{E_LANGUAGE} <b>เลือกภาษาของคุณ:</b>",
        "lang_updated": "เปลี่ยนภาษาเป็นภาษาไทยเรียบร้อยแล้ว",
        "support_text": f"{E_SUPPORT} <b>ฝ่ายบริการลูกค้า</b>\n\nหากคุณต้องการความช่วยเหลือ โปรดติดต่อทีมสนับสนุน:\n\n{E_CLOCK} <b>เวลาทำการ:</b> ให้บริการ 24/7",
        "insufficient_balance": f"{E_WARNING} <b>ยอดเงินไม่เพียงพอ</b>\n\nยอดเงินของคุณ: <b>{{balance}} USDT</b>\nจำนวนที่ต้องชำระ: <b>{{required}} USDT</b>\n\nโปรดเติมเงินเข้ากระเป๋าของคุณ",
        "order_success": f"{E_CHECK} <b>สั่งซื้อสำเร็จ!</b>\n\nรหัสคำสั่งซื้อ: <code>#{{order_id}}</code>\nสินค้า: <b>{{product}}</b> ({{plan}})\nจำนวน: <b>{{qty}}</b>\nยอดรวม: <b>{{price}}</b>\n\n{E_BOX} <b>ข้อมูลบัญชี / การเข้าสู่ระบบ:</b>\n<code>{{credentials}}</code>\n\nขอบคุณสำหรับการสั่งซื้อ! ฝ่ายสนับสนุน: @{{support}}"
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

def format_price(amount_usd: float, amount_idr: int = 0, lang: str = "en") -> str:
    return f"${amount_usd:.2f}"
