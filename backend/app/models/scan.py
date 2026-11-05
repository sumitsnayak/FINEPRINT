from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.sql import func
from app.database import Base

class ScanHistory(Base):
    __tablename__ = "scan_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True, index=True) # can be guest or logged-in user
    product_id = Column(Integer, nullable=True, index=True)
    image_url = Column(String(500), nullable=True)
    ocr_raw_text = Column(Text, nullable=True)
    user_corrected_text = Column(Text, nullable=True)
    product_name_detected = Column(String(255), nullable=True)
    
    # Complete JSON result of analysis
    analysis_result = Column(Text, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SavedProduct(Base):
    __tablename__ = "saved_products"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    product_id = Column(Integer, index=True, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ProductComparison(Base):
    __tablename__ = "product_comparisons"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=True)
    product_ids = Column(Text, nullable=False) # JSON array of IDs e.g. [1, 2]
    comparison_summary = Column(Text, nullable=True) # AI or engine comparison insights
    created_at = Column(DateTime(timezone=True), server_default=func.now())

