"""
LabelLens AI Personal Food Assistant Router
"""

import json
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserProfile
from app.schemas import AssistantMessage
from app.services.auth_service import get_current_user_optional
from app.services.ai_service import answer_assistant_chat, query_gemini_api

router = APIRouter(prefix="/api/assistant", tags=["AI Food Assistant"])

@router.post("/chat")
async def chat_with_assistant(
    payload: AssistantMessage,
    user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    user_profile = None
    if user:
        prof = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
        if prof:
            user_profile = {
                "dietary_preferences": json.loads(prof.dietary_preferences or "[]"),
                "allergies": json.loads(prof.allergies or "[]"),
                "target_calories": prof.target_calories
            }
            
    response = await answer_assistant_chat(
        user_message=payload.message,
        history=payload.history or [],
        user_profile=user_profile,
        active_product=payload.active_product
    )
    return response

@router.post("/estimate-meal")
async def estimate_meal_nutrition(
    food_description: str,
    user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Estimates calorie and macro range for traditional Indian meals or prepared dishes.
    """
    prompt = f"""
    Estimate the nutritional values for this meal/dish: "{food_description}".
    Return ONLY a valid JSON object with keys:
    "food_name": (string, cleaned title),
    "portion_amount": (number, default 1),
    "portion_unit": (string, e.g. "plate", "bowl", "katori", "serving"),
    "calories": (number in kcal),
    "protein": (number in grams),
    "carbs": (number in grams),
    "fat": (number in grams),
    "sugar": (number in grams),
    "sodium": (number in mg),
    "confidence": (string, "Estimated" or "Standard Portion")
    """
    
    gemini_reply = await query_gemini_api(prompt, "You are a nutritional data analyst. Output valid JSON only.")
    
    if gemini_reply:
        try:
            # Clean possible markdown ticks
            cleaned = gemini_reply.replace("```json", "").replace("```", "").strip()
            return json.loads(cleaned)
        except Exception:
            pass
            
    # Deterministic fallback for common Indian foods
    desc_lower = food_description.lower()
    if "dosa" in desc_lower:
        return {
            "food_name": "Plain / Masala Dosa with Sambar",
            "portion_amount": 1,
            "portion_unit": "serving (1 dosa + sambar)",
            "calories": 320.0,
            "protein": 7.0,
            "carbs": 48.0,
            "fat": 11.0,
            "sugar": 3.0,
            "sodium": 580.0,
            "confidence": "Database Standard Portion"
        }
    elif "roti" in desc_lower or "chapati" in desc_lower:
        return {
            "food_name": "Whole Wheat Roti / Chapati with Dal",
            "portion_amount": 2,
            "portion_unit": "rotis with 1 bowl dal",
            "calories": 280.0,
            "protein": 11.0,
            "carbs": 46.0,
            "fat": 5.0,
            "sugar": 2.0,
            "sodium": 420.0,
            "confidence": "Database Standard Portion"
        }
    elif "biryani" in desc_lower:
        return {
            "food_name": "Vegetable Dum Biryani with Raita",
            "portion_amount": 1,
            "portion_unit": "medium bowl (250g)",
            "calories": 420.0,
            "protein": 9.0,
            "carbs": 62.0,
            "fat": 15.0,
            "sugar": 3.5,
            "sodium": 650.0,
            "confidence": "Database Standard Portion"
        }
    elif "idli" in desc_lower:
        return {
            "food_name": "Steamed Idlis with Coconut Chutney",
            "portion_amount": 2,
            "portion_unit": "pieces with chutney",
            "calories": 160.0,
            "protein": 5.0,
            "carbs": 28.0,
            "fat": 3.5,
            "sugar": 1.0,
            "sodium": 310.0,
            "confidence": "Database Standard Portion"
        }
    else:
        return {
            "food_name": food_description.strip().title(),
            "portion_amount": 1,
            "portion_unit": "serving",
            "calories": 250.0,
            "protein": 6.0,
            "carbs": 35.0,
            "fat": 9.0,
            "sugar": 4.0,
            "sodium": 350.0,
            "confidence": "Standard Reference Estimate"
        }

