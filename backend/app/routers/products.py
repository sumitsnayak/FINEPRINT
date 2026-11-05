"""
LabelLens Products & Barcode Router
Handles product catalog, barcode lookup, side-by-side comparison, and saved bookmarks.
"""

import json
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserProfile
from app.models.product import Product
from app.models.scan import SavedProduct
from app.schemas import ProductCompareRequest
from app.services.auth_service import get_current_user, get_current_user_optional
from app.services.ingredient_engine import analyze_full_ingredient_text
from app.services.rating_engine import calculate_comprehensive_rating
from app.services.recommendation_engine import find_healthier_alternatives

router = APIRouter(prefix="/api/products", tags=["Products & Comparison"])

def format_product_detail(p: Product, user_profile: Optional[dict] = None) -> dict:
    try:
        nutr_100g = json.loads(p.nutrition_per_100g or "{}")
    except Exception:
        nutr_100g = {}
    try:
        nutr_serving = json.loads(p.nutrition_per_serving or "{}")
    except Exception:
        nutr_serving = {}
    try:
        allergens = json.loads(p.allergens_declared or "[]")
    except Exception:
        allergens = []
    try:
        factors = json.loads(p.rating_factors or "{}")
    except Exception:
        factors = {}
        
    ing_report = analyze_full_ingredient_text(p.ingredients_text, user_profile)
    
    return {
        "id": p.id,
        "barcode": p.barcode,
        "name": p.name,
        "brand": p.brand,
        "category": p.category,
        "image_url": p.image_url,
        "package_weight": p.package_weight,
        "serving_size": p.serving_size,
        "ingredients_text": p.ingredients_text,
        "allergens_declared": allergens,
        "nutrition_per_100g": nutr_100g,
        "nutrition_per_serving": nutr_serving,
        "overall_score": p.overall_rating,
        "safety_score": p.safety_score,
        "nutrition_score": p.nutrition_score,
        "concern_level": p.concern_level,
        "summary_verdict": factors.get("verdict", "Evaluated Product"),
        "factors_positive": factors.get("positive", []),
        "factors_negative": factors.get("negative", []),
        "source": p.source,
        "is_verified": p.is_verified,
        "data_confidence": p.data_confidence,
        "manufacturer": p.manufacturer,
        "fssai_license": p.fssai_license,
        "ingredient_analysis": ing_report,
        "created_at": p.created_at.isoformat() if p.created_at else None
    }

@router.get("")
def list_products(
    q: Optional[str] = Query(None, description="Search query"),
    category: Optional[str] = Query(None, description="Filter by category"),
    limit: int = 30,
    db: Session = Depends(get_db)
):
    query = db.query(Product)
    if q:
        search_filter = f"%{q.strip()}%"
        query = query.filter(
            (Product.name.ilike(search_filter)) | 
            (Product.brand.ilike(search_filter)) |
            (Product.category.ilike(search_filter))
        )
    if category and category != "All":
        query = query.filter(Product.category == category)
        
    products = query.order_by(Product.overall_rating.desc()).limit(limit).all()
    
    return [
        {
            "id": p.id,
            "barcode": p.barcode,
            "name": p.name,
            "brand": p.brand,
            "category": p.category,
            "image_url": p.image_url,
            "package_weight": p.package_weight,
            "overall_score": p.overall_rating,
            "safety_score": p.safety_score,
            "nutrition_score": p.nutrition_score,
            "concern_level": p.concern_level,
            "is_verified": p.is_verified,
            "source": p.source
        }
        for p in products
    ]

@router.get("/barcode/{code}")
def get_by_barcode(
    code: str,
    user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    clean_code = code.strip()
    product = db.query(Product).filter(Product.barcode == clean_code).first()
    if not product:
        raise HTTPException(
            status_code=404,
            detail=f"Product with barcode '{clean_code}' not found in database. You can scan its ingredient label directly with our Instant Scanner or contribute its details."
        )
        
    user_profile = None
    if user:
        prof = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
        if prof:
            user_profile = {
                "allergies": json.loads(prof.allergies or "[]"),
                "dietary_preferences": json.loads(prof.dietary_preferences or "[]")
            }
            
    detail = format_product_detail(product, user_profile)
    alternatives = find_healthier_alternatives(
        {"name": product.name, "category": product.category, "overall_score": product.overall_rating},
        user_profile
    )
    detail["healthier_alternatives"] = alternatives
    return detail

@router.get("/{product_id}")
def get_product(
    product_id: int,
    user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
        
    user_profile = None
    if user:
        prof = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
        if prof:
            user_profile = {
                "allergies": json.loads(prof.allergies or "[]"),
                "dietary_preferences": json.loads(prof.dietary_preferences or "[]")
            }
            
    detail = format_product_detail(product, user_profile)
    alternatives = find_healthier_alternatives(
        {"name": product.name, "category": product.category, "overall_score": product.overall_rating},
        user_profile
    )
    detail["healthier_alternatives"] = alternatives
    return detail

@router.post("/compare")
def compare_products(
    payload: ProductCompareRequest,
    user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    if len(payload.product_ids) < 2:
        raise HTTPException(status_code=400, detail="Please select at least 2 products to compare.")
        
    products = db.query(Product).filter(Product.id.in_(payload.product_ids)).all()
    if len(products) < 2:
        raise HTTPException(status_code=404, detail="Selected products could not be loaded.")
        
    user_profile = None
    if user:
        prof = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
        if prof:
            user_profile = {
                "allergies": json.loads(prof.allergies or "[]"),
                "dietary_preferences": json.loads(prof.dietary_preferences or "[]")
            }
            
    formatted_list = [format_product_detail(p, user_profile) for p in products]
    
    # Calculate comparative insights
    # Winner by rating
    sorted_by_rating = sorted(formatted_list, key=lambda x: x["overall_score"], reverse=True)
    winner = sorted_by_rating[0]
    
    # Lowest sugar
    sorted_by_sugar = sorted(
        formatted_list,
        key=lambda x: float(x["nutrition_per_100g"].get("total_sugar", 999))
    )
    lowest_sugar = sorted_by_sugar[0]
    
    # Lowest sodium
    sorted_by_sodium = sorted(
        formatted_list,
        key=lambda x: float(x["nutrition_per_100g"].get("sodium", 99999))
    )
    lowest_sodium = sorted_by_sodium[0]
    
    # Highest protein
    sorted_by_protein = sorted(
        formatted_list,
        key=lambda x: float(x["nutrition_per_100g"].get("protein", 0)),
        reverse=True
    )
    highest_protein = sorted_by_protein[0]
    
    insights = [
        f"**{winner['name']}** holds the highest overall LabelLens rating ({winner['overall_score']}/10).",
        f"**{lowest_sugar['name']}** has the lowest sugar content ({lowest_sugar['nutrition_per_100g'].get('total_sugar', 0)}g/100g).",
        f"**{lowest_sodium['name']}** has the lowest sodium ({lowest_sodium['nutrition_per_100g'].get('sodium', 0)}mg/100g).",
        f"**{highest_protein['name']}** provides the most protein ({highest_protein['nutrition_per_100g'].get('protein', 0)}g/100g)."
    ]
    
    return {
        "products": formatted_list,
        "winner": {
            "id": winner["id"],
            "name": winner["name"],
            "score": winner["overall_score"]
        },
        "insights": insights
    }

@router.post("/save/{product_id}")
def save_product(
    product_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(SavedProduct).filter(
        SavedProduct.user_id == user.id,
        SavedProduct.product_id == product_id
    ).first()
    if existing:
        return {"status": "already_saved", "message": "Product already in your saved bookmarks."}
        
    item = SavedProduct(user_id=user.id, product_id=product_id)
    db.add(item)
    db.commit()
    return {"status": "success", "message": "Product saved to your bookmarks."}

@router.delete("/save/{product_id}")
def remove_saved_product(
    product_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(SavedProduct).filter(
        SavedProduct.user_id == user.id,
        SavedProduct.product_id == product_id
    ).first()
    if item:
        db.delete(item)
        db.commit()
    return {"status": "success", "message": "Removed from bookmarks."}

@router.get("/user/saved")
def get_user_saved_products(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    saved_items = db.query(SavedProduct).filter(SavedProduct.user_id == user.id).all()
    product_ids = [s.product_id for s in saved_items]
    products = db.query(Product).filter(Product.id.in_(product_ids)).all()
    
    return [
        {
            "id": p.id,
            "name": p.name,
            "brand": p.brand,
            "category": p.category,
            "image_url": p.image_url,
            "overall_score": p.overall_rating,
            "safety_score": p.safety_score,
            "nutrition_score": p.nutrition_score,
            "concern_level": p.concern_level
        }
        for p in products
    ]

