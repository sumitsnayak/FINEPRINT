from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Date
from sqlalchemy.sql import func
from app.database import Base

class FoodDiary(Base):
    __tablename__ = "food_diaries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    entry_date = Column(String(10), index=True, nullable=False) # 'YYYY-MM-DD'
    
    # Aggregated totals
    total_calories = Column(Float, default=0.0)
    total_protein = Column(Float, default=0.0)
    total_carbs = Column(Float, default=0.0)
    total_fat = Column(Float, default=0.0)
    total_sugar = Column(Float, default=0.0)
    total_sodium = Column(Float, default=0.0)
    
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class MealEntry(Base):
    __tablename__ = "meal_entries"

    id = Column(Integer, primary_key=True, index=True)
    diary_id = Column(Integer, index=True, nullable=False)
    user_id = Column(Integer, index=True, nullable=False)
    meal_type = Column(String(50), nullable=False) # 'breakfast', 'lunch', 'dinner', 'snack'
    food_name = Column(String(255), nullable=False)
    portion_amount = Column(Float, default=1.0)
    portion_unit = Column(String(50), default="serving") # 'g', 'ml', 'serving', 'packet', 'bowl'
    
    calories = Column(Float, default=0.0)
    protein = Column(Float, default=0.0)
    carbs = Column(Float, default=0.0)
    fat = Column(Float, default=0.0)
    sugar = Column(Float, default=0.0)
    sodium = Column(Float, default=0.0)
    
    product_id = Column(Integer, nullable=True)
    source_type = Column(String(50), default="manual") # 'scan', 'database', 'manual', 'photo_ai'
    photo_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

