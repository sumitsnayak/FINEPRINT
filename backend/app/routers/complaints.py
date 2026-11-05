"""
LabelLens Food Safety Complaints & Incident Reporting Router
Manages user food safety concerns, evidence uploads, tracking IDs, and FSSAI Food Safety Connect guidance.
"""

import os
import random
import uuid
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.user import User
from app.models.complaint import Complaint
from app.schemas import ComplaintCreate, ComplaintStatusUpdate
from app.services.auth_service import get_current_user_optional, get_current_admin

router = APIRouter(prefix="/api/complaints", tags=["Food Safety Complaints"])

FSSAI_GUIDANCE_INFO = {
    "fssai_portal_name": "FSSAI Food Safety Connect (FOSCOS)",
    "fssai_portal_url": "https://foscos.fssai.gov.in/consumergrievance/",
    "national_consumer_helpline": "1915",
    "fssai_toll_free": "1800-112-100",
    "disclaimer": (
        "IMPORTANT LEGAL NOTICE: Reports filed through LabelLens are consumer grievance records "
        "and investigative allegations maintained within our platform database. "
        "They do not constitute an official legal indictment or formal government penalty. "
        "For immediate statutory regulatory intervention, consumers are encouraged to file on the official FSSAI Food Safety Connect portal."
    )
}

def generate_reference_number() -> str:
    year = datetime.now().year
    random_digits = random.randint(10000, 99999)
    return f"LL-{year}-{random_digits}"

@router.post("/upload-evidence")
async def upload_complaint_evidence(
    image: UploadFile = File(...)
):
    filename = f"evidence_{uuid.uuid4().hex}_{image.filename}"
    filepath = os.path.join(settings.UPLOAD_DIR, "evidence", filename)
    contents = await image.read()
    with open(filepath, "wb") as f:
        f.write(contents)
    return {"status": "success", "image_url": f"/uploads/evidence/{filename}"}

@router.post("")
def submit_complaint(
    payload: ComplaintCreate,
    user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    ref_num = generate_reference_number()
    # Ensure unique
    while db.query(Complaint).filter(Complaint.reference_number == ref_num).first():
        ref_num = generate_reference_number()
        
    complaint = Complaint(
        reference_number=ref_num,
        user_id=user.id if user else None,
        category=payload.category,
        product_name=payload.product_name,
        brand_name=payload.brand_name,
        batch_number=payload.batch_number,
        mfg_date=payload.mfg_date,
        expiry_date=payload.expiry_date,
        fssai_number_on_pack=payload.fssai_number_on_pack,
        seller_name=payload.seller_name,
        seller_location=payload.seller_location,
        city=payload.city,
        state=payload.state,
        incident_date=payload.incident_date,
        description=payload.description,
        evidence_image_url=payload.evidence_image_url,
        contact_name=payload.contact_name,
        contact_phone=payload.contact_phone,
        contact_email=payload.contact_email,
        is_anonymous="true" if payload.is_anonymous else "false",
        status="submitted"
    )
    db.add(complaint)
    db.commit()
    db.refresh(complaint)
    
    return {
        "status": "success",
        "reference_number": ref_num,
        "complaint_id": complaint.id,
        "message": "Food safety report registered successfully.",
        "fssai_guidance": FSSAI_GUIDANCE_INFO
    }

@router.get("/user/my-complaints")
def get_user_complaints(
    user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    if not user:
        return []
        
    complaints = db.query(Complaint).filter(Complaint.user_id == user.id).order_by(Complaint.id.desc()).all()
    return [
        {
            "id": c.id,
            "reference_number": c.reference_number,
            "category": c.category,
            "product_name": c.product_name,
            "brand_name": c.brand_name,
            "seller_name": c.seller_name,
            "city": c.city,
            "incident_date": c.incident_date,
            "status": c.status,
            "evidence_image_url": c.evidence_image_url,
            "created_at": c.created_at.isoformat() if c.created_at else None
        }
        for c in complaints
    ]

@router.get("/track/{reference_number}")
def track_complaint(
    reference_number: str,
    db: Session = Depends(get_db)
):
    clean_ref = reference_number.strip().upper()
    complaint = db.query(Complaint).filter(Complaint.reference_number == clean_ref).first()
    if not complaint:
        raise HTTPException(
            status_code=404,
            detail=f"No food safety report found matching reference number '{clean_ref}'."
        )
        
    return {
        "id": complaint.id,
        "reference_number": complaint.reference_number,
        "category": complaint.category,
        "product_name": complaint.product_name,
        "brand_name": complaint.brand_name,
        "seller_name": complaint.seller_name,
        "seller_location": complaint.seller_location,
        "city": complaint.city,
        "state": complaint.state,
        "incident_date": complaint.incident_date,
        "description": complaint.description,
        "status": complaint.status,
        "evidence_image_url": complaint.evidence_image_url,
        "admin_notes": complaint.admin_notes,
        "created_at": complaint.created_at.isoformat() if complaint.created_at else None,
        "fssai_guidance": FSSAI_GUIDANCE_INFO
    }

@router.get("/fssai-guidance")
def get_fssai_guidance():
    return FSSAI_GUIDANCE_INFO

