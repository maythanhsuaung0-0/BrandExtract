from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from typing import Optional, List
from pydantic import BaseModel, HttpUrl
from core.security import get_current_user
from ML.color_extraction import extract_palette_dispatch
from ML.font_extraction import extract_font_dispatch
from ML.logo_extraction import extract_logo_dispatch
from core.config import supabase
import tempfile, os, uuid

router = APIRouter()

DEFAULT_NUM_COLORS = 5
DEFAULT_NUM_FONTS = 2

class BrandDNA(BaseModel):
    colors: List[str]
    fonts: List[str]
    logo_url: Optional[HttpUrl]

@router.post("/extract/dna", response_model=BrandDNA)
async def extract_brand_dna(
    file: Optional[UploadFile] = File(None),
    url: Optional[HttpUrl] = Form(None),
    num_colors: int = DEFAULT_NUM_COLORS,
    num_fonts: int = DEFAULT_NUM_FONTS,
    user=Depends(get_current_user)
):
    if file and url:
        raise HTTPException(status_code=400, detail="Provide either a file or URL, not both.")
    if not file and not url:
        raise HTTPException(status_code=400, detail="No file or URL provided.")

    tmp_path = None
    logo_url = None
    logo_path = None

    if file:
        with tempfile.NamedTemporaryFile(delete=False, suffix=file.filename) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name
        src = tmp_path
    else:
        src = str(url)

    try:
        colors = extract_palette_dispatch(src, num_colors)
        fonts = extract_font_dispatch(src, num_fonts)
        logo_path = extract_logo_dispatch(src)

        # Upload logo preview to Supabase if present
        if logo_path and os.path.exists(logo_path):
            preview_key = f"{uuid.uuid4().hex}_{os.path.basename(logo_path)}"
            with open(logo_path, "rb") as logo_file:
                supabase.storage.from_("preview").upload(preview_key, logo_file)
            logo_url = supabase.storage.from_("preview").get_public_url(preview_key)

    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)
        if logo_path and os.path.exists(logo_path):
            os.remove(logo_path)

    return BrandDNA(colors=colors, fonts=fonts, logo_url=logo_url)
