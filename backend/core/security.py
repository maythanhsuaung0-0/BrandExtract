"""
This module provides a security dependency for FastAPI to authenticate users
via Supabase using a JWT Bearer token.
"""
from fastapi import Security, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Assuming supabase is configured and imported from a central config file
from core.config import supabase

# Instantiate the security scheme
security = HTTPBearer()

def get_current_user(token: HTTPAuthorizationCredentials = Security(security)):
    """Dependency to validate JWT and get user from Supabase."""
    if not supabase:
        raise HTTPException(status_code=503, detail="Database service is not configured.")
    try:
        user_response = supabase.auth.get_user(token.credentials)
        user = user_response.user
        if not user:
             raise HTTPException(status_code=401, detail="User not found for token.")
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token.")