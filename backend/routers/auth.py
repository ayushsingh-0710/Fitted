import time
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from backend.database import db_manager

router = APIRouter(prefix="/auth", tags=["Auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class UserProfile(BaseModel):
    id: str = "usr_01"
    name: str = "Dixita Mishra"
    email: str = "dixita.mishra@fitted.ai"
    avatar: str = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
    styleScore: int = 88
    bodyType: str = "Athletic Trapezoid"
    undertone: str = "Warm Golden"
    height: str = "5'11\" (180 cm)"
    chest: str = "39 in"
    waist: str = "31 in"

@router.post("/login")
async def login(req: LoginRequest):
    user_data = None
    if db_manager.is_connected and db_manager.db is not None:
        try:
            found = await db_manager.db["users"].find_one({"email": req.email}, {"_id": 0, "password": 0})
            if found:
                user_data = found
        except Exception as e:
            print(f"[Auth MongoDB Login Error]: {e}")

    if not user_data:
        # Graceful fallback/demo profile
        user_data = UserProfile(email=req.email).model_dump()

    return {
        "success": True,
        "token": "fitted_jwt_token_fastapi_2026",
        "user": user_data
    }

@router.post("/register")
async def register(req: RegisterRequest):
    new_user = UserProfile(
        id=f"usr_{int(time.time() * 1000)}",
        name=req.name,
        email=req.email
    ).model_dump()

    if db_manager.is_connected and db_manager.db is not None:
        try:
            doc = {**new_user, "password": req.password}
            await db_manager.db["users"].update_one(
                {"email": req.email},
                {"$set": doc},
                upsert=True
            )
        except Exception as e:
            print(f"[Auth MongoDB Register Error]: {e}")

    return {
        "success": True,
        "token": "fitted_jwt_token_fastapi_2026",
        "user": new_user
    }

@router.get("/me")
async def get_me():
    return UserProfile().model_dump()

