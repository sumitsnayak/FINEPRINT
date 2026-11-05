"""
LabelLens Admin Router
Protected administrator console for managing complaints, product verification, and safety audits.
"""

from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.product import Product
from app.models.complaint import Complaint
from app.models.scan import ScanHistory
from app.schemas import ComplaintStatusUpdate
from app.services.auth_service import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["Admin Operations"])

@router.get("/stats")
def get_admin_dashboard_stats(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    total_users = db.query(User).count()
    total_products = db.query(Product).count()
    total_scans = db.query(ScanHistory).count()
    total_complaints = db.query(Complaint).count()
    resolved_complaints = db.query(Complaint).filter(Complaint.status == "resolved").count()
    pending_complaints = db.query(Complaint).filter(Complaint.status.in_(["submitted", "under_review"])).count()
    
    return {
        "total_users": total_users,
        "total_products": total_products,
        "total_scans": total_scans,
        "total_complaints": total_complaints,
        "resolved_complaints": resolved_complaints,
        "pending_complaints": pending_complaints
    }

@router.get("/complaints")
def list_all_complaints(
    status_filter: Optional[str] = Query(None, alias="status"),
    category_filter: Optional[str] = Query(None, alias="category"),
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    query = db.query(Complaint)
    if status_filter and status_filter != "all":
        query = query.filter(Complaint.status == status_filter)
    if category_filter and category_filter != "all":
        query = query.filter(Complaint.category == category_filter)
        
    complaints = query.order_by(Complaint.id.desc()).all()
    
    return [
        {
            "id": c.id,
            "reference_number": c.reference_number,
            "category": c.category,
            "product_name": c.product_name,
            "brand_name": c.brand_name,
            "seller_name": c.seller_name,
            "city": c.city,
            "state": c.state,
            "incident_date": c.incident_date,
            "status": c.status,
            "description": c.description,
            "evidence_image_url": c.evidence_image_url,
            "admin_notes": c.admin_notes,
            "contact_email": c.contact_email,
            "contact_phone": c.contact_phone,
            "created_at": c.created_at.isoformat() if c.created_at else None
        }
        for c in complaints
    ]

@router.put("/complaints/{complaint_id}/status")
def update_complaint_status(
    complaint_id: int,
    payload: ComplaintStatusUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint record not found.")
        
    complaint.status = payload.status
    if payload.admin_notes:
        complaint.admin_notes = payload.admin_notes
        
    db.commit()
    db.refresh(complaint)
    
    return {
        "status": "success",
        "message": f"Report {complaint.reference_number} updated to '{payload.status}'.",
        "reference_number": complaint.reference_number,
        "new_status": complaint.status
    }

@router.put("/products/{product_id}/verify")
def toggle_product_verification(
    product_id: int,
    is_verified: bool,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
        
    product.is_verified = is_verified
    db.commit()
    db.refresh(product)
    
    return {
        "status": "success",
        "message": f"Product '{product.name}' verification status set to {is_verified}."
    }

