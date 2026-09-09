"""
ZELVA AI - Product Catalog Data Model
Structured products catalog for AI tools and digital subscriptions.
"""

PRODUCTS = {
    "chatgpt": {
        "id": "chatgpt",
        "name": "ChatGPT",
        "category": "AI LLM & Coding",
        "badge": "MOST POPULAR",
        "description_en": "OpenAI GPT-4o, GPT-4, DALL·E 3, Advanced Voice, Data Analysis, and Canvas workspace.",
        "description_id": "Akses resmi model tercanggih OpenAI GPT-4o, GPT-4, DALL·E 3, Voice, dan Canvas.",
        "plans": [
            {"id": "1m", "name_en": "1 Month", "name_id": "1 Bulan", "duration": "30 Days", "price_usd": 15.0, "price_idr": 125000, "stock": 99},
            {"id": "3m", "name_en": "3 Months", "name_id": "3 Bulan", "duration": "90 Days", "price_usd": 40.0, "price_idr": 350000, "stock": 99},
            {"id": "6m", "name_en": "6 Months", "name_id": "6 Bulan", "duration": "180 Days", "price_usd": 75.0, "price_idr": 680000, "stock": 99},
            {"id": "1y", "name_en": "1 Year", "name_id": "1 Tahun", "duration": "365 Days", "price_usd": 140.0, "price_idr": 1250000, "stock": 99},
        ]
    },
    "claude": {
        "id": "claude",
        "name": "Claude",
        "category": "AI LLM & Coding",
        "badge": "BEST FOR CODING",
        "description_en": "Anthropic Claude 3.5 Sonnet & Claude 3 Opus with interactive Artifacts and 200k token context.",
        "description_id": "Claude 3.5 Sonnet & Opus dengan pemahaman coding tingkat lanjut dan fitur Artifacts.",
        "plans": [
            {"id": "1m", "name_en": "1 Month", "name_id": "1 Bulan", "duration": "30 Days", "price_usd": 16.0, "price_idr": 140000, "stock": 99},
            {"id": "3m", "name_en": "3 Months", "name_id": "3 Bulan", "duration": "90 Days", "price_usd": 45.0, "price_idr": 390000, "stock": 99},
            {"id": "6m", "name_en": "6 Months", "name_id": "6 Bulan", "duration": "180 Days", "price_usd": 85.0, "price_idr": 750000, "stock": 99},
            {"id": "1y", "name_en": "1 Year", "name_id": "1 Tahun", "duration": "365 Days", "price_usd": 155.0, "price_idr": 1390000, "stock": 99},
        ]
    },
    "gemini": {
        "id": "gemini",
        "name": "Gemini",
        "category": "Google AI Ecosystem",
        "badge": "2TB STORAGE INCLUDED",
        "description_en": "Google Gemini Advanced 1.5 Pro with 1M context window and Google One 2TB cloud storage.",
        "description_id": "Google Gemini Advanced 1.5 Pro dengan context window 1 Juta Token & Google One 2TB.",
        "plans": [
            {"id": "1m", "name_en": "1 Month", "name_id": "1 Bulan", "duration": "30 Days", "price_usd": 5.0, "price_idr": 350000, "stock": 99},
            {"id": "3m", "name_en": "3 Months", "name_id": "3 Bulan", "duration": "90 Days", "price_usd": 12.0, "price_idr": 95000, "stock": 99},
            {"id": "1y", "name_en": "1 Year", "name_id": "1 Tahun", "duration": "365 Days", "price_usd": 25.0, "price_idr": 180000, "stock": 99},
        ]
    },
    "grok": {
        "id": "grok",
        "name": "Grok",
        "category": "Realtime AI & Social",
        "badge": "UNFILTERED AI",
        "description_en": "xAI Grok 2 & Grok 2 Mini with realtime X data access and Flux uncensored image generation.",
        "description_id": "Grok 2 dari xAI (X Premium+) dengan akses data realtime X dan generate gambar Flux.",
        "plans": [
            {"id": "1m", "name_en": "1 Month", "name_id": "1 Bulan", "duration": "30 Days", "price_usd": 10.0, "price_idr": 85000, "stock": 99},
            {"id": "3m", "name_en": "3 Months", "name_id": "3 Bulan", "duration": "90 Days", "price_usd": 28.0, "price_idr": 240000, "stock": 99},
            {"id": "1y", "name_en": "1 Year", "name_id": "1 Tahun", "duration": "365 Days", "price_usd": 95.0, "price_idr": 850000, "stock": 99},
        ]
    },
    "perplexity": {
        "id": "perplexity",
        "name": "Perplexity",
        "category": "AI Search Engine",
        "badge": "PRO SEARCH",
        "description_en": "Perplexity Pro with unlimited Pro Search, Claude 3.5 & GPT-4o model toggling, and file uploads.",
        "description_id": "Perplexity Pro pencarian AI cerdas tanpa batas, ganti model AI bebas, dan analisis file.",
        "plans": [
            {"id": "1m", "name_en": "1 Month", "name_id": "1 Bulan", "duration": "30 Days", "price_usd": 12.0, "price_idr": 95000, "stock": 99},
            {"id": "3m", "name_en": "3 Months", "name_id": "3 Bulan", "duration": "90 Days", "price_usd": 32.0, "price_idr": 270000, "stock": 99},
            {"id": "1y", "name_en": "1 Year", "name_id": "1 Tahun", "duration": "365 Days", "price_usd": 110.0, "price_idr": 950000, "stock": 99},
        ]
    },
    "kimi": {
        "id": "kimi",
        "name": "Kimi",
        "category": "Long Context & Research",
        "badge": "2M CONTEXT LENGTH",
        "description_en": "Moonshot Kimi AI VIP with 2 million characters long-context document processing and research tools.",
        "description_id": "Kimi AI VIP dengan kapasitas baca dokumen raksasa hingga 2 juta karakter dan riset cepat.",
        "plans": [
            {"id": "1m", "name_en": "1 Month", "name_id": "1 Bulan", "duration": "30 Days", "price_usd": 5.0, "price_idr": 35000, "stock": 99},
            {"id": "3m", "name_en": "3 Months", "name_id": "3 Bulan", "duration": "90 Days", "price_usd": 12.0, "price_idr": 95000, "stock": 99},
            {"id": "1y", "name_en": "1 Year", "name_id": "1 Tahun", "duration": "365 Days", "price_usd": 40.0, "price_idr": 320000, "stock": 99},
        ]
    },
    "cursor": {
        "id": "cursor",
        "name": "Cursor",
        "category": "Developer Tools",
        "badge": "AI CODE EDITOR",
        "description_en": "Cursor Pro AI Code Editor with 500 Fast Premium requests, Cursor Tab, and AI Composer.",
        "description_id": "Editor kode AI tercanggih dengan 500 Fast Requests per bulan dan Cursor Composer.",
        "plans": [
            {"id": "1m", "name_en": "1 Month", "name_id": "1 Bulan", "duration": "30 Days", "price_usd": 9.0, "price_idr": 75000, "stock": 99},
            {"id": "3m", "name_en": "3 Months", "name_id": "3 Bulan", "duration": "90 Days", "price_usd": 25.0, "price_idr": 210000, "stock": 99},
            {"id": "1y", "name_en": "1 Year", "name_id": "1 Tahun", "duration": "365 Days", "price_usd": 85.0, "price_idr": 750000, "stock": 99},
        ]
    },
    "leonardo": {
        "id": "leonardo",
        "name": "Leonardo",
        "category": "AI Art & Design",
        "badge": "PREMIUM ART",
        "description_en": "Leonardo.ai Premium Artisan with 8,500+ Fast Tokens, Phoenix model, and Motion video generator.",
        "description_id": "Platform gambar & motion AI profesional dengan 8.500+ token dan model Phoenix.",
        "plans": [
            {"id": "1m", "name_en": "1 Month", "name_id": "1 Bulan", "duration": "30 Days", "price_usd": 6.0, "price_idr": 45000, "stock": 99},
            {"id": "3m", "name_en": "3 Months", "name_id": "3 Bulan", "duration": "90 Days", "price_usd": 16.0, "price_idr": 125000, "stock": 99},
            {"id": "1y", "name_en": "1 Year", "name_id": "1 Tahun", "duration": "365 Days", "price_usd": 55.0, "price_idr": 450000, "stock": 99},
        ]
    },
    "lovable": {
        "id": "lovable",
        "name": "Lovable",
        "category": "Fullstack AI Engineer",
        "badge": "APP BUILDER",
        "description_en": "Lovable.dev Fullstack AI Web App Creator with GitHub & Supabase integration and live deploy.",
        "description_id": "Buat aplikasi web fullstack instan dari prompt, terintegrasi GitHub dan Supabase.",
        "plans": [
            {"id": "1m", "name_en": "1 Month", "name_id": "1 Bulan", "duration": "30 Days", "price_usd": 11.0, "price_idr": 85000, "stock": 99},
            {"id": "3m", "name_en": "3 Months", "name_id": "3 Bulan", "duration": "90 Days", "price_usd": 30.0, "price_idr": 240000, "stock": 99},
        ]
    },
    "manus": {
        "id": "manus",
        "name": "Manus",
        "category": "Autonomous AI Agent",
        "badge": "AUTONOMOUS AGENT",
        "description_en": "Manus AI Autonomous Agent with browser execution, multi-step problem solving, and research export.",
        "description_id": "Agent AI otonom yang dapat menjalankan tugas kompleks, browsing, dan analisis otomatis.",
        "plans": [
            {"id": "1m", "name_en": "1 Month", "name_id": "1 Bulan", "duration": "30 Days", "price_usd": 12.0, "price_idr": 90000, "stock": 99},
            {"id": "3m", "name_en": "3 Months", "name_id": "3 Bulan", "duration": "90 Days", "price_usd": 33.0, "price_idr": 260000, "stock": 99},
        ]
    },
    "heygen": {
        "id": "heygen",
        "name": "HeyGen",
        "category": "AI Video Studio",
        "badge": "AVATAR VIDEO",
        "description_en": "HeyGen AI Video Studio with realistic avatars, multi-language voice cloning, and 1080p/4K exports.",
        "description_id": "Studio video AI dengan presenter avatar manusia realistis dan kloning suara multi-bahasa.",
        "plans": [
            {"id": "1m", "name_en": "1 Month", "name_id": "1 Bulan", "duration": "30 Days", "price_usd": 12.0, "price_idr": 95000, "stock": 99},
            {"id": "3m", "name_en": "3 Months", "name_id": "3 Bulan", "duration": "90 Days", "price_usd": 34.0, "price_idr": 270000, "stock": 99},
        ]
    },
    "telegram": {
        "id": "telegram",
        "name": "Telegram",
        "category": "Premium Messenger",
        "badge": "OFFICIAL GIFT",
        "description_en": "Telegram Premium Official Gift subscription with 4GB upload, voice-to-text, fast speed, and badges.",
        "description_id": "Telegram Premium resmi via Gift Link. Batas upload 4GB, voice note ke teks, dan badge bintang.",
        "plans": [
            {"id": "3m", "name_en": "3 Months", "name_id": "3 Bulan", "duration": "90 Days", "price_usd": 18.0, "price_idr": 140000, "stock": 99},
            {"id": "6m", "name_en": "6 Months", "name_id": "6 Bulan", "duration": "180 Days", "price_usd": 32.0, "price_idr": 250000, "stock": 99},
            {"id": "1y", "name_en": "1 Year", "name_id": "1 Tahun", "duration": "365 Days", "price_usd": 54.0, "price_idr": 420000, "stock": 99},
        ]
    }
}

PRODUCTS_LIST = [
    "chatgpt", "claude",
    "gemini", "grok",
    "perplexity", "kimi",
    "cursor", "leonardo",
    "lovable", "manus",
    "heygen", "telegram"
]

def get_product(product_id: str) -> dict | None:
    return PRODUCTS.get(product_id)

def get_product_plan(product_id: str, plan_id: str) -> dict | None:
    prod = PRODUCTS.get(product_id)
    if not prod:
        return None
    for p in prod.get("plans", []):
        if p["id"] == plan_id:
            return p
    return None
