from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Float
from sqlalchemy.sql import func
from app.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    barcode = Column(String(100), unique=True, index=True, nullable=True)
    name = Column(String(255), index=True, nullable=False)
    brand = Column(String(255), index=True, nullable=True)
    category = Column(String(100), index=True, default="Packaged Food")
    image_url = Column(String(500), nullable=True)
    package_weight = Column(String(100), nullable=True) # e.g. "70g", "200ml"
    
    # Ingredient text
    ingredients_text = Column(Text, nullable=False)
    # Allergen declarations on packet (e.g. "Contains Wheat, Soy. May contain Milk.")
    allergens_declared = Column(Text, default="[]") 
    
    # Nutrition facts (per 100g / 100ml) stored as JSON string
    # {"calories": 420, "protein": 8.0, "carbs": 63.0, "total_fat": 15.0, "saturated_fat": 6.5, "trans_fat": 0.1, "total_sugar": 2.5, "added_sugar": 1.0, "fiber": 3.2, "sodium": 820.0}
    nutrition_per_100g = Column(Text, default="{}")
    nutrition_per_serving = Column(Text, default="{}")
    serving_size = Column(String(100), default="100g")
    
    # Scientific Scores & Ratings (out of 10)
    overall_rating = Column(Float, default=5.0)     # 0 to 10
    safety_score = Column(Float, default=5.0)       # 0 to 10
    nutrition_score = Column(Float, default=5.0)    # 0 to 10
    concern_level = Column(String(50), default="low") # 'low', 'moderate', 'high', 'insufficient_info'
    
    # Factors breakdown JSON string
    rating_factors = Column(Text, default="{}")
    
    # Verification & Sourcing
    source = Column(String(100), default="verified_label") # verified_label, fssai_db, openfoodfacts, user_scan
    is_verified = Column(Boolean, default=False)
    data_confidence = Column(String(50), default="High") # High, Medium, Low
    
    manufacturer = Column(String(255), nullable=True)
    fssai_license = Column(String(100), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Ingredient(Base):
    __tablename__ = "ingredients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True, nullable=False)
    scientific_name = Column(String(255), nullable=True)
    ins_number = Column(String(50), nullable=True) # e.g. "INS 621", "E211"
    category = Column(String(100), nullable=True) # preservative, emulsifier, artificial sweetener, color, enhancer
    purpose = Column(Text, nullable=True) # Why manufacturers use it
    safety_level = Column(String(50), default="safe") # safe, moderate_concern, high_concern, limited_evidence
    description = Column(Text, nullable=True) # Plain English non-jargon explanation
    common_sources = Column(Text, nullable=True)
    allergens = Column(Text, default="[]") # Known allergen connections
    dietary_compatibility = Column(Text, default="{}") # {"vegetarian": true, "vegan": true, "halal": true}
    regulatory_status = Column(Text, nullable=True) # FSSAI / Codex Alimentarius / EU status
    daily_intake_limit = Column(String(255), nullable=True) # Acceptable Daily Intake (ADI)
    scientific_references = Column(Text, default="[]")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

