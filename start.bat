@echo off
echo ============================================================
echo Starting LabelLens Full-Stack Application...
echo ============================================================

start "LabelLens Backend (FastAPI)" cmd /k "python -m uvicorn app.main:app --app-dir backend --port 8000 --reload"
timeout /t 3 >nul

start "LabelLens Frontend (Vite)" cmd /k "cd frontend && npm run dev"

echo.
echo ============================================================
echo LabelLens is launching!
echo Backend API:  http://127.0.0.1:8000
echo API Docs:     http://127.0.0.1:8000/docs
echo Web App UI:   http://localhost:5173
echo ============================================================
echo.

