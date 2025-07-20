from fastapi import APIRouter, HTTPException, Depends, status
from typing import Optional, List
from pydantic import BaseModel, HttpUrl
from gotrue.types import User
import traceback
from core.config import supabase
from core.security import get_current_user

router = APIRouter(
    tags=["Brands"]
)

# --- Pydantic Models ---
class BrandBase(BaseModel):
    name: str
    colors: Optional[List[str]] = []
    fonts: Optional[List[str]] = []
    logo_url: Optional[HttpUrl] = None

class BrandCreate(BrandBase):
    pass

class BrandUpdate(BaseModel): # separate model for updates for more flexibility
    name: Optional[str] = None
    colors: Optional[List[str]] = None
    fonts: Optional[List[str]] = None
    logo_url: Optional[HttpUrl] = None

class BrandOut(BrandBase):
    id: str
    user_id: str


# --- API Endpoints ---
@router.post("/", response_model=BrandOut, status_code=status.HTTP_201_CREATED)
def create_brand(brand: BrandCreate, current_user: User = Depends(get_current_user)):
    """Creates a new brand for the authenticated user."""
    print('brand',brand)
    try:
        # Pydantic v2 uses .model_dump()
        brand_data = brand.dict() 
        brand_data["user_id"] = str(current_user.id)
        
        # Convert HttpUrl to string for DB insertion
        if brand_data.get("logo_url"):
            brand_data["logo_url"] = str(brand_data["logo_url"])
        

        response = supabase.table("brands").insert(brand_data).execute()

        if not response.data:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to create brand.")
        
        return response.data[0]
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An error occurred while creating the brand.")

@router.get("/", response_model=List[BrandOut])
def get_brands(current_user: User = Depends(get_current_user)):
    """Retrieves all brands associated with the currently authenticated user."""
    try:
        user_id_str = str(current_user.id)
        # BUG-PROOF: Use .filter() instead of .eq()
        response = supabase.table("brands").select("*").filter("user_id", "eq", user_id_str).execute()
        return response.data
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An error occurred while fetching brands.")

@router.get("/{brand_id}", response_model=BrandOut)
def get_brand(brand_id: str, current_user: User = Depends(get_current_user)):
    """Retrieves a specific brand by its ID."""
    try:
        user_id_str = str(current_user.id)
        # BUG-PROOF: Chain .filter() for AND conditions. Use limit(1) for safety.
        response = supabase.table("brands").select("*").filter("id", "eq", brand_id).filter("user_id", "eq", user_id_str).limit(1).execute()
        
        if not response.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Brand not found.")
        
        return response.data[0]
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An error occurred while fetching the brand.")

@router.put("/{brand_id}", response_model=BrandOut)
def update_brand(brand_id: str, brand: BrandUpdate, current_user: User = Depends(get_current_user)):
    """Updates a specific brand."""
    try:
        user_id_str = str(current_user.id)
        # Pydantic v2 uses .model_dump(), exclude_unset=True ignores fields not provided
        update_data = brand.dict(exclude_unset=True) 

        if not update_data:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No update data provided.")
        
        # Convert HttpUrl to string if it exists
        if update_data.get("logo_url"):
            update_data["logo_url"] = str(update_data["logo_url"])

        # BUG-PROOF: Chain .filter() to ensure user can only update their own brand
        response = supabase.table("brands").update(update_data).filter("id", "eq", brand_id).filter("user_id", "eq", user_id_str).execute()

        if not response.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Brand not found or you do not have permission to update it.")
        
        return response.data[0]
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An error occurred while updating the brand.")

@router.delete("/{brand_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_brand(brand_id: str, current_user: User = Depends(get_current_user)):
    """Deletes a specific brand."""
    try:
        user_id_str = str(current_user.id)
        # BUG-PROOF: Chain .filter() to ensure user can only delete their own brand
        response = supabase.table("brands").delete().filter("id", "eq", brand_id).filter("user_id", "eq", user_id_str).execute()

        if not response.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Brand not found or you do not have permission to delete it.")
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An error occurred while deleting the brand.")
