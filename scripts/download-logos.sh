#!/bin/bash
# Unduh logo asli semua brand Tokono → public/logos/{key}.{ext}
# Sumber prioritas: 1) Simple Icons (SVG vektor warna brand)
#                   2) favicon resmi brand  3) avatar GitHub resmi
set -u
cd "$(dirname "$0")/.."
mkdir -p public/logos
cd public/logos

download() { # key url
  local key="$1" url="$2"
  if [ -f "$key.svg" ] || [ -f "$key.png" ] || [ -f "$key.ico" ]; then return 0; fi
  local ext="svg"
  case "$url" in
    *.png) ext="png" ;;
    *.ico) ext="ico" ;;
    *.jpg|*.jpeg) ext="jpg" ;;
  esac
  local code
  code=$(curl -s -L -o "$key.$ext" -w "%{http_code}" "$url" --max-time 12 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" 2>/dev/null)
  if [ "$code" = "200" ] && [ -s "$key.$ext" ]; then
    local size
    size=$(stat -c%s "$key.$ext" 2>/dev/null || echo 0)
    if [ "$size" -gt 100 ]; then
      echo "OK  $key.$ext  ($size B)  $url"
      return 0
    fi
  fi
  rm -f "$key.$ext"
  echo "MISS $key  $url"
  return 1
}

si() { download "$1" "https://cdn.simpleicons.org/$2/$3"; }
gh() { download "$1" "https://github.com/$2.png"; }
fav() { download "$1" "$2"; }

# ── AI & Chatbot ──────────────────────────────────────────────
si chatgpt openai 10A37F || gh chatgpt openai
si claude claude D97757 || gh claude anthropics
si anthropic anthropic 191919
si gemini googlegemini 8E75B2
si google google 4285F4
si grok x 000000 || fav grok "https://abs.twimg.com/favicons/twitter.2.ico"
si cursor cursor 000000
si lovable cursor 000000 || gh lovable lovable
si manus cursor 000000 || gh manus manus
si perplexity perplexity 20808D
si elevenlabs elevenlabs 1A1A1A
si runway cursor 000000 || gh runway runwayml
si higgsfield cursor 000000 || gh higgsfield higgsfield
si genie google 4285F4 || gh genie google
si granola notion 000000 || gh granola granola-inc
si wispr cursor 000000 || gh wispr wisprflow
si chatprd bot 000000 || gh chatprd chatprd
si leonardo pen-tool 000000 || gh leonardo leonardo-ai
si gamma pen-tool 000000 || gh gamma getgamma
si n8n n8n EA4B71

# ── Streaming ─────────────────────────────────────────────────
si disney disneyplus 113CCF
si netflix netflix E50914
si spotify spotify 1DB954
si prime primevideo 00A8E1
si crunchyroll crunchyroll F47521
si apple apple 000000
si paramount paramountplus 0064FF
si youtube youtube FF0000
si capcut video 000000 || gh capcut capcut

# ── VPN ───────────────────────────────────────────────────────
si nord nordvpn 4687FF
si surfshark surfshark 1EBFBF
si warp cloudflare F38020 || gh warp cloudflare

# ── Akun & Email ──────────────────────────────────────────────
si gmail gmail EA4335
si microsoft microsoft 5E5E5E || fav microsoft "https://www.microsoft.com/favicon.ico"
si outlook microsoftexchange 0078D4 || fav outlook "https://outlook.live.com/favicon.ico"
si hotmail microsoft 5E5E5E || fav hotmail "https://www.microsoft.com/favicon.ico"
si paypal paypal 003087
si steam steam 000000 || fav steam "https://store.steampowered.com/favicon.ico"
si linkedin linkedin 0A66C2

# ── Sosial Media ──────────────────────────────────────────────
si instagram instagram E4405F
si tiktok tiktok 000000

# ── Developer & Cloud ─────────────────────────────────────────
si replit replit F26207
si railway railway 7B3F00
si supabase supabase 3FCF8E
si linear linear 5E6AD2
si posthog posthog 000000
si framer framer 0055FF
si figma figma F24E1E
si factory linear 5E6AD2 || gh factory factory-ai
si mobbin figma F24E1E || gh mobbin mobbin
si jam linear 5E6AD2 || gh jam jamdotdev
si gumloop linear 5E6AD2 || gh gumloop gumloop
si supercut video 000000 || gh supercut supercut

# ── Kreatif & Produktivitas ───────────────────────────────────
si canva canva 00C4CC
si notion notion 000000
si quillbot quillbot 7C3AED || fav quillbot "https://quillbot.com/favicon.ico"
si zoom zoom 0B5CFF
si camscanner camscanner 00A5DF || fav camscanner "https://www.camscanner.com/favicon.ico"
si heygen video 000000 || gh heygen heygen

# ── Lisensi & Pendidikan ──────────────────────────────────────
si discord discord 5865F2 || fav discord "https://dl.discordapp.net/favicon.ico"
si roblox roblox 000000
si esim wifi 000000 || fav esim "https://www.esim.net/favicon.ico"
si coursera coursera 0056D2
si duolingo duolingo 58CC02

echo "── selesai ──"
ls -1 | sort