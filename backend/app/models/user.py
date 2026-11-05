from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Float
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="user") # 'user' or 'admin'
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, unique=True, index=True, nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String(50), nullable=True)
    height_cm = Column(Float, nullable=True)
    weight_kg = Column(Float, nullable=True)
    activity_level = Column(String(50), default="moderate") # sedentary, light, moderate, active, very_active
    
    # Stored as JSON strings
    dietary_preferences = Column(Text, default="[]") # e.g. ["vegetarian", "gluten_free", "halal"]
    allergies = Column(Text, default="[]") # e.g. ["peanuts", "milk", "soy", "gluten"]
    health_conditions = Column(Text, default="[]") # e.g. ["diabetic", "hypertension"]
    
    # Nutrition daily targets
    target_calories = Column(Float, default=2000.0)
    target_protein = Column(Float, default=60.0)     # grams
    target_carbs = Column(Float, default=250.0)      # grams
    target_fat = Column(Float, default=65.0)         # grams
    target_sugar = Column(Float, default=30.0)       # grams max
    target_sodium = Column(Float, default=2000.0)    # mg max
    
    # Notification preferences
    notifications_enabled = Column(Boolean, default=True)
    meal_reminders = Column(Boolean, default=True)
    safety_alerts = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

