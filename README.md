# LabelLens — AI-Powered Food Intelligence, Nutrition & Food Safety Platform

> **Know exactly what's inside packaged food.**  
> Decode chemical additives, detect hidden sugars & allergens, track daily dietary habits, and report food safety hazards with transparent scientific ratings.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![FSSAI Aligned](https://img.shields.io/badge/Standards-FSSAI%20%26%20ICMR--NIN-15803d?style=flat)](https://www.fssai.gov.in)

---

## 1. Project Overview & Vision

Many consumers purchase packaged food without understanding the ingredients, chemical additives, or potential allergens present. Scientific names on food labels are intimidating, front-of-pack marketing claims are often misleading, and nutrition facts tables are difficult to interpret.

**LabelLens** solves this by providing a unified, science-backed platform to:
- **Instantly scan packaged food labels** via camera or image upload with high-accuracy OCR.
- **Review and edit extracted ingredient lists** before analysis to guarantee complete accuracy.
- **Decode confusing additives and INS/E numbers** into plain-language explanations with zero medical jargon.
- **Detect declared and hidden allergens**, cross-referenced against the user's declared allergies.
- **Compute a transparent Dual-Vector Score (out of 10)**:
  - **Food Safety Assessment (0–10)**: Evaluates industrial additives, trans fats, preservatives, and FSSAI license compliance.
  - **Nutritional Quality Score (0–10)**: Nutrient-profiling model assessing calories, added sugars, sodium, saturated fat, and protein.
- **Track daily food consumption** across Breakfast, Lunch, Dinner, and Snacks with macro trends and weekly habit observations.
- **Side-by-side product comparison** of 2 to 4 products with automatic winner determination.
- **Discover healthier alternatives** that match the user's dietary preferences and do not conflict with declared allergies.
- **File and track Food Safety Grievances** with unique reference IDs (e.g. `LL-2026-XXXX`) and guidance to official **FSSAI Food Safety Connect**.
- **Admin Audit Console** with role-based access control to investigate consumer grievances and verify products.

---

## 2. Architecture & Technology Stack

```
LabelLens Platform
│
├── frontend/ (React 19 + TypeScript + Vite + Tailwind CSS)
│   ├── src/components/ (Navbar, MobileBottomNav, CameraScanner, IngredientCard, ScoreBadge, NutritionTable)
│   ├── src/pages/      (Landing, Dashboard, Scanner, ScanResults, Catalog, Compare, Diary, Assistant, Reports, Admin)
│   ├── src/context/    (AuthContext, ScanContext)
│   └── src/services/   (Axios API Client)
│
├── backend/ (Python 3.10+ / FastAPI REST Architecture)
│   ├── app/routers/    (auth, scan, products, diary, complaints, assistant, admin)
│   ├── app/services/   (ingredient_engine, rating_engine, ocr_service, ai_service, recommendation_engine, seed_data)
│   ├── app/models/     (SQLAlchemy relational models)
│   └── app/config.py   (Environment settings, Gemini API, Supabase)
│
└── supabase/
    └── schema.sql      (PostgreSQL Schema with Row Level Security policies)
```

### Frontend
- **React 19** with **TypeScript**
- **Vite** for rapid bundling
- **Tailwind CSS** with custom health palette (Deep Forest Green, Soft Mint, Charcoal, Alert Amber, Alert Red)
- **Lucide React** icons
- **Html5-Qrcode** for camera barcode scanning

### Backend
- **FastAPI** with asynchronous request handling
- **SQLAlchemy** relational ORM
- **Pydantic v2** validation schemas
- **PyJWT & Bcrypt** for secure authentication
- **Pillow (PIL)** for image contrast boosting and preprocessing

### AI & Knowledge Engines
- **Configurable Google Gemini REST Integration**: Live generative food scientist insights when `GEMINI_API_KEY` is provided.
- **Verified Offline Food Safety Engine**: 100% resilient deterministic knowledge base of INS/E numbers, additives, allergens, and Indian standards (FSSAI Compendium & ICMR-NIN).
- **OCR Engine**: Tesseract OCR / Google Vision integration with sample preview templates for instant evaluation without camera permissions.

---

## 3. Pre-Seeded Indian Products & Test Accounts

LabelLens is pre-seeded with authentic Indian packaged food products and test profiles:

### Seeded Indian Packaged Foods
1. **Maggi 2-Minute Masala Instant Noodles** (70g, Barcode: `8901058852345`)
2. **Parle-G Original Gluco Biscuits** (130g, Barcode: `8901719101018`)
3. **Lay's India's Magic Masala Potato Chips** (50g, Barcode: `8901491101826`)
4. **Amul Pasteurised Salted Butter** (100g, Barcode: `8901262010054`)
5. **Kissan Fresh Tomato Ketchup** (200g, Barcode: `8901030383119`)
6. **Haldiram's Nagpur Aloo Bhujia** (150g, Barcode: `8904004400588`)
7. **Real Fruit Power Mixed Fruit Juice** (1L, Barcode: `8901207010118`)
8. **Epigamia Greek Yogurt Natural** (85g, Barcode: `8906079980123`)

### 1-Click Demo Accounts

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Consumer** | `demo@labellens.com` | `DemoUser2026!` | Profile: Priya Sharma, Vegetarian, Allergic to Peanuts & Tree Nuts |
| **Admin** | `admin@labellens.com` | `AdminPassword2026!` | Role: Food Safety Officer, Access to Admin Audit Console |

*(Both accounts can be logged in via 1-click quick buttons on the Login page).*

---

## 4. Setup & Running Locally

### Prerequisites
- **Python 3.10+** (tested on 3.14)
- **Node.js 18+** and **npm**

### Step 1: Clone and Set Up Backend
```bash
# Navigate to backend directory
cd backend

# (Optional) Create virtual environment
python -m venv venv
# Windows: venv\Scripts\activate
# Linux/macOS: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env
```

### Step 2: Start the FastAPI Backend
```bash
# From workspace root
python -m uvicorn app.main:app --app-dir backend --port 8000 --reload
```
The backend API will run at `http://127.0.0.1:8000`.  
Interactive Swagger docs: `http://127.0.0.1:8000/docs`.

### Step 3: Start the React Frontend
```bash
# Open a new terminal in frontend directory
cd frontend

# Install dependencies (already installed)
npm install

# Start Vite development server
npm run dev
```
Open your browser at **`http://localhost:5173`**.

---

## 5. Verification & Automated Test Suite

A complete integration test suite validates all 12 platform operations:

```bash
# Run test suite
python test_live.py
```

### Test Coverage:
1. `GET /api/health` — Platform health check
2. `GET /api/products/barcode/{code}` — Barcode product lookup
3. `GET /api/products` — Catalog search & category filtering
4. `POST /api/products/compare` — Side-by-side comparison matrix
5. `POST /api/scan/analyze` — OCR text analysis & 0-10 score calculation
6. `POST /api/auth/login` — Authentication & JWT generation
7. `POST /api/diary/entry` — Logging daily meals
8. `GET /api/diary/day` — Macro aggregation and progress calculation
9. `POST /api/complaints` — Food safety grievance registration
10. `GET /api/complaints/track/{ref}` — Real-time grievance tracking
11. `POST /api/assistant/chat` — AI Food Assistant chatbot
12. `GET /api/admin/stats` — Admin compliance console and RBAC protection

---

## 6. External APIs & Environment Configuration

Configuration options in `backend/.env`:

```env
# JWT Secret
JWT_SECRET_KEY=labellens-super-secret-jwt-key-2026-hackathon

# Database
DATABASE_URL=sqlite:///./labellens.db
# Or PostgreSQL / Supabase:
# DATABASE_URL=postgresql://postgres.xxx:pass@aws-0-ap-south-1.pooler.supabase.com:6543/postgres

# Google Gemini API (Optional)
# If provided, live Gemini generates personalized text analysis.
# If omitted, LabelLens runs the offline verified Food Safety Knowledge Engine.
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash

# Supabase Credentials (Optional)
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## 7. FSSAI & Legal Compliance

- **Consumer Grievance Notice**: Reports submitted within LabelLens are consumer grievance records for community awareness and platform audits.
- **Statutory Reporting**: Direct guidance and one-click links are provided to the official government portal: **FSSAI Food Safety Connect (FOSCOS)** and the **National Consumer Helpline (1915)**.
- **Scientific Objectivity**: Ingredients are evaluated based on peer-reviewed toxicology, permitted limits, and ICMR guidelines. Ingredients are never labeled dangerous merely because of complex scientific names.

---

## 8. License

MIT License — Developed for the 2026 Food Intelligence & Consumer Safety Hackathon.

