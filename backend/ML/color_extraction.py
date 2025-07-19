import re
import requests
from bs4 import BeautifulSoup
from collections import Counter
from typing import List
import os

# ----------------- Color Utilities -----------------

CSS3_NAMES_TO_HEX = {
    'black': '#000000', 'white': '#ffffff', 'red': '#ff0000', 'blue': '#0000ff', 'green': '#008000',
    'yellow': '#ffff00', 'gray': '#808080', 'grey': '#808080', 'purple': '#800080', 'pink': '#ffc0cb',
    'orange': '#ffa500', 'brown': '#a52a2a', 'navy': '#000080', 'teal': '#008080', 'aqua': '#00ffff',
    'lime': '#00ff00', 'maroon': '#800000', 'olive': '#808000', 'silver': '#c0c0c0', 'gold': '#ffd700'
}

def rgb_to_hex(s: str) -> str:
    nums = re.findall(r'[\d.]+', s)
    if len(nums) >= 3:
        r, g, b = map(float, nums[:3])
        return '#{:02x}{:02x}{:02x}'.format(int(r), int(g), int(b))
    return s

def color_to_hex(s: str) -> str:
    s = s.lower().strip()
    if s.startswith('#') and (len(s) == 7 or len(s) == 4):
        return s
    if s.startswith('rgb'):
        return rgb_to_hex(s)
    if s in CSS3_NAMES_TO_HEX:
        return CSS3_NAMES_TO_HEX[s]
    return ''

def is_vivid(hex_color: str) -> bool:
    """Filter out colors close to white, black, and gray."""
    r, g, b = [int(hex_color[i:i+2], 16) for i in (1, 3, 5)]
    # Remove near-white and near-black
    if max(r, g, b) > 245 or min(r, g, b) < 20:
        return False
    # Remove grays (low RGB variance)
    if abs(r-g) < 18 and abs(g-b) < 18 and abs(r-b) < 18:
        return False
    return True

# --------------- Image & Logo Extraction ---------------

def load_image_from_bytes(image_bytes: bytes) -> 'np.ndarray':
    import cv2
    import numpy as np
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode image bytes.")
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    return img

def load_image_from_url(url: str) -> 'np.ndarray':
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()
    return load_image_from_bytes(response.content)


def extract_palette_from_image(img: 'np.ndarray', num_colors: int = 5, resize: int = 200) -> List[str]:
    import numpy as np
    from sklearn.cluster import KMeans
    import cv2
    if resize and (img.shape[0] > resize or img.shape[1] > resize):
        h, w = img.shape[:2]
        scale = resize / max(h, w)
        img = cv2.resize(img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)
    img_flat = img.reshape(-1, 3)
    img_flat = img_flat[np.random.choice(img_flat.shape[0], min(5000, img_flat.shape[0]), replace=False)]
    # Do NOT filter out vivid reds/yellows!
    # Remove near-white and near-black for background cleaning
    mask = np.all(img_flat > 15, axis=1) & np.all(img_flat < 240, axis=1)
    img_flat = img_flat[mask] if np.any(mask) else img_flat
    if img_flat.shape[0] < num_colors:
        raise ValueError("Not enough pixels for palette extraction.")
    kmeans = KMeans(n_clusters=max(num_colors+2, 6), n_init='auto' if hasattr(KMeans(), 'n_init') else 10)
    labels = kmeans.fit_predict(img_flat)
    centers = kmeans.cluster_centers_.astype(int)
    _, counts = np.unique(labels, return_counts=True)
    idxs = np.argsort(counts)[::-1]
    hex_colors = ['#%02x%02x%02x' % tuple(centers[i]) for i in idxs]
    # Filter to vivid/brand-like colors, dedupe, then select top-N
    filtered = []
    for c in hex_colors:
        if is_vivid(c) and c not in filtered:
            filtered.append(c)
        if len(filtered) == num_colors:
            break
    # If not enough vivid, add remaining most common colors
    if len(filtered) < num_colors:
        for c in hex_colors:
            if c not in filtered:
                filtered.append(c)
            if len(filtered) == num_colors:
                break
    return filtered

def extract_palette_from_bytes(image_bytes: bytes, num_colors: int = 5) -> List[str]:
    img = load_image_from_bytes(image_bytes)
    return extract_palette_from_image(img, num_colors=num_colors)

def extract_palette_from_url(url: str, num_colors: int = 5) -> List[str]:
    img = load_image_from_url(url)
    return extract_palette_from_image(img, num_colors=num_colors)

# ----------- Screenshot KMeans Extraction (for websites) -----------

def extract_palette_from_website_screenshot(website_url: str, num_colors: int = 5) -> List[str]:
    from PIL import Image
    import numpy as np
    from sklearn.cluster import KMeans
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    import tempfile

    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,3000")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(options=options)
    driver.get(website_url)
    total_height = driver.execute_script("return document.body.scrollHeight")
    driver.set_window_size(1920, total_height)
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmpfile:
        screenshot_path = tmpfile.name
        driver.save_screenshot(screenshot_path)
    driver.quit()
    img = Image.open(screenshot_path).convert("RGB")
    img_np = np.array(img)
    os.remove(screenshot_path)
    img_flat = img_np.reshape(-1, 3)
    if img_flat.shape[0] > 100000:
        idxs = np.random.choice(img_flat.shape[0], 100000, replace=False)
        img_flat = img_flat[idxs]
    kmeans = KMeans(n_clusters=max(num_colors+2, 6))
    labels = kmeans.fit_predict(img_flat)
    centers = kmeans.cluster_centers_.astype(int)
    _, counts = np.unique(labels, return_counts=True)
    idxs = np.argsort(counts)[::-1]
    hex_colors = ['#%02x%02x%02x' % tuple(centers[i]) for i in idxs]
    # Filter to vivid/brand-like colors
    filtered = []
    for c in hex_colors:
        if is_vivid(c) and c not in filtered:
            filtered.append(c)
        if len(filtered) == num_colors:
            break
    # Fallback to most common if not enough vivid
    if len(filtered) < num_colors:
        for c in hex_colors:
            if c not in filtered:
                filtered.append(c)
            if len(filtered) == num_colors:
                break
    return filtered

# ----------- Universal Dispatcher --------------

def extract_palette_dispatch(src: str, num_colors: int = 5) -> List[str]:
    """
    Smart dispatcher: handles websites, image files, direct image URLs.
    """
    image_exts = (".png", ".jpg", ".jpeg", ".webp", ".bmp")
    # 1. Image file on disk
    if os.path.exists(src) and src.lower().endswith(image_exts):
        with open(src, "rb") as f:
            img_bytes = f.read()
        return extract_palette_from_bytes(img_bytes, num_colors)
    # 2. Direct image URL
    if src.startswith("http") and src.lower().endswith(image_exts):
        return extract_palette_from_url(src, num_colors)
    # 3. Website URL
    if src.startswith("http"):
        try:
            return extract_palette_from_website_screenshot(src, num_colors)
        except Exception as e:
            print("[WARN] Screenshot extraction failed:", e)
            print("[INFO] Falling back to image-based extraction...")
            # fallback: try to extract logo palette if available
            try:
                logo_url = extract_logo_url_from_website(src)
                return extract_palette_from_url(logo_url, num_colors)
            except Exception as e2:
                print("[INFO] Could not extract logo as fallback:", e2)
            return []
    raise ValueError("Input must be a valid website URL, direct image URL, or path to image file.")

def extract_logo_url_from_website(website_url: str) -> str:
    response = requests.get(website_url, timeout=10)
    soup = BeautifulSoup(response.text, 'html.parser')
    logo_img = None
    for img in soup.find_all('img'):
        attrs = (img.get('class', []) + [img.get('id', ''), img.get('src', '')])
        if any('logo' in str(a).lower() for a in attrs):
            logo_img = img
            break
    if not logo_img:
        imgs = soup.find_all('img')
        if imgs:
            logo_img = imgs[0]
    if not logo_img or not logo_img.get('src'):
        raise ValueError("Could not find logo image on website.")
    logo_url = logo_img['src']
    if logo_url.startswith('//'):
        logo_url = 'https:' + logo_url
    elif logo_url.startswith('/'):
        base = re.match(r"(https?://[^/]+)", website_url).group(1)
        logo_url = base + logo_url
    elif not logo_url.startswith('http'):
        base = re.match(r"(https?://[^/]+)", website_url).group(1)
        logo_url = base + '/' + logo_url
    return logo_url

def show_palette(colors: List[str]):
    import matplotlib.pyplot as plt
    plt.figure(figsize=(max(5, len(colors)), 1.6))
    for i, c in enumerate(colors):
        plt.bar(i, 1, color=c)
    plt.xticks([])
    plt.yticks([])
    plt.title("Extracted Color Palette")
    for i, c in enumerate(colors):
        rgb = tuple(int(c[j:j+2], 16) for j in (1, 3, 5))
        text_color = 'white' if sum(rgb) < 384 else 'black'
        plt.text(i, 0.5, c, ha='center', va='center', color=text_color, fontsize=10, fontweight='bold')
    plt.show()

# -------- CLI Entrypoint --------
if __name__ == "__main__":
    import sys
    src = sys.argv[1]
    num_colors = int(sys.argv[2]) if len(sys.argv) > 2 else 5
    colors = extract_palette_dispatch(src, num_colors)
    print(colors)
    show_palette(colors)
