from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends, status
from typing import Optional, List
from pydantic import BaseModel, HttpUrl
from core.security import get_current_user
from ML.color_extraction import extract_palette_dispatch
from ML.font_extraction import extract_font_dispatch
from ML.logo_extraction import extract_logo_dispatch
import tempfile

router = APIRouter()

# --- Sensible ML Defaults ---
DEFAULT_NUM_COLORS = 5
DEFAULT_NUM_FONTS = 2

# --- Response Models ---
class BrandDNA(BaseModel):
    colors: List[str]
    fonts: List[str]
    logo_url: Optional[HttpUrl]

class StyleTransferRequest(BaseModel):
    template_id: str
    brand_id: str

class StyleTransferResult(BaseModel):
    asset_url: str
    summary: Optional[str] = None

# ========== Brand DNA Extraction ==========
@router.post("/extract/dna", response_model=BrandDNA)
async def extract_brand_dna(
    file: Optional[UploadFile] = File(None),
    url: Optional[HttpUrl] = Form(None),
    num_colors: int = DEFAULT_NUM_COLORS,
    num_fonts: int = DEFAULT_NUM_FONTS,
    user=Depends(get_current_user)
):
    """
    Extract brand DNA (colors, fonts, logo) from uploaded asset or URL.
    Sensible defaults for num_colors, num_fonts.
    """
    if file and url:
        raise HTTPException(status_code=400, detail="Provide either a file or URL, not both.")
    if not file and not url:
        raise HTTPException(status_code=400, detail="No file or URL provided.")

    # Handle file upload (image)
    if file:
        # Save file to temp path for ML function (all ML expects file path)
        with tempfile.NamedTemporaryFile(delete=False, suffix=file.filename) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name
        try:
            colors = extract_palette_dispatch(tmp_path, num_colors)
            fonts = extract_font_dispatch(tmp_path, num_fonts)
            logo_path = extract_logo_dispatch(tmp_path)
            logo_url = None
            if logo_path:
                # TODO: might want to upload to CDN, here just return file name
                logo_url = f"/static/{logo_path}"  # adjust as needed for your CDN/static
        finally:
            os.remove(tmp_path)
    else:
        # Handle website or image URL
        src = str(url)
        colors = extract_palette_dispatch(src, num_colors)
        fonts = extract_font_dispatch(src, num_fonts)
        logo_path = extract_logo_dispatch(src)
        logo_url = None
        if logo_path:
            logo_url = f"/static/{logo_path}"  # Or CDN, as above

    return BrandDNA(colors=colors, fonts=fonts, logo_url=logo_url)

# ========== Neural Style Transfer ==========
@router.post("/extract/style", response_model=StyleTransferResult)
async def style_transfer(
    req: StyleTransferRequest,
    user=Depends(get_current_user)
):
    """
    Apply neural style transfer to a template using a brand's DNA.
    """
    # For now, mock
    asset_url = f"https://cdn.example.com/generated/{req.template_id}_on_brand.png"
    summary = "Applied your brand palette and fonts to the template."
    return StyleTransferResult(asset_url=asset_url, summary=summary)
