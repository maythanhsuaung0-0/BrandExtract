from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from core.config import supabase
from pydantic import BaseModel, EmailStr

router = APIRouter()

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/register", status_code=201)
def register(req: RegisterRequest):
    try:
        response = supabase.auth.sign_up({
            "email": req.email,
            "password": req.password
        })
        user = getattr(response, 'user', None)
        if not user:
            raise HTTPException(status_code=400, detail="Registration failed (no user returned).")
        return {
            "message": "Registration successful",
            "user_id": user.id,
            "email": user.email
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": form_data.username,
            "password": form_data.password
        })
        # AuthResponse fields are attributes, not dict keys!
        if getattr(response, "error", None):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=str(response.error.message)
            )
        session = getattr(response, "session", None)
        user = getattr(response, "user", None)
        if not session or not getattr(session, "access_token", None):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Login failed. No session or access token returned."
            )
        return {
            "access_token": session.access_token,
            "refresh_token": session.refresh_token,
            "token_type": "bearer",
            "user": {
                "id": getattr(user, "id", None),
                "email": getattr(user, "email", None)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
