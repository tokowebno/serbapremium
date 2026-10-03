import type { App, Category, ProductVariant, Banner, Platform } from "@/types";
import type { LanguageCode } from "./dictionaries";

export interface AppTranslation {
  tagline: string;
  description: string;
  features?: string[];
}

export interface CategoryTranslation {
  name: string;
  description: string;
}

export interface BannerTranslation {
  title: string;
  description: string;
  cta: string;
}

export const categoryTranslations: Record<string, Record<LanguageCode, CategoryTranslation>> = {
  ai: {
    id: { name: "AI & Chatbot", description: "Chatbot, asisten AI, dan alat berbasis AI." },
    en: { name: "AI & Chatbots", description: "Chatbots, AI assistants, and AI-powered tools." },
    zh: { name: "AI 与聊天机器人", description: "聊天机器人、AI 助手和人工智能工具。" },
  },
  streaming: {
    id: { name: "Streaming", description: "Langganan premium platform streaming film & musik." },
    en: { name: "Streaming", description: "Premium subscriptions for movies, series & music." },
    zh: { name: "流媒体与影音", description: "影视电影、剧集与音乐的高级会员订阅。" },
  },
  vpn: {
    id: { name: "VPN & Keamanan", description: "Lindungi koneksi dan privasi digital Anda." },
    en: { name: "VPN & Security", description: "Protect your connection and digital privacy." },
    zh: { name: "VPN 与网络安全", description: "保护您的网络连接与数字隐私安全。" },
  },
  akun: {
    id: { name: "Akun & Email", description: "Akun siap pakai dan layanan email profesional." },
    en: { name: "Accounts & Email", description: "Ready-to-use accounts and professional email." },
    zh: { name: "账号与企业邮箱", description: "即用型账号与专业企业邮箱服务。" },
  },
  sosial: {
    id: { name: "Sosial Media", description: "Tumbuhkan follower dan engagement media sosial." },
    en: { name: "Social Media", description: "Grow your social media followers and engagement." },
    zh: { name: "社交媒体增长", description: "提升各大社交媒体平台的粉丝量与互动率。" },
  },
  developer: {
    id: { name: "Developer & Cloud", description: "Tools pengembangan, hosting, dan layanan cloud." },
    en: { name: "Developer & Cloud", description: "Development tools, hosting, and cloud services." },
    zh: { name: "开发者与云服务", description: "开发工具、智能代码编辑器与云端基础设施。" },
  },
  kreatif: {
    id: { name: "Desain & Kreatif", description: "Alat desain grafis, video, dan konten kreatif." },
    en: { name: "Design & Creative", description: "Graphic design, video editing, and creative tools." },
    zh: { name: "设计与创意工具", description: "图形设计、视频剪辑与创意内容制作工具。" },
  },
  tools: {
    id: { name: "Produktivitas", description: "Aplikasi untuk bekerja lebih cerdas dan efisien." },
    en: { name: "Productivity", description: "Apps to work smarter, faster, and more efficiently." },
    zh: { name: "效率与生产力", description: "助您高效办公、整理知识与协同工作的利器。" },
  },
  lisensi: {
    id: { name: "Lisensi & Kredit", description: "Gift card, saldo game, token, dan lisensi digital." },
    en: { name: "Licenses & Credits", description: "Gift cards, gaming credits, tokens, and licenses." },
    zh: { name: "数字许可与充值卡", description: "礼品卡、游戏点卡、AI Token 与正版数字授权。" },
  },
  pendidikan: {
    id: { name: "Pendidikan", description: "Platform belajar, kursus online, dan sertifikasi." },
    en: { name: "Education", description: "Learning platforms, online courses, and certificates." },
    zh: { name: "教育与在线学习", description: "语言学习、在线课程与专业技能认证平台。" },
  },
};

export const appTranslations: Record<string, Record<LanguageCode, AppTranslation>> = {
  chatgpt: {
    id: {
      tagline: "Akses Flagship OpenAI GPT-6 (GPT-6 Astra, GPT-6.1 Sol & Luna), Dots Autonomous Agents & GPT-Live-1",
      description: "Langganan resmi OpenAI ChatGPT Plus, Pro & Business menghadirkan akses prioritas ke generasi mutakhir GPT-6 (GPT-6 Astra, GPT-6.1 Sol, dan GPT-6 Luna), agen otonom 'Dots' di lingkungan cloud terisolasi, percakapan suara real-time ultra cepat GPT-Live-1, kapabilitas riset otonom Deep Research, dan ruang kerja Canvas interaktif.",
      features: ["Akses prioritas model frontier generasi GPT-6: GPT-6 Astra, GPT-6.1 Sol & Luna", "Dukungan agen otonom 'Dots' di cloud untuk eksekusi tugas otonom berkelanjutan", "Teknologi audio percakapan full-duplex generasi mutakhir GPT-Live-1", "Fitur otonom Deep Research untuk riset web multi-sumber mendalam", "Canvas interaktif untuk penulisan artikel & rekayasa coding terstruktur", "Advanced Data Analysis dengan lingkungan eksekusi Python terisolasi"],
    },
    en: {
      tagline: "Access OpenAI Flagship GPT-6 (GPT-6 Astra, Sol & Luna), Dots Autonomous Agents & GPT-Live-1",
      description: "Official OpenAI ChatGPT Plus, Pro & Business subscription offering priority access to the cutting-edge GPT-6 generation (GPT-6 Astra, GPT-6.1 Sol, and GPT-6 Luna), always-on cloud-native 'Dots' autonomous agents, real-time full-duplex GPT-Live-1 voice, autonomous Deep Research, and interactive Canvas.",
      features: ["Priority access to flagship GPT-6 models: GPT-6 Astra, GPT-6.1 Sol & Luna", "Persistent 'Dots' autonomous cloud agents for continuous task execution", "Next-gen ultra-low latency full-duplex GPT-Live-1 voice technology", "Autonomous Deep Research tool for synthesis of extensive web sources", "Interactive Canvas workspace for structured coding and editorial writing", "Advanced Data Analysis with sandbox Python execution environment"],
    },
    zh: {
      tagline: "畅享 OpenAI 旗舰 GPT-6 时代 (GPT-6 Astra, GPT-6.1 Sol & Luna)、Dots 自主代理与 GPT-Live-1",
      description: "官方正版 ChatGPT Plus, Pro 与 Business 订阅，为您开通前沿 GPT-6 系列旗舰模型 (GPT-6 Astra, GPT-6.1 Sol 与 GPT-6 Luna) 全天候优先访问权、全天候云端常驻 'Dots' 自主代理、低延迟全双工 GPT-Live-1 语音交互、Deep Research 深度自主调研与 Canvas 协同画布。",
      features: ["优先使用 OpenAI 旗舰 GPT-6 系列大模型 (GPT-6 Astra, GPT-6.1 Sol, GPT-6 Luna)", "原生支持常驻云端 'Dots' 自主代理，实现连续不间断任务推进", "全新一代 GPT-Live-1 全双工超低延迟语音拟真交互", "内置 Deep Research 全网自主深度研究与多源学术报告合成", "交互式 Canvas 画布支持复杂代码重构与大型文章创作", "高级数据分析与独立 Python 沙盒代码安全执行环境"],
    },
  },
  claude: {
    id: {
      tagline: "Akses Model Frontier Anthropic Claude 5.5 (Opus 5.5, Sonnet 5.5, Fable 5.1), 1M Token & Claude Code",
      description: "Tingkatkan produktivitas ke level tertinggi dengan Claude Pro & Max dari Anthropic. Nikmati batas kuota pesan masif, akses prioritas seluruh model AI frontier generasi 5.5 (Claude Opus 5.5, Claude Sonnet 5.5, dan Claude Fable 5.1), jendela konteks 1 Juta (1M) token, adaptive extended thinking, integrasi agen coding otonom Claude Code CLI, Projects workspace, dan visualisasi interaktif Artifacts.",
      features: ["Akses prioritas generasi 5.5 terbaru Anthropic: Claude Opus 5.5, Claude Sonnet 5.5 & Claude Fable 5.1", "Jendela konteks raksasa 1.000.000 (1M) token untuk analisis codebase & dokumen masif", "Fitur Adaptive Extended Thinking untuk penalaran logika murni dan rekayasa arsitektur", "Dukungan penuh agen coding otonom Claude Code CLI", "Fitur Artifacts untuk preview kode, HTML, SVG, dan UI realtime", "Kapasitas kuota pesan jauh lebih tinggi (Paket Pro & Claude Max 5x/20x)", "Fitur Claude Projects untuk pengelompokan repositori dan instruksi kerja"],
    },
    en: {
      tagline: "Access Anthropic Claude 5.5 Generation (Opus 5.5, Sonnet 5.5, Fable 5.1), 1M Context & Claude Code",
      description: "Supercharge your workflow with Claude Pro & Claude Max from Anthropic. Enjoy massive message limits, priority access to the cutting-edge 5.5 model family (Claude Opus 5.5, Claude Sonnet 5.5, and Claude Fable 5.1), a 1 Million token context window, adaptive extended thinking, autonomous Claude Code CLI integration, Claude Projects, and interactive Artifacts.",
      features: ["Priority access to Anthropic's flagship 5.5 series: Claude Opus 5.5, Sonnet 5.5 & Fable 5.1", "Massive 1,000,000 (1M) token context window for large codebases and complex documents", "Adaptive Extended Thinking for advanced mathematical reasoning and engineering", "Native autonomous Claude Code CLI coding agent integration", "Interactive Artifacts for realtime code, HTML, SVG, and web UI execution", "Substantially increased message capacity (Pro & Claude Max 5x/20x plans)", "Claude Projects workspace with dedicated knowledge bases"],
    },
    zh: {
      tagline: "畅享 Anthropic Claude 5.5 世代 (Opus 5.5, Sonnet 5.5, Fable 5.1)、100万Token 上下文与 Claude Code",
      description: "通过 Anthropic 官方 Claude Pro & Max 升级您的生产力。享有超大消息用量额度、前沿 5.5 系列旗舰大模型全天候优先访问 (Claude Opus 5.5, Claude Sonnet 5.5 与 Claude Fable 5.1)、高达 100 万 Token 的上下文处理能力、Claude Code CLI 自主编程终端代理、自适应 Extended Thinking 深度思考、Claude Projects 项目空间以及 Artifacts 实时工件支持。",
      features: ["优先访问 Anthropic 5.5 时代全系前沿旗舰 (Claude Opus 5.5, Sonnet 5.5, Fable 5.1)", "支持高达 100 万 (1,000,000) Token 超长上下文长文本与全代码库解析", "自适应 Extended Thinking 深度思考模式，攻克复杂数理与高阶工程难题", "深度原生集成 Claude Code CLI 自主编程终端代理", "Artifacts 交互式工件实时可视化渲染代码、网页与图表", "日常消息发送额度大幅提升（Pro 与 Max 5x/20x 套餐）", "Claude Projects 专属项目知识库与自定义业务提示词管理"],
    },
  },
  gemini: {
    id: {
      tagline: "Google AI Premium: Flagship Gemini 4 Argon & Gemini 3.8 Flash, Jendela Konteks 1M Token & Deep Research",
      description: "Paket Google One AI Premium menghadirkan akses eksklusif ke model generasi mutakhir Google DeepMind: Gemini 4 Argon (arsitektur frontier untuk penalaran mendalam dan rekayasa software) serta Gemini 3.8 Flash & Gemini 3.8 Live. Dilengkapi kapasitas output 1 Juta token, agen otonom Deep Research, generator visual Imagen 3, integrasi cerdas Google Workspace (Docs, Gmail, Sheets), dan penyimpanan Google One Cloud (5TB / 30TB Ultra).",
      features: ["Akses penuh ke model frontier terbaru Google: Gemini 4 Argon dan Gemini 3.8 Flash", "Kapasitas output hingga 1.000.000 (1M) token untuk pemrosesan teks dan data raksasa", "Fitur percakapan audio realtime generasi mutakhir Gemini 3.8 Live", "Integrasi AI langsung di Gmail, Google Docs, Google Slides, dan Google Sheets", "Fitur otonom Deep Research Google untuk sintesis riset multi-sumber", "Penyimpanan Google One Cloud super besar (5TB / 30TB Ultra)"],
    },
    en: {
      tagline: "Google AI Premium: Gemini 4 Argon & Gemini 3.8 Flash, 1M Token Output & Deep Research",
      description: "Google One AI Premium plan delivers exclusive access to Google DeepMind's cutting-edge models: Gemini 4 Argon (advanced reasoning and complex software engineering) alongside Gemini 3.8 Flash and Gemini 3.8 Live. Features 1 Million token output capacity, autonomous Deep Research, Imagen 3 generation, seamless Google Workspace integration, and Google One cloud storage (5TB / 30TB Ultra).",
      features: ["Gemini Advanced powered by flagship Gemini 4 Argon & Gemini 3.8 Flash", "Massive 1,000,000 token output capacity for enterprise document and code synthesis", "Ultra-low latency audio conversations with Gemini 3.8 Live", "Native AI integration in Gmail, Docs, Sheets, and Slides", "Autonomous Deep Research tool for comprehensive web and academic investigations", "Google One Cloud storage inclusion (5TB / 30TB Ultra)"],
    },
    zh: {
      tagline: "Google AI Premium：Gemini 4 Argon 与 Gemini 3.8 Flash 旗舰大模型与 Google One 云盘",
      description: "Google One AI Premium 套餐为您带来 Google DeepMind 最新一代旗舰大模型 Gemini 4 Argon (专注于深度逻辑推理与系统级软件架构) 以及 Gemini 3.8 Flash / Gemini 3.8 Live 的尊享权限，支持高达 100 万 Token 的单次输出与长文本解析，内置自主 Deep Research 深度调研，无缝深度集成于 Gmail、Google 文档与表格，并包含 Google One 云端存储。",
      features: ["搭载最新一代 Gemini 4 Argon 与 Gemini 3.8 Flash 架构的 Gemini Advanced 旗舰模型", "支持高达 100 万 Token 超大规模输出与长文本精准解析", "支持全新超低延迟双向实时语音 Gemini 3.8 Live", "内置 Deep Research 全网深度自主调研与学术综述", "直接无缝集成于 Gmail、Docs 与 Slides 协同办公", "包含 Google One 高速云端储存空间 (5TB / 30TB Ultra)"],
    },
  },
  youtube: {
    id: {
      tagline: "Bebas Iklan, Putar Latar Belakang & YouTube Music",
      description: "Nikmati video YouTube tanpa jeda iklan, putar di latar belakang saat multitasking atau layar mati, unduh video untuk ditonton offline, serta akses penuh jutaan lagu di YouTube Music Premium.",
      features: ["Streaming seluruh video 100% bebas iklan", "Putar video di latar belakang (Background Play)", "Unduh video & musik untuk mode offline", "Akses penuh aplikasi YouTube Music Premium", "Kualitas audio bitrate tinggi & Picture-in-Picture"],
    },
    en: {
      tagline: "Ad-Free Streaming, Background Play & YouTube Music",
      description: "Enjoy uninterrupted ad-free YouTube videos, background playback while multitasking or screen off, offline downloads, and full access to millions of songs on YouTube Music Premium.",
      features: ["100% ad-free streaming across all devices", "Background playback with screen locked", "Download videos and songs for offline enjoyment", "Full premium access to YouTube Music app", "High bitrate audio & Picture-in-Picture support"],
    },
    zh: {
      tagline: "全平台去广告播放、后台画中画与 YouTube Music 音乐畅享",
      description: "享受无任何广告打扰的 YouTube 视听盛宴，支持锁屏与多任务后台播放，离线下载视频随时随地观看，并畅享 YouTube Music Premium 亿万曲库的高保真音频流。",
      features: ["全设备 100% 纯净无广告沉浸式播放", "支持锁屏后台播放与画中画悬浮窗 (PiP)", "支持离线高速下载视频与高保真音频", "包含 YouTube Music Premium 完整订阅权限", "原画质超清视频与高比特率高品质音效"],
    },
  },
  netflix: {
    id: {
      tagline: "Streaming Film & Serial Resolusi 4K UHD + HDR",
      description: "Akses tanpa batas ke ribuan film blockbuster, serial original Netflix, dokumenter, dan anime terbaik dengan kualitas visual 4K Ultra HD, Dolby Vision, dan audio spasial.",
      features: ["Kualitas video tertinggi 4K Ultra HD + HDR", "Audio spasial imersif Dolby Atmos", "Tonton di Smart TV, Laptop, Tablet, dan HP", "Fitur unduh untuk menonton saat bepergian", "Profil personal dengan PIN privasi aman"],
    },
    en: {
      tagline: "Stream Movies & Series in Ultra 4K UHD + HDR",
      description: "Unlimited streaming of thousands of blockbuster movies, award-winning Netflix originals, documentaries, and anime in stunning 4K Ultra HD, Dolby Vision, and spatial audio.",
      features: ["Highest 4K Ultra HD + HDR video resolution", "Immersive Dolby Atmos spatial audio", "Watch on Smart TV, Laptop, Tablet, and Mobile", "Download titles to watch offline anywhere", "Personalized profile with secure PIN protection"],
    },
    zh: {
      tagline: "超高清 4K UHD + HDR 杜比视界海量影视剧集尽情畅享",
      description: "无限畅看数以万计的院线大片、Netflix 独家自制高分剧集、纪录片与热门动漫，尊享 4K Ultra HD 超高清画质、Dolby Vision 杜比视界与震撼的空间立体声效。",
      features: ["支持最高规格 4K Ultra HD + HDR 超清画质", "沉浸式 Dolby Atmos 杜比全景声环绕音效", "支持电视、电脑、平板与手机等多端同步观看", "随时随地一键离线缓存下载离线观影", "专属独立播放档案与独立安全 PIN 码保护"],
    },
  },
  spotify: {
    id: {
      tagline: "Bebas Iklan, Audio Kualitas Tinggi & Unduh Offline",
      description: "Dengarkan lebih dari 100 juta lagu dan podcast tanpa gangguan iklan. Nikmati audio berkualitas tinggi 320kbps, lewati lagu tanpa batas, dan unduh musik untuk didengarkan saat offline.",
      features: ["Streaming musik & podcast 100% bebas iklan", "Kualitas audio maksimal 320kbps Crystal Clear", "Lewati lagu (skip) tanpa batasan", "Unduh musik tak terbatas untuk mode offline", "Dukungan Spotify Connect ke berbagai speaker & TV"],
    },
    en: {
      tagline: "Ad-Free Music, High-Quality Audio & Offline Downloads",
      description: "Stream over 100 million songs and podcasts without any ad interruptions. Enjoy 320kbps high-fidelity audio, unlimited track skips, and offline listening wherever you go.",
      features: ["100% ad-free music and podcast streaming", "Maximum 320kbps high-fidelity crystal clear audio", "Unlimited song skips on all playlists", "Unlimited offline downloads for music & podcasts", "Full Spotify Connect support for smart devices"],
    },
    zh: {
      tagline: "纯净去广告、320kbps 高保真音质与无限离线下载",
      description: "随时随地畅听超过 1 亿首歌曲与精选播客，全程无插播广告打扰。享受 320kbps 无损级音质、无限制任意切歌切歌单，以及支持全曲库离线下载聆听。",
      features: ["全曲库与播客 100% 无任何广告打扰", "320kbps 极致纯净高保真无损音质输出", "不受限制随时自由跳过任意曲目", "支持歌曲、专辑及播客完整离线下载", "完美支持 Spotify Connect 智能音箱多端串联"],
    },
  },
  cursor: {
    id: {
      tagline: "AI Code Editor Cerdas Berbasis VS Code & Agent Composer (Claude Sonnet 5.5, GPT-6.1 Sol, Grok 4.7)",
      description: "Editor kode revolusioner bertenaga AI. Hadirkan fitur Composer multi-file otonom, integrasi langsung model coding frontier terdepan (Claude Sonnet 5.5, GPT-6.1 Sol, Grok 4.7), indexing codebase lokal instan, dan autocompletion cerdas Cursor Tab.",
      features: ["Composer multi-file editing otonom yang dapat merevisi seluruh arsitektur proyek", "Model AI coding frontier terdepan: Claude Sonnet 5.5, GPT-6.1 Sol & Grok 4.7", "Indexing codebase lokal instan untuk pemahaman konteks proyek 100% presisi", "Cursor Tab AI autocomplete super responsif", "Ekosistem ekstensi 100% kompatibel dengan VS Code"],
    },
    en: {
      tagline: "Smart AI Code Editor on VS Code with Agent Composer (Claude Sonnet 5.5, GPT-6.1 Sol, Grok 4.7)",
      description: "The premier AI-first code editor. Features autonomous multi-file Composer, native frontier model integrations (Claude Sonnet 5.5, GPT-6.1 Sol, Grok 4.7), instant local codebase indexing, and lightning-fast Cursor Tab autocomplete.",
      features: ["Autonomous multi-file Composer capable of refactoring entire project architectures", "Top-tier frontier coding models: Claude Sonnet 5.5, GPT-6.1 Sol & Grok 4.7", "Instant local codebase indexing for precise multi-repository context", "Ultra-fast predictive Cursor Tab smart completions", "100% full compatibility with VS Code extension ecosystem"],
    },
    zh: {
      tagline: "基于 VS Code 打造的 AI 原生代码编辑器 (集成 Claude Sonnet 5.5, GPT-6.1 Sol, Grok 4.7)",
      description: "全球顶尖开发者青睐的 AI 原生代码编辑器。内置强大的多文件自主协同 Composer 代理、深度原生集成 Claude Sonnet 5.5, GPT-6.1 Sol 与 Grok 4.7 前沿编程大模型、本地代码库秒级索引与极速智能 Tab 代码补全。",
      features: ["强大的 Composer 多文件架构自动重构与端到端代码编写", "原生接入前沿编程旗舰：Claude Sonnet 5.5, GPT-6.1 Sol 与 Grok 4.7", "本地全项目代码智能索引与精准架构级上下文理解", "毫秒级极速智能 Cursor Tab 代码预测与自动补全", "100% 无缝兼容 VS Code 插件生态与配置环境"],
    },
  },
  manus: {
    id: {
      tagline: "Autonomous Generalist AI Agent untuk Multi-Workflow",
      description: "Agent AI otonom pertama di dunia yang mampu mengeksekusi riset mendalam, menganalisis data, membuat aplikasi web, dan menyelesaikan alur kerja kompleks dari awal hingga akhir secara otomatis.",
      features: ["Eksekusi tugas multi-langkah secara mandiri", "Riset web mendalam dan pembuatan laporan komprehensif", "Kemampuan coding dan deploy aplikasi instan", "Analisis data visual dan pembuatan grafik otomatis", "Antarmuka kerja modern dan ramah pengguna"],
    },
    en: {
      tagline: "Autonomous Generalist AI Agent for Complex Multi-Workflows",
      description: "The world's premier autonomous AI agent capable of conducting in-depth research, analyzing large datasets, building web apps, and automating end-to-end complex workflows independently.",
      features: ["Self-directed multi-step autonomous task execution", "Deep web research and comprehensive report generation", "Instant coding, testing, and application deployment", "Automated visual data analysis and chart creation", "Modern, intuitive, and responsive user interface"],
    },
    zh: {
      tagline: "全球领先的通用自主 AI Agent，实现复杂工作流端到端自动化",
      description: "开创性的通用型自主 AI Agent，能够独立进行全网深度研究、数据统计与可视化分析、自主编写并部署全栈网页应用，自动将复杂任务从头到尾完美交付。",
      features: ["端到端多步骤全自主任务规划与执行能力", "全网智能深度调研与专业级结构化报告输出", "一键式代码编写、环境调试与应用实时部署", "自动化图表制作与多维度数据洞察分析", "直观高效的现代多任务流交互工作台"],
    },
  },
  meitu: {
    id: {
      tagline: "Edit foto & video estetik dengan filter premium",
      description: "Berlangganan Meitu VIP untuk membuka semua filter eksklusif, efek kecantikan, kolase, dan fitur edit video tanpa batas. Proses edit menjadi jauh lebih mudah dengan alat bertenaga AI.",
      features: ["Akses ke semua filter & efek VIP", "Hapus watermark otomatis", "Alat retouching AI premium", "Edit video resolusi tinggi"],
    },
    en: {
      tagline: "Aesthetic photo & video editing with premium filters",
      description: "Subscribe to Meitu VIP to unlock all exclusive filters, beauty effects, collages, and unlimited video editing tools with powerful AI enhancements.",
      features: ["Full access to all VIP filters & effects", "Automatic watermark removal", "Premium AI portrait retouching tools", "High-resolution HD video editing"],
    },
    zh: {
      tagline: "尊享 VIP 独家高级滤镜与 AI 智能人像修图剪辑",
      description: "开通美图秀秀 VIP 会员，解锁全量独家高级滤镜、智能医美级人像精修、高清视频剪辑与 AI 一键画质修复工具，助您轻松制作惊艳视觉大片。",
      features: ["畅享全套 VIP 独家高级质感滤镜与特效", "自动无痕消除水印与路人修图功能", "AI 智能高清人像重塑与五官精修算法", "支持 4K 超清画质视频导出与剪辑"],
    },
  },
  perplexity: {
    id: {
      tagline: "Mesin Pencari AI Cerdas dengan Pilihan Model Frontier Terbaru (Claude Sonnet 5.5, GPT-6.1 Sol, Gemini 4)",
      description: "Pencarian cerdas yang menggabungkan kecerdasan model AI frontier mutakhir (Claude Sonnet 5.5, GPT-6.1 Sol, Gemini 4 Argon, Sonar Reasoning) dengan kutipan sumber terverifikasi realtime, Pro Search tanpa batas, dan upload file dokumen.",
      features: ["Pro Search harian dengan penalaran bertahap", "Pilihan bebas model frontier: Claude Sonnet 5.5, GPT-6.1 Sol, Gemini 4 Argon & Sonar", "Upload dan analisis dokumen PDF/data tanpa batas", "Generasi gambar AI terintegrasi", "Kutipan sumber akurat dan dapat diverifikasi langsung"],
    },
    en: {
      tagline: "Intelligent AI Search Engine with Frontier Models (Claude Sonnet 5.5, GPT-6.1 Sol, Gemini 4)",
      description: "Next-generation conversational search engine powered by frontier AI models (Claude Sonnet 5.5, GPT-6.1 Sol, Gemini 4 Argon, Sonar Reasoning) with realtime verified citations, daily Pro Search queries, and document file analysis.",
      features: ["Daily Pro Search queries with multi-step reasoning", "Freedom to switch frontier models: Claude Sonnet 5.5, GPT-6.1 Sol, Gemini 4 Argon & Sonar", "Unlimited document and PDF upload & analysis", "Integrated AI image generation capabilities", "Accurate realtime citations and clickable sources"],
    },
    zh: {
      tagline: "新一代智能 AI 搜索引擎 (自由切换 Claude Sonnet 5.5, GPT-6.1 Sol, Gemini 4 Argon)",
      description: "结合来自 Claude Sonnet 5.5、GPT-6.1 Sol、Gemini 4 Argon 及 Sonar 前沿大模型的专业对话式 AI 搜索引擎，支持 Pro 深度搜索模式、全网实时来源溯源与多格式学术文献解析。",
      features: ["支持 Pro 级智能多步深度推理搜索", "自由切换来自 Claude Sonnet 5.5、GPT-6.1 Sol、Gemini 4 Argon 及 Sonar 模型", "支持上传海量学术文献、PDF 与数据报告解析", "内置多风格 AI 创意配图与信息图生成", "100% 精确标注信息来源出处与可信链接"],
    },
  },
  grok: {
    id: {
      tagline: "Langganan Resmi xAI Grok: Model Frontier Grok 4.7, Think Mode, Grok Imagine & Real-Time X",
      description: "Akses resmi SuperGrok dari xAI dengan model penalaran frontier mutakhir Grok 4.7 (500K konteks, RL coding), integrasi tren data real-time platform X, mode penalaran mendalam Think Mode, dan generator visual Grok Imagine Image 2.0 & Video 1.5.",
      features: ["Akses prioritas model frontier generasi terbaru Grok 4.7 dari xAI", "Integrasi pengetahuan dan tren terkini detik-ke-detik dari platform X", "Mode penalaran mendalam Think Mode untuk sains, matematika & koding tingkat lanjut", "Grok DeepSearch untuk riset dan investigasi multi-sumber mendalam", "Generator visual Grok Imagine Image 2.0 & Video 1.5 fotorealistik"],
    },
    en: {
      tagline: "Official xAI Grok Subscription: Frontier Model Grok 4.7, Think Mode, Grok Imagine & Real-Time X",
      description: "Official SuperGrok access from xAI featuring flagship model Grok 4.7 (500K context, RL coding), real-time platform X intelligence, deep reasoning Think Mode, and Grok Imagine Image 2.0 & Video 1.5 visual generator.",
      features: ["Priority access to xAI's latest flagship frontier model Grok 4.7", "Real-time world events and trend data from platform X", "Think Mode deep reasoning for complex math, science, and coding", "Grok DeepSearch for multi-source web synthesis", "Integrated Grok Imagine Image 2.0 & Video 1.5 generation"],
    },
    zh: {
      tagline: "xAI 官方正版 Grok 订阅：旗舰 Grok 4.7 大模型、Think Mode 与 X 实时数据",
      description: "xAI 官方 SuperGrok 会员服务，为您提供最新一代 Grok 4.7 旗舰大模型 (500K 上下文、RL 深度强化编程) 优先访问权、X (Twitter) 全球实时社交数据联动、Think Mode 深度思考推理与 Grok Imagine 2.0 / Video 1.5 视觉生成支持。",
      features: ["优先使用 xAI 旗舰级 Grok 4.7 前沿大模型", "全网最强 X 实时全球突发事件与趋势深度分析", "内置 Think Mode 深度思考模式攻克数理与高级编程难题", "Grok DeepSearch 全网长文调研与情报整理", "集成顶级 Grok Imagine 2.0 图像与 Video 1.5 视频渲染模型"],
    },
  },
  nord: {
    id: {
      tagline: "VPN Tercepat & Teraman dengan Proteksi Ancaman Siber",
      description: "Lindungi aktivitas online Anda dengan enkripsi kelas militer, lebih dari 6000 server di 111 negara, pemblokir malware Threat Protection, dan koneksi super cepat tanpa batasan kuota.",
      features: ["6000+ server ultra-cepat di 111 negara", "Threat Protection untuk memblokir malware & tracker", "Kecepatan koneksi tertinggi tanpa limit bandwidth", "Dukungan hingga 10 perangkat secara bersamaan", "Fitur Double VPN & Onion Over VPN untuk privasi maksimal"],
    },
    en: {
      tagline: "Fastest & Most Secure VPN with Cyber Threat Protection",
      description: "Safeguard your digital life with military-grade encryption, 6000+ servers in 111 countries, built-in Threat Protection malware blocker, and blazing-fast unlimited bandwidth.",
      features: ["6000+ ultra-fast servers across 111 countries", "Threat Protection blocks malware, ads & trackers", "Ultra-high connection speed with no data limits", "Protect up to 10 devices simultaneously", "Double VPN & Onion Over VPN for ultimate privacy"],
    },
    zh: {
      tagline: "全球极速高安全 VPN，搭载先进网络威胁与恶意软件拦截",
      description: "采用军工级加密标准守护您的在线隐私，遍布全球 111 个国家的 6000+ 高速服务器节点，内置 Threat Protection 实时拦截恶意软件、广告追踪与钓鱼网站。",
      features: ["遍布全球 111 国的 6000+ 超高速专用节点", "内置 Threat Protection 拦截恶意软件与广告", "无限流量极速带宽，畅享 4K 极速流媒体跨区", "单账号支持多达 10 台设备同时安全连接", "双重加密 (Double VPN) 与混淆服务器极致私密"],
    },
  },
  surfshark: {
    id: {
      tagline: "VPN Privasi Tanpa Batas Perangkat dengan Kecepatan Tinggi",
      description: "Jelajahi internet dengan aman tanpa batasan jumlah perangkat. Dilengkapi fitur CleanWeb untuk memblokir iklan berbahaya, MultiHop, dan proteksi kebocoran DNS/IP.",
      features: ["Koneksi perangkat tanpa batas (Unlimited Devices)", "CleanWeb untuk memblokir iklan, pop-up, dan malware", "3200+ server RAM-only di 100 negara", "Bypass pembatasan geografis dengan mudah", "Garansi tanpa pencatatan log (Strict No-Logs)"],
    },
    en: {
      tagline: "Unlimited Devices High-Speed Privacy VPN",
      description: "Browse the web securely on unlimited devices simultaneously. Includes CleanWeb to block harmful ads, MultiHop routing, and private DNS leak protection.",
      features: ["Unlimited simultaneous device connections", "CleanWeb blocks intrusive ads and malware", "3200+ RAM-only servers in 100 countries", "Effortlessly bypass regional geo-restrictions", "Strict independently audited No-Logs policy"],
    },
    zh: {
      tagline: "支持无限设备同时连接的高速安全隐私 VPN",
      description: "一个账号即可保护全家所有设备，不限设备连接数量。内置 CleanWeb 强效过滤流氓广告与恶意弹窗，配备动态 MultiHop 双重跳板路由与 DNS 防泄漏保护。",
      features: ["支持无限台设备同时在线连接与使用", "CleanWeb 强效屏蔽广告、弹窗与恶意软件", "部署于 100 个国家的 3200+ 纯内存高速节点", "一键解锁全球流媒体与各大网站地区限制", "严格执行经第三方权威审计的无日志隐私策略"],
    },
  },
  canva: {
    id: {
      tagline: "Desain Grafis & Konten Profesional dengan Magic Studio AI",
      description: "Buka jutaan template premium, foto dan video stok berkualitas tinggi, penghapus background otomatis satu klik, kit merek profesional, dan alat AI Magic Studio terlengkap.",
      features: ["100+ juta foto, video, grafik, dan audio premium", "Magic Switch untuk resize desain instan ke berbagai ukuran", "Penghapus latar belakang foto & video 1-klik", "Brand Kit untuk konsistensi warna, font, dan logo", "Magic Write, Magic Edit & AI generator terintegrasi"],
    },
    en: {
      tagline: "Professional Design & Content Creation with Magic Studio AI",
      description: "Unlock millions of premium templates, high-res stock assets, 1-click background remover, brand kits, and the full suite of AI-powered Magic Studio tools.",
      features: ["100M+ premium stock photos, videos, and graphics", "Magic Switch to instantly resize designs for any platform", "One-click photo and video background remover", "Brand Kits for font, color, and logo management", "Full Magic Studio AI generation and editing suite"],
    },
    zh: {
      tagline: "专业视觉平面设计与全套 Magic Studio AI 智能创作套件",
      description: "畅享数以亿计的高清正版设计模板与商用素材库，支持一键智能抠图消除背景、品牌资产工具箱以及功能完备的 Magic Studio 生成式 AI 创意设计工具。",
      features: ["海量 1 亿+ 正版商用高清图片、视频与字体素材", "Magic Switch 智能一键多尺寸跨平台适配转换", "照片与视频一键精准秒级智能抠图去背景", "品牌工具箱轻松管理专属配色、字体与企业 Logo", "集成 Magic Write 智能文案与 AI 创意绘图功能"],
    },
  },
  capcut: {
    id: {
      tagline: "Editor Video All-in-One dengan Fitur AI & Efek Sinematik",
      description: "Edit video TikTok, Reels, dan YouTube dengan mudah. Dapatkan akses ke semua efek Pro, auto-caption multibahasa akurat, peningkatan kualitas video 4K, dan transisi viral.",
      features: ["Akses penuh semua filter, efek, dan transisi Pro", "Auto Captions otomatis dalam berbagai bahasa", "Peningkatan resolusi video bertenaga AI", "Hapus background video tanpa green screen", "Eksport kualitas 4K 60fps tanpa watermark"],
    },
    en: {
      tagline: "All-in-One Video Editor with Pro AI Features & Cinematic Effects",
      description: "Create viral TikTok, Reels, and YouTube videos with ease. Unlock all Pro transitions, accurate multilingual auto-captions, AI video upscaling, and watermark-free 4K export.",
      features: ["Full access to all Pro filters, effects, and transitions", "Accurate multilingual automatic video captions", "AI video quality enhancer and upscaler", "Instant background removal without green screen", "Export in crisp 4K 60fps without any watermark"],
    },
    zh: {
      tagline: "全能视频剪辑神器，搭载 Pro 级 AI 特效与高清无水印导出",
      description: "轻松剪辑爆款短视频、Vlog 与影视级大片。解锁全量 Pro 专属高级转场与特效滤镜、高精度多语种自动生成字幕、AI 视频画质超清修复及 4K 60fps 无水印导出。",
      features: ["解锁全量 Pro 专属影视级调色滤镜与潮流转场", "高精度多语言智能自动识别语音生成字幕", "AI 智能增强修复老旧或模糊视频画质", "无需绿幕一键智能抠像抠除视频背景", "支持 4K 60fps 超清最高规格无水印极速导出"],
    },
  },
  duolingo: {
    id: {
      tagline: "Belajar Bahasa Menyenangkan Tanpa Batas Heart & Bebas Iklan",
      description: "Kuasai lebih dari 40 bahasa dunia dengan Duolingo Super. Nikmati nyawa tak terbatas (Unlimited Hearts), latihan kesalahan yang dipersonalisasi, dan belajar tanpa jeda iklan.",
      features: ["Nyawa tak terbatas (Unlimited Hearts) bebas latihan", "Bebas dari segala bentuk iklan yang mengganggu", "Review kesalahan dan kuis pemulihan yang dipersonalisasi", "Uji keterampilan tak terbatas di setiap level", "Lacak progres dan pertahankan streak belajar harian"],
    },
    en: {
      tagline: "Fun Language Learning with Unlimited Hearts & Zero Ads",
      description: "Master over 40 languages with Duolingo Super. Enjoy unlimited hearts, personalized mistake practice reviews, legendary challenges, and an ad-free learning experience.",
      features: ["Unlimited Hearts for uninterrupted daily practice", "100% ad-free streamlined learning environment", "Personalized Mistake Practice review sessions", "Unlimited Legendary Challenge level attempts", "Streak repair and comprehensive progress tracking"],
    },
    zh: {
      tagline: "轻松高效掌握多门外语，无限爱心畅学与全程无广告",
      description: "借助 Duolingo Super 轻松学习全球 40 多种热门语言。尊享无限爱心生命值练习、个性化专属错题智能巩固复习，以及完全不受广告打扰的沉浸式进阶体验。",
      features: ["无限爱心无限次答题练习，告别等待冷却", "100% 纯净学习环境，全程无任何广告插播", "个性化智能错题本针对性专项巩固与练习", "无限制挑战传奇关卡检验学习成果", "连续打卡连胜保护与全方位学习进度统计"],
    },
  },
  coursera: {
    id: {
      tagline: "Akses 7000+ Kursus & Sertifikat Profesional Universitas Top",
      description: "Tingkatkan karir Anda dengan Coursera Plus. Dapatkan akses tak terbatas ke ribuan kursus, proyek terpandu, dan sertifikat profesional dari Google, IBM, Stanford, dan Meta.",
      features: ["Akses 7.000+ kursus dan sertifikat profesional tanpa batas", "Sertifikasi resmi dari Google, IBM, Meta, dan universitas ternama", "Proyek terpandu praktis (Guided Projects) siap kerja", "Jadwal belajar fleksibel sesuai ritme Anda sendiri", "Verifikasi sertifikat yang dapat ditambahkan ke LinkedIn"],
    },
    en: {
      tagline: "Access 7000+ Courses & Certificates from Top Universities",
      description: "Boost your career with Coursera Plus. Get unlimited access to thousands of courses, hands-on guided projects, and job-ready professional certificates from Google, IBM, Meta, and top universities.",
      features: ["Unlimited access to 7,000+ courses and programs", "Official certificates from Google, IBM, Meta, and top universities", "Hands-on Guided Projects for practical job experience", "Flexible learning schedule at your own pace", "Verifiable certificates shareable directly to LinkedIn"],
    },
    zh: {
      tagline: "畅学全球顶尖名校 7000+ 课程与 Google、IBM 专业权威认证",
      description: "通过 Coursera Plus 全面提升职业技能与竞争力。无限制畅学来自斯坦福、Google、IBM、Meta 等顶级名校与跨国企业的数千门精品课程、实战项目与权威微专业证书。",
      features: ["无限畅学 7000+ 门权威认证课程与专业项目", "斩获 Google、IBM、Meta 及顶尖名校官方证书", "实操型引导式项目 (Guided Projects) 快速上手", "自由自主把控学习节奏，随时随地在线修读", "支持一键添加可验证的官方证书至 LinkedIn"],
    },
  },
  notion: {
    id: {
      tagline: "Ruang Kerja All-in-One dengan Asisten AI Penulisan & Database",
      description: "Gabungkan catatan, dokumen, manajemen tugas, dan database dalam satu workspace terpadu. Lengkap dengan Notion AI untuk merangkum, menulis, dan menganalisis secara instan.",
      features: ["Notion AI tak terbatas untuk menulis dan merangkum dokumen", "Upload file tanpa batas ukuran", "Kolaborasi real-time tanpa batasan anggota", "Database canggih dengan formula dan automasi", "Riwayat versi halaman hingga 30 hari"],
    },
    en: {
      tagline: "All-in-One Connected Workspace with Built-in AI Writing",
      description: "Combine notes, docs, task management, and databases into one unified workspace. Supercharged with Notion AI to write, summarize, and automate workflows effortlessly.",
      features: ["Unlimited Notion AI for writing and document summaries", "Unlimited file upload file size limit", "Realtime collaboration with unlimited guests", "Advanced relational databases with automated formulas", "30-day page version history backup"],
    },
    zh: {
      tagline: "全能一体化协作工作空间，内置 Notion AI 智能写作与知识库",
      description: "将笔记、文档、项目管理、待办清单与复杂数据库融为一体。搭载深度集成的 Notion AI 智能助手，轻松实现长文提炼、头脑风暴、智能翻译与工作流自动化。",
      features: ["无限量使用 Notion AI 进行写作、润色与长文摘要", "支持无限制体积大小的文件与附件上传", "支持团队多人实时协同编辑与灵活权限管理", "支持复杂关联数据库、智能函数与自动化流", "提供长达 30 天的页面历史版本追溯与备份"],
    },
  },
};

import { multilingualCatalog } from "./multilingual-catalog";

export function translateGenericText(text: string, lang: LanguageCode): string {
  if (!text || lang === "id") return text;
  let s = text;
  if (lang === "en") {
    s = s
      .replace(/Paling Laris/gi, "Best Seller")
      .replace(/Hemat/gi, "Best Value")
      .replace(/Garansi Penuh/gi, "Full Warranty")
      .replace(/Garansi Resmi/gi, "Official Warranty")
      .replace(/Garansi/gi, "Warranty")
      .replace(/Aktivasi Instan/gi, "Instant Activation")
      .replace(/Stok Habis/gi, "Sold Out")
      .replace(/Stok Kosong/gi, "Out of Stock")
      .replace(/Stok:/gi, "Stock:")
      .replace(/Total Pembayaran/gi, "Total Payment")
      .replace(/Beli Sekarang/gi, "Buy Now")
      .replace(/Tambah ke Keranjang/gi, "Add to Cart")
      .replace(/1 Bulan/gi, "1 Month")
      .replace(/2 Bulan/gi, "2 Months")
      .replace(/3 Bulan/gi, "3 Months")
      .replace(/6 Bulan/gi, "6 Months")
      .replace(/12 Bulan/gi, "12 Months")
      .replace(/1 Tahun/gi, "1 Year")
      .replace(/2 Tahun/gi, "2 Years")
      .replace(/30 Hari/gi, "30 Days")
      .replace(/7 Hari/gi, "7 Days")
      .replace(/1 Hari/gi, "1 Day")
      .replace(/Akun Sharing/gi, "Shared Account")
      .replace(/Sharing/gi, "Shared")
      .replace(/Akun Privat/gi, "Private Account")
      .replace(/Akun Private/gi, "Private Account")
      .replace(/Private/gi, "Private")
      .replace(/Email Pribadi/gi, "Personal Email")
      .replace(/Akun Baru/gi, "New Account")
      .replace(/CARA ORDER \/ CARA PEMBELIAN:/gi, "HOW TO ORDER / PURCHASE GUIDE:")
      .replace(/HAL PENTING \/ CATATAN PENGGUNAAN:/gi, "IMPORTANT USAGE NOTES:")
      .replace(/Browser modern \(Chrome, Edge, Safari, Firefox\) dengan koneksi internet aktif\./gi, "Modern web browser (Chrome, Edge, Safari, Firefox) with active internet connection.")
      .replace(/Browser modern \(Chrome, Edge, Safari, Firefox\) dengan JavaScript aktif dan koneksi internet\./gi, "Modern web browser (Chrome, Edge, Safari, Firefox) with JavaScript and internet.")
      .replace(/Browser modern di semua perangkat dengan koneksi internet stabil\./gi, "Modern web browser on all devices with stable internet.")
      .replace(/Semua browser modern di desktop dan mobile dengan koneksi internet aktif\./gi, "All modern browsers on desktop and mobile with active internet.")
      .replace(/Android 8\.0 \(Oreo\) atau lebih baru dengan ruang penyimpanan kosong minimal 500 MB\./gi, "Android 8.0 (Oreo) or later with at least 500 MB free storage.")
      .replace(/iOS 14\.0 atau lebih baru untuk iPhone dan iPadOS 14\.0\+\./gi, "iOS 14.0 or later for iPhone and iPadOS 14.0+.")
      .replace(/Windows 10 \/ 11 64-bit\./gi, "Windows 10 / 11 64-bit.")
      .replace(/macOS 11\.0 \(Big Sur\) ke atas \(Apple Silicon M-Series atau Intel\)\./gi, "macOS 11.0 (Big Sur) or later (Apple Silicon M-Series or Intel).")
      .replace(/Distro Linux 64-bit \(Ubuntu, Debian, Fedora, Arch, dll\)\./gi, "64-bit Linux distributions (Ubuntu, Debian, Fedora, Arch, etc).")
      .replace(/resmi dengan jaminan garansi penuh selama masa aktif\./gi, "official with full warranty protection during the active period.")
      .replace(/resmi dengan proteksi garansi penuh selama masa aktif\./gi, "official with full warranty protection during the active period.");
  } else if (lang === "zh") {
    s = s
      .replace(/Paling Laris/gi, "热销爆款")
      .replace(/Hemat/gi, "超值特惠")
      .replace(/Garansi Penuh/gi, "全额质保")
      .replace(/Garansi Resmi/gi, "官方质保")
      .replace(/Garansi/gi, "质保")
      .replace(/Aktivasi Instan/gi, "自动秒开")
      .replace(/Stok Habis/gi, "已售罄")
      .replace(/Stok Kosong/gi, "暂无库存")
      .replace(/Stok:/gi, "库存:")
      .replace(/Total Pembayaran/gi, "应付总额")
      .replace(/Beli Sekarang/gi, "立即购买")
      .replace(/Tambah ke Keranjang/gi, "加入购物车")
      .replace(/1 Bulan/gi, "1 个月")
      .replace(/2 Bulan/gi, "2 个月")
      .replace(/3 Bulan/gi, "3 个月")
      .replace(/6 Bulan/gi, "6 个月")
      .replace(/12 Bulan/gi, "12 个月")
      .replace(/1 Tahun/gi, "1 年")
      .replace(/2 Tahun/gi, "2 年")
      .replace(/30 Hari/gi, "30 天")
      .replace(/7 Hari/gi, "7 天")
      .replace(/1 Hari/gi, "1 天")
      .replace(/Akun Sharing/gi, "共享账号")
      .replace(/Sharing/gi, "共享")
      .replace(/Akun Privat/gi, "独享专属账号")
      .replace(/Akun Private/gi, "独享专属账号")
      .replace(/Private/gi, "独享")
      .replace(/Email Pribadi/gi, "个人邮箱")
      .replace(/Akun Baru/gi, "全新账号")
      .replace(/CARA ORDER \/ CARA PEMBELIAN:/gi, "购买流程与下单指引：")
      .replace(/HAL PENTING \/ CATATAN PENGGUNAAN:/gi, "重要使用须知：")
      .replace(/Browser modern \(Chrome, Edge, Safari, Firefox\) dengan koneksi internet aktif\./gi, "现代主流浏览器（Chrome、Edge、Safari、Firefox）及稳定网络连接。")
      .replace(/Browser modern \(Chrome, Edge, Safari, Firefox\) dengan JavaScript aktif dan koneksi internet\./gi, "现代主流浏览器（支持 JavaScript）及稳定网络连接。")
      .replace(/Browser modern di semua perangkat dengan koneksi internet stabil\./gi, "支持全平台现代主流浏览器及稳定网络环境。")
      .replace(/Semua browser modern di desktop dan mobile dengan koneksi internet aktif\./gi, "桌面端与移动端主流现代浏览器。")
      .replace(/Android 8\.0 \(Oreo\) atau lebih baru dengan ruang penyimpanan kosong minimal 500 MB\./gi, "Android 8.0 及以上版本操作系统，建议预留 500 MB 可用储存空间。")
      .replace(/iOS 14\.0 atau lebih baru untuk iPhone dan iPadOS 14\.0\+\./gi, "适用于 iPhone 及 iPad 的 iOS 14.0 及更高版本操作系统。")
      .replace(/Windows 10 \/ 11 64-bit\./gi, "Windows 10 / 11 64 位操作系统。")
      .replace(/macOS 11\.0 \(Big Sur\) ke atas \(Apple Silicon M-Series atau Intel\)\./gi, "macOS 11.0 (Big Sur) 及更高版本（支持 Apple Silicon M 系列与 Intel 芯片）。")
      .replace(/Distro Linux 64-bit \(Ubuntu, Debian, Fedora, Arch, dll\)\./gi, "主流 64 位 Linux 发行版（Ubuntu、Debian、Fedora、Arch 等）。")
      .replace(/resmi dengan jaminan garansi penuh selama masa aktif\./gi, "正版授权，有效期内尊享全额免费换新与质保服务。")
      .replace(/resmi dengan proteksi garansi penuh selama masa aktif\./gi, "正版授权，有效期内尊享全额免费换新与质保服务。");
  }
  return s;
}

/**
 * Mencari translasi aplikasi berdasarkan id, slug, atau nama brand.
 */
export function getLocalizedApp(app: App, lang: LanguageCode): App {
  if (lang === "id") return app;

  const multi = multilingualCatalog[app.name]?.[lang];

  const key = app.slug?.toLowerCase() || app.id?.toLowerCase() || "";
  const nameKey = app.name.toLowerCase();

  let trans: AppTranslation | undefined;

  for (const [k, dict] of Object.entries(appTranslations)) {
    if (key.includes(k) || nameKey.includes(k)) {
      trans = dict[lang];
      break;
    }
  }

  const tagline = multi?.tagline || trans?.tagline || translateGenericText(app.tagline, lang);
  const description = multi?.description || trans?.description || translateGenericText(app.description, lang);
  const summary = multi?.summary || (app.summary ? translateGenericText(app.summary, lang) : undefined);
  const rawFeatures = multi?.features || (app.features && app.features.length > 0 ? app.features : (trans?.features || []));
  const localizedFeatures = rawFeatures.map((f) => translateGenericText(f, lang));

  const requirements: Partial<Record<Platform, string>> = {};
  if (multi?.requirements && Object.keys(multi.requirements).length > 0) {
    Object.assign(requirements, multi.requirements);
  } else if (app.requirements) {
    for (const [p, req] of Object.entries(app.requirements)) {
      if (req) {
        requirements[p as Platform] = translateGenericText(req, lang);
      }
    }
  }

  const localizedVariants = app.variants?.map((v) => ({
    ...v,
    name: translateGenericText(v.name, lang),
    description: multi?.variantDescriptions?.[v.id] || (v.description ? translateGenericText(v.description, lang) : undefined),
    badge: v.badge ? translateGenericText(v.badge, lang) : undefined,
  }));

  return {
    ...app,
    tagline,
    description,
    summary,
    features: localizedFeatures,
    requirements,
    variants: localizedVariants,
  };
}

/**
 * Menerjemahkan kategori berdasarkan ID/slug.
 */
export function getLocalizedCategory(cat: Category, lang: LanguageCode): Category {
  if (lang === "id") return cat;

  const trans = categoryTranslations[cat.id]?.[lang] || categoryTranslations[cat.slug]?.[lang];
  if (!trans) return cat;

  return {
    ...cat,
    name: trans.name || cat.name,
    description: trans.description || cat.description,
  };
}

export const bannerTranslations: Record<string, Record<LanguageCode, BannerTranslation>> = {
  "bn-001": {
    id: {
      title: "Pekan Streaming",
      description: "Disney, Netflix, dan Spotify dengan harga spesial — berakhir 31 Agustus.",
      cta: "Lihat Promo",
    },
    en: {
      title: "Streaming Week Special",
      description: "Special discounted rates for Disney+, Netflix 4K, and Spotify — valid until August 31.",
      cta: "View Promo",
    },
    zh: {
      title: "流媒体影音专场特惠",
      description: "Disney+、Netflix 4K 与 Spotify 独家会员折扣价 — 截止 8 月 31 日。",
      cta: "查看优惠",
    },
  },
  "bn-002": {
    id: {
      title: "Harga spesial ChatGPT Plus",
      description: "Akses penuh ChatGPT Plus, dikirim instan setelah pembayaran.",
      cta: "Beli Sekarang",
    },
    en: {
      title: "ChatGPT Plus Special Offer",
      description: "Full ChatGPT Plus premium access, instant automatic delivery after payment.",
      cta: "Buy Now",
    },
    zh: {
      title: "ChatGPT Plus 独家特惠",
      description: "ChatGPT Plus 完整官方高级功能，付款后即时全自动发货交付。",
      cta: "立即购买",
    },
  },
  "bn-003": {
    id: {
      title: "Tumbuh di Sosial Media",
      description: "Follower Instagram & TikTok HQ dengan proses aman dan bertahap.",
      cta: "Lihat Layanan",
    },
    en: {
      title: "Grow on Social Media",
      description: "High Quality Instagram & TikTok followers with safe, organic drip-feed delivery.",
      cta: "Explore Services",
    },
    zh: {
      title: "社交媒体极速增长",
      description: "高品质 Instagram 与 TikTok 真实粉丝，安全自然梯度交付提升互动率。",
      cta: "查看服务",
    },
  },
};

/**
 * Menerjemahkan promo banner berdasarkan ID / title.
 */
export function getLocalizedBanner(banner: Banner, lang: LanguageCode): Banner {
  if (lang === "id") return banner;

  const trans = bannerTranslations[banner.id]?.[lang];
  if (!trans) return banner;

  return {
    ...banner,
    title: trans.title || banner.title,
    description: trans.description || banner.description,
    cta: trans.cta || banner.cta,
  };
}
