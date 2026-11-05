"""
LabelLens Scanner & Analysis Router
Handles image uploads, OCR extraction, user text correction, and AI-powered label analysis.
"""

import os
import uuid
import json
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.user import User, UserProfile
from app.models.scan import ScanHistory
from app.models.product import Product
from app.schemas import AnalyzeTextRequest, ExplainScoreRequest
from app.services.auth_service import get_current_user_optional
from app.services.ocr_service import extract_text_from_image
from app.services.ai_service import analyze_label_ai, explain_score_with_ai
from app.services.rating_engine import explain_product_score
from app.services.recommendation_engine import find_healthier_alternatives

router = APIRouter(prefix="/api/scan", tags=["Scanner & OCR"])

@router.post("/ocr")
async def process_label_ocr(
    image: UploadFile = File(...),
    user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Step 1: Uploads food label photo and performs OCR text extraction.
    Returns editable structured fields for consumer review before triggering analysis.
    """
    filename = f"{uuid.uuid4().hex}_{image.filename}"
    filepath = os.path.join(settings.UPLOAD_DIR, "labels", filename)
    
    contents = await image.read()
    with open(filepath, "wb") as f:
        f.write(contents)
        
    ocr_result = extract_text_from_image(filepath)
    relative_url = f"/uploads/labels/{filename}"
    
    return {
        "status": "success",
        "image_url": relative_url,
        "engine_used": ocr_result["engine_used"],
        "confidence": ocr_result["confidence"],
        "raw_text": ocr_result["raw_text"],
        "extracted_data": ocr_result["structured"]
    }

@router.post("/analyze")
async def analyze_label(
    payload: AnalyzeTextRequest,
    user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """
    Step 2: Takes verified/corrected label text and nutrition values.
    Performs AI ingredient explanation, safety scoring, allergen cross-matching,
    and returns personalized recommendations.
    """
    user_profile = None
    if user:
        profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
        if profile:
            user_profile = {
                "dietary_preferences": json.loads(profile.dietary_preferences or "[]"),
                "allergies": json.loads(profile.allergies or "[]"),
                "health_conditions": json.loads(profile.health_conditions or "[]"),
                "target_calories": profile.target_calories
            }

    # Perform comprehensive analysis
    report = await analyze_label_ai(
        product_name=payload.product_name or "Scanned Product",
        ingredients_text=payload.ingredients_text,
        nutrition_facts=payload.nutrition_facts or {},
        user_profile=user_profile,
        fssai_license=payload.fssai_license
    )
    
    # Generate tailored alternatives
    alternatives = find_healthier_alternatives(
        current_product={
            "name": payload.product_name or "Scanned Product",
            "category": "Packaged Food",
            "overall_score": report["overall_score"]
        },
        user_profile=user_profile
    )
    report["healthier_alternatives"] = alternatives
    
    # Save scan history
    scan_entry = ScanHistory(
        user_id=user.id if user else None,
        product_name_detected=payload.product_name,
        ocr_raw_text=payload.ingredients_text,
        user_corrected_text=payload.ingredients_text,
        analysis_result=json.dumps(report)
    )
    db.add(scan_entry)
    db.commit()
    db.refresh(scan_entry)
    
    report["scan_id"] = scan_entry.id
    return report

@router.post("/explain-score")
async def explain_score_endpoint(payload: ExplainScoreRequest):
    """
    Step 3: On-Demand Explainable Food Score.
    Generates deterministic evidence, breakdowns, and scoring methodology,
    accompanied by Google Gemini's plain-language consumer explanation.
    """
    deterministic_breakdown = explain_product_score(
        product_name=payload.product_name,
        overall_score=payload.overall_score,
        safety_score=payload.safety_score,
        nutrition_score=payload.nutrition_score,
        concern_level=payload.concern_level,
        nutrition_facts=payload.nutrition_facts,
        ingredient_analysis=payload.ingredient_analysis,
        fssai_license=payload.fssai_license,
        processing_level=payload.processing_level
    )
    full_explanation = await explain_score_with_ai(deterministic_breakdown)
    return full_explanation

@router.get("/history")
def get_scan_history(
    limit: int = 15,
    user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """
    Returns scan history for logged-in user or recent scans if guest.
    """
    query = db.query(ScanHistory)
    if user:
        query = query.filter(ScanHistory.user_id == user.id)
    else:
        query = query.order_by(ScanHistory.id.desc()).limit(limit)
        
    records = query.order_by(ScanHistory.id.desc()).limit(limit).all()
    
    results = []
    for r in records:
        try:
            parsed = json.loads(r.analysis_result)
        except Exception:
            parsed = {}
        results.append({
            "id": r.id,
            "product_name": r.product_name_detected or parsed.get("product_name", "Scanned Item"),
            "image_url": r.image_url,
            "overall_score": parsed.get("overall_score", 5.0),
            "safety_score": parsed.get("safety_score", 5.0),
            "nutrition_score": parsed.get("nutrition_score", 5.0),
            "concern_level": parsed.get("concern_level", "low"),
            "summary_verdict": parsed.get("summary_verdict", ""),
            "created_at": r.created_at.isoformat() if r.created_at else None
        })
        
    return results

@router.get("/history/{scan_id}")
def get_scan_detail(
    scan_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(ScanHistory).filter(ScanHistory.id == scan_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Scan record not found.")
    try:
        report = json.loads(record.analysis_result)
    except Exception:
        raise HTTPException(status_code=500, detail="Corrupted scan record.")
    report["scan_id"] = record.id
    report["created_at"] = record.created_at.isoformat() if record.created_at else None
    return report

