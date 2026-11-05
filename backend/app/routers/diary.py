"""
LabelLens Nutrition Tracker & Food Diary Router
"""

import json
from datetime import datetime, date, timedelta
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserProfile
from app.models.diary import FoodDiary, MealEntry
from app.models.product import Product
from app.schemas import MealEntryCreate
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/diary", tags=["Nutrition Tracker & Food Diary"])

def get_or_create_diary(user_id: int, entry_date: str, db: Session) -> FoodDiary:
    diary = db.query(FoodDiary).filter(
        FoodDiary.user_id == user_id,
        FoodDiary.entry_date == entry_date
    ).first()
    if not diary:
        diary = FoodDiary(
            user_id=user_id,
            entry_date=entry_date,
            total_calories=0.0,
            total_protein=0.0,
            total_carbs=0.0,
            total_fat=0.0,
            total_sugar=0.0,
            total_sodium=0.0
        )
        db.add(diary)
        db.commit()
        db.refresh(diary)
    return diary

def recalculate_diary_totals(diary: FoodDiary, db: Session):
    meals = db.query(MealEntry).filter(MealEntry.diary_id == diary.id).all()
    diary.total_calories = round(sum(m.calories for m in meals), 1)
    diary.total_protein = round(sum(m.protein for m in meals), 1)
    diary.total_carbs = round(sum(m.carbs for m in meals), 1)
    diary.total_fat = round(sum(m.fat for m in meals), 1)
    diary.total_sugar = round(sum(m.sugar for m in meals), 1)
    diary.total_sodium = round(sum(m.sodium for m in meals), 1)
    db.commit()
    db.refresh(diary)

@router.get("/day")
def get_daily_diary(
    day: Optional[str] = Query(None, description="Date in YYYY-MM-DD format"),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_date = day if day else date.today().isoformat()
    diary = get_or_create_diary(user.id, target_date, db)
    meals = db.query(MealEntry).filter(MealEntry.diary_id == diary.id).all()
    
    # Get user goals
    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    targets = {
        "calories": profile.target_calories if profile else 2000.0,
        "protein": profile.target_protein if profile else 60.0,
        "carbs": profile.target_carbs if profile else 250.0,
        "fat": profile.target_fat if profile else 65.0,
        "sugar": profile.target_sugar if profile else 30.0,
        "sodium": profile.target_sodium if profile else 2000.0
    }
    
    # Group meals by category
    meal_groups = {"breakfast": [], "lunch": [], "dinner": [], "snack": []}
    for m in meals:
        cat = m.meal_type.lower()
        if cat not in meal_groups:
            meal_groups[cat] = []
        meal_groups[cat].append({
            "id": m.id,
            "meal_type": m.meal_type,
            "food_name": m.food_name,
            "portion_amount": m.portion_amount,
            "portion_unit": m.portion_unit,
            "calories": m.calories,
            "protein": m.protein,
            "carbs": m.carbs,
            "fat": m.fat,
            "sugar": m.sugar,
            "sodium": m.sodium,
            "source_type": m.source_type,
            "product_id": m.product_id
        })
        
    return {
        "date": target_date,
        "totals": {
            "calories": diary.total_calories,
            "protein": diary.total_protein,
            "carbs": diary.total_carbs,
            "fat": diary.total_fat,
            "sugar": diary.total_sugar,
            "sodium": diary.total_sodium
        },
        "targets": targets,
        "meals": meal_groups
    }

@router.post("/entry")
def add_meal_entry(
    payload: MealEntryCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_date = payload.entry_date if payload.entry_date else date.today().isoformat()
    diary = get_or_create_diary(user.id, target_date, db)
    
    entry = MealEntry(
        diary_id=diary.id,
        user_id=user.id,
        meal_type=payload.meal_type,
        food_name=payload.food_name,
        portion_amount=payload.portion_amount,
        portion_unit=payload.portion_unit,
        calories=round(payload.calories, 1),
        protein=round(payload.protein, 1),
        carbs=round(payload.carbs, 1),
        fat=round(payload.fat, 1),
        sugar=round(payload.sugar, 1),
        sodium=round(payload.sodium, 1),
        product_id=payload.product_id,
        source_type=payload.source_type or "manual"
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    
    recalculate_diary_totals(diary, db)
    return {"status": "success", "entry_id": entry.id, "message": "Meal logged successfully."}

@router.delete("/entry/{entry_id}")
def delete_meal_entry(
    entry_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    entry = db.query(MealEntry).filter(
        MealEntry.id == entry_id,
        MealEntry.user_id == user.id
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Meal entry not found.")
        
    diary = db.query(FoodDiary).filter(FoodDiary.id == entry.diary_id).first()
    db.delete(entry)
    db.commit()
    
    if diary:
        recalculate_diary_totals(diary, db)
        
    return {"status": "success", "message": "Meal entry deleted."}

@router.get("/weekly-summary")
def get_weekly_nutrition_summary(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    today = date.today()
    days_data = []
    
    high_sugar_days = 0
    low_protein_days = 0
    high_sodium_days = 0
    
    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    target_sugar = profile.target_sugar if profile else 30.0
    target_protein = profile.target_protein if profile else 60.0
    target_calories = profile.target_calories if profile else 2000.0
    
    for i in range(6, -1, -1):
        d_str = (today - timedelta(days=i)).isoformat()
        diary = db.query(FoodDiary).filter(
            FoodDiary.user_id == user.id,
            FoodDiary.entry_date == d_str
        ).first()
        
        cals = diary.total_calories if diary else 0.0
        prot = diary.total_protein if diary else 0.0
        sugar = diary.total_sugar if diary else 0.0
        sodium = diary.total_sodium if diary else 0.0
        
        if sugar > target_sugar:
            high_sugar_days += 1
        if diary and prot < target_protein:
            low_protein_days += 1
        if sodium > 2000:
            high_sodium_days += 1
            
        days_data.append({
            "date": d_str,
            "day_name": (today - timedelta(days=i)).strftime("%a"),
            "calories": cals,
            "protein": prot,
            "carbs": diary.total_carbs if diary else 0.0,
            "fat": diary.total_fat if diary else 0.0,
            "sugar": sugar,
            "sodium": sodium
        })
        
    observations = []
    if high_sugar_days > 0:
        observations.append(
            f"You consumed more added sugar than your selected daily target on {high_sugar_days} day(s) this week."
        )
    if low_protein_days > 0:
        observations.append(
            f"Your recorded protein intake was below your selected target on {low_protein_days} day(s) this week."
        )
    if high_sodium_days > 0:
        observations.append(
            f"Your recorded sodium exceeded the 2000mg WHO recommended threshold on {high_sodium_days} day(s)."
        )
    if not observations:
        observations.append("Excellent consistency! Your recorded nutritional values stayed within target benchmarks this week.")

    return {
        "weekly_days": days_data,
        "observations": observations,
        "targets": {
            "calories": target_calories,
            "protein": target_protein,
            "sugar": target_sugar
        }
    }

