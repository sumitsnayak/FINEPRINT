from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

# Auth Schemas
class UserRegister(BaseModel):
    email: str
    password: str = Field(min_length=6)
    full_name: str
    age: Optional[int] = None
    gender: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    activity_level: Optional[str] = "moderate"
    dietary_preferences: Optional[List[str]] = []
    allergies: Optional[List[str]] = []
    health_conditions: Optional[List[str]] = []

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    activity_level: Optional[str] = None
    dietary_preferences: Optional[List[str]] = None
    allergies: Optional[List[str]] = None
    health_conditions: Optional[List[str]] = None
    target_calories: Optional[float] = None
    target_protein: Optional[float] = None
    target_carbs: Optional[float] = None
    target_fat: Optional[float] = None
    target_sugar: Optional[float] = None
    target_sodium: Optional[float] = None
    notifications_enabled: Optional[bool] = None
    meal_reminders: Optional[bool] = None
    safety_alerts: Optional[bool] = None

# Scan & OCR Schemas
class AnalyzeTextRequest(BaseModel):
    product_name: Optional[str] = "Scanned Food Product"
    ingredients_text: str
    nutrition_facts: Optional[Dict[str, float]] = None
    fssai_license: Optional[str] = None

class ExplainScoreRequest(BaseModel):
    product_name: str
    overall_score: float
    safety_score: Optional[float] = None
    nutrition_score: Optional[float] = None
    concern_level: Optional[str] = None
    nutrition_facts: Optional[Dict[str, Any]] = None
    ingredient_analysis: Optional[Dict[str, Any]] = None
    fssai_license: Optional[str] = None
    processing_level: Optional[str] = None

# Diary Schemas
class MealEntryCreate(BaseModel):
    meal_type: str # breakfast, lunch, dinner, snack
    food_name: str
    portion_amount: float = 1.0
    portion_unit: str = "serving"
    calories: float = 0.0
    protein: float = 0.0
    carbs: float = 0.0
    fat: float = 0.0
    sugar: float = 0.0
    sodium: float = 0.0
    product_id: Optional[int] = None
    source_type: Optional[str] = "manual"
    entry_date: Optional[str] = None # YYYY-MM-DD

# Complaint Schemas
class ComplaintCreate(BaseModel):
    category: str
    product_name: str
    brand_name: Optional[str] = None
    batch_number: Optional[str] = None
    mfg_date: Optional[str] = None
    expiry_date: Optional[str] = None
    fssai_number_on_pack: Optional[str] = None
    seller_name: Optional[str] = None
    seller_location: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    incident_date: str
    description: str
    evidence_image_url: Optional[str] = None
    contact_name: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    is_anonymous: Optional[bool] = False

class ComplaintStatusUpdate(BaseModel):
    status: str
    admin_notes: Optional[str] = None

# Assistant Schemas
class AssistantMessage(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = []
    active_product: Optional[Dict[str, Any]] = None

# Product Comparison Schema
class ProductCompareRequest(BaseModel):
    product_ids: List[int]
