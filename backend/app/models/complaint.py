from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    reference_number = Column(String(50), unique=True, index=True, nullable=False) # e.g. "LL-2026-7842"
    user_id = Column(Integer, index=True, nullable=True) # Anonymous or logged-in
    
    category = Column(String(100), nullable=False)
    # Categories:
    # - "missing_label": Missing or incomplete ingredient/nutritional label
    # - "expired_product": Selling expired or repackaged food
    # - "missing_expiry": Missing manufacturing or expiry date
    # - "tampered_packaging": Damaged, unsealed, or compromised packaging
    # - "misleading_claims": False health or nutrition claims (e.g. "100% natural", "Sugar-free" containing syrup)
    # - "counterfeit_suspected": Suspected counterfeit / imitation food brand
    # - "unhygienic_conditions": Unsanitary food selling/storage conditions
    # - "foreign_matter": Foreign object or contamination in food
    # - "other": Other food safety concerns
    
    product_name = Column(String(255), nullable=False)
    brand_name = Column(String(255), nullable=True)
    batch_number = Column(String(100), nullable=True)
    mfg_date = Column(String(50), nullable=True)
    expiry_date = Column(String(50), nullable=True)
    fssai_number_on_pack = Column(String(100), nullable=True)
    
    seller_name = Column(String(255), nullable=True)
    seller_location = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    incident_date = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    
    evidence_image_url = Column(String(500), nullable=True)
    additional_evidence_urls = Column(Text, default="[]") # JSON array
    
    contact_name = Column(String(255), nullable=True)
    contact_phone = Column(String(50), nullable=True)
    contact_email = Column(String(255), nullable=True)
    is_anonymous = Column(String(10), default="false")
    
    # Status lifecycle
    # "submitted", "under_review", "additional_info_required", "referred_to_authority", "resolved", "closed"
    status = Column(String(50), default="submitted")
    fssai_guidance_provided = Column(Text, nullable=True)
    admin_notes = Column(Text, nullable=True)
    status_history = Column(Text, default="[]") # JSON list of status changes with timestamps
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="info") # alert, reminder, complaint, recommendation
    link = Column(String(255), nullable=True)
    is_read = Column(String(10), default="false")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

