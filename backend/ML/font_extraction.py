import os
import sys
import requests
from bs4 import BeautifulSoup
from typing import List, Optional, Dict
from PIL import Image

# --- Gemini Setup ---
try:
    from dotenv import load_dotenv
    import google.generativeai as genai
except ImportError as e:
    print(f"[FATAL] Missing dependency: {e}. Install all requirements and try again.")
    sys.exit(1)

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")
if not API_KEY:
    print("\n[ERROR] Gemini API Key not found.")
    print("Please create a .env file with GOOGLE_API_KEY='YOUR_KEY'.\n")
    sys.exit(1)
genai.configure(api_key=API_KEY)

def identify_font_with_gemini(image: Image.Image) -> Optional[str]:
    prompt = (
        "What is the name of the FONT used in the attached image? "
        "Return ONLY the font name (e.g., 'Arial Black', 'Futura Bold', etc.), "
        "with no extra text or explanations. If you are not sure, give your best guess."
    )
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        print("[INFO] Asking Gemini to identify the font...")
        response = model.generate_content([prompt, image])
        font_name = response.text.strip().replace("*", "").replace("`", "")
        return font_name
    except Exception as e:
        print(f"[WARN] Could not get font from Gemini: {e}")
        return None

def map_single_font_to_adobe_with_gemini(font_name: str) -> Optional[str]:
    """
    Maps a single font name to the closest available Adobe Fonts font using Gemini.
    """
    prompt = (
        f"You are an Adobe Express AI Assistant. The extracted font is: '{font_name}'.\n\n"
        "Return ONLY the closest matching font available in Adobe Express (Adobe Fonts library). "
        "If no exact match exists, return the most visually similar Adobe font. "
        "Respond with ONLY the font name."
    )
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        print(f"[INFO] Mapping '{font_name}' to Adobe Fonts using Gemini...")
        resp = model.generate_content(prompt)
        adobe_font = resp.text.strip().replace("*", "").replace("`", "")
        if not adobe_font:
            return font_name  # Fallback to original
        return adobe_font
    except Exception as e:
        print(f"[WARN] Could not map font to Adobe: {e}")
        return font_name

def extract_fonts_from_website(url: str, num_fonts: int = 5) -> List[str]:
    response = requests.get(url, timeout=10)
    soup = BeautifulSoup(response.text, "html.parser")
    font_families = set()
    # Inline styles
    for tag in soup.find_all(style=True):
        style = tag.get("style")
        if style and "font-family" in style:
            families = []
            for part in style.split(";"):
                if "font-family" in part:
                    css_val = part.split(":", 1)[-1]
                    families.extend([f.strip().replace("'", "").replace('"', '') for f in css_val.split(",")])
            font_families.update(families)
    # Linked CSS and <style>
    css_sources = []
    for link in soup.find_all("link", rel="stylesheet"):
        href = link.get("href")
        if href and not href.startswith("data:"):
            css_url = href if href.startswith("http") else requests.compat.urljoin(url, href)
            try:
                css = requests.get(css_url, timeout=5).text
                css_sources.append(css)
            except Exception:
                continue
    for style in soup.find_all("style"):
        css_sources.append(style.get_text())
    for css in css_sources:
        for line in css.split(";"):
            if "font-family" in line:
                css_val = line.split(":", 1)[-1]
                families = [f.strip().replace("'", "").replace('"', '') for f in css_val.split(",")]
                font_families.update(families)
    # Remove generic fallbacks, CSS vars, and noise
    invalid = {
        "inherit", "initial", "unset", "sans-serif", "serif", "monospace", "",
        "var(--font-sans)", "var(--font-mono)", "var(--default-font-family)", "var(--tw-gradient-via-stops)"
    }
    filtered = [f for f in font_families if f and not f.startswith("var(") and f.lower() not in invalid and "layer" not in f]
    # Prioritize the most frequent
    from collections import Counter
    freq = Counter(filtered)
    results = [f for f, _ in freq.most_common(num_fonts)]
    return results[:num_fonts] if results else ["(no font-family rules found)"]

def map_fonts_to_adobe_with_gemini(font_list: List[str], website_url: str) -> Dict[str, str]:
    """
    Sends the font list + URL to Gemini and asks for a mapping to closest Adobe Fonts.
    """
    if not font_list or font_list[0].startswith("(no font"):
        return {}
    prompt = (
        "You are an Adobe Express AI Assistant. Here is a list of fonts extracted from a company's website "
        f"({website_url}):\n\n"
        + "\n".join(f"- {f}" for f in font_list)
        + "\n\nFor each, return the CLOSEST matching font available in Adobe Express (Adobe Fonts library) as a mapping."
        "\nRespond ONLY in JSON as { 'OriginalFont': 'ClosestAdobeFont', ... }."
        "\nIf an exact match does not exist, pick the most visually similar Adobe font."
    )
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        print("[INFO] Asking Gemini to map fonts to Adobe library...")
        resp = model.generate_content(prompt)
        # Parse the JSON response
        import json
        font_map = {}
        try:
            font_map = json.loads(resp.text)
        except Exception:
            # fallback: try to find the first { ... } in the response
            import re
            m = re.search(r"\{[\s\S]*\}", resp.text)
            if m:
                font_map = json.loads(m.group(0))
        return font_map
    except Exception as e:
        print(f"[WARN] Could not map fonts to Adobe: {e}")
        return {}

def load_image_from_path_or_url(path_or_url: str) -> Optional[Image.Image]:
    try:
        if path_or_url.startswith("http"):
            headers = {'User-Agent': 'Mozilla/5.0'}
            resp = requests.get(path_or_url, headers=headers, stream=True, timeout=10)
            resp.raise_for_status()
            return Image.open(resp.raw).convert("RGB")
        else:
            return Image.open(path_or_url).convert("RGB")
    except Exception as e:
        print(f"[ERROR] Could not load image: {e}")
        return None

def extract_font_dispatch(source: str, num_fonts: int = 5) -> List[str]:
    image_exts = (".png", ".jpg", ".jpeg", ".webp", ".bmp")
    is_image = source.lower().endswith(image_exts) or \
               (source.startswith("http") and any(ext in source.lower() for ext in image_exts))
    if is_image:
        print(f"[INFO] Processing image source: {source}")
        img = load_image_from_path_or_url(source)
        if img is None:
            return ["Error: Could not load image file or URL."]
        font_name = identify_font_with_gemini(img)
        if font_name:
            print(f"[SUCCESS] Gemini identified font: {font_name}")
            # Map to Adobe
            adobe_font = map_single_font_to_adobe_with_gemini(font_name)
            print(f"[INFO] Adobe font mapping: {font_name}  →  {adobe_font}")
            return [adobe_font]
        else:
            print("[ERROR] Gemini did not return a font name.")
            return ["Error: Font identification with Gemini failed."]
    elif source.startswith("http"):
        print(f"[INFO] Processing website source: {source}")
        fonts = extract_fonts_from_website(source, num_fonts)
        print(f"[INFO] Extracted fonts: {fonts}")
        # Map these fonts to Adobe equivalents using Gemini
        font_map = map_fonts_to_adobe_with_gemini(fonts, source)
        if font_map:
            print("[INFO] Adobe font mapping:")
            for k, v in font_map.items():
                print(f"    {k}  →  {v}")
            # Optionally, return only Adobe font list
            return list(font_map.values())
        else:
            print("[WARN] Could not map fonts to Adobe. Returning raw list.")
            return fonts
    else:
        raise ValueError("Input must be a valid website URL or a path/URL to an image.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python font_extraction.py <image_path_or_url | website_url> [num_fonts]")
        sys.exit(1)
    source_input = sys.argv[1]
    num_fonts_arg = int(sys.argv[2]) if len(sys.argv) > 2 else 5
    try:
        fonts_found = extract_font_dispatch(source_input, num_fonts_arg)
        print("\n--- Results ---")
        if fonts_found:
            for font in fonts_found:
                print(f"- {font}")
        else:
            print("No fonts were identified.")
        print("---------------")
    except Exception as e:
        print(f"\n[FATAL ERROR] An unexpected error occurred: {e}")
