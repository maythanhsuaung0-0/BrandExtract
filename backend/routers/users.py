from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from core.config import supabase
from core.security import get_current_user  

router = APIRouter()

# Models

class UserOut(BaseModel):
    id: str
    email: EmailStr
    full_name: Optional[str] = None

class UserUpdate(BaseModel):
    full_name: Optional[str] = None

# Endpoints 

@router.get("/me", response_model=UserOut)
def get_current_user_profile(current_user=Depends(get_current_user)):
    """
    Get details of the currently authenticated user.
    """
    user_id = current_user.id
    # Get additional info from 'users' table if you have it, else use supabase user
    result = supabase.table("users").select("*").eq("id", user_id).single().execute()
    if result.get("error") or not result.get("data"):
        # Fallback: Return data from Supabase Auth user object if row not found
        return UserOut(id=current_user.id, email=current_user.email, full_name=None)
    data = result.get("data")
    return UserOut(**data)

@router.put("/me", response_model=UserOut)
def update_current_user(
    update: UserUpdate,
    current_user=Depends(get_current_user)
):
    """
    Update the current user's profile (full_name, etc.).
    """
    user_id = current_user.id
    update_data = {k: v for k, v in update.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update.")
    result = (
        supabase.table("users")
        .update(update_data)
        .eq("id", user_id)
        .execute()
    )
    if result.get("error"):
        raise HTTPException(status_code=400, detail=str(result["error"]["message"]))
    data = result.get("data")
    if not data:
        raise HTTPException(status_code=404, detail="User not found")
    return UserOut(**data[0])
