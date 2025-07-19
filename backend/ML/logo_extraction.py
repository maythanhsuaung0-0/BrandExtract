import os
import sys
import re
import requests
from bs4 import BeautifulSoup
from typing import List, Optional
from PIL import Image as PILImage
from io import BytesIO
import tempfile
from dotenv import load_dotenv

# --- Load environment variables from .env ---
load_dotenv()
CONVERTAPI_SECRET = os.getenv("CONVERTAPI_SECRET")
if not CONVERTAPI_SECRET or "YOUR_" in CONVERTAPI_SECRET:
    print("[FATAL] CONVERTAPI_SECRET is missing or placeholder. Please set it in your .env file.")
    sys.exit(1)

def debug_convertapi_response(svg_bytes) -> Optional[bytes]:
    tmp_svg_path = None
    try:
        import convertapi
        convertapi.api_credentials = 'cKY0EnBYA8QN9URWv1QAaEk1ljgDLevw' # left intenionally for debugging

        print("[DEBUG] convertapi.api_credentials:", convertapi.api_credentials)

        # Create temporary file for SVG
        with tempfile.NamedTemporaryFile(suffix='.svg', delete=False) as tmp_svg:
            tmp_svg.write(svg_bytes)
            tmp_svg_path = tmp_svg.name

        print(f"[DEBUG] Created temporary SVG file: {tmp_svg_path}")

        # Convert SVG to PNG using ConvertAPI
        result = convertapi.convert('png', {'File': tmp_svg_path}, from_format='svg')

        # Try to find the download URL for the PNG file
        png_url = None
        if hasattr(result, 'file') and result.file and hasattr(result.file, 'url') and result.file.url:
            png_url = result.file.url
            print(f"[DEBUG] Got URL from result.file.url: {png_url}")
        elif hasattr(result, 'files') and result.files and hasattr(result.files[0], 'url') and result.files[0].url:
            png_url = result.files[0].url
            print(f"[DEBUG] Got URL from result.files[0].url: {png_url}")
        else:
            print("[ERROR] Could not find URL in ConvertAPI response")
            return None

        print(f"[INFO] Downloading PNG from: {png_url}")
        png_resp = requests.get(png_url, timeout=30)
        if not png_resp.ok:
            print(f"[ERROR] Failed to download PNG. Status: {png_resp.status_code}")
            return None

        png_bytes = png_resp.content
        print(f"[INFO] Successfully downloaded PNG ({len(png_bytes)} bytes)")
        return png_bytes

    except Exception as e:
        print(f"[ERROR] ConvertAPI conversion failed: {e}")
        import traceback
        traceback.print_exc()
        return None
    finally:
        if tmp_svg_path and os.path.exists(tmp_svg_path):
            try:
                os.unlink(tmp_svg_path)
                print(f"[DEBUG] Cleaned up temporary file: {tmp_svg_path}")
            except Exception as cleanup_e:
                print(f"[WARN] Failed to delete temp file: {cleanup_e}")

def find_logo_urls_from_website(url: str) -> List[str]:
    try:
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        response = requests.get(url, timeout=30, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        logo_urls = []

        for img in soup.find_all("img"):
            attrs = (img.get('class', []) or []) + [img.get('id', ''), img.get('src', '')]
            if any('logo' in str(a).lower() for a in attrs):
                src = img.get('src')
                if src:
                    logo_urls.append(src)

        if not logo_urls:
            header = soup.find('header')
            if header:
                for img in header.find_all("img"):
                    src = img.get('src')
                    if src:
                        logo_urls.append(src)
        for rel in ['icon', 'shortcut icon', 'apple-touch-icon']:
            for link in soup.find_all('link', rel=rel):
                href = link.get('href')
                if href:
                    logo_urls.append(href)

        logo_urls = list(dict.fromkeys(logo_urls))

        def abs_url(src):
            if src.startswith('http'):
                return src
            elif src.startswith('//'):
                return 'https:' + src
            elif src.startswith('/'):
                base = re.match(r"(https?://[^/]+)", url).group(1)
                return base + src
            else:
                base = re.match(r"(https?://[^/]+)", url).group(1)
                return base + '/' + src

        logo_urls = [abs_url(l) for l in logo_urls if l]
        return logo_urls
    except Exception as e:
        print(f"[ERROR] Failed to fetch website: {e}")
        return []

def download_image(url: str) -> Optional[PILImage.Image]:
    try:
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        resp = requests.get(url, headers=headers, timeout=15)
        resp.raise_for_status()

        is_svg = (url.lower().endswith('.svg') or
                  b'<svg' in resp.content[:200] or
                  'image/svg' in resp.headers.get('content-type', '').lower())

        if is_svg:
            print(f"[INFO] Processing SVG: {url}")
            png_bytes = debug_convertapi_response(resp.content)
            if not png_bytes:
                return None
            img = PILImage.open(BytesIO(png_bytes)).convert("RGBA")
            return img

        img = PILImage.open(BytesIO(resp.content)).convert("RGBA")
        return img
    except Exception as e:
        print(f"[WARN] Could not download image from {url}: {e}")
        return None

def smart_crop_logo(img: PILImage.Image, margin: int = 10) -> PILImage.Image:
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    bbox = img.getbbox()
    if not bbox:
        return img
    if margin > 0:
        left = max(0, bbox[0] - margin)
        upper = max(0, bbox[1] - margin)
        right = min(img.width, bbox[2] + margin)
        lower = min(img.height, bbox[3] + margin)
        cropped = img.crop((left, upper, right, lower))
    else:
        cropped = img.crop(bbox)
    return cropped

def remove_logo_background(img: PILImage.Image, bg_threshold: int = 240) -> PILImage.Image:
    try:
        import numpy as np
        arr = np.array(img.convert("RGBA"))
        mask = (arr[:, :, :3] > bg_threshold).all(axis=2)
        arr[mask, 3] = 0
        return PILImage.fromarray(arr)
    except ImportError:
        print("[WARN] numpy not available, skipping background removal")
        return img

def save_logo_image(img: PILImage.Image, out_path: str):
    img.save(out_path, format="PNG")

def extract_logo_dispatch(
    src: str, out_file: str = "brand_logo.png", smart_crop: bool = True, remove_bg: bool = True
) -> Optional[str]:
    def process_logo(img: PILImage.Image) -> PILImage.Image:
        if remove_bg:
            img = remove_logo_background(img)
        if smart_crop:
            img = smart_crop_logo(img)
        return img

    if src.startswith("http"):
        logo_urls = find_logo_urls_from_website(src)
        if not logo_urls:
            print("[ERROR] Could not find any logo images on website.")
            return None

        print(f"[INFO] Found logo candidates:")
        for i, url in enumerate(logo_urls):
            print(f"  {i+1}. {url}")

        img = download_image(logo_urls[0])
        if img:
            img = process_logo(img)
            save_logo_image(img, out_file)
            print(f"[SUCCESS] Downloaded and saved logo: {out_file}")
            return out_file
        else:
            print("[ERROR] Failed to download logo candidate image.")
            return None

    print("[ERROR] Input must be a website URL, image URL, or image file path.")
    return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python logo_extraction.py <website_url>")
        sys.exit(1)

    src = sys.argv[1]
    out_file = "debug_logo.png"

    print(f"[INFO] Debug mode - extracting logo from: {src}")
    print("-" * 50)

    result = extract_logo_dispatch(src, out_file, True, True)
    if result:
        print(f"\n---\nLogo saved to: {result}")
    else:
        print("\n---\nLogo extraction failed.")
