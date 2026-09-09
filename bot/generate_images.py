"""
ZELVA AI - Premium Banner & Product Image Generator
Generates clean, minimalist, high-resolution graphics with official brand logos.
"""

import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from config import IMAGES_DIR, LOGOS_DIR
from products import PRODUCTS, PRODUCTS_LIST

FONTS_SEARCH = [
    "/usr/share/fonts/google-carlito-fonts/Carlito-Bold.ttf",
    "/usr/share/fonts/google-droid-sans-fonts/DroidSans-Bold.ttf",
    "/usr/share/fonts/adwaita-sans-fonts/AdwaitaSans-Regular.ttf",
    "/usr/share/fonts/google-noto-vf/NotoSans[wght].ttf",
    "/home/tino/.local/share/fonts/JetBrainsMonoNerd/JetBrainsMonoNerdFont-Medium.ttf"
]

def get_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    for fpath in FONTS_SEARCH:
        if os.path.exists(fpath):
            try:
                return ImageFont.truetype(fpath, size)
            except Exception:
                pass
    return ImageFont.load_default()

def hex_to_rgb(hex_str: str) -> tuple[int, int, int]:
    hex_str = hex_str.lstrip('#')
    if len(hex_str) == 3:
        hex_str = "".join([c*2 for c in hex_str])
    return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))

def create_clean_gradient(width: int, height: int, c1: str, c2: str) -> Image.Image:
    rgb1 = hex_to_rgb(c1)
    rgb2 = hex_to_rgb(c2)
    grad = Image.new("RGBA", (width, height))
    draw = ImageDraw.Draw(grad)

    for y in range(height):
        t = y / height
        r = int(rgb1[0] * (1 - t) + rgb2[0] * t)
        g = int(rgb1[1] * (1 - t) + rgb2[1] * t)
        b = int(rgb1[2] * (1 - t) + rgb2[2] * t)
        draw.line([(0, y), (width, y)], fill=(r, g, b, 255))
        
    return grad

def generate_main_banner() -> Path:
    """Generate clean, dark minimalist header banner for /start"""
    width, height = 1200, 500
    base = create_clean_gradient(width, height, "#0B0E14", "#111827")
    
    # Soft ambient glow in center
    glow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse([width//2 - 350, height//2 - 250, width//2 + 350, height//2 + 250], fill=(59, 130, 246, 45))
    glow = glow.filter(ImageFilter.GaussianBlur(120))
    base = Image.alpha_composite(base, glow)

    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Clean outer card container
    cx1, cy1, cx2, cy2 = 50, 40, width - 50, height - 40
    draw.rounded_rectangle([cx1, cy1, cx2, cy2], radius=24, fill=(15, 20, 30, 210), outline=(255, 255, 255, 30), width=1)

    # Top Brand Pill
    font_pill = get_font(18, bold=True)
    draw.rounded_rectangle([cx1 + 40, cy1 + 35, cx1 + 320, cy1 + 75], radius=20, fill=(255, 255, 255, 12), outline=(255, 255, 255, 35), width=1)
    draw.text((cx1 + 60, cy1 + 45), "GLOBAL DIGITAL STORE", fill=(203, 213, 225, 255), font=font_pill)

    # Main Brand Name
    font_brand = get_font(68, bold=True)
    draw.text((cx1 + 40, cy1 + 105), "ZELVA AI", fill=(255, 255, 255, 255), font=font_brand)

    # Subtitle
    font_sub = get_font(26)
    draw.text((cx1 + 42, cy1 + 200), "Premium Subscriptions & AI Development Tools", fill=(148, 163, 184, 255), font=font_sub)

    # Divider
    draw.line([(cx1 + 40, cy1 + 255), (cx2 - 40, cy1 + 255)], fill=(255, 255, 255, 25), width=1)

    # Badges
    badges = ["⚡ Instant Delivery", "🛡️ 100% Warranty", "💳 Global Payments", "🌐 24/7 Support"]
    bx = cx1 + 40
    by = cy1 + 285
    font_b = get_font(20, bold=True)
    for b_item in badges:
        draw.rounded_rectangle([bx, by, bx + 220, by + 48], radius=14, fill=(255, 255, 255, 14), outline=(255, 255, 255, 30), width=1)
        draw.text((bx + 20, by + 12), b_item, fill=(241, 245, 249, 240), font=font_b)
        bx += 240

    final = Image.alpha_composite(base, overlay)
    out_path = IMAGES_DIR / "main_banner.png"
    final.convert("RGB").save(out_path, "PNG", quality=95)
    return out_path

def generate_catalog_banner() -> Path:
    """Generate clean catalog header showing the 12 core products in a neat grid"""
    width, height = 1200, 600
    base = create_clean_gradient(width, height, "#090C12", "#0F172A")
    
    # Ambient glow
    glow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse([width - 400, -100, width + 200, 400], fill=(59, 130, 246, 50))
    glow = glow.filter(ImageFilter.GaussianBlur(100))
    base = Image.alpha_composite(base, glow)

    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    cx1, cy1, cx2, cy2 = 45, 35, width - 45, height - 35
    draw.rounded_rectangle([cx1, cy1, cx2, cy2], radius=24, fill=(13, 18, 28, 220), outline=(255, 255, 255, 35), width=1)

    # Title
    font_badge = get_font(18, bold=True)
    draw.rounded_rectangle([cx1 + 40, cy1 + 30, cx1 + 280, cy1 + 68], radius=19, fill=(59, 130, 246, 60), outline=(59, 130, 246, 200), width=1)
    draw.text((cx1 + 58, cy1 + 40), "OFFICIAL CATALOG", fill=(255, 255, 255, 255), font=font_badge)

    font_title = get_font(44, bold=True)
    font_sub = get_font(22)
    draw.text((cx1 + 40, cy1 + 88), "AI Products & Digital Subscriptions", fill=(255, 255, 255, 255), font=font_title)
    draw.text((cx1 + 42, cy1 + 148), "Choose a service below to view available plans and pricing:", fill=(148, 163, 184, 255), font=font_sub)

    # Grid of 12 app logos (2 rows x 6 items)
    box_w, box_h = 160, 115
    start_x = cx1 + 40
    start_y = cy1 + 195

    row1 = PRODUCTS_LIST[:6]
    row2 = PRODUCTS_LIST[6:]

    for idx, pid in enumerate(row1):
        bx = start_x + idx * (box_w + 18)
        by = start_y
        draw.rounded_rectangle([bx, by, bx + box_w, by + box_h], radius=18, fill=(255, 255, 255, 12), outline=(255, 255, 255, 35), width=1)
        
        logo_file = LOGOS_DIR / f"{pid}.png"
        if logo_file.exists():
            try:
                limg = Image.open(logo_file).convert("RGBA")
                limg.thumbnail((50, 50), Image.Resampling.LANCZOS)
                overlay.paste(limg, (bx + (box_w - limg.width)//2, by + 16), limg)
            except Exception:
                pass
        
        font_nm = get_font(18, bold=True)
        pname = PRODUCTS.get(pid, {}).get("name", pid.capitalize())
        draw.text((bx + (box_w - len(pname)*10)//2, by + 78), pname, fill=(241, 245, 249, 255), font=font_nm)

    for idx, pid in enumerate(row2):
        bx = start_x + idx * (box_w + 18)
        by = start_y + box_h + 16
        draw.rounded_rectangle([bx, by, bx + box_w, by + box_h], radius=18, fill=(255, 255, 255, 12), outline=(255, 255, 255, 35), width=1)
        
        logo_file = LOGOS_DIR / f"{pid}.png"
        if logo_file.exists():
            try:
                limg = Image.open(logo_file).convert("RGBA")
                limg.thumbnail((50, 50), Image.Resampling.LANCZOS)
                overlay.paste(limg, (bx + (box_w - limg.width)//2, by + 16), limg)
            except Exception:
                pass
        
        font_nm = get_font(18, bold=True)
        pname = PRODUCTS.get(pid, {}).get("name", pid.capitalize())
        draw.text((bx + (box_w - len(pname)*10)//2, by + 78), pname, fill=(241, 245, 249, 255), font=font_nm)

    # Footer
    font_ft = get_font(18, bold=True)
    draw.text((cx1 + 40, cy2 - 40), "⚡ Instant Activation  •  🛡️ Full Replacement Warranty  •  💳 Balance & Instant Payments", fill=(96, 165, 250, 240), font=font_ft)

    final = Image.alpha_composite(base, overlay)
    out_path = IMAGES_DIR / "catalog_banner.png"
    final.convert("RGB").save(out_path, "PNG", quality=95)
    return out_path

def generate_product_card(prod: dict) -> Path:
    """Generate clean individual product card with official logo and specs"""
    width, height = 1000, 520
    pid = prod["id"]
    
    # Brand color mapping
    brand_colors = {
        "chatgpt": ("#0D241C", "#10A37F"),
        "claude": ("#241511", "#D97757"),
        "gemini": ("#0F172A", "#4E82EE"),
        "grok": ("#111827", "#3B82F6"),
        "perplexity": ("#0C1E28", "#22B8CF"),
        "kimi": ("#0B1528", "#0F62FE"),
        "cursor": ("#0A0A0A", "#0070F3"),
        "leonardo": ("#1E0A2A", "#8A2BE2"),
        "lovable": ("#260D0D", "#FF5252"),
        "manus": ("#081E2B", "#06B6D4"),
        "heygen": ("#1E0F38", "#7C3AED"),
        "telegram": ("#0C253B", "#229ED9"),
    }
    c1, c2 = brand_colors.get(pid, ("#0F172A", "#3B82F6"))

    base = create_clean_gradient(width, height, c1, "#0A0D14")
    
    # Glow effect
    rgb2 = hex_to_rgb(c2)
    glow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse([width - 350, -100, width + 150, 350], fill=(rgb2[0], rgb2[1], rgb2[2], 65))
    glow = glow.filter(ImageFilter.GaussianBlur(90))
    base = Image.alpha_composite(base, glow)

    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    cx1, cy1, cx2, cy2 = 45, 35, width - 45, height - 35
    draw.rounded_rectangle([cx1, cy1, cx2, cy2], radius=24, fill=(12, 16, 24, 225), outline=(255, 255, 255, 35), width=1)

    # Top Badge
    font_badge = get_font(18, bold=True)
    draw.rounded_rectangle([cx1 + 40, cy1 + 35, cx1 + 320, cy1 + 75], radius=20, fill=(rgb2[0], rgb2[1], rgb2[2], 55), outline=(rgb2[0], rgb2[1], rgb2[2], 210), width=1)
    draw.text((cx1 + 58, cy1 + 46), f"✨ {prod.get('badge', 'OFFICIAL PLAN')}", fill=(255, 255, 255, 255), font=font_badge)

    # Official Logo in top right
    logo_file = LOGOS_DIR / f"{pid}.png"
    if logo_file.exists():
        try:
            limg = Image.open(logo_file).convert("RGBA")
            lw, lh = 110, 110
            lx = cx2 - lw - 40
            ly = cy1 + 35
            draw.rounded_rectangle([lx, ly, lx + lw, ly + lh], radius=22, fill=(255, 255, 255, 14), outline=(255, 255, 255, 40), width=1)
            limg.thumbnail((lw - 28, lh - 28), Image.Resampling.LANCZOS)
            overlay.paste(limg, (lx + (lw - limg.width)//2, ly + (lh - limg.height)//2), limg)
        except Exception:
            pass

    # Title & Category
    font_title = get_font(52, bold=True)
    font_cat = get_font(22)
    draw.text((cx1 + 40, cy1 + 95), prod["name"], fill=(255, 255, 255, 255), font=font_title)
    draw.text((cx1 + 42, cy1 + 165), f"Category: {prod['category']}  •  Instant 24/7 Delivery", fill=(rgb2[0], rgb2[1], rgb2[2], 255), font=font_cat)

    # Divider
    draw.line([(cx1 + 40, cy1 + 215), (cx2 - 40, cy1 + 215)], fill=(255, 255, 255, 25), width=1)

    # Description
    font_desc = get_font(22)
    desc = prod["description_en"]
    if len(desc) > 65:
        # wrap into two lines
        words = desc.split(" ")
        line1 = " ".join(words[:len(words)//2 + 1])
        line2 = " ".join(words[len(words)//2 + 1:])
        draw.text((cx1 + 40, cy1 + 240), line1, fill=(226, 232, 240, 255), font=font_desc)
        draw.text((cx1 + 40, cy1 + 272), line2, fill=(226, 232, 240, 255), font=font_desc)
    else:
        draw.text((cx1 + 40, cy1 + 245), desc, fill=(226, 232, 240, 255), font=font_desc)

    # Bottom starting price
    plans = prod.get("plans", [])
    if plans:
        min_p = min(p["price_usd"] for p in plans)
        price_str = f"Plans from ${min_p:.2f}"
    else:
        price_str = "Available Now"

    px1, py1 = cx1 + 40, cy2 - 70
    draw.rounded_rectangle([px1, py1, px1 + 250, py1 + 46], radius=14, fill=(rgb2[0], rgb2[1], rgb2[2], 220))
    font_pr = get_font(22, bold=True)
    draw.text((px1 + 22, py1 + 10), price_str, fill=(255, 255, 255, 255), font=font_pr)

    # Trust Badges
    badges = ["⚡ Auto Process", "🛡️ Full Warranty", "⭐ Verified"]
    bx = cx2 - 420
    font_b = get_font(18, bold=True)
    for b_item in badges:
        draw.rounded_rectangle([bx, py1, bx + 130, py1 + 46], radius=14, fill=(255, 255, 255, 14), outline=(255, 255, 255, 30), width=1)
        draw.text((bx + 12, py1 + 12), b_item, fill=(241, 245, 249, 230), font=font_b)
        bx += 140

    final = Image.alpha_composite(base, overlay)
    out_path = IMAGES_DIR / f"{pid}.png"
    final.convert("RGB").save(out_path, "PNG", quality=95)
    return out_path

def generate_all_images():
    print("Generating main banner...")
    generate_main_banner()
    print("Generating catalog banner...")
    generate_catalog_banner()
    print(f"Generating {len(PRODUCTS)} product cards...")
    for pid, pdata in PRODUCTS.items():
        generate_product_card(pdata)
    print(f"All images successfully created in {IMAGES_DIR}")

if __name__ == "__main__":
    generate_all_images()
