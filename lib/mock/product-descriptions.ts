import type { Platform } from "@/types";

export interface ProductContentSpec {
  name: string;
  tagline: string;
  serviceDescription: string; // 2–4 kalimat ringkas, tanpa heading
  summary: string; // Penjelasan produk + CARA ORDER / PANDUAN PEMBELIAN + CATATAN PENGGUNAAN
  features: string[]; // 4–6 poin fitur otentik & terbaru
  requirements: Partial<Record<Platform, string>>; // Persyaratan platform nyata
  version: string; // Versi / model / tier resmi
  variantDescriptions?: Record<string, string>; // Penjelasan spesifik per variasi ID
}

export const descriptionsData: Record<string, ProductContentSpec> = {
  "Meitu VIP": {
    name: "Meitu VIP",
    tagline: "Edit Foto & Video Estetik dengan Filter & AI Retouching Eksklusif",
    serviceDescription: "Layanan akun premium Meitu VIP resmi untuk membuka seluruh koleksi filter estetika, preset makeup AI, dan alat retouching wajah 3D tanpa watermark. Sangat cocok untuk kreator konten dan pecinta fotografi mobile yang menginginkan hasil foto dan video berkualitas tinggi secara instan.",
    summary: `Meitu VIP memberikan akses tanpa batas ke ratusan preset warna sinematik, efek film vintage, penghapus objek pintar berbasis AI, dan perbaikan kualitas foto menjadi Ultra HD. Anda dapat mengedit foto portrait maupun video vertikal dengan kualitas visual setara studio profesional langsung dari smartphone Anda.

CARA ORDER / CARA PEMBELIAN:
1. Pilih durasi paket Meitu VIP yang Anda butuhkan (7 Hari, 30 Hari, 90 Hari, atau 1 Tahun) dan tentukan jumlah pesanan.
2. Klik tombol "Beli Sekarang", lalu lengkapi informasi kontak (Nama & Email/WhatsApp aktif) pada formulir pemesanan.
3. Selesaikan pembayaran menggunakan metode pilihan Anda (QRIS otomatis, Binance Pay, BNB BEP-20, atau Tron TRC-20) sesuai nominal pas termasuk kode unik.
4. Detail akun login Meitu VIP (Email & Password resmi) akan dikirimkan otomatis ke email dan halaman invoice pesanan Anda dalam waktu 1–15 menit.
5. Buka aplikasi Meitu di ponsel Android atau iPhone Anda, lakukan login dengan data yang diberikan, dan seluruh fitur VIP akan langsung aktif.
6. Klaim bantuan atau garansi penggantian akun baru 100% dengan menghubungi admin Telegram @tokonoo jika mengalami kendala selama masa aktif.

HAL PENTING / CATATAN PENGGUNAAN:
• Gunakan kredensial akun khusus yang diberikan untuk login pada aplikasi resmi Meitu.
• Dilarang mengubah informasi profil atau kata sandi akun utama demi menjaga kelancaran garansi penuh.`,
    features: [
      "Akses tak terbatas ke seluruh Filter VIP & Preset Warna Sinematik",
      "AI Retouching Wajah 3D & Body Reshape Alami",
      "Penghapus Objek AI (AI Eraser) & Ekstraksi Latar Belakang Presisi",
      "Ekspor Foto & Video Resolusi HD/4K 60fps Tanpa Watermark",
      "Fitur AI Anime & Karikatur Potret Otomatis Generasi Terbaru"
    ],
    requirements: {
      Android: "Android 8.0 (Oreo) atau lebih baru dengan ruang penyimpanan kosong minimal 500 MB.",
      iOS: "iOS 14.0 atau lebih baru untuk iPhone dan iPadOS 14.0+."
    },
    version: "v10.8 VIP Edition",
    variantDescriptions: {
      "meitu-7d": "Paket Meitu VIP aktif 7 Hari dengan garansi penuh selama masa pakai.",
      "meitu-30d": "Paket Meitu VIP aktif 30 Hari (1 Bulan) paling populer untuk kreator konten.",
      "meitu-90d": "Paket Meitu VIP aktif 90 Hari (3 Bulan) hemat untuk kebutuhan editing berkala.",
      "meitu-1y": "Paket Meitu VIP aktif 1 Tahun penuh dengan garansi resmi dan akses prioritas."
    }
  },

  "ChatGPT Plus Apple Pay": {
    name: "ChatGPT Plus Apple Pay",
    tagline: "Langganan Resmi OpenAI: GPT-5.6 Sol, Reasoning Mode, Canvas, DALL-E & Advanced Voice",
    serviceDescription: "Langganan resmi OpenAI ChatGPT Plus dengan metode penagihan Apple Pay resmi yang terkenal sangat stabil, aman, dan minim risiko suspend dibanding metode kartu virtual biasa. Memberikan prioritas penuh ke model AI tercanggih (GPT-5.6 Sol, mode penalaran tingkat tinggi), batas pesan tinggi, pembuatan gambar DALL-E, analisis data Python, dan mode suara interaktif.",
    summary: `ChatGPT Plus adalah asisten kecerdasan buatan terlengkap untuk profesional, developer, akademisi, dan kreator. Dengan paket Plus, Anda mendapatkan akses tanpa antrean ke model penalaran terkuat, fitur Canvas untuk kolaborasi penulisan dan pemrograman realtime, serta kemampuan menganalisis dokumen data berukuran besar.

CARA ORDER / CARA PEMBELIAN:
1. Pilih varian paket ChatGPT Plus yang Anda inginkan (Plus Apple Pay 1 Bulan, Go 3 Bulan, Pro 1 Bulan, atau Business 1 Bulan).
2. Masukkan nama dan email aktif Anda pada formulir checkout untuk penerimaan kredensial atau aktivasi akun.
3. Bayar menggunakan QRIS otomatis, Binance Pay, BNB BEP-20, atau Tron TRC-20 sesuai total tagihan termasuk kode unik.
4. Detail akun ChatGPT Plus siap pakai (Email & Password terverifikasi langganan resmi) akan dikirimkan otomatis dalam 1–15 menit.
5. Login di situs resmi chatgpt.com atau aplikasi resmi ChatGPT di iOS, Android, macOS, dan Windows.
6. Nikmati seluruh fitur Plus tanpa batas antrean dengan garansi penggantian akun baru 100% jika terjadi kendala langganan.

HAL PENTING / CATATAN PENGGUNAAN:
• Akun dapat digunakan di browser web maupun aplikasi resmi ChatGPT di seluruh perangkat Anda.
• Riwayat chat dan workspace tersimpan aman di cloud OpenAI. Hubungi admin Telegram @tokonoo jika memerlukan bantuan.`,
    features: [
      "Akses prioritas penuh ke model unggulan GPT-5.6 Sol dengan slider Reasoning Effort",
      "Batas kuota pesan (message limit) hingga 5x lebih tinggi dibanding paket gratis",
      "Fitur Canvas interaktif untuk penulisan artikel, revisi naskah, dan coding realtime",
      "Pembuatan gambar AI resolusi tinggi terintegrasi dengan DALL-E",
      "Advanced Data Analysis: unggah file CSV, Excel, PDF tebal, dan jalankan kode Python",
      "Mode Suara Lanjutan (Advanced Voice Mode) untuk percakapan lisan alami"
    ],
    requirements: {
      Web: "Browser modern (Chrome, Edge, Safari, Firefox) dengan JavaScript aktif dan koneksi internet.",
      Android: "Aplikasi resmi ChatGPT di Google Play Store (Android 6.0+).",
      iOS: "Aplikasi resmi ChatGPT di Apple App Store (iOS 16.1+).",
      macOS: "Aplikasi desktop resmi ChatGPT untuk macOS (Apple Silicon M-Series / Intel) macOS 14+.",
      Windows: "Aplikasi desktop resmi ChatGPT Windows 10/11 64-bit."
    },
    version: "2026.3 OpenAI Official",
    variantDescriptions: {
      "chatgpt-plus-1m": "Akun ChatGPT Plus 1 Bulan via Apple Pay billing resmi dengan garansi penuh 30 hari.",
      "chatgpt-go-3m": "Paket ChatGPT Go 3 Bulan hemat untuk produktivitas belajar dan kerja harian.",
      "chatgpt-pro-1m": "Akun ChatGPT Pro 1 Bulan dengan alokasi komputasi dan batas pesan tertinggi.",
      "chatgpt-biz-1m": "Akun ChatGPT Business 1 Bulan untuk kolaborasi tim kerja dan privasi enterprise."
    }
  },

  "Gemini AI Pro": {
    name: "Gemini AI Pro",
    tagline: "Google AI Premium: Gemini 1.5 Pro, 1 Juta Token Context & Google One Cloud Storage",
    serviceDescription: "Langganan resmi Google One AI Premium yang memberikan akses eksklusif ke model kecerdasan buatan Gemini 1.5 Pro dengan jendela konteks raksasa 1.000.000 token, generator gambar Imagen 3, dan integrasi cerdas di Google Workspace (Docs, Gmail, Sheets). Sangat ideal untuk membaca buku tebal, ratusan halaman PDF, atau repositori kode besar dalam satu prompt.",
    summary: `Gemini AI Pro dari Google dirancang untuk produktivitas tingkat lanjut. Anda dapat memasukkan video berdurasi 1 jam, ratusan lembar berkas keuangan, atau puluhan dokumen riset sekaligus untuk dianalisis secara mendalam tanpa khawatir kehabisan batas konteks token.

CARA ORDER / CARA PEMBELIAN:
1. Pilih variasi paket Gemini AI Pro yang tersedia (Gemini Pro 12 Bulan 5TB atau Gemini Ultra 1 Bulan 30TB).
2. Isi data kontak Anda (Nama & Email/WhatsApp) pada form pembelian.
3. Lakukan pembayaran via QRIS, Binance Pay, BNB, atau Tron dengan nominal pas termasuk kode unik.
4. Kredensial akun Google dengan status langganan AI Premium aktif akan dikirimkan otomatis ke email dan dashboard pesanan Anda.
5. Login di gemini.google.com atau aplikasi Google Gemini di smartphone.
6. Untuk varian dengan stok habis (Sold Out), silakan pilih variasi aktif lainnya yang tersedia.

HAL PENTING / CATATAN PENGGUNAAN:
• Akun Google siap pakai dengan fitur AI Premium aktif dan penyimpanan Google One Cloud.
• Didukung full garansi masa aktif dengan konsultasi cepat via admin Telegram @tokonoo.`,
    features: [
      "Akses penuh ke model Gemini 1.5 Pro generasi terbaru dari Google DeepMind",
      "Jendela konteks ultra besar 1.000.000 token (analisis dokumen tebal & video panjang)",
      "Integrasi AI langsung di Gmail, Google Docs, Google Slides, dan Google Sheets",
      "Generator gambar AI generasi terbaru Google Imagen 3",
      "Fitur Deep Research untuk sintesis data otomatis dari berbagai sumber web"
    ],
    requirements: {
      Web: "Browser modern (Google Chrome, Microsoft Edge, Safari, Firefox) dengan koneksi internet aktif.",
      Android: "Aplikasi Google Gemini / Google App di Android 10.0 ke atas.",
      iOS: "Aplikasi Google Gemini di iOS 16.0+."
    },
    version: "v1.5 Pro Google One",
    variantDescriptions: {
      "gemini-pro-18m-5tb": "Akun Google One AI Premium 18 Bulan 5TB (Stok Habis / Sold Out).",
      "gemini-pro-12m-5tb": "Akun Google One AI Premium 12 Bulan dengan kapasitas cloud storage 5TB.",
      "gemini-ultra-1m-30tb": "Akun Google Gemini Ultra 1 Bulan dengan kapasitas cloud super besar 30TB."
    }
  },

  "Claude AI Pro": {
    name: "Claude AI Pro",
    tagline: "Model AI Tercanggih Anthropic: Claude 3.5 Sonnet, Artifacts & 200K Context Window",
    serviceDescription: "Langganan premium Claude AI Pro dari Anthropic yang menghadirkan model tercanggih untuk coding, penalaran logika kompleks, dan penulisan bernuansa alami (Claude 3.5 Sonnet & Claude 3 Opus). Dilengkapi fitur Artifacts untuk me-render kode program, diagram, dan antarmuka web interaktif secara realtime di samping percakapan chat.",
    summary: `Claude AI Pro diakui sebagai salah satu AI terbaik dunia untuk software engineer, peneliti, dan penulis profesional. Jendela konteks 200.000 token memungkinkan Anda menganalisis repositori kode proyek, dokumen teknis panjang, dan laporan keuangan komprehensif dengan akurasi sangat tinggi.

CARA ORDER / CARA PEMBELIAN:
1. Pilih variasi paket yang diinginkan (Akun Claude Max 5x/20x atau API Key Token 100M/200M).
2. Masukkan nama dan email Anda pada formulir checkout pemesanan.
3. Selesaikan transaksi melalui QRIS, Binance Pay, BNB, atau Tron.
4. Data login akun Claude Pro atau API Key instan akan otomatis dikirimkan ke email dan invoice status pesanan.
5. Untuk Akun Pro: Buka claude.ai dan login dengan kredensial yang diberikan. Untuk API Key: Masukkan key ke IDE/aplikasi Anda.
6. Dapatkan jaminan garansi penggantian akun baru 100% jika terjadi kendala selama masa durasi aktif.

HAL PENTING / CATATAN PENGGUNAAN:
• Gunakan sesi akun secara wajar sesuai kapasitas pemakaian yang ditentukan penyedia.
• Simpan kredensial login atau API Key di tempat yang aman.`,
    features: [
      "Akses prioritas tanpa batas antrean ke Claude 3.5 Sonnet dan Claude 3 Opus",
      "Fitur Artifacts interaktif untuk preview kode React, HTML, SVG, dan diagram Mermaid realtime",
      "Batas kuota pesan 5x lebih banyak dibanding akun gratis",
      "Jendela konteks besar 200.000 token (~150.000 kata dalam satu sesi chat)",
      "Fitur Claude Projects untuk mengelompokkan dokumen referensi dan prompt khusus tim"
    ],
    requirements: {
      Web: "Browser modern (Chrome, Safari, Firefox, Edge) di desktop atau laptop.",
      Android: "Aplikasi resmi Claude di Google Play Store.",
      iOS: "Aplikasi resmi Claude di Apple App Store (iOS 16.0+).",
      macOS: "Aplikasi desktop Claude untuk macOS atau via browser.",
      Windows: "Aplikasi desktop Claude Windows atau via browser."
    },
    version: "3.5 Sonnet / Opus Edition",
    variantDescriptions: {
      "claude-api-100m": "API Key Claude Token 100M resmi untuk integrasi bot, tools, atau Cursor IDE (Exp 1 Hari).",
      "claude-api-200m": "API Key Claude Token 200M kapasitas besar untuk aplikasi enterprise dan riset (Exp 1 Hari).",
      "claude-max-5x-1m": "Akun Claude AI Max 5x 1 Bulan untuk kebutuhan chat dan coding harian intensif.",
      "claude-max-20x-1m": "Akun Claude AI Max 20x 1 Bulan untuk developer dan workflow profesional beban tinggi."
    }
  },

  "Perplexity AI Pro": {
    name: "Perplexity AI Pro",
    tagline: "Mesin Pencari AI Cerdas dengan Sitasi Sumber Terpercaya, Copilot & Multi-Model Switcher",
    serviceDescription: "Langganan resmi Perplexity AI Pro untuk riset dan pencarian informasi cerdas tanpa iklan. Menggabungkan penjelajahan web realtime dengan sitasi sumber akademis terpercaya, upload file tanpa batas, serta kebebasan beralih antara model AI terdepan di dunia seperti Claude 3.5 Sonnet, GPT-4o, dan Sonar Large.",
    summary: `Perplexity Pro mengubah cara Anda mencari informasi di internet. Daripada membuka puluhan tab pencarian manual, Perplexity Pro memberikan rangkuman terstruktur yang dilengkapi tautan sumber asli, grafik interaktif, dan penalaran bertingkat (Pro Search).

CARA ORDER / CARA PEMBELIAN:
1. Pilih variasi paket Perplexity Pro (Pro 1 Bulan, Education Pro, atau Max 1 Bulan) lalu klik "Beli Sekarang".
2. Lengkapi formulir pemesanan dengan nama dan email aktif Anda.
3. Bayar melalui QRIS, Binance Pay, BNB, atau Tron sesuai nominal pas.
4. Detail akun Perplexity Pro siap pakai akan otomatis dikirimkan ke email dan status pesanan.
5. Login di perplexity.ai atau aplikasi mobile/desktop Perplexity, lalu aktifkan mode Pro Search.
6. Garansi penuh berlaku selama masa aktif dengan dukungan teknis admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Akun berstatus Pro aktif dengan kuota Pro Search harian besar dan kredit bulanan generator gambar.
• Bebas memilih model default (Claude 3.5 Sonnet / GPT-4o) pada menu pengaturan profil akun.`,
    features: [
      "Akses Pro Search (Copilot) harian tanpa batas dengan penjelajahan multi-sumber mendalam",
      "Bebas beralih model AI utama: Claude 3.5 Sonnet, GPT-4o, dan Sonar Large 32k",
      "Unggah dan analisis berkas tanpa batas (PDF, CSV, Word, teks kode)",
      "Pencarian akademis terverifikasi dengan sitasi jurnal ilmiah asli",
      "Kredit bulanan untuk pembuatan gambar AI (Playground v3, FLUX, DALL-E)"
    ],
    requirements: {
      Web: "Semua browser modern di desktop dan mobile dengan koneksi internet aktif.",
      Android: "Aplikasi resmi Perplexity di Google Play Store.",
      iOS: "Aplikasi resmi Perplexity di Apple App Store.",
      macOS: "Aplikasi native Perplexity macOS atau via web.",
      Windows: "Aplikasi native Perplexity Windows atau via web."
    },
    version: "2026 Pro Edition",
    variantDescriptions: {
      "perplexity-pro-1m": "Akun Perplexity AI Pro 1 Bulan siap pakai dengan fitur Pro Search tak terbatas.",
      "perplexity-edu-1m": "Akun Perplexity Education Pro 1 Bulan khusus riset akademis dan literatur ilmiah.",
      "perplexity-max-1m": "Akun Perplexity Max 1 Bulan dengan alokasi komputasi prioritas tertinggi."
    }
  },

  "Cursor AI Pro": {
    name: "Cursor AI Pro",
    tagline: "Code Editor AI Terbaik untuk Developer: Composer Multi-File, Tab Autocomplete & Indexing",
    serviceDescription: "Langganan resmi Cursor AI Pro — code editor berbasis VS Code yang diintegrasikan langsung dengan model AI terdepan (Claude 3.5 Sonnet, GPT-4o). Dilengkapi fitur Composer untuk membuat dan mengedit banyak file sekaligus dari instruksi teks, Cursor Tab untuk autocomplete multi-baris prediktif, dan pemahaman penuh struktur codebase proyek.",
    summary: `Cursor AI Pro adalah senjata utama software engineer modern. Anda dapat menjelaskan fitur baru dalam bahasa alami dan Cursor Composer akan otomatis membuat arsitektur file, mengimpor dependency, serta memperbaiki bug di seluruh folder proyek Anda secara akurat.

CARA ORDER / CARA PEMBELIAN:
1. Pilih durasi paket Cursor AI Pro yang Anda butuhkan (1 Bulan, Pro+ 3x, Ultra 20x, atau 1 Tahun).
2. Isi data kontak Anda pada halaman checkout pemesanan.
3. Selesaikan pembayaran menggunakan QRIS, Binance Pay, BNB, atau Tron.
4. Kredensial akun Cursor Pro aktif akan dikirimkan otomatis ke email Anda dalam waktu 1–15 menit.
5. Unduh aplikasi Cursor di cursor.com, login dengan akun yang diberikan, dan buka folder proyek Anda.
6. Garansi penggantian akun baru 100% jika terjadi masalah selama durasi paket aktif.

HAL PENTING / CATATAN PENGGUNAAN:
• Cursor kompatibel 100% dengan seluruh ekstensi, tema, keybindings, dan konfigurasi VS Code Anda.
• Fitur Fast Requests akan langsung aktif di dashboard editor Anda.`,
    features: [
      "500 Fast Premium Requests bulanan ke model Claude 3.5 Sonnet & GPT-4o",
      "Unlimited Slow Requests tanpa batas setelah kuota Fast habis",
      "Cursor Composer: AI agent untuk membuat dan memodifikasi multi-file secara simultan",
      "Cursor Tab: Autocomplete prediktif multi-baris berkecepatan milidetik",
      "Full Codebase Indexing untuk pemahaman menyeluruh atas seluruh file proyek Anda"
    ],
    requirements: {
      Windows: "Windows 10 / 11 64-bit.",
      macOS: "macOS 11.0 (Big Sur) ke atas (Apple Silicon M-Series atau Intel).",
      Linux: "Distro Linux 64-bit (Ubuntu, Debian, Fedora, Arch, dll)."
    },
    version: "v0.45+ Pro Build",
    variantDescriptions: {
      "cursor-pro-1m": "Akun Cursor Pro 1 Bulan dengan 500 Fast Requests dan Composer aktif.",
      "cursor-pro-plus-3x-1m": "Akun Cursor Pro+ 3x 1 Bulan untuk developer dengan beban kerja tinggi.",
      "cursor-ultra-20x-1m": "Akun Cursor Ultra 20x 1 Bulan untuk tim engineering dan proyek skala besar.",
      "cursor-pro-1y": "Akun Cursor Pro 1 Tahun penuh dengan garansi resmi dan hemat biaya."
    }
  },

  "Grok Super AI": {
    name: "Grok Super AI",
    tagline: "Akses Eksklusif xAI Grok 2 & Grok 3 dengan Data Real-Time X dan Generator Gambar Flux",
    serviceDescription: "Langganan resmi Super Grok AI dari xAI (Elon Musk) yang memberikan akses prioritas ke model Grok generasi terbaru dengan pemahaman tren dunia terkini secara realtime dari platform X (Twitter), penalaran mendalam tanpa sensor berlebih, dan generator gambar fotorealistik Flux.",
    summary: `Grok AI unggul dalam kecepatan analisis berita terkini, tren pasar finansial, isu global, serta pembuatan konten kreatif dengan sudut pandang tajam dan data yang selalu diperbarui setiap detik langsung dari percakapan publik di platform X.

CARA ORDER / CARA PEMBELIAN:
1. Pilih varian paket Super Grok yang diinginkan (7 Hari, 1 Bulan Lite/Standar/Plus, atau 1 Tahun).
2. Lengkapi formulir pembelian dan lakukan checkout.
3. Bayar via QRIS, Binance Pay, BNB, atau Tron sesuai nominal pas.
4. Kredensial akun X / Grok dengan status Super Grok aktif akan dikirimkan otomatis ke email Anda.
5. Login di grok.com atau aplikasi X di ponsel/komputer Anda dan mulai berinteraksi dengan Grok.
6. Full garansi penggantian akun selama durasi langganan aktif via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Gunakan akun sesuai dengan ketentuan komunitas dan panduan penggunaan platform resmi.`,
    features: [
      "Akses penuh ke model unggulan xAI Grok 2 & Grok 3 generasi terbaru",
      "Integrasi informasi dan tren berita realtime dari seluruh jaringan platform X",
      "Generator gambar AI canggih Flux dengan detail fotorealistik tinggi",
      "Mode penalaran Think Mode untuk memecahkan persoalan matematika dan coding kompleks",
      "Pilihan gaya interaksi cerdas (Fun Mode & Normal Mode) yang adaptif"
    ],
    requirements: {
      Web: "Browser modern di semua perangkat dengan koneksi internet stabil.",
      Android: "Aplikasi X atau browser Android 8.0+.",
      iOS: "Aplikasi X atau browser iOS 15.0+."
    },
    version: "Grok 3 / 2026 Edition",
    variantDescriptions: {
      "grok-7d": "Akun Super Grok aktif 7 Hari untuk kebutuhan riset kilat dan uji coba fitur.",
      "grok-lite-1m": "Akun Super Grok Lite 1 Bulan hemat untuk akses chat dan analisis tren.",
      "grok-std-1m": "Akun Super Grok 1 Bulan Standar paling populer dengan akses fitur penuh.",
      "grok-heavy-1m": "Akun Super Grok Heavy 1 Bulan untuk kreator konten dan analisis data intensif.",
      "grok-1y": "Akun Super Grok 1 Tahun penuh dengan garansi resmi dan hemat biaya."
    }
  },

  "Lovable AI Pro": {
    name: "Lovable AI Pro",
    tagline: "Buat Aplikasi Web Full-Stack Instan Berbasis AI dengan Integrasi Supabase & GitHub",
    serviceDescription: "Langganan akun Lovable AI Pro (lovable.dev) untuk membangun aplikasi web full-stack siap produksi hanya dari deskripsi teks bahasa alami. Menghasilkan kode React, Tailwind CSS, dan TypeScript bersih, terhubung otomatis ke repositori GitHub, serta database Supabase.",
    summary: `Lovable Pro memangkas waktu pembuatan prototipe dan aplikasi web bisnis dari hitungan minggu menjadi beberapa menit saja. Dilengkapi live preview interaktif, visual editor untuk mengedit elemen secara langsung, dan dukungan deployment custom domain instan.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket 1 Bulan Akun Private Pro Tier Lovable AI lalu klik "Beli Sekarang".
2. Masukkan nama dan email Anda pada form checkout.
3. Selesaikan pembayaran menggunakan QRIS, Binance Pay, BNB, atau Tron.
4. Kredensial akun Lovable Pro (Email & Password) akan dikirimkan otomatis ke email Anda dalam 1–15 menit.
5. Login di lovable.dev, mulai bangun aplikasi web baru, dan hubungkan repositori GitHub Anda.
6. Garansi 30 hari penuh dengan bantuan teknis via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Akun private eksklusif untuk Anda dengan alokasi kredit Pro tier aktif.
• Kode sumber aplikasi 100% milik Anda dan dapat diekspor langsung ke GitHub.`,
    features: [
      "Pembuatan UI web full-stack interaktif dari prompt bahasa alami",
      "Export kode sumber bersih ke GitHub (React, Vite, Tailwind CSS, Lucide)",
      "Integrasi database, autentikasi pengguna, dan backend otomatis dengan Supabase",
      "Fitur Visual Editing: klik elemen pada preview untuk mengubah teks atau layout langsung",
      "Dukungan custom domain dan hosting cloud berkecepatan tinggi"
    ],
    requirements: {
      Web: "Browser modern berbasis Chromium (Chrome, Edge, Brave) atau Safari/Firefox pada PC/laptop."
    },
    version: "Pro Cloud 2026",
    variantDescriptions: {
      "lovable-pro-1m": "Akun Private Lovable AI Pro 1 Bulan dengan alokasi kredit penuh dan GitHub sync."
    }
  },

  "Manus AI Pro": {
    name: "Manus AI Pro",
    tagline: "Autonomous General AI Agent untuk Riset Kompleks, Otomatisasi & Eksekusi Tugas Mandiri",
    serviceDescription: "Akses akun Manus AI Pro (Early Access) — agen kecerdasan buatan otonom pertama di dunia yang mampu merencanakan, menjelajahi web, menganalisis data, menulis kode, dan menyelesaikan alur kerja multi-langkah secara mandiri dari satu perintah tunggal.",
    summary: `Manus AI bukan sekadar chatbot biasa, melainkan asisten otonom yang bekerja di lingkungan komputasi virtual independen untuk mengeksekusi tugas berat seperti riset kompetitor pasar, pengumpulan data web, atau penyusunan laporan bisnis komprehensif tanpa perlu dipandu berulang kali.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket 1 Bulan Akun Akses Early Pro Manus AI.
2. Lengkapi data pemesanan pada form checkout.
3. Bayar via QRIS, Binance Pay, BNB, atau Tron sesuai tagihan.
4. Kredensial login akun Manus AI Pro akan dikirimkan otomatis ke email Anda.
5. Buka platform web Manus AI di browser desktop, login, dan berikan tugas komprehensif pertama Anda.
6. Garansi penuh 30 hari selama masa aktif langganan.

HAL PENTING / CATATAN PENGGUNAAN:
• Slot akses awal terbatas. Gunakan agen untuk otomatisasi riset dan eksekusi tugas profesional.`,
    features: [
      "Agen AI otonom dengan kemampuan eksekusi tugas multi-langkah mandiri",
      "Virtual Browser terintegrasi untuk penjelajahan dan ekstraksi data web interaktif",
      "Sandbox Python terisolasi untuk analisis data dan pembuatan visualisasi grafik",
      "Penyusunan dokumen laporan akhir berformat rapi lengkap dengan sumber referensi",
      "Penyelesaian alur kerja kompleks hanya dari 1 instruksi awal"
    ],
    requirements: {
      Web: "Browser desktop modern (Google Chrome disarankan) dengan koneksi internet cepat."
    },
    version: "Early Pro Access 2026",
    variantDescriptions: {
      "manus-pro-1m": "Akun Akses Early Pro Manus AI 1 Bulan dengan kuota komputasi agen mandiri."
    }
  },

  "ElevenLabs Voice AI": {
    name: "ElevenLabs Voice AI",
    tagline: "Voice AI Paling Realistis di Dunia: Text-to-Speech Alami, Voice Cloning & AI Dubbing",
    serviceDescription: "Layanan saldo kredit redeem resmi dan akun ElevenLabs Voice AI untuk menghasilkan suara narasi AI yang sangat alami dan beremosi tinggi dalam 30+ bahasa, kloning suara instan dari rekaman pendek, serta dubbing video otomatis dengan penerjemahan multi-bahasa.",
    summary: `ElevenLabs adalah standar emas industri suara kecerdasan buatan. Digunakan secara luas oleh kreator konten YouTube, podcaster, pengembang game, dan penerbit buku audio untuk menghasilkan voiceover profesional tanpa biaya studio rekaman mahal.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket ElevenLabs yang Anda butuhkan (Redeem 300K, 1M, 3M Credits, atau ElevenReader Ultra 1 Tahun).
2. Lakukan checkout dan isi informasi kontak Anda.
3. Selesaikan pembayaran melalui QRIS, Binance Pay, BNB, atau Tron.
4. Kode voucher redeem resmi atau detail akun akan dikirimkan instan ke email dan invoice Anda.
5. Untuk Kode Redeem: Masuk ke elevenlabs.io, buka menu Subscription / Billing, lalu masukkan kode voucher Anda untuk menambah kuota kredit secara instan.
6. Garansi resmi berlaku selama durasi paket yang Anda pilih via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Kode voucher redeem resmi dapat langsung ditukarkan ke akun ElevenLabs pribadi Anda.
• Format ekspor audio berkualitas tinggi (MP3 / WAV studio quality).`,
    features: [
      "Generasi suara AI Text-to-Speech paling natural dengan kontrol emosi dan intonasi presisi",
      "Dukungan lebih dari 30 bahasa termasuk Bahasa Indonesia, Inggris, Mandarin, Jepang, dll",
      "Instant Voice Cloning: kloning suara sendiri hanya dari sampel audio 1 menit",
      "AI Video & Audio Dubbing otomatis dengan sinkronisasi karakter suara",
      "Ekspor audio kualitas studio tanpa kompresi berlebih (WAV / MP3 44.1kHz)"
    ],
    requirements: {
      Web: "Browser modern di semua perangkat (Desktop, Laptop, Tablet, Smartphone)."
    },
    version: "v2 Voice Generative Engine",
    variantDescriptions: {
      "eleven-1": "Kode Redeem Resmi ElevenLabs 300K Karakter Kredit dengan garansi penuh.",
      "eleven-2": "Kode Redeem Resmi ElevenLabs 1 Juta Karakter Kredit untuk produksi konten skala menengah.",
      "eleven-3": "Kode Redeem Resmi ElevenLabs 3 Juta Karakter Kredit untuk studio dan podcaster.",
      "eleven-4": "Akun ElevenReader Ultra 1 Tahun penuh untuk membaca artikel dan buku dengan suara AI alami."
    }
  },

  "Runway Gen-3 AI Pro": {
    name: "Runway Gen-3 AI Pro",
    tagline: "AI Video Generator Sinematik: Text-to-Video, Image-to-Video & Kontrol Kamera 3D",
    serviceDescription: "Langganan resmi akun Runway Gen-3 Alpha AI Standard (625 Kredit) untuk membuat video sinematik berkualitas tinggi dari teks atau gambar diam. Dilengkapi kontrol pergerakan kamera sinematik, motion brush presisi, dan resolusi video tajam hingga 4K.",
    summary: `Runway Gen-3 Alpha menghadirkan fidelitas visual video AI dengan pencahayaan realistis, konsistensi karakter manusia, dan fisika pergerakan yang mulus. Solusi utama untuk video klip musik, iklan produk visual, dan aset video media sosial.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket 1 Bulan Akun Standard (625 Credits) Runway Gen-3 AI Pro.
2. Lakukan pembelian dan selesaikan pembayaran via QRIS, Binance Pay, BNB, atau Tron.
3. Kredensial akun Runway siap pakai akan dikirim otomatis ke email Anda dalam 1–15 menit.
4. Login di runwayml.com, masuk ke menu Gen-3 Alpha, dan mulai render video AI Anda.
5. Garansi 30 hari penuh dengan bantuan admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Alokasi 625 kredit dapat digunakan untuk render video Gen-3 Alpha dan fitur kreatif lainnya tanpa watermark.`,
    features: [
      "Akses penuh ke model video tercanggih Runway Gen-3 Alpha",
      "Generasi Text-to-Video dan Image-to-Video berdurasi 5–10 detik per klip",
      "Camera Control canggih (Pan, Tilt, Zoom, Roll, Dolly) untuk pergerakan sinematik",
      "Motion Brush untuk menggerakkan bagian spesifik pada gambar",
      "Penghapus latar belakang video (Green Screen AI) & Inpainting video otomatis"
    ],
    requirements: {
      Web: "Browser desktop modern (Chrome / Edge) dengan akselerasi hardware GPU aktif.",
      iOS: "Aplikasi resmi RunwayML di iOS App Store."
    },
    version: "Gen-3 Alpha Standard",
    variantDescriptions: {
      "runway-standard-1m": "Akun Runway Standard 1 Bulan dengan 625 Credits dan akses Gen-3 Alpha."
    }
  },

  "Leonardo AI Pro": {
    name: "Leonardo AI Pro",
    tagline: "Platform Seni AI & Desain Game: 8.500 Kredit, Custom Models & Motion Video AI",
    serviceDescription: "Langganan akun Leonardo AI Pro dengan alokasi 8.500 Token Kredit untuk menghasilkan ilustrasi digital memukau, aset game 3D, konsep seni, foto fotorealistik dengan model Leonardo Phoenix, dan animasi video pendek berkecepatan tinggi.",
    summary: `Leonardo AI menawarkan studio pembuatan gambar AI paling fleksibel bagi desainer dan artist digital. Dilengkapi fitur Realtime Canvas, Universal Upscaler untuk memperjelas detail gambar, serta ratusan model komunitas siap pakai.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket Leonardo AI 8.500 Credits 1 Bulan lalu klik "Beli Sekarang".
2. Selesaikan transaksi menggunakan QRIS, Binance Pay, BNB, atau Tron.
3. Data akun Leonardo AI Pro akan dikirimkan otomatis ke email Anda.
4. Login di leonardo.ai atau aplikasi iOS Leonardo, lalu mulai kreasi seni Anda.
5. Garansi penuh 30 hari dengan support admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Saldo 8.500 kredit memungkinkan pembuatan ratusan gambar resolusi tinggi tanpa antre.`,
    features: [
      "Alokasi 8.500 Fast Token Credits untuk render gambar tanpa antre",
      "Akses ke model unggulan Leonardo Phoenix dan FLUX",
      "Fitur Realtime Canvas: coretan sketsa langsung berubah menjadi gambar AI",
      "Motion Video AI: ubah gambar statis menjadi animasi video dinamis",
      "AI Canvas Editor untuk Inpainting, Outpainting, dan pengeditan detail"
    ],
    requirements: {
      Web: "Browser modern di PC, Laptop, atau Tablet.",
      iOS: "Aplikasi resmi Leonardo.Ai di iOS App Store."
    },
    version: "Pro Studio 2026",
    variantDescriptions: {
      "leonardo-pro-1m": "Akun Leonardo AI Pro 1 Bulan dengan saldo 8.500 Fast Credits dan akses Phoenix."
    }
  },

  "Wispr Flow Pro": {
    name: "Wispr Flow Pro",
    tagline: "Voice-to-Text AI 3x Lebih Cepat dari Mengetik dengan Auto-Formatting Cerdas",
    serviceDescription: "Langganan akun Wispr Flow Pro Unlimited untuk dikte suara ke teks berbasis AI di komputer Mac dan Windows. Mampu menangkap ucapan dengan akurasi 99%, otomatis menyusun tanda baca, menghapus kata gumam, dan menyesuaikan gaya bahasa sesuai konteks aplikasi yang sedang dibuka.",
    summary: `Wispr Flow menggantikan kebiasaan mengetik yang lambat dengan kecepatan suara Anda. Berfungsi di semua aplikasi (WhatsApp, Word, Gmail, Slack, Cursor, VS Code) tanpa perlu instalasi plugin tambahan.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket 1 Bulan Akun Pro Unlimited Wispr Flow.
2. Lakukan checkout dan bayar melalui QRIS, Binance Pay, BNB, atau Tron.
3. Kredensial akun Wispr Flow Pro akan dikirimkan langsung ke email Anda.
4. Unduh aplikasi Wispr Flow di macOS atau Windows, login, dan aktifkan shortcut mic.
5. Mulai bicara di aplikasi apa pun dan teks rapi akan otomatis terketik instan.
6. Garansi penuh 30 hari selama masa langganan aktif.

HAL PENTING / CATATAN PENGGUNAAN:
• Memerlukan mikrofon yang berfungsi dengan baik pada komputer Anda.`,
    features: [
      "Kecepatan dikte hingga 3x lebih cepat dibanding mengetik keyboard manual",
      "Auto-Formatting cerdas: otomatis menyusun paragraf, poin, dan tanda baca tepat",
      "Bekerja universal di atas semua aplikasi macOS & Windows",
      "Dukungan multi-bahasa dengan deteksi aksen otomatis",
      "Voice Editing: edit atau revisi kalimat hanya dengan perintah suara"
    ],
    requirements: {
      macOS: "macOS 13.0 (Ventura) atau lebih baru (Apple Silicon & Intel).",
      Windows: "Windows 10 / 11 64-bit."
    },
    version: "v1.4 Pro Unlimited",
    variantDescriptions: {
      "wispr-flow-1m": "Akun Wispr Flow Pro 1 Bulan dengan kuota dikte suara tak terbatas (Unlimited)."
    }
  },

  "Spotify Premium": {
    name: "Spotify Premium",
    tagline: "Streaming Musik & Podcast Bebas Iklan, Unduh Offline & Kualitas Audio 320kbps",
    serviceDescription: "Langganan resmi Spotify Premium untuk mendengarkan lebih dari 100 juta lagu dan podcast favorit tanpa jeda iklan, bebas skip lagu tanpa batas, unduh musik untuk didengarkan offline, dan kualitas streaming audio Extreme Quality (320 kbps).",
    summary: `Nikmati pengalaman mendengarkan musik terbaik di Spotify tanpa gangguan. Tersedia pilihan durasi fleksibel (3 Bulan, 6 Bulan, hingga 1 Tahun Penuh) dengan aktivasi resmi dan full garansi penggantian selama masa aktif.

CARA ORDER / CARA PEMBELIAN:
1. Pilih durasi paket Spotify Premium yang Anda inginkan (3 Bulan, 6 Bulan, atau 1 Tahun).
2. Masukkan nama dan email/nomor kontak Anda pada formulir pemesanan.
3. Selesaikan pembayaran melalui QRIS otomatis, Binance Pay, BNB, atau Tron.
4. Data akses (Tautan Undangan Family Plan resmi atau Akun Siap Pakai) akan dikirimkan otomatis ke email Anda dalam 1–15 menit.
5. Untuk Tautan Undangan: Klik tautan tersebut saat login di akun Spotify pribadi Anda, konfirmasi alamat sesuai instruksi, dan akun langsung berubah status menjadi Premium.
6. Hubungi admin Telegram @tokonoo jika butuh bantuan aktivasi atau klaim garansi 100%.

HAL PENTING / CATATAN PENGGUNAAN:
• Untuk opsi invite link, pastikan akun Spotify Anda belum pernah bergabung dalam Family Plan lain dalam 12 bulan terakhir.`,
    features: [
      "Mendengarkan seluruh lagu & podcast 100% bebas jeda iklan",
      "Bebas shuffle dan skip lagu tanpa batas di aplikasi mobile",
      "Unduh musik hingga 10.000 lagu untuk didengarkan offline tanpa internet",
      "Kualitas streaming audio tertinggi Very High Quality (320 kbps AAC)",
      "Fitur Group Session untuk mendengarkan musik bersama teman secara realtime"
    ],
    requirements: {
      Android: "Android 5.0 atau lebih baru.",
      iOS: "iOS 14.0 atau lebih baru untuk iPhone/iPad.",
      Web: "Web player di open.spotify.com di semua browser modern.",
      Windows: "Windows 10 / 11 via aplikasi desktop Spotify.",
      macOS: "macOS 10.15 Catalina ke atas."
    },
    version: "2026 Premium Official",
    variantDescriptions: {
      "spotify-family-3m": "Paket Spotify Premium 3 Bulan via Family Plan resmi dengan garansi penuh.",
      "spotify-family-6m": "Paket Spotify Premium 6 Bulan hemat untuk mendengarkan musik tanpa jeda iklan.",
      "spotify-family-1y": "Paket Spotify Premium 1 Tahun penuh resmi dengan jaminan garansi 100%."
    }
  },

  "Netflix Premium 4K": {
    name: "Netflix Premium 4K",
    tagline: "Streaming Film & Serial 4K Ultra HD + HDR, Dolby Atmos & Profil Privat Ber-PIN",
    serviceDescription: "Langganan Netflix Premium Plan resmi dengan kualitas tayangan tertinggi 4K Ultra HD + HDR, tata suara spasial imersif Dolby Atmos, bebas iklan, dan akses penuh ke seluruh katalog film, serial original, dokumenter, dan anime Netflix global.",
    summary: `Tonton serial viral dan film blockbuster dunia dengan visual super jernih di Smart TV, Laptop, Tablet, maupun Smartphone. Tersedia pilihan 1 Slot Profil Pribadi ber-PIN aman atau Akun Admin 5 Slot penuh.

CARA ORDER / CARA PEMBELIAN:
1. Pilih varian Netflix (Slot 1 Profil 4K Full Warranty atau Akun Admin 5 Slot 1 Bulan).
2. Isi data pemesanan dan selesaikan pembayaran melalui QRIS, Binance Pay, BNB, atau Tron.
3. Email, Password, nomor profil yang dialokasikan, beserta PIN profil akan dikirim otomatis ke email dan invoice Anda.
4. Buka aplikasi Netflix atau netflix.com, login dengan kredensial tersebut, dan masuk ke profil khusus Anda.
5. Garansi penuh penggantian akun/profil selama masa aktif jika mengalami kendala login via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Untuk varian 1 Slot, harap hanya login dan menonton pada 1 profil yang telah ditentukan. Dilarang mengubah data email/password akun utama.`,
    features: [
      "Resolusi visual tertinggi 4K Ultra HD + Dolby Vision & HDR10",
      "Audio spasial imersif Dolby Atmos untuk pengalaman bioskop di rumah",
      "Dukungan tonton di Smart TV, Android TV Box, Apple TV, PC, Tablet, dan HP",
      "Profil pribadi aman dilengkapi proteksi PIN 4 digit",
      "Fitur unduh film untuk menonton saat bepergian tanpa kuota internet"
    ],
    requirements: {
      Android: "Aplikasi Netflix di Android 7.0+ / Android TV.",
      iOS: "Aplikasi Netflix di iOS 15.0+ / Apple TV.",
      Web: "netflix.com di browser PC / Mac (Chrome, Safari, Edge 4K).",
      Windows: "Aplikasi Netflix Windows 10/11 atau browser Edge untuk resolusi 4K.",
      macOS: "Safari di macOS Big Sur+ untuk playback 4K HDR."
    },
    version: "Ultra HD 4K Plan",
    variantDescriptions: {
      "netflix-1": "1 Slot Profil Pribadi 4K Ultra HD dengan proteksi PIN 4 digit dan full garansi 30 hari.",
      "netflix-2": "Akun Admin Netflix Premium 5 Profil 1 Bulan penuh untuk keluarga atau grup."
    }
  },

  "YouTube Premium": {
    name: "YouTube Premium",
    tagline: "Nonton YouTube Bebas Iklan, Background Play Layar Mati & YouTube Music Premium",
    serviceDescription: "Langganan resmi YouTube Premium untuk menikmati jutaan video tanpa gangguan iklan sama sekali, kemampuan memutar video di latar belakang saat multitasking atau layar smartphone terkunci, unduhan video offline, serta akses penuh ke katalog lagu YouTube Music Premium.",
    summary: `Tingkatkan kenyamanan hiburan digital Anda di YouTube tanpa jeda iklan sponsor. Tersedia pilihan durasi lengkap dari 1 Bulan, 3 Bulan, 6 Bulan, hingga 1 Tahun Penuh dengan garansi resmi.

CARA ORDER / CARA PEMBELIAN:
1. Pilih variasi durasi YouTube Premium (1 Bulan, 3 Bulan, 6 Bulan, atau 1 Tahun).
2. Masukkan alamat email Google / YouTube aktif Anda pada formulir checkout.
3. Selesaikan pembayaran melalui QRIS, Binance Pay, BNB, atau Tron.
4. Undangan Family Plan resmi dari YouTube akan dikirimkan langsung ke email Anda dalam 1–15 menit.
5. Buka email masuk dari Google, klik "Accept Invitation / Gabung Keluarga", dan akun Anda seketika aktif Premium.
6. Full garansi selama masa aktif dengan bantuan admin Telegram @tokonoo jika terjadi kendala.

HAL PENTING / CATATAN PENGGUNAAN:
• Email Google Anda tidak boleh sedang tergabung dalam grup keluarga Google lain dalam 12 bulan terakhir.`,
    features: [
      "Streaming seluruh video YouTube 100% bebas jeda iklan di semua perangkat",
      "Background Play: video tetap bersuara saat membuka aplikasi lain atau layar mati",
      "Download video kualitas hingga 1080p Full HD untuk ditonton secara offline",
      "Akses penuh tanpa batas ke aplikasi YouTube Music Premium",
      "Fitur Picture-in-Picture (PiP) dan bitrate video premium 1080p Enhanced"
    ],
    requirements: {
      Android: "Aplikasi YouTube resmi di Android 8.0+.",
      iOS: "Aplikasi YouTube resmi di iOS 14.0+.",
      Web: "youtube.com di semua browser desktop dan laptop.",
      Windows: "Browser web di Windows 10/11.",
      macOS: "Browser web di macOS."
    },
    version: "2026 Premium Official",
    variantDescriptions: {
      "youtube-family-1m": "Langganan YouTube Premium 1 Bulan via Family Invite resmi langsung ke email Anda.",
      "youtube-family-3m": "Langganan YouTube Premium 3 Bulan hemat bebas iklan + YouTube Music.",
      "youtube-family-6m": "Langganan YouTube Premium 6 Bulan dengan garansi penggantian penuh.",
      "youtube-family-1y": "Langganan YouTube Premium 1 Tahun penuh resmi dengan proteksi garansi 100%."
    }
  },

  "Disney+ Hotstar": {
    name: "Disney+ Hotstar",
    tagline: "Streaming Disney, Marvel, Star Wars, Pixar, National Geographic & Film Bioskop",
    serviceDescription: "Layanan langganan premium Disney+ Hotstar resmi untuk menonton seluruh blockbuster Marvel Studios, saga Star Wars, animasi Pixar, film Disney klasik, serial Star, hingga film bioskop lokal Indonesia dan Asia berkualitas tinggi Full HD / 4K.",
    summary: `Disney+ Hotstar adalah rumah bagi konten hiburan keluarga terbaik di dunia. Nikmati kemudahan streaming di Smart TV dan ponsel dengan audio multi-bahasa dan subtitle Bahasa Indonesia akurat.

CARA ORDER / CARA PEMBELIAN:
1. Pilih variasi paket Disney+ Hotstar (Sharing Profil 1 Bulan / 3 Bulan atau Akun Private 1 Bulan).
2. Lakukan pembelian dan selesaikan pembayaran via QRIS, Binance Pay, BNB, atau Tron.
3. Data login (Nomor HP/Email terdaftar) akan dikirimkan ke email atau kontak Anda.
4. Buka aplikasi Disney+ Hotstar, masukkan nomor yang diberikan, dan minta kode OTP login ke admin Telegram @tokonoo.
5. Setelah login berhasil, Anda dapat langsung menikmati seluruh tayangan.
6. Garansi penuh berlaku selama masa durasi paket aktif.

HAL PENTING / CATATAN PENGGUNAAN:
• Untuk paket Sharing, gunakan 1 perangkat sesuai alokasi. Jangan keluar (logout) dari aplikasi setelah berhasil masuk.`,
    features: [
      "Akses penuh ke seluruh film Marvel Cinematic Universe, Star Wars, Pixar & Disney",
      "Kualitas video tajam Full HD 1080p hingga 4K UHD dengan Dolby Audio",
      "Pilihan audio dubbing dan subtitle Bahasa Indonesia resmi",
      "Fitur unduh film untuk ditonton offline tanpa koneksi internet",
      "Konten eksklusif original series Disney+ yang rilis tiap pekan"
    ],
    requirements: {
      Android: "Aplikasi Disney+ Hotstar di Android 5.0+ / Android TV.",
      iOS: "Aplikasi Disney+ Hotstar di iOS 12.0+ / Apple TV.",
      Web: "hotstar.com di browser desktop (Chrome, Safari, Edge, Firefox)."
    },
    version: "Hotstar Premium 2026",
    variantDescriptions: {
      "disney-sharing-1m": "Paket Sharing Disney+ Hotstar 1 Bulan untuk 1 perangkat dengan garansi penuh.",
      "disney-sharing-3m": "Paket Sharing Disney+ Hotstar 3 Bulan hemat untuk tontonan maraton serial Marvel.",
      "disney-private-1m": "Akun Private Disney+ Hotstar 1 Bulan penuh untuk penggunaan pribadi multi-perangkat."
    }
  },

  "Prime Video Premium": {
    name: "Prime Video Premium",
    tagline: "Streaming Serial Original Amazon Prime (The Boys, Fallout, Rings of Power) & Film HD",
    serviceDescription: "Langganan Amazon Prime Video resmi untuk mengakses ribuan film box office dunia, serial pemenang penghargaan (The Boys, Fallout, The Lord of the Rings: The Rings of Power, Reacher), dan konten eksklusif Amazon Originals dalam kualitas 4K UHD dan HDR.",
    summary: `Nikmati tayangan serial berkelas tinggi tanpa batas dengan fitur X-Ray eksklusif yang menampilkan informasi aktor dan musik di setiap adegan secara realtime.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket Prime Video yang diinginkan (Sharing 1 Perangkat atau Akun Private Penuh).
2. Lakukan pemesanan dan bayar dengan QRIS, Binance Pay, BNB, atau Tron.
3. Data akun (Email & Password Prime Video) akan dikirimkan langsung ke email Anda.
4. Login di primevideo.com atau aplikasi Prime Video di Smart TV / Smartphone.
5. Garansi aktif 100% selama 30 hari periode langganan via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Akun siap pakai dengan langganan aktif. Dilarang mengubah data profil pembayaran akun.`,
    features: [
      "Akses tanpa batas ke seluruh koleksi Amazon Originals eksklusif",
      "Kualitas video hingga 4K Ultra HD, HDR10+, dan audio surround Dolby 5.1",
      "Fitur X-Ray eksklusif (identifikasi aktor, trivia, dan soundtrack film)",
      "Mode offline download di aplikasi mobile",
      "Dukungan subtitle Bahasa Indonesia dan audio multi-bahasa"
    ],
    requirements: {
      Android: "Aplikasi Prime Video di Android 6.0+.",
      iOS: "Aplikasi Prime Video di iOS 14.0+.",
      Web: "primevideo.com di browser komputer."
    },
    version: "Prime Official 2026",
    variantDescriptions: {
      "prime-sharing-1m": "Paket Sharing Prime Video 1 Bulan untuk 1 perangkat dengan garansi penuh.",
      "prime-private-1m": "Akun Private Prime Video 1 Bulan penuh bebas digunakan di Smart TV dan HP."
    }
  },

  "Crunchyroll Mega Fan": {
    name: "Crunchyroll Mega Fan",
    tagline: "Streaming Anime Simulcast Jepang Terlengkap Tanpa Iklan & Offline Viewing",
    serviceDescription: "Langganan resmi Crunchyroll Mega Fan Tier untuk menonton ribuan judul anime populer langsung setelah tayang di Jepang (Simulcast) tanpa iklan, kualitas video 1080p Full HD, akses offline download, dan katalog manga digital.",
    summary: `Crunchyroll Mega Fan adalah surga bagi para pecinta anime. Tonton episode terbaru Attack on Titan, Jujutsu Kaisen, Demon Slayer, One Piece, dan Solo Leveling hanya 1 jam setelah penayangan di televisi Jepang.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket Crunchyroll Mega Fan (Sharing 1 Perangkat atau Private Mega Fan Tier).
2. Lakukan checkout dan selesaikan pembayaran via QRIS / Crypto.
3. Data login akun Crunchyroll akan dikirimkan otomatis ke email Anda dalam 1–15 menit.
4. Login di crunchyroll.com atau aplikasi Crunchyroll di smartphone/konsol/TV.
5. Garansi penuh penggantian akun selama masa aktif jika terjadi kendala.

HAL PENTING / CATATAN PENGGUNAAN:
• Dilarang membagikan detail login ke pengguna lain pada varian sharing.`,
    features: [
      "Tayangan anime Simulcast episode baru hanya 1 jam setelah rilis di Jepang",
      "Streaming seluruh episode anime 100% bebas iklan",
      "Fitur unduh episode anime untuk ditonton offline di perangkat mobile",
      "Kualitas video jernih hingga 1080p Full HD 60fps",
      "Akses penuh ke Crunchyroll Game Vault & katalog manga"
    ],
    requirements: {
      Android: "Aplikasi Crunchyroll di Android 6.0+.",
      iOS: "Aplikasi Crunchyroll di iOS 14.0+.",
      Web: "crunchyroll.com di browser desktop."
    },
    version: "Mega Fan Tier 2026",
    variantDescriptions: {
      "crunchy-sharing-1m": "Paket Sharing Crunchyroll Mega Fan 1 Bulan untuk 1 perangkat aktif.",
      "crunchy-private-1m": "Akun Private Crunchyroll Mega Fan 1 Bulan dengan akses 4 layar simultan."
    }
  },

  "Apple TV+ Premium": {
    name: "Apple TV+ Premium",
    tagline: "Streaming Serial Original Apple Kualitas 4K Dolby Vision & Bitrate Tertinggi",
    serviceDescription: "Langganan resmi Apple TV+ untuk menikmati film dan serial original Apple Original Films & Series yang diakui secara kritis (Ted Lasso, Severance, The Morning Show, Silo, Foundation) dengan standar kualitas visual dan audio tertinggi di industri streaming.",
    summary: `Apple TV+ dikenal dengan kualitas produksi sinematik premium tanpa kompromi, bitrate streaming tertinggi, dan integrasi mulus di seluruh perangkat ekosistem Apple maupun Smart TV.

CARA ORDER / CARA PEMBELIAN:
1. Pilih varian durasi Apple TV+ (1 Bulan atau 3 Bulan).
2. Selesaikan pembayaran melalui QRIS, Binance Pay, BNB, atau Tron.
3. Kredensial Apple ID khusus dengan langganan Apple TV+ aktif akan dikirimkan ke email Anda.
4. Login Apple ID tersebut pada menu Media & Purchases (atau aplikasi Apple TV di Android/Smart TV/Web).
5. Buka aplikasi Apple TV dan tonton seluruh serial Apple Originals.
6. Garansi aktif penuh selama masa langganan via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Hanya gunakan akun untuk login pada layanan Media & Purchases / Apple TV app, bukan untuk iCloud pribadi utama Anda.`,
    features: [
      "Akses eksklusif ke seluruh konten Apple Original Series & Films",
      "Kualitas streaming 4K HDR, Dolby Vision, dan audio spasial Dolby Atmos",
      "Bitrate tayangan tertinggi di kelasnya (kualitas visual paling tajam)",
      "Bebas iklan di seluruh konten",
      "Dukungan download offline di perangkat Apple"
    ],
    requirements: {
      iOS: "Aplikasi Apple TV di iPhone/iPad (iOS 13+).",
      macOS: "Aplikasi Apple TV di macOS Catalina ke atas.",
      Web: "tv.apple.com di browser web.",
      Android: "Browser web atau aplikasi Android TV / Google TV."
    },
    version: "Apple Originals 2026",
    variantDescriptions: {
      "appletv-1m": "Akun Apple TV+ 1 Bulan dengan akses penuh ke katalog Apple Originals 4K HDR.",
      "appletv-3m": "Akun Apple TV+ 3 Bulan hemat dengan garansi penuh selama masa aktif."
    }
  },

  "Paramount+ Premium": {
    name: "Paramount+ Premium",
    tagline: "Streaming Film Paramount Pictures, Star Trek, Nickelodeon & Serial Eksklusif",
    serviceDescription: "Langganan Paramount+ Premium resmi untuk menonton film bioskop Paramount Pictures, universe Star Trek lengkap, tayangan anak Nickelodeon, konten CBS, MTV, Comedy Central, serta serial drama populer dari Taylor Sheridan (Yellowstone, Tulsa King, Mayor of Kingstown).",
    summary: `Nikmati akses ke ribuan jam tayangan hiburan legendaris Amerika dengan kualitas Full HD dan 4K tanpa jeda iklan komersial.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket 1 Bulan Akun Sharing Paramount+ lalu klik "Beli Sekarang".
2. Selesaikan transaksi menggunakan QRIS atau metode pembayaran Crypto.
3. Detail akun login akan dikirimkan otomatis ke email dan invoice Anda.
4. Gunakan VPN region US/Global jika diperlukan saat membuka platform Paramount+.
5. Login di paramountplus.com atau aplikasi resmi Paramount+.
6. Garansi penuh penggantian selama 30 hari masa aktif via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Gunakan 1 perangkat login sesuai alokasi paket sharing.`,
    features: [
      "Akses penuh ke seluruh serial eksklusif Paramount+ Originals",
      "Koleksi film bioskop blockbuster Paramount Pictures",
      "Katalog animasi anak terlengkap dari Nickelodeon (SpongeBob, PAW Patrol)",
      "Kualitas streaming video jernih hingga 4K UHD dan audio Dolby 5.1",
      "Bebas jeda iklan komersial"
    ],
    requirements: {
      Android: "Aplikasi Paramount+ Android (memerlukan VPN US).",
      iOS: "Aplikasi Paramount+ iOS (Apple ID region US / VPN).",
      Web: "paramountplus.com di browser desktop via VPN."
    },
    version: "Paramount+ Commercial Free",
    variantDescriptions: {
      "paramount-sharing-1m": "Akun Sharing Paramount+ 1 Bulan Commercial Free dengan garansi penuh."
    }
  },

  "VPN Premium All-in-One": {
    name: "VPN Premium All-in-One",
    tagline: "Koleksi VPN Terbaik Dunia: ExpressVPN, Surfshark, ProtonVPN & NordVPN",
    serviceDescription: "Pilihan langganan VPN premium kelas dunia (ExpressVPN, Surfshark, Proton VPN Plus/Unlimited, NordVPN) untuk mengamankan koneksi internet Anda dengan enkripsi militer AES-256, membuka blokir konten global, streaming lancar tanpa buffering, dan proteksi privasi zero-log terverifikasi.",
    summary: `Bebaskan aktivitas browsing Anda dari pelacakan ISP dan pembatasan geografis. Sangat andal untuk streaming konten luar negeri, bermain game dengan ping stabil, dan bertransaksi aman di jaringan WiFi publik.

CARA ORDER / CARA PEMBELIAN:
1. Pilih provider VPN yang Anda inginkan (ExpressVPN 1M, Surfshark 2M Code, Proton Plus/Unlimited 1M, atau NordVPN 3M).
2. Lengkapi data pemesanan pada form checkout.
3. Lakukan pembayaran via QRIS, Binance Pay, BNB, atau Tron.
4. Kode aktivasi resmi atau akun premium VPN akan dikirimkan langsung ke email Anda.
5. Unduh aplikasi resmi provider VPN di perangkat Anda, masukkan kode aktivasi / login, dan hubungkan ke ribuan server.
6. Full garansi selama masa aktif varian yang Anda pilih.

HAL PENTING / CATATAN PENGGUNAAN:
• Kode aktivasi resmi dapat di-redeem langsung di aplikasi atau website resmi masing-masing provider VPN.`,
    features: [
      "Enkripsi militer AES-256 bit & protokol canggih (Lightway, WireGuard, NordLynx)",
      "Ribuan server berkecepatan tinggi di lebih dari 90–100 negara dunia",
      "Kebijakan No-Logs terbukti dan telah diaudit oleh lembaga independen",
      "Fitur Kill Switch otomatis & proteksi kebocoran DNS/IPv6",
      "Bypass sensor internet dan streaming Netflix / Disney+ region luar negeri"
    ],
    requirements: {
      Windows: "Windows 10 / 11 32/64-bit.",
      macOS: "macOS 10.15 Catalina ke atas.",
      Android: "Android 6.0 atau lebih baru.",
      iOS: "iOS 13.0 atau lebih baru.",
      Linux: "Ubuntu, Debian, Fedora, Arch via terminal CLI atau GUI."
    },
    version: "2026 Enterprise Security",
    variantDescriptions: {
      "vpn-1": "ExpressVPN 1 Bulan akun siap pakai dengan server Lightway ultra cepat.",
      "vpn-2": "Surfshark VPN 2 Bulan kode aktivasi resmi dengan koneksi perangkat tak terbatas.",
      "vpn-3": "Proton VPN Plus 1 Bulan akun siap pakai dengan fitur Secure Core dan server 10Gbps.",
      "vpn-4": "Proton Unlimited 1 Bulan akun komprehensif termasuk VPN, Mail, Drive & Pass.",
      "vpn-5": "NordVPN 3 Bulan akun premium dengan fitur Threat Protection dan NordLynx."
    }
  },

  "Canva Pro": {
    name: "Canva Pro",
    tagline: "Desain Grafis Profesional: 100 Juta+ Aset Premium, Brand Kit, Magic Studio & Hapus Background",
    serviceDescription: "Langganan resmi Canva Pro untuk membuka seluruh potensi desain Anda tanpa batas. Akses lebih dari 100 juta foto, video, audio, dan template grafis premium, fitur Magic Switch untuk resize instan, Brand Kit terpusat, Magic Eraser, dan penyimpanan cloud 1TB.",
    summary: `Canva Pro adalah alat wajib bagi pebisnis online, digital marketer, desainer, dan mahasiswa untuk membuat postingan media sosial, presentasi, banner toko, video promosi, dan materi promosi berkualitas tinggi dalam hitungan detik.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket Canva Pro (1 Tahun atau Lifetime Access).
2. Masukkan alamat email akun Canva Anda yang aktif pada formulir checkout.
3. Selesaikan pembayaran melalui QRIS, Binance Pay, BNB, atau Tron.
4. Undangan tim resmi Canva Pro akan dikirimkan langsung ke email Anda dalam 1–15 menit.
5. Buka email, klik "Gabung Tim / Join Team", dan akun Canva Anda seketika berubah status menjadi Canva Pro.
6. Garansi penuh selama masa aktif paket dengan support admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Desain pribadi Anda tetap 100% aman dan privat di akun Anda sendiri, tidak dapat dilihat oleh anggota tim lain.`,
    features: [
      "Akses penuh tanpa batas ke 100+ juta foto, vektor, video, dan template premium",
      "Fitur Penghapus Latar Belakang (Background Remover) 1-klik yang sangat presisi",
      "Magic Switch & Magic Resize: ubah ukuran desain untuk semua medsos otomatis",
      "Brand Kit: simpan logo, palet warna, dan font kustom merek Anda",
      "Ekspor format resolusi tinggi: PNG transparan, PDF Print CMYK, SVG vektor & MP4"
    ],
    requirements: {
      Web: "canva.com di semua browser modern.",
      Android: "Aplikasi Canva di Google Play Store (Android 6.0+).",
      iOS: "Aplikasi Canva di App Store (iOS 13.0+).",
      Windows: "Aplikasi desktop Canva Windows 10/11.",
      macOS: "Aplikasi desktop Canva macOS 10.13+."
    },
    version: "Pro Official 2026",
    variantDescriptions: {
      "canva-team-1y": "Aktivasi Canva Pro 1 Tahun langsung ke email pribadi Anda dengan garansi penuh.",
      "canva-team-life": "Aktivasi Canva Pro Akses Jangka Panjang (Lifetime Access) ke email pribadi."
    }
  },

  "CapCut Pro": {
    name: "CapCut Pro",
    tagline: "Video Editor AI All-in-One: Efek Viral TikTok, Auto-Caption AI, 4K Export & No Watermark",
    serviceDescription: "Langganan resmi CapCut Pro untuk mengedit video di PC dan HP dengan seluruh fitur premium terbuka: auto-caption otomatis berbagai bahasa, text-to-speech suara AI viral, transisi & efek VIP, penghapusan latar belakang otomatis, dan ekspor video 4K 60fps tanpa watermark.",
    summary: `CapCut Pro adalah software editing video nomor satu untuk kreator konten TikTok, Instagram Reels, dan YouTube Shorts. Menghemat waktu pengeditan dengan kecerdasan buatan terintegrasi.

CARA ORDER / CARA PEMBELIAN:
1. Pilih variasi paket CapCut Pro yang Anda butuhkan (1 Bulan Personal Email, 6 Bulan Share/Personal, atau 1 Tahun Full Warranty).
2. Lengkapi data pemesanan di checkout.
3. Selesaikan pembayaran via QRIS, Binance Pay, BNB, atau Tron.
4. Instruksi aktivasi atau akun CapCut Pro akan dikirimkan otomatis ke email Anda.
5. Login di aplikasi CapCut (PC / Android / iOS) dan nikmati seluruh aset Pro.
6. Full garansi penggantian selama masa aktif jika terjadi kendala langganan via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Dapat digunakan untuk CapCut Desktop di Windows/Mac maupun CapCut Mobile di smartphone.`,
    features: [
      "Buka seluruh efek video, animasi teks, filter estetik, dan transisi VIP",
      "Auto-Caption AI: generate subtitle otomatis dalam Bahasa Indonesia & Inggris",
      "Voice Changer & Text-to-Speech dengan puluhan karakter suara AI populer",
      "Ekspor video resolusi tinggi hingga 4K 60fps dengan bitrate tinggi",
      "AI Body Retouch, penghapus background video instan & stabilisasi video"
    ],
    requirements: {
      Android: "Android 8.0 atau lebih baru.",
      iOS: "iOS 13.0 atau lebih baru.",
      Windows: "Windows 10 / 11 64-bit dengan RAM minimal 4 GB.",
      macOS: "macOS 10.15 Catalina ke atas."
    },
    version: "CapCut Pro 2026",
    variantDescriptions: {
      "capcut-1": "CapCut Pro 1 Bulan via email personal Anda dengan garansi penuh.",
      "capcut-2": "CapCut Pro 6 Bulan Sharing untuk 1 perangkat dengan harga hemat.",
      "capcut-3": "CapCut Pro 6 Bulan Personal aktif di email sendiri.",
      "capcut-4": "CapCut Pro 1 Tahun Full Warranty resmi untuk kebutuhan editing jangka panjang."
    }
  },

  "Figma Pro": {
    name: "Figma Pro",
    tagline: "Desain UI/UX & Prototyping Kolaboratif: Unlimited Files, Component Library & Dev Mode",
    serviceDescription: "Aktivasi lisensi resmi Figma Pro (Education / Professional Plan) untuk desainer UI/UX dan tim pengembang. Membuka jumlah berkas tak terbatas, riwayat versi tanpa batas (Unlimited Version History), team component libraries bersama, dan fitur Dev Mode untuk inspeksi kode CSS/Swift/Kotlin.",
    summary: `Figma Pro adalah platform kolaborasi desain antarmuka standar industri digital. Desain, uji prototipe interaktif, dan serahkan spesifikasi desain ke programmer dengan alur kerja yang sangat efisien.

CARA ORDER / CARA PEMBELIAN:
1. Pilih durasi paket Figma Pro (1 Tahun atau 2 Tahun).
2. Masukkan alamat email akun Figma yang ingin diaktifkan.
3. Bayar menggunakan QRIS, Binance Pay, BNB, atau Tron.
4. Undangan tim workspace Figma Pro akan dikirimkan langsung ke email Anda.
5. Buka email, terima undangan tim, dan akun Anda otomatis mendapatkan status Figma Pro.
6. Garansi penuh 100% selama durasi paket yang Anda beli via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Aktivasi langsung ke email Figma pribadi Anda sehingga proyek dan desain lama Anda tetap aman 100%.`,
    features: [
      "Ruang kerja tanpa batas: Unlimited Figma Projects & FigJam Boards",
      "Unlimited Version History: lacak dan kembalikan revisi desain kapan saja",
      "Shared Team Libraries untuk sinkronisasi komponen desain dan design system",
      "Fitur Dev Mode untuk mempermudah developer menyalin kode dan aset desain",
      "Prototyping interaktif lanjutan dengan variabel dan logika kondisional"
    ],
    requirements: {
      Web: "Browser modern (Chrome, Edge, Safari, Firefox) di desktop.",
      macOS: "Aplikasi Figma Desktop macOS 11.0+.",
      Windows: "Aplikasi Figma Desktop Windows 10/11 64-bit."
    },
    version: "Pro Education 2026",
    variantDescriptions: {
      "figma-edu-1y": "Aktivasi Figma Pro 1 Tahun langsung ke akun email Figma pribadi Anda.",
      "figma-edu-2y": "Aktivasi Figma Pro 2 Tahun hemat biaya dengan full garansi resmi."
    }
  },

  "Framer Pro": {
    name: "Framer Pro",
    tagline: "No-Code Website Builder Interaktif dengan Animasi Kelas Dunia & Hosting Cepat",
    serviceDescription: "Langganan Framer Workspace Pro untuk merancang dan mempublikasikan situs web interaktif berkecepatan tinggi langsung dari kanvas desain tanpa perlu menulis kode manual. Mendukung custom domain, CMS tanpa batas, formulir interaktif, dan SEO otomatis.",
    summary: `Framer menggabungkan kemudahan mendesain seperti di Figma dengan kekuatan rendering website modern React yang ultra responsif dan animasi interaktif memukau.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket 1 Bulan Akun Workspace Pro Framer lalu lakukan checkout.
2. Selesaikan pembayaran via QRIS, Binance Pay, BNB, atau Tron.
3. Data akun Framer Pro akan dikirimkan otomatis ke email Anda.
4. Login di framer.com, mulai buat website, dan hubungkan domain pilihan Anda.
5. Garansi penuh selama 30 hari masa aktif via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Akun siap pakai dengan paket Pro aktif. Simpan akses login Anda dengan baik.`,
    features: [
      "Desain kanvas visual fleksibel dengan auto-responsive breakpoints",
      "Efek animasi scroll, hover, dan transisi halaman kelas dunia",
      "Built-in CMS untuk mengelola artikel blog dan katalog produk",
      "Hosting global super cepat berbasis CDN dengan sertifikat SSL gratis",
      "Optimalisasi SEO otomatis dan integrasi analitik"
    ],
    requirements: {
      Web: "Browser desktop modern di Google Chrome atau Microsoft Edge.",
      macOS: "Aplikasi Framer Desktop macOS.",
      Windows: "Aplikasi Framer Desktop Windows."
    },
    version: "Pro Workspace 2026",
    variantDescriptions: {
      "framer-pro-1m": "Akun Workspace Framer Pro 1 Bulan dengan dukungan custom domain dan CMS."
    }
  },

  "Gamma App Pro": {
    name: "Gamma App Pro",
    tagline: "Buat Presentasi, Dokumen & Webpage Interaktif Berbasis AI dalam 30 Detik",
    serviceDescription: "Langganan akun resmi Gamma App Pro (gamma.app) dengan alokasi 4.000+ kredit pembuatan AI. Buat deck presentasi profesional, ringkasan dokumen eksekutif, dan landing page menarik hanya dengan mengetikkan topik atau outline materi.",
    summary: `Ubah teks kasar menjadi presentasi siap tayang dalam hitungan detik. Gamma Pro menghemat waktu berjam-jam dalam merapikan layout, tipografi, dan visual grafis slide Anda.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket Gamma Pro 4k4 Create 1 Month lalu klik "Beli Sekarang".
2. Selesaikan pembayaran menggunakan QRIS atau Crypto.
3. Kredensial akun Gamma Pro (Email & Password) akan dikirimkan otomatis ke email Anda.
4. Login di gamma.app, masukkan outline materi, dan generate slide presentasi Anda.
5. Garansi penggantian akun jika terjadi kendala selama masa aktif via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Gunakan saldo kredit AI untuk membuat presentasi dan dokumen interaktif tanpa watermark.`,
    features: [
      "Generasi slide presentasi, dokumen, dan halaman web otomatis dari prompt AI",
      "Kredit AI 4.000+ untuk pembuatan konten tanpa batas",
      "Ekspor dokumen ke format PDF dan PowerPoint (PPTX) resolusi tinggi",
      "Hapus watermark Gamma pada dokumen yang dibagikan",
      "Fitur custom branding, analitik pengunjung, dan tema visual premium"
    ],
    requirements: {
      Web: "Browser desktop modern (Chrome, Edge, Safari, Firefox)."
    },
    version: "Pro Plus 2026",
    variantDescriptions: {
      "gamma-1": "Akun Gamma Pro 1 Bulan dengan 4.400 Creation Credits dan garansi 5 hari."
    }
  },

  "HeyGen AI Video Pro": {
    name: "HeyGen AI Video Pro",
    tagline: "Buat Video AI Avatar Berbicara & Voice Clone Realistis untuk Bisnis",
    serviceDescription: "Langganan akun HeyGen Creator Pro (15 Video Credits) untuk membuat video pembawa acara AI fotorealistik dalam berbagai bahasa tanpa kamera, studio, atau aktor manusia. Dilengkapi kloning suara instan, auto translation video, dan template video bisnis.",
    summary: `HeyGen adalah platform pembuatan video AI terdepan untuk video marketing, tutorial produk, materi edukasi perusahaan, dan konten media sosial global.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket 1 Bulan Akun Creator HeyGen (15 Credits).
2. Lakukan checkout dan selesaikan pembayaran via QRIS / Crypto.
3. Kredensial akun HeyGen Pro akan dikirimkan otomatis ke email Anda.
4. Login di app.heygen.com, pilih avatar AI favorit, ketik naskah, dan render video Anda.
5. Garansi penuh 30 hari selama masa langganan aktif via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Kredit 15 dapat digunakan untuk me-render video avatar kualitas tinggi tanpa watermark.`,
    features: [
      "Pilihan 100+ avatar AI fotorealistik dengan sinkronisasi bibir (Lip-sync) sempurna",
      "Generasi suara AI alami dalam 40+ bahasa dengan 300+ pilihan karakter suara",
      "AI Video Translation: terjemahkan video rekaman sendiri ke bahasa asing otomatis",
      "Ekspor video resolusi Full HD 1080p tanpa watermark",
      "Koleksi template video bisnis, e-commerce, dan presentasi profesional"
    ],
    requirements: {
      Web: "Browser desktop modern (Chrome / Edge disarankan) dengan koneksi internet cepat."
    },
    version: "Creator Tier 2026",
    variantDescriptions: {
      "heygen-creator-1m": "Akun HeyGen Creator 1 Bulan dengan alokasi 15 Video Credits tanpa watermark."
    }
  },

  "Notion Plus": {
    name: "Notion Plus",
    tagline: "All-in-One Workspace: Unlimited Blocks, Upload Berkas Tanpa Batas & Integrasi Tim",
    serviceDescription: "Aktivasi langganan resmi Notion Plus / Notion Business untuk mengelola catatan, dokumentasi proyek, basis data cerdas (databases), wiki perusahaan, dan manajemen tugas tanpa batas blok penyimpanan.",
    summary: `Notion Plus menyatukan seluruh produktivitas kerja tim dan individu dalam satu kanvas fleksibel. Didukung fitur sinkronisasi realtime, custom database views (Kanban, Calendar, Gantt Chart), dan integrasi API.

CARA ORDER / CARA PEMBELIAN:
1. Pilih varian Notion yang Anda butuhkan (Notion Plus 1 Bulan atau Notion Business 1 Tahun).
2. Masukkan detail kontak Anda di form checkout.
3. Selesaikan pembayaran melalui QRIS, Binance Pay, BNB, atau Tron.
4. Data akun Workspace Notion Plus atau instruksi aktivasi akan dikirimkan instan ke email Anda.
5. Login di notion.so atau aplikasi desktop Notion dan mulai atur workspace Anda.
6. Garansi penuh berlaku selama masa aktif paket yang dipilih via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Simpan data catatan Anda di workspace resmi Notion dengan backup otomatis di cloud.`,
    features: [
      "Blok penyimpanan tanpa batas (Unlimited Blocks) untuk halaman dan catatan",
      "Upload berkas lampiran file besar tanpa batas ukuran (Unlimited File Uploads)",
      "Riwayat versi halaman hingga 30 hari (Page Version History)",
      "Kolaborasi tim hingga 100 tamu (Guests) dalam satu workspace",
      "Database relasional canggih dengan formula, rollup, dan timeline view"
    ],
    requirements: {
      Web: "notion.so di semua browser modern.",
      Android: "Aplikasi Notion di Google Play Store (Android 8.0+).",
      iOS: "Aplikasi Notion di App Store (iOS 15.0+).",
      Windows: "Aplikasi desktop Notion Windows 10/11 64-bit.",
      macOS: "Aplikasi desktop Notion macOS 11.0+."
    },
    version: "Plus / Business 2026",
    variantDescriptions: {
      "notion-0": "Akun Notion Plus 1 Bulan dengan unlimited blocks dan file upload.",
      "notion-1": "Akun Notion Business 1 Tahun penuh dengan fitur admin dan workspace kolaboratif."
    }
  },

  "Microsoft 365 Personal": {
    name: "Microsoft 365 Personal",
    tagline: "Aplikasi Office Lengkap (Word, Excel, PowerPoint) & Cloud Storage 1TB OneDrive",
    serviceDescription: "Langganan resmi Microsoft 365 (Office 365) untuk mengaktifkan seluruh aplikasi produktivitas standar industri: Microsoft Word, Excel, PowerPoint, Outlook, OneNote di 5 perangkat sekaligus, ditambah penyimpanan cloud aman 1.000 GB (1TB) OneDrive.",
    summary: `Gunakan aplikasi Microsoft Office resmi selalu ter-update dengan fitur keamanan data ransomware protection di OneDrive, kolaborasi dokumen realtime, dan integrasi Microsoft Copilot AI.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket Microsoft 365 (Office 365 Premium 6 Bulan atau Admin Family 1 Bulan).
2. Lakukan checkout dan selesaikan pembayaran via QRIS / Crypto.
3. Akun Microsoft resmi atau link aktivasi Family resmi akan dikirimkan otomatis ke email Anda.
4. Login di portal.office.com atau aplikasi Office di laptop/ponsel Anda.
5. Unduh dan install installer resmi Microsoft Office di Windows/Mac.
6. Full garansi 100% selama durasi paket aktif via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Lisensi resmi Microsoft yang dapat diinstal pada hingga 5 perangkat aktif secara bersamaan (PC, Mac, Tablet, HP).`,
    features: [
      "Aplikasi Office lengkap versi desktop terbaru: Word, Excel, PowerPoint, Outlook, OneNote",
      "Penyimpanan Cloud 1TB (1.000 GB) OneDrive dengan enkripsi keamanan tinggi",
      "Dapat diinstal dan digunakan pada hingga 5 perangkat sekaligus (Windows, Mac, iOS, Android)",
      "Ransomware Detection and Recovery untuk keamanan dokumen penting Anda",
      "Fitur kolaborasi dokumen realtime & ratusan template premium eksklusif"
    ],
    requirements: {
      Windows: "Windows 10 / 11 32/64-bit.",
      macOS: "Tiga versi macOS terbaru (macOS Sonoma, Ventura, Monterey).",
      Android: "Aplikasi Microsoft 365 di Android 9.0+.",
      iOS: "Aplikasi Microsoft 365 di iOS 16.0+.",
      Web: "office.com di browser web."
    },
    version: "Microsoft 365 Official",
    variantDescriptions: {
      "ms365-1": "Microsoft Office 365 Premium 6 Bulan dengan 1TB OneDrive dan garansi penuh.",
      "ms365-2": "Office 365 Admin Family 1 Bulan untuk aktivasi lisensi multi-pengguna."
    }
  },

  "QuillBot Premium": {
    name: "QuillBot Premium",
    tagline: "Paraphrasing AI & Grammar Checker: Paragraf Mulus, Anti Plagiasi & Summarizer",
    serviceDescription: "Langganan resmi QuillBot Premium untuk memparafrase kalimat tanpa batas kata, membuka seluruh 8 mode penulisan AI (Formal, Creative, Simple, Shorten, Expand), pemeriksa tata bahasa (Grammar Checker), Plagiarism Checker 20 halaman/bulan, dan Summarizer cerdas.",
    summary: `QuillBot Premium adalah alat parafrase dan perbaikan tata bahasa terbaik untuk mahasiswa, akademisi, penerjemah, dan penulis artikel agar tulisan terdengar profesional, mengalir alami, dan bebas kesalahan tata bahasa.

CARA ORDER / CARA PEMBELIAN:
1. Pilih durasi paket QuillBot Premium (1 Bulan atau 1 Tahun).
2. Selesaikan pembayaran melalui QRIS, Binance Pay, BNB, atau Tron.
3. Detail akun QuillBot Premium (Email & Password) akan dikirimkan otomatis ke email Anda.
4. Login di quillbot.com atau instal ekstensi QuillBot di browser Chrome / Microsoft Word.
5. Garansi penuh penggantian selama periode langganan aktif via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Gunakan pada 1 perangkat aktif sesuai ketentuan paket. Dilarang mengubah data password akun.`,
    features: [
      "Paraphrasing tanpa batas jumlah kata (Unlimited Words in Paraphraser)",
      "Akses ke seluruh 8 Mode Parafrase: Standard, Fluency, Formal, Simple, Creative, Expand, Shorten, Custom",
      "Batas 25.000 kata sekaligus pada fitur Summarizer",
      "Pemeriksa Plagiarisme (Plagiarism Checker) hingga 20 halaman per bulan",
      "Integrasi ekstensi browser Chrome, Microsoft Word add-in, dan Google Docs"
    ],
    requirements: {
      Web: "quillbot.com di semua browser desktop dan mobile.",
      Windows: "Add-in Microsoft Word di Windows 10/11.",
      macOS: "Add-in Microsoft Word di macOS atau ekstensi Chrome."
    },
    version: "Premium Suite 2026",
    variantDescriptions: {
      "quillbot-sharing-1m": "Akun QuillBot Premium 1 Bulan untuk 1 perangkat dengan garansi penuh.",
      "quillbot-sharing-1y": "Akun QuillBot Premium 1 Tahun hemat 45% untuk kebutuhan akademik."
    }
  },

  "Zoom Pro": {
    name: "Zoom Pro",
    tagline: "Video Conference Profesional: Durasi Rapat hingga 30 Jam, 100-300 Peserta & Cloud Recording",
    serviceDescription: "Langganan akun resmi Zoom Pro / Business untuk menyelenggarakan rapat online, webinar, kelas pelatihan, dan konferensi video tanpa batas waktu 40 menit (durasi hingga 30 jam per sesi), kapasitas 100–300 peserta, rekaman cloud otomatis, dan AI Companion.",
    summary: `Hindari rapat terputus di tengah jalan. Zoom Pro memberikan stabilitas audio-video kelas dunia dengan fitur manajemen co-host, breakout rooms, live streaming ke YouTube/Facebook, dan transkrip otomatis.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket Zoom Pro (14 Hari Full Warranty atau Trial 28 Hari Full Warranty).
2. Lengkapi formulir pemesanan dan lakukan pembayaran via QRIS / Crypto.
3. Kredensial akun Zoom Pro siap pakai akan dikirimkan otomatis ke email Anda.
4. Login di aplikasi Zoom desktop/mobile atau via zoom.us, lalu mulai jadwalkan rapat Anda.
5. Garansi penuh selama masa aktif paket yang Anda pilih via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Akun siap pakai berstatus Host Pro aktif. Anda dapat langsung menjadwalkan meeting berdurasi panjang.`,
    features: [
      "Durasi video meeting hingga 30 jam tanpa terputus (bebas batas 40 menit)",
      "Kapasitas peserta 100 hingga 300 peserta dalam satu sesi rapat",
      "Penyimpanan rekaman rapat di Cloud (Cloud Recording) dengan tautan berbagi instan",
      "Fitur Breakout Rooms untuk membagi peserta ke dalam kelompok diskusi kecil",
      "Live Streaming rapat langsung ke YouTube, Facebook, atau Custom RTMP"
    ],
    requirements: {
      Windows: "Aplikasi Zoom Client di Windows 10 / 11.",
      macOS: "Aplikasi Zoom Client di macOS 10.15+.",
      Android: "Aplikasi Zoom di Android 6.0+.",
      iOS: "Aplikasi Zoom di iOS 13.0+.",
      Web: "Join meeting via browser di semua sistem operasi."
    },
    version: "Pro Workplace 2026",
    variantDescriptions: {
      "zoom-1": "Akun Zoom Pro 28 Hari dengan kapasitas 100-300 peserta dan full warranty.",
      "zoom-2": "Akun Zoom Pro 14 Hari untuk event jangka pendek dan pelatihan."
    }
  },

  "CamScanner Premium HD": {
    name: "CamScanner Premium HD",
    tagline: "Scanner Dokumen Mobile Terbaik: OCR Teks Presisi, No Watermark & Ekspor Word/Excel",
    serviceDescription: "Langganan resmi CamScanner Premium HD untuk memindai dokumen fisik, buku, nota belanja, kartu identitas (KTP/Paspor) menjadi file PDF berkualitas tinggi dengan penghapusan bayangan otomatis, OCR pengubah gambar ke Word/Excel, penyimpanan cloud 10GB, dan bebas watermark.",
    summary: `Ubah smartphone Anda menjadi mesin scanner portabel beresolusi tinggi dengan pengenalan teks otomatis yang akurat dalam puluhan bahasa.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket 1 Tahun Akun CamScanner Premium HD.
2. Selesaikan pembayaran melalui QRIS, Binance Pay, BNB, atau Tron.
3. Data akun CamScanner Premium (Email & Password) akan dikirimkan otomatis ke email Anda.
4. Login di aplikasi CamScanner di ponsel Android atau iPhone Anda.
5. Garansi penuh 1 tahun selama masa langganan aktif via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Gunakan data login yang diberikan. Nikmati fitur ekspor HD tanpa watermark selamanya selama masa aktif.`,
    features: [
      "Pemindaian dokumen otomatis dengan auto-crop dan filter kejernihan Magic Color",
      "Ekspor dokumen PDF dan gambar resolusi tinggi tanpa watermark CamScanner",
      "OCR (Optical Character Recognition) presisi: ubah scan ke file Word, Excel, atau TXT",
      "Fitur Book Scan: pindai 2 halaman buku sekaligus dan otomatis luruskan kurva buku",
      "ID Mode khusus untuk fotokopi digital KTP, SIM, dan Paspor bolak-balik dalam 1 lembar"
    ],
    requirements: {
      Android: "Android 7.0 atau lebih baru.",
      iOS: "iOS 14.0 atau lebih baru untuk iPhone/iPad."
    },
    version: "v6.7 Premium HD",
    variantDescriptions: {
      "camscanner-edu-1y": "Akun CamScanner Premium HD 1 Tahun penuh dengan OCR tanpa batas dan no watermark."
    }
  },

  "Supabase Pro": {
    name: "Supabase Pro",
    tagline: "Backend-as-a-Service Open Source: PostgreSQL Database, Auth, Realtime & Edge Functions",
    serviceDescription: "Akun saldo kredit Supabase Pro Tier ($25/bulan) resmi untuk membangun backend aplikasi web dan mobile modern dengan database PostgreSQL mandiri, otentikasi pengguna, database realtime, media storage 100GB, dan Edge Functions tanpa batasan tier gratis (bebas project auto-pause).",
    summary: `Supabase Pro adalah alternatif terbaik untuk Firebase dengan kekuatan penuh database relational SQL PostgreSQL. Proyek Anda tidak akan pernah di-pause otomatis dan didukung backup database harian 7 hari.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket 1 Bulan Akun Saldo Kredit Pro Tier ($25/bln) Supabase Pro.
2. Lakukan checkout dan selesaikan pembayaran via QRIS / Crypto.
3. Kredensial akun Supabase Pro akan dikirimkan langsung ke email Anda.
4. Login di supabase.com, buat project database PostgreSQL baru, dan integrasikan API ke aplikasi Anda.
5. Garansi penuh 30 hari selama masa aktif via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Akun private dengan saldo Pro aktif. Simpan API Keys dan DB Password Anda dengan aman.`,
    features: [
      "Database PostgreSQL penuh tanpa batasan sleep/pause otomatis",
      "Alokasi penyimpanan Database 8 GB & Media File Storage hingga 100 GB",
      "Kuota 100.000 Monthly Active Users (MAU) untuk sistem Authentication",
      "Sistem Realtime Database WebSockets hingga 500 koneksi simultan",
      "Point-in-Time Recovery (PITR) & backup database harian selama 7 hari"
    ],
    requirements: {
      Web: "Browser modern dan koneksi internet untuk mengelola dashboard di supabase.com."
    },
    version: "Pro Cloud Tier ($25)",
    variantDescriptions: {
      "supabase-credit-1m": "Akun Saldo Kredit Supabase Pro ($25/bulan) 1 Bulan tanpa auto-pause project."
    }
  },

  "Replit Core Cloud": {
    name: "Replit Core Cloud",
    tagline: "Cloud IDE Kolaboratif & Server Hosting 24/7 dengan $60 Kredit Komputasi & Replit AI",
    serviceDescription: "Langganan resmi akun Replit Core dengan saldo kredit komputasi $60 untuk coding dan hosting aplikasi di cloud tanpa setup lokal. Dilengkapi asisten Replit AI cerdas untuk debugging, autocomplete kode, dan server virtual Always-On 24/7.",
    summary: `Kembangkan dan jalankan aplikasi Python, Node.js, Next.js, bot Discord, atau API backend langsung dari browser di perangkat apa pun dengan server hosting yang selalu aktif.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket Replit Core $60 Credit 30D Full Warranty.
2. Bayar menggunakan QRIS, Binance Pay, BNB, atau Tron.
3. Data akun Replit Core akan dikirimkan otomatis ke email Anda.
4. Login di replit.com, buat Repl baru, dan jalankan proyek aplikasi Anda.
5. Garansi penuh penggantian akun selama 30 hari masa aktif via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Gunakan kredit $60 untuk alokasi CPU/RAM tinggi pada Repl Anda dan deployment cloud.`,
    features: [
      "Alokasi saldo kredit komputasi $60 untuk deployment dan server hosting",
      "Fitur Always-On untuk menjaga bot dan web server tetap hidup 24 jam non-stop",
      "Akses penuh ke Replit AI Agent untuk pembuatan dan perbaikan kode otomatis",
      "Spesifikasi komputasi fleksibel hingga 8 vCPU dan 16 GB RAM per Repl",
      "Kolaborasi coding multiplayer realtime seperti Google Docs"
    ],
    requirements: {
      Web: "replit.com di browser desktop atau tablet.",
      Android: "Aplikasi Replit di Android 8.0+.",
      iOS: "Aplikasi Replit di iOS 14.0+."
    },
    version: "Core $60 Edition",
    variantDescriptions: {
      "replit-1": "Akun Replit Core dengan saldo $60 komputasi cloud dan full warranty 30 hari."
    }
  },

  "Railway Hobby Cloud": {
    name: "Railway Hobby Cloud",
    tagline: "Platform Deployment Cloud Instan untuk Docker, Node.js, Python, PostgreSQL & Redis",
    serviceDescription: "Akun saldo kredit Railway Hobby Cloud ($5/bulan) untuk mendeploy aplikasi backend, mikroservis, bot, dan database (PostgreSQL, MySQL, Redis, MongoDB) secara otomatis langsung dari repositori GitHub dengan infrastruktur cloud performa tinggi.",
    summary: `Railway adalah platform cloud favorit developer modern. Cukup hubungkan repo GitHub Anda, Railway akan otomatis mendeteksi konfigurasi, mem-build container Docker, dan menyediakan URL HTTPS publik secara instan.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket 1 Bulan Akun Saldo Kredit $5 Deployment Railway Hobby.
2. Selesaikan transaksi melalui QRIS atau Crypto.
3. Data akun Railway dengan saldo kredit aktif akan dikirimkan ke email Anda.
4. Login di railway.app, sambungkan repo GitHub Anda, dan deploy project pertama Anda.
5. Garansi penuh selama 30 hari periode langganan via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Pastikan mengatur batasan resource pemakaian container agar saldo kredit mencukupi sepanjang bulan.`,
    features: [
      "Deployment otomatis (Continuous Deployment) langsung dari push commit GitHub",
      "Penyediaan database instan 1-klik (Postgres, MySQL, Redis, MongoDB)",
      "Domain kustom dengan sertifikat SSL otomatis dan URL publik bawaan *.up.railway.app",
      "Resource komputasi fleksibel hingga 8 GB RAM dan 8 vCPU per servis",
      "Metrik performa realtime (penggunaan CPU, Memori, dan Log server)"
    ],
    requirements: {
      Web: "railway.app di browser desktop dengan koneksi internet aktif."
    },
    version: "Hobby Tier 2026",
    variantDescriptions: {
      "railway-hobby-1m": "Akun Railway Hobby Cloud 1 Bulan dengan saldo kredit $5 untuk deployment aplikasi."
    }
  },

  "N8N Cloud Workflow": {
    name: "N8N Cloud Workflow",
    tagline: "Otomatisasi Workflow Bisnis & Integrasi API Mandiri Tanpa Batas Tanpa Koding",
    serviceDescription: "Layanan instance cloud n8n (n8n.io) siap pakai untuk membangun otomatisasi alur kerja bisnis tingkat lanjut. Hubungkan ratusan layanan API (WhatsApp, Telegram, Google Sheets, OpenAI, Supabase, CRM) secara visual dengan integrasi AI node yang sangat fleksibel.",
    summary: `Alternatif terbaik dan jauh lebih hemat dari Zapier / Make. Bangun otomatisasi tanpa batas eksekusi dengan logika percabangan kompleks, webhook kustom, dan agen AI terpadu.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket 1 Bulan Instance N8N Cloud Siap Pakai lalu lakukan checkout.
2. Selesaikan pembayaran melalui QRIS, Binance Pay, BNB, atau Tron.
3. Tautan instance n8n khusus beserta kredensial login admin akan dikirimkan ke email Anda.
4. Buka URL instance di browser, login, dan mulai susun diagram alur otomatisasi Anda.
5. Garansi penuh selama 30 hari masa aktif dengan dukungan teknis admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Instance n8n aktif 24 jam non-stop di server cloud berkecepatan tinggi.`,
    features: [
      "Lebih dari 400+ node integrasi bawaan (OpenAI, Telegram, Google, Discord, Stripe, dll)",
      "Dukungan AI Nodes canggih (LangChain, Vector Stores, Memory, AI Agents)",
      "Eksekusi webhook instan untuk trigger realtime dari aplikasi pihak ketiga",
      "Visual Workflow Editor berbasis drag-and-drop dengan debugger interaktif",
      "Kebebasan menulis kode kustom JavaScript/Python di dalam alur kerja"
    ],
    requirements: {
      Web: "Browser modern di komputer desktop atau laptop."
    },
    version: "v1.75 Cloud Instance",
    variantDescriptions: {
      "n8n-cloud-1m": "Instance N8N Cloud Siap Pakai 1 Bulan dengan 400+ node integrasi dan AI agent."
    }
  },

  "Linear Business Plan": {
    name: "Linear Business Plan",
    tagline: "Project Management Tool Modern untuk Tim Engineering, Desain & Produk",
    serviceDescription: "Langganan workspace Linear Business Plan resmi untuk manajemen proyek perangkat lunak berkecepatan tinggi. Dirancang khusus untuk tim modern dengan antarmuka secepat kilat, pelacakan issue, roadmap produk, siklus sprint (Cycles), dan integrasi mulus dengan GitHub / GitLab.",
    summary: `Linear adalah standar baru dalam manajemen proyek teknologi dunia. Menghilangkan kerumitan Jira dengan UI minimalis, keyboard shortcuts lengkap, dan sinkronisasi realtime.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket 1 Bulan Akun Workspace Pro Linear Business Plan.
2. Lakukan checkout dan bayar dengan QRIS atau Crypto.
3. Kredensial akun Linear Pro akan dikirimkan otomatis ke email Anda.
4. Login di linear.app atau aplikasi desktop Linear, lalu buat tim dan proyek Anda.
5. Garansi penuh 30 hari selama masa aktif via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Gunakan akun untuk mengelola tim engineering dan backlog proyek Anda.`,
    features: [
      "Antarmuka ultra responsif dengan navigasi shortcut keyboard penuh (Command Palette)",
      "Manajemen sprint otomatis (Linear Cycles) dan pelacakan beban kerja tim",
      "Roadmap visual interaktif untuk perencanaan rilis produk jangka panjang",
      "Integrasi 2 arah dengan GitHub, GitLab, Slack, Discord, dan Figma",
      "Fitur Customer Requests (Triage) untuk menghubungkan feedback pengguna ke task developer"
    ],
    requirements: {
      Web: "linear.app di browser modern.",
      macOS: "Aplikasi Linear Desktop native macOS.",
      Windows: "Aplikasi Linear Desktop Windows."
    },
    version: "Business Plan 2026",
    variantDescriptions: {
      "linear-pro-1m": "Akun Workspace Linear Business Plan 1 Bulan dengan cycles, roadmap, dan integrasi GitHub."
    }
  },

  "PostHog Cloud Scale": {
    name: "PostHog Cloud Scale",
    tagline: "All-in-One Product Analytics: Event Tracking, Session Replay, Feature Flags & A/B Testing",
    serviceDescription: "Akun saldo kredit PostHog Cloud Scale resmi untuk analitik produk menyeluruh. Lacak aktivitas pengguna, rekam sesi layar pengunjung (Session Replay), jalankan eksperimen A/B Testing, buat Feature Flags, dan analisis user funnel secara mendalam dalam satu platform.",
    summary: `PostHog menggantikan 5 tools sekaligus (Mixpanel, Hotjar, LaunchDarkly, Google Analytics). Sangat penting bagi startup dan developer untuk memahami perilaku pengguna dan meningkatkan konversi produk.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket 1 Bulan Akun Dev Credit Tier PostHog Cloud Scale.
2. Selesaikan pembayaran via QRIS, Binance Pay, BNB, atau Tron.
3. Detail akun PostHog akan dikirimkan otomatis ke email Anda.
4. Login di us.posthog.com / eu.posthog.com, salin snippet tracking ke website/aplikasi Anda.
5. Garansi penuh 30 hari selama masa aktif via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Dapat diintegrasikan ke React, Next.js, Vue, iOS, Android, Node.js, dan Python dengan mudah.`,
    features: [
      "Product Analytics lengkap: Funnels, Retention, Trends, dan Lifecycle tracking",
      "Session Replay HD: tonton rekaman visual saat pengunjung menggunakan website Anda",
      "Feature Flags & Remote Config untuk merilis fitur bertahap ke user tertentu",
      "A/B Testing statistik terintegrasi untuk menguji variasi halaman dan konversi",
      "User Surveys dan feedback widget bawaan langsung di dalam aplikasi"
    ],
    requirements: {
      Web: "Browser modern di komputer desktop."
    },
    version: "Scale Dev Edition",
    variantDescriptions: {
      "posthog-scale-1m": "Akun PostHog Cloud Scale Tier 1 Bulan dengan akses event tracking, replay, dan feature flags."
    }
  },

  "Super Duolingo": {
    name: "Super Duolingo",
    tagline: "Belajar Bahasa Tanpa Batas: Unlimited Hearts, Bebas Iklan & Tes Kemampuan Personalisasi",
    serviceDescription: "Langganan resmi Super Duolingo (Slot Family Plan 12 Bulan) untuk belajar lebih dari 40 bahasa asing (Inggris, Jepang, Mandarin, Jerman, Korea, Perancis, dll) tanpa batas nyawa (Unlimited Hearts), bebas gangguan iklan, akses ke Practice Hub, dan tes kenaikan level tanpa batas.",
    summary: `Kuasai bahasa asing lebih cepat dengan Super Duolingo. Anda dapat belajar kapan saja tanpa takut kehabisan nyawa saat salah menjawab soal latihan.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket DUOLINGO SUPER Slot - 12 MONTHS (Full Warranty).
2. Masukkan alamat email akun Duolingo yang ingin diaktifkan pada form checkout.
3. Selesaikan pembayaran melalui QRIS, Binance Pay, BNB, atau Tron.
4. Undangan resmi Super Duolingo Family akan dikirimkan ke email Anda dalam 1–15 menit.
5. Buka email, klik "Accept Invitation / Gabung Keluarga", dan akun Anda otomatis aktif Super Duolingo 1 Tahun.
6. Garansi penuh 1 tahun selama masa aktif dengan bantuan admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Aktivasi langsung ke akun Duolingo pribadi Anda, seluruh progres belajar, streak hari, dan teman Anda tetap terjaga 100%.`,
    features: [
      "Nyawa tak terbatas (Unlimited Hearts): bebas latihan tanpa takut kehabisan nyawa",
      "Belajar 100% bebas jeda iklan di aplikasi mobile maupun web",
      "Akses penuh ke Practice Hub untuk melatih kesalahan dan percakapan khusus",
      "Bebas mencoba tes loncat level (Legendary Challenges) tanpa biaya gems",
      "Tinjauan kemajuan belajar personal berbasis kecerdasan buatan"
    ],
    requirements: {
      Android: "Aplikasi Duolingo di Android 7.0+.",
      iOS: "Aplikasi Duolingo di iOS 14.0+.",
      Web: "duolingo.com di semua browser."
    },
    version: "Super 12 Months Official",
    variantDescriptions: {
      "duolingo-1": "Aktivasi Super Duolingo 12 Bulan via Family Slot resmi ke email akun sendiri."
    }
  },

  "Coursera Plus": {
    name: "Coursera Plus",
    tagline: "Akses Tanpa Batas ke 7.000+ Kursus & Sertifikat Profesional Google, Meta, IBM & Universitas Dunia",
    serviceDescription: "Langganan resmi Coursera Plus untuk mendapatkan akses tak terbatas ke lebih dari 7.000 kursus daring, spesialisasi, dan program Sertifikat Profesional dari institusi ternama dunia seperti Google, Meta, IBM, Amazon AWS, Stanford, dan Yale University lengkap dengan sertifikat kelulusan resmi.",
    summary: `Tingkatkan karir Anda di bidang Data Science, Software Engineering, AI, Digital Marketing, dan Bisnis dengan sertifikat resmi berstandar global yang diakui perusahaan internasional.

CARA ORDER / CARA PEMBELIAN:
1. Pilih durasi paket Coursera Plus (1 Bulan Akun Private atau 1 Tahun Akun Edu/Org Access).
2. Isi data kontak Anda pada form pemesanan.
3. Bayar melalui QRIS, Binance Pay, BNB, atau Tron sesuai nominal pas.
4. Data akun Coursera Plus siap pakai akan dikirimkan otomatis ke email Anda.
5. Login di coursera.org, daftarkan diri ke kursus mana pun yang Anda inginkan, dan mulai belajar.
6. Full garansi selama masa aktif paket yang Anda pilih via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Sertifikat digital resmi atas nama Anda dapat diunduh dan dipajang langsung di profil LinkedIn Anda.`,
    features: [
      "Akses tanpa batas ke 7.000+ kursus dan ratusan program spesialisasi ternama",
      "Dapatkan Sertifikat Profesional resmi tanpa biaya tambahan setelah lulus tugas",
      "Materi pembelajaran dari Google, Meta, IBM, Microsoft, Yale, Michigan, dll",
      "Akses ke Hands-on Guided Projects untuk praktik langsung di lingkungan virtual",
      "Jadwal belajar fleksibel sesuai kecepatan belajar pribadi Anda"
    ],
    requirements: {
      Web: "coursera.org di browser desktop / laptop.",
      Android: "Aplikasi Coursera di Android 6.0+.",
      iOS: "Aplikasi Coursera di iOS 14.0+."
    },
    version: "Coursera Plus 2026",
    variantDescriptions: {
      "coursera-private-1m": "Akun Private Coursera Plus 1 Bulan dengan sertifikat kelulusan tak terbatas.",
      "coursera-edu-1y": "Akun Coursera Plus 1 Tahun Org Access untuk pembelajaran jangka panjang."
    }
  },

  "Roblox 1,000 Robux": {
    name: "Roblox 1,000 Robux",
    tagline: "Kode Voucher Resmi Roblox Robux Digital: Top Up Instan untuk Avatar & Game Pass",
    serviceDescription: "Kode voucher digital resmi Roblox Robux (pilihan 100, 500, 1.000, hingga 2.000 Robux) untuk mengisi saldo Robux di akun Roblox Anda secara instan. Gunakan untuk membeli item avatar eksklusif, skin, animasi, game passes, dan akses item di jutaan game Roblox.",
    summary: `Voucher resmi 100% legal dan aman dari banned. Kode voucher digital dapat di-redeem langsung di akun Roblox pribadi Anda di platform web resmi roblox.com/redeem.

CARA ORDER / CARA PEMBELIAN:
1. Pilih denominasi Robux yang diinginkan (100, 500, 1.000, atau 2.000 Robux).
2. Lakukan checkout dan selesaikan pembayaran via QRIS, Binance Pay, BNB, atau Tron.
3. Kode PIN voucher digital 10–16 digit akan dikirimkan instan ke email dan invoice status pesanan.
4. Buka browser, login ke akun Anda di roblox.com/redeem.
5. Masukkan kode voucher yang diterima dan klik tombol "Redeem". Saldo Robux akan langsung bertambah seketika.
6. Garansi kode valid 100% saat di-redeem via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Pastikan Anda login ke akun Roblox yang benar sebelum menekan tombol redeem. Kode voucher bersifat sekali pakai.`,
    features: [
      "Kode voucher digital resmi 100% legal dan aman dari banned akun",
      "Dapat di-redeem ke semua region akun Roblox (Global / Indonesia)",
      "Proses instan masuk ke saldo Robux tanpa perlu memberikan password akun",
      "Bebas digunakan untuk membeli Avatar Items, Game Passes, dan Developer Products",
      "Dukungan denominasi fleksibel sesuai kebutuhan gaming Anda"
    ],
    requirements: {
      Web: "Halaman redeem resmi di roblox.com/redeem pada browser apa pun.",
      Android: "Aplikasi Roblox di Android.",
      iOS: "Aplikasi Roblox di iOS.",
      Windows: "Roblox Client di Windows 10/11.",
      macOS: "Roblox Client di macOS."
    },
    version: "Official Digital Gift Card",
    variantDescriptions: {
      "robux-100": "Kode Voucher Digital 100 Robux resmi instan redeem.",
      "robux-500": "Kode Voucher Digital 500 Robux resmi untuk item avatar.",
      "robux-1000": "Kode Voucher Digital 1.000 Robux paling laris untuk Game Pass.",
      "robux-2000": "Kode Voucher Digital 2.000 Robux Best Value untuk koleksi item langka."
    }
  },

  "Discord Nitro": {
    name: "Discord Nitro",
    tagline: "Tingkatkan Pengalaman Discord: 2 Server Boosts, Emoji Global, 4K 60fps Stream & 500MB Upload",
    serviceDescription: "Aktivasi resmi Discord Nitro (Basic / Full dengan 2 Server Boosts) untuk membuka fitur personalisasi profil tingkat tinggi: avatar bergerak (GIF), banner profil khusus, custom tag/badge, streaming video 4K 60fps, batas kirim pesan 4.000 karakter, dan upload file hingga 500 MB.",
    summary: `Tampil menonjol di semua server Discord dengan emoji kustom lintas server, tema profil warna-warni, suara soundboard di mana saja, dan 2x Server Boost gratis untuk menaikkan level server komunitas Anda.

CARA ORDER / CARA PEMBELIAN:
1. Pilih variasi paket Discord Nitro (1 Bulan Basic, 1 Bulan Full + 2 Boosts, atau 1 Tahun Full).
2. Masukkan detail kontak Anda di checkout.
3. Selesaikan pembayaran melalui QRIS, Binance Pay, BNB, atau Tron.
4. Tautan Gift Link resmi Discord Nitro atau instruksi aktivasi akan dikirimkan otomatis ke email Anda.
5. Buka tautan Gift Link di browser/aplikasi Discord Anda dan klik "Accept Gift".
6. Garansi penuh selama masa aktif varian yang Anda beli via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Aktivasi via Gift Link resmi langsung masuk ke akun Discord pribadi Anda tanpa perlu login password.`,
    features: [
      "Gunakan Custom & Animated Emoji serta Stiker di mana saja lintas server",
      "2x Server Boost gratis bulanan + diskon 30% untuk pembelian boost tambahan",
      "Kualitas streaming video layar HD tajam hingga 4K pada 60 FPS",
      "Ukuran upload berkas file besar hingga 500 MB (Basic: 50 MB)",
      "Kustomisasi profil penuh: Animated Avatar GIF, Banner Profil & Custom Badge"
    ],
    requirements: {
      Windows: "Aplikasi Discord Desktop Windows 10/11.",
      macOS: "Aplikasi Discord Desktop macOS.",
      Linux: "Aplikasi Discord Desktop Linux (.deb / tar.gz / Flatpak).",
      Android: "Aplikasi Discord di Google Play Store.",
      iOS: "Aplikasi Discord di App Store.",
      Web: "discord.com/app di browser modern."
    },
    version: "Nitro Full 2026",
    variantDescriptions: {
      "nitro-basic-1m": "Discord Nitro Basic 1 Bulan dengan emoji global dan upload 50MB.",
      "nitro-full-1m": "Discord Nitro Full 1 Bulan dengan 2 Server Boosts, streaming 4K, dan upload 500MB.",
      "nitro-full-1y": "Discord Nitro Full 1 Tahun penuh resmi dengan diskon boost dan garansi 100%."
    }
  },

  "Steam Wallet & Account": {
    name: "Steam Wallet & Account",
    tagline: "Voucher Steam Wallet IDR & Akun Steam Fresh Region Indonesia Siap Pakai",
    serviceDescription: "Voucher saldo resmi Steam Wallet Code (IDR Rp 45.000 / Rp 90.000) dan Akun Steam Fresh Region Indonesia siap pakai untuk membeli game PC original di Steam Store (Dota 2, CS2, GTA V, EA FC, Cyberpunk 2077, Black Myth: Wukong), item market, dan battle pass.",
    summary: `Beli game original favorit Anda di Steam dengan mudah tanpa kartu kredit. Kode voucher digital langsung menambah saldo rupiah Anda secara otomatis.

CARA ORDER / CARA PEMBELIAN:
1. Pilih produk yang Anda butuhkan (Akun Steam Fresh, Voucher Rp 45.000, atau Voucher Rp 90.000).
2. Lakukan checkout dan bayar via QRIS atau Crypto.
3. Untuk Voucher: Kode digital 15 digit akan dikirimkan langsung. Untuk Akun: Data username & password email akan dikirimkan.
4. Buka aplikasi Steam atau store.steampowered.com/account/redeemwalletcode.
5. Masukkan kode voucher dan saldo Steam Wallet Anda seketika bertambah.
6. Garansi kode valid 100% saat penukaran via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Voucher berlaku untuk akun Steam dengan mata uang Rupiah (IDR).`,
    features: [
      "Kode voucher digital resmi 100% legal dan bebas risiko penalti",
      "Saldo langsung masuk ke Steam Wallet dalam mata uang Rupiah (IDR)",
      "Bebas digunakan untuk membeli game, DLC, software, dan item Community Market",
      "Opsi Akun Fresh siap pakai lengkap dengan akses email pertama",
      "Proses pengiriman instan otomatis setelah pembayaran terverifikasi"
    ],
    requirements: {
      Windows: "Steam Client di Windows 10/11.",
      macOS: "Steam Client di macOS.",
      Linux: "Steam Client di Linux (SteamOS / Ubuntu)."
    },
    version: "Steam IDR Digital Code",
    variantDescriptions: {
      "steam-account-fresh": "Akun Steam Region Indonesia Fresh siap pakai lengkap dengan data email pertama.",
      "steam-wallet-45k": "Kode Voucher Resmi Steam Wallet IDR Rp 45.000 instan redeem.",
      "steam-wallet-90k": "Kode Voucher Resmi Steam Wallet IDR Rp 90.000 instan redeem."
    }
  },

  "Hotmail Outlook Pro": {
    name: "Hotmail Outlook Pro",
    tagline: "Akun Email Hotmail & Outlook Verified Kualitas Tinggi untuk Registrasi & Bisnis",
    serviceDescription: "Paket akun email Microsoft Hotmail / Outlook resmi terverifikasi kualitas tinggi (Pilihan Satuan atau Paket Hemat 5 Akun). Siap digunakan untuk pendaftaran akun media sosial, layanan SaaS, verifikasi developer, dan korespondensi bisnis dengan protokol POP3/IMAP aktif.",
    summary: `Akun email fresh dengan reputasi IP bersih, format login rapi lengkap dengan email pemulihan (recovery email), serta umur akun yang stabil untuk mencegah checkpoint verifikasi berulang.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket akun yang Anda inginkan (1 Akun Verified atau Paket Hemat 5 Akun).
2. Lakukan checkout dan selesaikan pembayaran via QRIS / Crypto.
3. Data akun lengkap dengan format: Email | Password | Recovery Email akan dikirimkan otomatis ke email dan invoice Anda.
4. Login di outlook.live.com atau aplikasi email favorit Anda via protokol IMAP/POP3.
5. Garansi ganti baru 100% jika akun mengalami kendala login saat pertama kali diterima via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Harap langsung amankan akun atau gunakan sesuai kebutuhan pendaftaran layanan Anda.`,
    features: [
      "Akun email Microsoft Outlook / Hotmail terverifikasi dengan domain resmi",
      "Format data rapi dan terstruktur: Email | Password | Recovery Email",
      "Mendukung akses webmail langsung di outlook.com dan protokol IMAP / POP3 / SMTP",
      "Reputasi domain tinggi untuk penerimaan email OTP dan verifikasi yang lancar",
      "Garansi penggantian akun baru jika ada kendala saat login pertama"
    ],
    requirements: {
      Web: "outlook.live.com di semua browser web.",
      Android: "Aplikasi Microsoft Outlook di Android.",
      iOS: "Aplikasi Microsoft Outlook di iOS.",
      Windows: "Aplikasi Mail / Outlook di Windows.",
      macOS: "Aplikasi Apple Mail / Outlook di macOS."
    },
    version: "Verified Enterprise Stock",
    variantDescriptions: {
      "hotmail-single": "1 Akun Microsoft Outlook / Hotmail Verified siap pakai lengkap dengan email pemulihan.",
      "hotmail-bundle-5": "Paket 5 Akun Microsoft Outlook / Hotmail Verified hemat untuk registrasi multi-layanan."
    }
  },

  "LinkedIn Premium Career": {
    name: "LinkedIn Premium Career",
    tagline: "Tingkatkan Peluang Karir: InMail Gratis, Insight Pelamar Kerja & Akses LinkedIn Learning",
    serviceDescription: "Aktivasi langganan resmi LinkedIn Premium Career (1 Bulan / 6 Bulan) ke akun LinkedIn pribadi Anda. Dapatkan fitur pesan langsung InMail ke HRD dan perekrut tanpa perlu terhubung, lihat siapa saja yang mengunjungi profil Anda, bandingkan kualifikasi Anda dengan pelamar lain, dan akses 20.000+ kursus video LinkedIn Learning.",
    summary: `Dapatkan keunggulan kompetitif dalam mencari pekerjaan impian. Profil LinkedIn dengan lencana emas Premium Career terbukti mendapatkan 4x lebih banyak kunjungan dari recruiter dan headhunter global.

CARA ORDER / CARA PEMBELIAN:
1. Pilih durasi paket LinkedIn Premium Career (1 Bulan atau 6 Bulan).
2. Masukkan detail nama dan email Anda pada form pemesanan.
3. Selesaikan pembayaran melalui QRIS, Binance Pay, BNB, atau Tron.
4. Tautan Gift Link aktivasi resmi LinkedIn akan dikirimkan otomatis ke email Anda.
5. Klik tautan aktivasi tersebut saat login di akun LinkedIn pribadi Anda, dan status akun akan langsung berubah menjadi LinkedIn Premium.
6. Full garansi resmi selama masa aktif paket yang dipilih via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Aktivasi langsung masuk ke akun LinkedIn pribadi Anda tanpa perlu memberikan password akun.`,
    features: [
      "Kirim pesan langsung (InMail credits) ke manajer perekrut dan HRD tanpa perlu koneksi",
      "Lihat daftar lengkap siapa saja yang telah melihat profil Anda selama 90 hari terakhir",
      "Competitive Insights: bandingkan skill dan kualifikasi Anda dengan kandidat pelamar kerja lainnya",
      "Akses tanpa batas ke 20.000+ kursus bersertifikat di LinkedIn Learning",
      "Lencana emas LinkedIn Premium eksklusif di profil untuk meningkatkan kredibilitas profesional"
    ],
    requirements: {
      Web: "linkedin.com di semua browser desktop.",
      Android: "Aplikasi LinkedIn di Google Play Store.",
      iOS: "Aplikasi LinkedIn di App Store."
    },
    version: "Premium Career 2026",
    variantDescriptions: {
      "linkedin-career-1m": "Aktivasi LinkedIn Premium Career 1 Bulan via Gift Link resmi langsung ke email sendiri.",
      "linkedin-career-6m": "Aktivasi LinkedIn Premium Career 6 Bulan hemat untuk pencarian karir intensif."
    }
  },

  "Instagram Followers & Likes HQ": {
    name: "Instagram Followers & Likes HQ",
    tagline: "Tingkatkan Kredibilitas Akun: Followers High Quality, Drip-Feed Alami & Garansi Refill 30 Hari",
    serviceDescription: "Layanan penambahan Followers & Likes Instagram High Quality (Pilihan 1.000, 2.500, hingga 5.000 Followers) dengan profil berkualitas tinggi (berfoto profil, bio, dan postingan aktif). Diproses secara aman dengan sistem drip-feed bertahap tanpa memerlukan password akun.",
    summary: `Tingkatkan social proof toko online, brand bisnis, atau akun personal branding Anda agar terlihat jauh lebih terpercaya bagi calon pelanggan baru.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket jumlah followers yang Anda butuhkan (1.000, 2.500, atau 5.000 Followers HQ).
2. Cantumkan USERNAME Instagram Anda yang benar pada kolom catatan/form pemesanan.
3. Selesaikan pembayaran melalui QRIS, Binance Pay, BNB, atau Tron.
4. Pesanan akan otomatis diproses masuk secara bertahap dalam waktu 1–24 jam demi keamanan akun.
5. Garansi refill (isi ulang gratis) selama 30 hari jika terjadi penurunan jumlah followers via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• PASTIKAN AKUN INSTAGRAM ANDA DALAM STATUS PUBLIK (TIDAK DI-PRIVATE) selama proses pengisian berlangsung. Jangan pernah mengubah username saat proses berjalan.`,
    features: [
      "Followers High Quality dengan profil lengkap (foto profil & feed aktif)",
      "100% Aman: Tanpa memerlukan password akun Instagram Anda",
      "Proses pengiriman bertahap (Drip-Feed) agar terlihat alami dan aman dari algoritma",
      "Garansi Refill 30 Hari: isi ulang otomatis jika ada drop followers",
      "Bonus likes tambahan pada varian paket hemat dan super growth"
    ],
    requirements: {
      Android: "Akun Instagram publik di aplikasi Android.",
      iOS: "Akun Instagram publik di aplikasi iOS.",
      Web: "Akun Instagram publik di instagram.com."
    },
    version: "HQ Server v4.8",
    variantDescriptions: {
      "ig-followers-1000": "1.000 Followers High Quality dengan foto profil dan garansi refill 30 hari.",
      "ig-followers-2500": "2.500 Followers High Quality bonus paket likes postingan.",
      "ig-followers-5000": "5.000 Followers High Quality Super Growth Pack untuk kredibilitas bisnis."
    }
  },

  "TikTok Followers & Views": {
    name: "TikTok Followers & Views",
    tagline: "Akun TikTok Siap Live Studio & Keranjang Kuning TikTok Shop / Akun Region USA 2024",
    serviceDescription: "Penyediaan akun TikTok berkualitas tinggi yang telah memenuhi kualifikasi fitur Live Studio dan Keranjang Kuning TikTok Shop (<900 Followers Siap Live) serta akun TikTok Region USA (Amerika Serikat) 2024 untuk monetisasi Creator Rewards Program.",
    summary: `Mulai jualan online di TikTok Shop atau lakukan live streaming game dari PC menggunakan TikTok Live Studio tanpa perlu menunggu mengumpulkan 1.000 followers secara manual.

CARA ORDER / CARA PEMBELIAN:
1. Pilih jenis akun TikTok yang Anda butuhkan (TikTok Siap Live Studio / Cart atau TikTok USA 2024).
2. Lakukan checkout dan selesaikan pembayaran via QRIS / Crypto.
3. Data akun lengkap (Username, Password, dan Email Akses) akan dikirimkan otomatis ke email Anda.
4. Login di aplikasi TikTok atau TikTok Live Studio di PC Anda.
5. Garansi ganti akun baru jika terjadi kendala login pada saat pertama kali diterima via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Gunakan data login yang diberikan dan segera ganti kata sandi serta kaitkan nomor HP pribadi Anda setelah akun berhasil diakses.`,
    features: [
      "Akun siap pakai dengan fitur Live Streaming & TikTok Live Studio PC aktif",
      "Fitur Showcase Keranjang Kuning TikTok Shop aktif",
      "Opsi Akun Region USA (US) 2024 dengan akses program monetisasi Creator Rewards",
      "Lengkap dengan akses login email pertama untuk keamanan penuh",
      "Garansi login pertama 100% dengan bantuan admin Telegram @tokonoo"
    ],
    requirements: {
      Android: "Aplikasi TikTok di Android 8.0+.",
      iOS: "Aplikasi TikTok di iOS 14.0+.",
      Web: "tiktok.com / TikTok Live Studio di Windows 10/11."
    },
    version: "Live Studio / US 2024",
    variantDescriptions: {
      "tiktok-1": "Akun TikTok <900 Followers siap fitur Live Studio PC dan Keranjang Kuning TikTok Shop.",
      "tiktok-2": "Akun TikTok Region USA (US) 2024 fresh untuk program monetisasi Creator Rewards."
    }
  },

  "DeepSeek API": {
    name: "DeepSeek API",
    tagline: "API Key DeepSeek V4 Flash / V4 Pro: Jendela Konteks 1M Token & Integrasi OpenAI-Compatible",
    serviceDescription: "Layanan akses API Key DeepSeek V4 Flash / V4 Pro resmi dengan token tak terbatas (Unlimited Token 30 Hari). Dirancang khusus untuk developer aplikasi AI, automasi bot, asisten koding Cursor/Cline/VS Code, dan integrasi LLM berkinerja tinggi dengan throughput cepat dan latensi rendah.",
    summary: `DeepSeek V4 adalah fondasi model AI terdepan dengan kemampuan penalaran matematika dan coding yang luar biasa hemat biaya. Format endpoint API 100% kompatibel dengan OpenAI SDK sehingga dapat langsung menggantikan baseURL di library OpenAI mana pun.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket API DeepSeek V4 Flash Unlimited Token 30 Days.
2. Masukkan email Anda pada form checkout pemesanan.
3. Selesaikan pembayaran melalui QRIS, Binance Pay, BNB, atau Tron.
4. API Key DeepSeek beserta endpoint URL resmi akan dikirimkan instan ke email dan invoice Anda dalam 1–15 menit.
5. Salin API Key ke environment variable aplikasi Anda atau konfigurasi model di Cursor / Next.js / Python.
6. Dukungan teknis integrasi tersedia via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Simpan API Key di file .env yang aman. Kompatibel dengan endpoint chat completions standar.`,
    features: [
      "Akses penuh ke model DeepSeek V4 Flash & Thinking Mode penalaran mendalam",
      "Jendela konteks besar hingga 1.000.000 (1M) token untuk pemrosesan codebase raksasa",
      "Kompatibilitas 100% dengan format OpenAI API (cURL, Python, Node.js, LangChain)",
      "Latensi response super cepat dengan throughput token tinggi per detik",
      "Ideal untuk integrasi Cursor AI, Cline, Aider, Open-WebUI, dan backend SaaS"
    ],
    requirements: {
      Web: "HTTP Client / SDK di Node.js, Python, cURL, Go, PHP, atau integrasi AI Tools."
    },
    version: "DeepSeek V4 Flash API",
    variantDescriptions: {
      "deepseek-1": "API Key DeepSeek V4 Flash Unlimited Token 30 Hari kompatibel dengan OpenAI SDK."
    }
  },

  "TradingView Premium": {
    name: "TradingView Premium",
    tagline: "Platform Analisis Grafik Keuangan: 8 Chart per Tab, 25 Indikator, Data Detik & Alert Tanpa Batas",
    serviceDescription: "Langganan resmi TradingView Premium Tier (30 Hari) untuk trader saham, forex, crypto, dan komoditas. Nikmati analisis grafik tingkat lanjut dengan hingga 8 chart dalam 1 tab, 25 indikator teknikal per grafik, interval waktu berbasis detik, 400 server-side alert realtime, dan bebas iklan.",
    summary: `TradingView Premium adalah standar tertinggi bagi para trader profesional dunia untuk melakukan charting presisi, backtesting strategi trading, dan memantau pergerakan pasar global tanpa batasan.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket TradingView Premium 30 Days lalu lakukan checkout.
2. Selesaikan pembayaran via QRIS, Binance Pay, BNB, atau Tron.
3. Data akun TradingView Premium (Email & Password) akan dikirimkan otomatis ke email Anda.
4. Login di tradingview.com atau aplikasi TradingView di PC/Smartphone.
5. Garansi penggantian akun jika terjadi kendala langganan via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Akun siap pakai dengan status Premium aktif. Anda dapat langsung menyimpan custom layout dan template indikator Anda.`,
    features: [
      "Tampilkan hingga 8 grafik (charts) sekaligus dalam satu layout tab browser",
      "Gunakan hingga 25 indikator teknikal secara bersamaan pada satu grafik",
      "Interval waktu bar grafik berbasis detik (1s, 5s, 15s, 30s) untuk scalping presisi",
      "Hingga 400 Server-Side Price Alerts realtime yang aktif terus menerus",
      "Akses data historis bar chart 4x lebih panjang (20.000 bar) untuk backtesting mendalam"
    ],
    requirements: {
      Web: "tradingview.com di semua browser desktop.",
      Android: "Aplikasi TradingView di Android 8.0+.",
      iOS: "Aplikasi TradingView di iOS 15.0+."
    },
    version: "Premium Tier 2026",
    variantDescriptions: {
      "tradingview-1": "Akun TradingView Premium 30 Hari dengan 8 chart per layout dan interval detik."
    }
  },

  "Wink VIP": {
    name: "Wink VIP",
    tagline: "Video Retouching & AI Video Enhancer: AI Video Quality 4K, Body Reshape & Beauty Portrait",
    serviceDescription: "Langganan resmi Wink VIP (Pilihan 90 Hari atau 1 Tahun Penuh) dari pengembang Meitu untuk menyempurnakan kualitas video portrait secara otomatis dengan AI. Buka seluruh fitur upscaling video ke resolusi 4K ultra jernih, perbaikan wajah alami, penghapusan kerutan/noda, dan pengeditan warna sinematik.",
    summary: `Wink VIP adalah aplikasi video editing portrait nomor satu bagi kreator konten video vertikal (Reels, TikTok, Shorts) untuk menghasilkan kualitas visual wajah dan video yang memukau layaknya rekaman kamera profesional.

CARA ORDER / CARA PEMBELIAN:
1. Pilih durasi paket Wink VIP yang diinginkan (90 Hari atau 1 Tahun Full Warranty).
2. Lakukan checkout dan selesaikan pembayaran via QRIS / Crypto.
3. Data akun Wink VIP akan dikirimkan otomatis ke email Anda.
4. Buka aplikasi Wink di ponsel Android atau iPhone, login dengan akun yang diberikan.
5. Garansi penuh 100% selama masa aktif paket dengan admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Gunakan akun khusus yang diberikan. Jangan mengubah password atau info profil.`,
    features: [
      "Fitur AI Video Repair: tingkatkan video buram/pecah menjadi kualitas 4K ultra HD",
      "AI Portrait Retouch: perbaiki tekstur kulit, makeup, dan bentuk wajah secara alami pada video bergerak",
      "AI Body Reshape untuk proporsi tubuh video yang proporsional dan mulus",
      "Hapus objek dan orang yang tidak diinginkan pada video dengan AI Eraser",
      "Ekspor video resolusi tinggi tanpa watermark dan tanpa batas durasi"
    ],
    requirements: {
      Android: "Android 8.0 atau lebih baru.",
      iOS: "iOS 14.0 atau lebih baru untuk iPhone."
    },
    version: "VIP Edition 2026",
    variantDescriptions: {
      "wink-1": "Akun Wink VIP 1 Tahun penuh dengan fitur AI Video Repair 4K dan full warranty.",
      "wink-2": "Akun Wink VIP 90 Hari hemat untuk kebutuhan konten video berkala."
    }
  },

  "Freepik Magnific": {
    name: "Freepik Magnific",
    tagline: "Akses Web Panel Freepik Premium & Magnific AI Image Upscaler 8K Tanpa Batas",
    serviceDescription: "Langganan akses panel web Freepik Premium & Magnific AI (Pilihan 30 Hari, 60 Hari, atau 90 Hari) untuk mengunduh jutaan aset vektor, file PSD, foto stok resolusi tinggi, dan menggunakan teknologi upscaling gambar AI Magnific tercanggih hingga resolusi 8K dengan penambahan detail mikroskopis fotorealistik.",
    summary: `Magnific AI terkenal mampu merekayasa ulang detail gambar beresolusi rendah menjadi karya seni beresolusi 8K yang tajam memukau, sangat ideal untuk desainer grafis, fotografer, dan agensi kreatif.

CARA ORDER / CARA PEMBELIAN:
1. Pilih durasi paket Freepik - Magnific API Web Panel (30 Hari, 60 Hari, atau 90 Hari).
2. Selesaikan pembayaran melalui QRIS, Binance Pay, BNB, atau Tron.
3. Tautan akses panel web khusus beserta kredensial login akan dikirimkan langsung ke email Anda.
4. Buka web panel di browser, masukkan file gambar atau cari aset Freepik, dan unduh hasil resolusi tinggi seketika.
5. Full garansi selama masa durasi paket aktif via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Akses melalui panel web resmi berkecepatan tinggi tanpa batas kuota unduhan harian yang merepotkan.`,
    features: [
      "Akses download tak terbatas ke seluruh koleksi Freepik Premium (Vektor, PSD, Foto)",
      "Teknologi Magnific AI Upscaler: ubah gambar kecil menjadi detail ultra tinggi 8K",
      "Fitur Hallucination Engine untuk menambah detail tekstur kulit, kain, dan alam yang realistis",
      "Akses via panel web responsif yang stabil 24 jam",
      "Garansi penuh selama periode langganan yang Anda pilih"
    ],
    requirements: {
      Web: "Browser modern di komputer desktop atau laptop."
    },
    version: "Magnific API Web Panel",
    variantDescriptions: {
      "freepik-1": "Akses Web Panel Freepik & Magnific AI 90 Hari dengan full warranty.",
      "freepik-2": "Akses Web Panel Freepik & Magnific AI 60 Hari hemat biaya.",
      "freepik-3": "Akses Web Panel Freepik & Magnific AI 30 Hari untuk proyek visual instan."
    }
  },

  "Akool Pro": {
    name: "Akool Pro",
    tagline: "AI Face Swap HD, Talking Avatar & Background Replacement Studio untuk Video Komersial",
    serviceDescription: "Langganan akun resmi Akool Pro / Starter dengan saldo kredit komputasi (200 / 600 Credits) untuk melakukan Face Swap foto & video resolusi tinggi berkecepatan tinggi, pembuatan avatar berbicara interaktif, dan penggantian latar belakang video otomatis untuk kebutuhan komersial dan periklanan.",
    summary: `Akool adalah platform manipulasi visual AI kelas industri dengan akurasi pengenalan wajah paling konsisten di industri video marketing global.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket Akun Akool yang Anda inginkan (Starter 200 Credits, Pro 600 Credits, atau Pro 1 Month).
2. Lakukan checkout dan bayar via QRIS / Crypto.
3. Kredensial akun Akool Pro akan dikirimkan otomatis ke email Anda.
4. Login di akool.com, upload video/foto sumber, dan mulai generate face swap berkualitas studio.
5. Didukung garansi penuh selama masa aktif varian yang dipilih via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Gunakan kredit komputasi untuk render video face swap tanpa watermark.`,
    features: [
      "AI Face Swap foto dan video resolusi tinggi hingga 4K tanpa distorsi ekspresi",
      "AI Talking Avatar: buat karakter berbicara dari foto statis dan file audio naskah",
      "Background Change AI untuk menghapus dan mengganti latar video secara presisi",
      "Kecepatan render cepat berbasis GPU server cloud berkinerja tinggi",
      "Ekspor hasil video bersih tanpa watermark"
    ],
    requirements: {
      Web: "akool.com di browser desktop modern."
    },
    version: "Pro Studio Edition",
    variantDescriptions: {
      "akool-1": "Akun Akool Starter 1 Bulan dengan 200 Creation Credits dan garansi 24 jam.",
      "akool-2": "Akun Akool Pro 1 Bulan dengan 600 Creation Credits untuk studio marketing.",
      "akool-3": "Akun Akool Pro 1 Bulan dengan akses studio video tanpa watermark."
    }
  },

  "MiniMax API": {
    name: "MiniMax API",
    tagline: "API Multimodal MiniMax M3 & Hailuo Video AI: Text-to-Video, Music & Voice AI",
    serviceDescription: "Layanan akses API Key MiniMax M3 Unlimited Token (14 Hari) dan Paket Redeem 300K Credits resmi untuk developer. Mendukung integrasi model bahasa besar (LLM) MiniMax M3, generasi video sinematik Hailuo AI, dan sintesis suara realistis multi-bahasa melalui antarmuka API terpadu.",
    summary: `MiniMax adalah salah satu fondasi AI multimodal terkuat di Asia dengan kemampuan video generation sinematik (Hailuo AI) dan pemrosesan teks berkecepatan tinggi.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket MiniMax yang Anda butuhkan (API MiniMax M3 Unlimited 14 Days atau Redeem 300K Credits).
2. Selesaikan pembayaran melalui QRIS, Binance Pay, BNB, atau Tron.
3. API Key atau kode redeem resmi akan dikirimkan otomatis ke email dan invoice Anda.
4. Gunakan API Key pada SDK / backend aplikasi Anda untuk memanggil endpoint MiniMax.
5. Bantuan teknis integrasi tersedia via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Simpan kredensial API Key di file konfigurasi backend Anda dengan aman.`,
    features: [
      "Akses ke endpoint model MiniMax M3 dengan pemrosesan token ultra cepat",
      "Dukungan generasi video sinematik Hailuo AI Text-to-Video via API",
      "Sintesis suara Speech-to-Speech & Text-to-Speech dengan emosi realistis",
      "Format integrasi REST API & WebSocket yang mudah diimplementasikan",
      "Kapasitas throughput tinggi untuk aplikasi berskala produksi"
    ],
    requirements: {
      Web: "HTTP Client / SDK di environment backend (Node.js, Python, Go, dll)."
    },
    version: "MiniMax M3 / Hailuo API",
    variantDescriptions: {
      "minimax-1": "API Key MiniMax M3 Unlimited Token 14 Hari untuk integrasi teks dan reasoning.",
      "minimax-2": "Kode Redeem Resmi MiniMax 300K Credits untuk video dan voice generation."
    }
  },

  "iCloud Storage": {
    name: "iCloud Storage",
    tagline: "Penyimpanan Cloud Ekosistem Apple 2TB (2.000 GB): Backup Foto, Video, iPhone & Mac",
    serviceDescription: "Slot resmi Apple iCloud+ 2TB (2.000 GB) Full Warranty untuk memperluas penyimpanan cloud di seluruh perangkat Apple Anda (iPhone, iPad, Mac). Mendukung pencadangan otomatis (Backup), iCloud Photos resolusi penuh, iCloud Drive, iCloud Private Relay, dan Hide My Email.",
    summary: `Hilangkan notifikasi "Penyimpanan iCloud Penuh" di iPhone Anda. Dengan slot 2TB, Anda dapat mencadangkan ribuan foto dan video beresolusi tinggi dengan aman tanpa perlu membeli paket langganan mahal secara mandiri.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket iCloud Slot 2TB - 1 Month Full Warranty.
2. Masukkan Apple ID (email Apple) Anda pada kolom catatan pemesanan.
3. Selesaikan pembayaran via QRIS, Binance Pay, BNB, atau Tron.
4. Undangan resmi Apple Family Sharing untuk slot 2TB akan dikirimkan ke Apple ID Anda.
5. Buka Pengaturan (Settings) di iPhone/iPad/Mac, klik notifikasi undangan keluarga Apple, dan terima undangan.
6. Kapasitas iCloud Anda seketika bertambah menjadi 2TB dengan privasi data 100% aman terpisah.
7. Garansi penuh selama masa aktif dengan bantuan admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Foto, file, dan dokumen pribadi Anda 100% AMAN DAN PRIVAT. Anggota keluarga lain TIDAK BISA melihat foto, pesan, atau data Anda.`,
    features: [
      "Kapasitas penyimpanan cloud super besar 2TB (2.000 GB) untuk semua file Anda",
      "Pencadangan otomatis (Auto Backup) untuk iPhone, iPad, dan Mac",
      "iCloud Photos: simpan foto dan video resolusi penuh di cloud untuk menghemat memori HP",
      "Fitur keamanan iCloud+ : iCloud Private Relay (proteksi browsing Safari) & Hide My Email",
      "Privasi 100% terjamin aman, data tidak bercampur dengan anggota keluarga lain"
    ],
    requirements: {
      iOS: "iPhone / iPad dengan iOS 13.0 ke atas.",
      macOS: "Mac / MacBook dengan macOS Catalina ke atas.",
      Web: "Akses file via icloud.com di semua browser."
    },
    version: "iCloud+ 2TB Official Slot",
    variantDescriptions: {
      "icloud-1": "Slot Apple iCloud+ 2TB (2.000 GB) 1 Bulan via Family Sharing resmi dengan garansi penuh."
    }
  },

  "Scribd Premium": {
    name: "Scribd Premium",
    tagline: "Perpustakaan Digital Terbesar: Jutaan Ebook, Audiobook, Dokumen Akademis & Majalah Global",
    serviceDescription: "Langganan resmi Scribd Premium (1 Bulan Full Warranty) untuk membaca dan mendengarkan jutaan judul ebook terlaris dunia, audiobook narasi profesional, dokumen akademis, jurnal penelitian, lembar musik (sheet music), dan artikel majalah premium tanpa batas.",
    summary: `Scribd adalah teman terbaik untuk menambah wawasan dan literasi Anda. Nikmati buku-buku best-seller dari penerbit internasional terkemuka di ponsel, tablet, atau e-reader Anda.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket Scribd Premium 1 Month - Full Warranty.
2. Lakukan checkout dan bayar dengan QRIS, Binance Pay, BNB, atau Tron.
3. Data akun Scribd Premium (Email & Password) akan dikirimkan langsung ke email Anda.
4. Login di scribd.com atau aplikasi Scribd di Android / iOS.
5. Garansi penuh penggantian akun jika terjadi masalah selama 30 hari masa aktif via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Gunakan data login yang diberikan. Anda dapat mengunduh buku untuk dibaca saat offline.`,
    features: [
      "Akses tanpa batas ke jutaan buku digital (Ebooks) dari berbagai genre",
      "Koleksi Audiobook berkualitas tinggi dengan fitur pengatur kecepatan audio",
      "Akses jutaan dokumen penelitian akademis, skripsi, dan presentasi bisnis",
      "Mode offline reading di aplikasi smartphone dan tablet",
      "Sinkronisasi bookmark dan halaman terakhir dibaca di seluruh perangkat Anda"
    ],
    requirements: {
      Android: "Aplikasi Scribd di Android 7.0+.",
      iOS: "Aplikasi Scribd di iOS 14.0+.",
      Web: "scribd.com di semua browser web."
    },
    version: "Premium Plan 2026",
    variantDescriptions: {
      "scribd-1": "Akun Scribd Premium 1 Bulan dengan akses tak terbatas ke jutaan ebook dan audiobook."
    }
  },

  "Autodesk All Apps": {
    name: "Autodesk All Apps",
    tagline: "Lisensi Resmi Autodesk: AutoCAD, 3ds Max, Maya, Revit, Inventor & Fusion 360",
    serviceDescription: "Aktivasi lisensi resmi Autodesk All Apps (AutoCAD, 3ds Max, Maya, Revit, Inventor Professional, Fusion 360, Civil 3D) untuk arsitek, insinyur teknik, desainer 3D, dan animator. Memberikan akses resmi langsung dari website Autodesk dengan update software versi terbaru.",
    summary: `Dapatkan akses resmi ke seluruh ekosistem software desain teknik dan animasi standar industri global dengan lisensi legal langsung ke akun email Autodesk Anda.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket Autodesk App All (3 Years Warranty 1 Year).
2. Masukkan alamat email akun Autodesk Anda pada formulir pemesanan.
3. Selesaikan pembayaran melalui QRIS, Binance Pay, BNB, atau Tron.
4. Lisensi resmi Autodesk akan diaktifkan langsung ke email akun Autodesk Anda dalam waktu 1–24 jam.
5. Login di manage.autodesk.com, unduh software yang diinginkan, dan aktivasi otomatis saat login di aplikasi desktop.
6. Garansi resmi 1 tahun penuh dengan support admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Lisensi resmi langsung terhubung ke email Autodesk Anda, dapat mengunduh installer asli dari server resmi Autodesk.`,
    features: [
      "Akses penuh ke seluruh software Autodesk (AutoCAD, Revit, 3ds Max, Maya, Fusion 360, dll)",
      "Lisensi resmi terdaftar langsung di portal manage.autodesk.com atas email pribadi Anda",
      "Bebas unduh dan instal versi terbaru (2024, 2025, 2026) langsung dari Autodesk",
      "Penyimpanan Cloud Autodesk Drive dan rendering cloud terintegrasi",
      "Dapat diinstal di sistem operasi Windows dan macOS"
    ],
    requirements: {
      Windows: "Windows 10 / 11 64-bit dengan spesifikasi hardware sesuai software yang diinstal.",
      macOS: "macOS Ventura / Sonoma untuk software yang mendukung macOS (AutoCAD, Maya, Fusion 360)."
    },
    version: "Official Education / Enterprise 2026",
    variantDescriptions: {
      "autodesk-1": "Lisensi Resmi Autodesk All Apps (AutoCAD, 3ds Max, Maya, Revit) aktif 3 Tahun garansi 1 Tahun."
    }
  },

  "Krea AI Basic": {
    name: "Krea AI Basic",
    tagline: "Real-Time AI Generation Studio: Realtime Image Generation, Video AI & Enhancer Upscaler",
    serviceDescription: "Langganan akun resmi Krea AI Basic (5.100 Kredit Komputasi) untuk menghasilkan gambar AI secara realtime di kanvas interaktif, enhancement upscaling gambar resolusi tinggi dengan detail tajam, dan pembuatan video animasi AI.",
    summary: `Krea AI merevolusi pembuatan visual kreatif dengan kecepatan generasi instan (Realtime Canvas). Setiap gerakan kursor dan bentuk yang Anda gambar di kanvas langsung diterjemahkan menjadi karya seni AI fotorealistik dalam hitungan milidetik.

CARA ORDER / CARA PEMBELIAN:
1. Pilih paket Krea Basic 5100 Credit 1 Month Warranty 1 Day.
2. Selesaikan transaksi via QRIS, Binance Pay, BNB, atau Tron.
3. Data akun Krea AI Basic akan dikirimkan otomatis ke email Anda.
4. Login di krea.ai dan mulai gunakan fitur Realtime Generation serta AI Enhancer.
5. Bantuan aktivasi dan klaim garansi tersedia via admin Telegram @tokonoo.

HAL PENTING / CATATAN PENGGUNAAN:
• Akun siap pakai dengan saldo 5.100 kredit aktif. Gunakan untuk upscaling dan generasi video AI.`,
    features: [
      "Real-time AI Image Generation: hasilkan gambar instan saat Anda menggambar di kanvas",
      "AI Enhancer & Upscaler canggih untuk memperjelas foto buram hingga resolusi 4K",
      "AI Video Generation: ubah gambar statis menjadi video dinamis dengan pergerakan mulus",
      "Alokasi 5.100 Fast Computation Credits untuk render tanpa antrean",
      "Antarmuka studio web modern berbasis GPU cloud berkecepatan tinggi"
    ],
    requirements: {
      Web: "krea.ai di browser desktop modern (Google Chrome disarankan)."
    },
    version: "Basic Tier 2026",
    variantDescriptions: {
      "krea-1": "Akun Krea AI Basic 1 Bulan dengan 5.100 Fast Credits untuk realtime canvas dan upscaler."
    }
  }
};
