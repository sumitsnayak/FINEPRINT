"""
LabelLens Authentication Router
"""

import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserProfile
from app.schemas import UserRegister, UserLogin, TokenResponse, UserProfileUpdate
from app.services.auth_service import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

def format_user_payload(user: User, profile: UserProfile) -> dict:
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "profile": {
            "age": profile.age if profile else None,
            "gender": profile.gender if profile else None,
            "height_cm": profile.height_cm if profile else None,
            "weight_kg": profile.weight_kg if profile else None,
            "activity_level": profile.activity_level if profile else "moderate",
            "dietary_preferences": json.loads(profile.dietary_preferences or "[]") if profile else [],
            "allergies": json.loads(profile.allergies or "[]") if profile else [],
            "health_conditions": json.loads(profile.health_conditions or "[]") if profile else [],
            "target_calories": profile.target_calories if profile else 2000.0,
            "target_protein": profile.target_protein if profile else 60.0,
            "target_carbs": profile.target_carbs if profile else 250.0,
            "target_fat": profile.target_fat if profile else 65.0,
            "target_sugar": profile.target_sugar if profile else 30.0,
            "target_sodium": profile.target_sodium if profile else 2000.0,
            "notifications_enabled": profile.notifications_enabled if profile else True,
            "meal_reminders": profile.meal_reminders if profile else True,
            "safety_alerts": profile.safety_alerts if profile else True
        }
    }

@router.post("/register", response_model=TokenResponse)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists."
        )
        
    hashed = get_password_hash(payload.password)
    user = User(
        email=payload.email.lower(),
        full_name=payload.full_name,
        hashed_password=hashed,
        role="user"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Initialize profile
    profile = UserProfile(
        user_id=user.id,
        age=payload.age,
        gender=payload.gender,
        height_cm=payload.height_cm,
        weight_kg=payload.weight_kg,
        activity_level=payload.activity_level or "moderate",
        dietary_preferences=json.dumps(payload.dietary_preferences or []),
        allergies=json.dumps(payload.allergies or []),
        health_conditions=json.dumps(payload.health_conditions or [])
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    
    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": format_user_payload(user, profile)
    }

@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )
        
    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": format_user_payload(user, profile)
    }

@router.get("/me")
def get_current_user_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    return format_user_payload(user, profile)

@router.put("/profile")
def update_profile(
    payload: UserProfileUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    if not profile:
        profile = UserProfile(user_id=user.id)
        db.add(profile)
        
    if payload.full_name:
        user.full_name = payload.full_name
    if payload.age is not None:
        profile.age = payload.age
    if payload.gender is not None:
        profile.gender = payload.gender
    if payload.height_cm is not None:
        profile.height_cm = payload.height_cm
    if payload.weight_kg is not None:
        profile.weight_kg = payload.weight_kg
    if payload.activity_level is not None:
        profile.activity_level = payload.activity_level
        
    if payload.dietary_preferences is not None:
        profile.dietary_preferences = json.dumps(payload.dietary_preferences)
    if payload.allergies is not None:
        profile.allergies = json.dumps(payload.allergies)
    if payload.health_conditions is not None:
        profile.health_conditions = json.dumps(payload.health_conditions)
        
    if payload.target_calories is not None:
        profile.target_calories = payload.target_calories
    if payload.target_protein is not None:
        profile.target_protein = payload.target_protein
    if payload.target_carbs is not None:
        profile.target_carbs = payload.target_carbs
    if payload.target_fat is not None:
        profile.target_fat = payload.target_fat
    if payload.target_sugar is not None:
        profile.target_sugar = payload.target_sugar
    if payload.target_sodium is not None:
        profile.target_sodium = payload.target_sodium
        
    if payload.notifications_enabled is not None:
        profile.notifications_enabled = payload.notifications_enabled
    if payload.meal_reminders is not None:
        profile.meal_reminders = payload.meal_reminders
    if payload.safety_alerts is not None:
        profile.safety_alerts = payload.safety_alerts
        
    db.commit()
    db.refresh(user)
    db.refresh(profile)
    
    return format_user_payload(user, profile)

