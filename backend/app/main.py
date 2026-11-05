"""
LabelLens - Main FastAPI Application
AI-Powered Food Intelligence, Nutrition & Food Safety Platform
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.services.seed_data import seed_database
from app.routers import auth, scan, products, diary, complaints, assistant, admin, news

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables if not exist
    Base.metadata.create_all(bind=engine)
    # Seed initial authentic Indian product catalog & admin user
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield
    # Shutdown

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-Powered Food Intelligence, Nutrition & Food Safety Platform",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Uploads for images
if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth.router)
app.include_router(scan.router)
app.include_router(products.router)
app.include_router(diary.router)
app.include_router(complaints.router)
app.include_router(assistant.router)
app.include_router(admin.router)
app.include_router(news.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": "active",
        "ai_engine": "Gemini 1.5 Flash (Configured)" if settings.GEMINI_API_KEY else "FINEPRINT Knowledge Engine (Active Offline/Fallback)"
    }

