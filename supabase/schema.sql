-- ==========================================================
-- LabelLens Supabase PostgreSQL Schema & Row Level Security (RLS)
-- ==========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user', -- 'user' or 'admin'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 3. User Profiles Table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    age INTEGER,
    gender VARCHAR(50),
    height_cm NUMERIC,
    weight_kg NUMERIC,
    activity_level VARCHAR(50) DEFAULT 'moderate',
    dietary_preferences TEXT DEFAULT '[]', -- JSON array: ["vegetarian", "gluten_free"]
    allergies TEXT DEFAULT '[]',           -- JSON array: ["peanuts", "milk"]
    health_conditions TEXT DEFAULT '[]',   -- JSON array: ["diabetic", "hypertension"]
    target_calories NUMERIC DEFAULT 2000.0,
    target_protein NUMERIC DEFAULT 60.0,
    target_carbs NUMERIC DEFAULT 250.0,
    target_fat NUMERIC DEFAULT 65.0,
    target_sugar NUMERIC DEFAULT 30.0,
    target_sodium NUMERIC DEFAULT 2000.0,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    meal_reminders BOOLEAN DEFAULT TRUE,
    safety_alerts BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 4. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id SERIAL PRIMARY KEY,
    barcode VARCHAR(100) UNIQUE,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    category VARCHAR(100) DEFAULT 'Packaged Food',
    image_url VARCHAR(500),
    package_weight VARCHAR(100),
    serving_size VARCHAR(100) DEFAULT '100g',
    ingredients_text TEXT NOT NULL,
    allergens_declared TEXT DEFAULT '[]',
    nutrition_per_100g TEXT DEFAULT '{}',
    nutrition_per_serving TEXT DEFAULT '{}',
    overall_rating NUMERIC DEFAULT 5.0,
    safety_score NUMERIC DEFAULT 5.0,
    nutrition_score NUMERIC DEFAULT 5.0,
    concern_level VARCHAR(50) DEFAULT 'low',
    rating_factors TEXT DEFAULT '{}',
    source VARCHAR(100) DEFAULT 'verified_label',
    is_verified BOOLEAN DEFAULT FALSE,
    data_confidence VARCHAR(50) DEFAULT 'High',
    manufacturer VARCHAR(255),
    fssai_license VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_products_barcode ON public.products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);

-- 5. Scan History Table
CREATE TABLE IF NOT EXISTS public.scan_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
    product_name_detected VARCHAR(255),
    ocr_raw_text TEXT,
    user_corrected_text TEXT,
    image_url VARCHAR(500),
    analysis_result TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Food Diaries Table
CREATE TABLE IF NOT EXISTS public.food_diaries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
    entry_date VARCHAR(10) NOT NULL, -- 'YYYY-MM-DD'
    total_calories NUMERIC DEFAULT 0.0,
    total_protein NUMERIC DEFAULT 0.0,
    total_carbs NUMERIC DEFAULT 0.0,
    total_fat NUMERIC DEFAULT 0.0,
    total_sugar NUMERIC DEFAULT 0.0,
    total_sodium NUMERIC DEFAULT 0.0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 7. Meal Entries Table
CREATE TABLE IF NOT EXISTS public.meal_entries (
    id SERIAL PRIMARY KEY,
    diary_id INTEGER REFERENCES public.food_diaries(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
    meal_type VARCHAR(50) NOT NULL, -- breakfast, lunch, dinner, snack
    food_name VARCHAR(255) NOT NULL,
    portion_amount NUMERIC DEFAULT 1.0,
    portion_unit VARCHAR(50) DEFAULT 'serving',
    calories NUMERIC DEFAULT 0.0,
    protein NUMERIC DEFAULT 0.0,
    carbs NUMERIC DEFAULT 0.0,
    fat NUMERIC DEFAULT 0.0,
    sugar NUMERIC DEFAULT 0.0,
    sodium NUMERIC DEFAULT 0.0,
    product_id INTEGER,
    source_type VARCHAR(50) DEFAULT 'manual',
    photo_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Food Safety Complaints Table
CREATE TABLE IF NOT EXISTS public.complaints (
    id SERIAL PRIMARY KEY,
    reference_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    brand_name VARCHAR(255),
    batch_number VARCHAR(100),
    mfg_date VARCHAR(50),
    expiry_date VARCHAR(50),
    fssai_number_on_pack VARCHAR(100),
    seller_name VARCHAR(255),
    seller_location TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    incident_date VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    evidence_image_url VARCHAR(500),
    contact_name VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    is_anonymous VARCHAR(10) DEFAULT 'false',
    status VARCHAR(50) DEFAULT 'submitted', -- submitted, under_review, additional_info_required, referred_to_authority, resolved, closed
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 9. Saved Products Table
CREATE TABLE IF NOT EXISTS public.saved_products (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_diaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_products ENABLE ROW LEVEL SECURITY;

-- Allow public read of verified products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public products viewable by everyone" ON public.products FOR SELECT USING (true);

