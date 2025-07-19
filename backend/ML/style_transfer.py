# style_transfer.py

import os
import sys
import requests
from typing import List, Optional, Tuple, Union
from PIL import Image
from io import BytesIO

# --- Try to load Gemini API (if available) ---
try:
    import google.generativeai as genai
    from dotenv import load_dotenv
    load_dotenv()
    GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
        HAS_GEMINI = True
    else:
        HAS_GEMINI = False
except ImportError:
    HAS_GEMINI = False

def load_image(src: str) -> Optional[Image.Image]:
    """
    Load image from file path or URL and return PIL Image.
    """
    try:
        if src.startswith("http"):
            resp = requests.get(src, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
            resp.raise_for_status()
            return Image.open(BytesIO(resp.content)).convert("RGBA")
        else:
            return Image.open(src).convert("RGBA")
    except Exception as e:
        print(f"[ERROR] Could not load image: {e}")
        return None

def recolor_with_gemini(image: Image.Image, palette: List[str]) -> Optional[Image.Image]:
    """
    Uses Gemini Vision API to recolor the image to match palette.
    """
    if not HAS_GEMINI:
        print("[WARN] Gemini API not configured. Falling back to KMeans transfer.")
        return None
    prompt = (
        f"Recolor this image using only the following brand color palette: {palette}. "
        "Do not change the content, just apply the new palette in a visually pleasing way. "
        "Return the recolored image."
    )
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")  # You may use the latest available vision model
        print("[INFO] Sending to Gemini Vision API...")
        resp = model.generate_content([prompt, image])
        # The image response may be base64, check if .media or .images are present
        if hasattr(resp, "media") and resp.media and resp.media[0].mime_type.startswith("image"):
            output_bytes = resp.media[0].data
            img = Image.open(BytesIO(output_bytes))
            return img
        # For simple text response fallback
        print("[WARN] Gemini did not return a direct image, falling back to KMeans.")
        return None
    except Exception as e:
        print(f"[WARN] Gemini style transfer failed: {e}")
        return None

def recolor_with_kmeans(image: Image.Image, palette: List[str]) -> Image.Image:
    """
    Recolors the image using KMeans clustering and maps clusters to the closest brand palette colors.
    """
    import numpy as np
    from sklearn.cluster import KMeans

    img = image.convert("RGB")
    arr = np.array(img)
    h, w, c = arr.shape
    flat = arr.reshape(-1, 3)

    # KMeans to cluster image colors
    k = max(2, min(len(palette), 8))
    kmeans = KMeans(n_clusters=k, n_init='auto' if hasattr(KMeans(), 'n_init') else 10, random_state=42)
    labels = kmeans.fit_predict(flat)
    centers = kmeans.cluster_centers_

    # Convert palette HEX to np array
    def hex_to_rgb(hx): return np.array([int(hx[i:i+2], 16) for i in (1, 3, 5)])
    palette_rgb = [hex_to_rgb(hex) for hex in palette]

    # Map each cluster center to closest palette color
    assigned = []
    for center in centers:
        dists = [np.linalg.norm(center - color) for color in palette_rgb]
        idx = int(np.argmin(dists))
        assigned.append(palette_rgb[idx])

    # Apply mapping to image
    recolored_flat = np.array([assigned[label] for label in labels], dtype=np.uint8)
    recolored_img = recolored_flat.reshape((h, w, 3))
    return Image.fromarray(recolored_img)

def save_image(img: Image.Image, out_path: str = "brandified_image.png") -> str:
    img.save(out_path)
    print(f"[SUCCESS] Saved recolored image: {out_path}")
    return out_path

def extract_palette_from_image(img: Image.Image, n: int = 5) -> List[str]:
    """
    Extract dominant colors using KMeans for demo/backup. Not used in main flow.
    """
    import numpy as np
    from sklearn.cluster import KMeans

    arr = np.array(img.convert("RGB"))
    flat = arr.reshape(-1, 3)
    kmeans = KMeans(n_clusters=n)
    kmeans.fit(flat)
    centers = kmeans.cluster_centers_.astype(int)
    hex_colors = ['#%02x%02x%02x' % tuple(c) for c in centers]
    return hex_colors

def style_transfer_dispatch(
    src: str, palette: List[str], out_file: str = "brandified_image.png", use_gemini: bool = True
) -> Optional[str]:
    """
    Runs the style transfer and saves the output image.
    """
    img = load_image(src)
    if not img:
        print("[ERROR] Could not load source image for style transfer.")
        return None
    out_img = None
    if use_gemini and HAS_GEMINI:
        out_img = recolor_with_gemini(img, palette)
    if out_img is None:
        out_img = recolor_with_kmeans(img, palette)
    save_image(out_img, out_file)
    return out_file

if __name__ == "__main__":
    import json

    if len(sys.argv) < 3:
        print("Usage: python style_transfer.py <image_path_or_url> <comma_separated_palette> [output_file]")
        print("Example: python style_transfer.py img.png '#FF6600,#0A0A0A,#FFFFFF' output.png")
        sys.exit(1)

    src = sys.argv[1]
    palette_str = sys.argv[2]
    out_file = sys.argv[3] if len(sys.argv) > 3 else "brandified_image.png"
    palette = [c if c.startswith('#') else '#' + c for c in palette_str.split(',')]
    result = style_transfer_dispatch(src, palette, out_file)
    if result:
        print("\n---\nRecolored image saved to:", result)
    else:
        print("\n---\nStyle transfer failed.")
