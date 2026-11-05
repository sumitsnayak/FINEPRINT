import sqlite3
import json

conn = sqlite3.connect('backend/labellens.db')
c = conn.cursor()

# 1. Kurkure (RED - 4.2 Score)
c.execute("""
INSERT OR REPLACE INTO products (
    barcode, name, brand, category, image_url, package_weight, serving_size,
    ingredients_text, allergens_declared, nutrition_per_100g, nutrition_per_serving,
    overall_rating, safety_score, nutrition_score, concern_level, rating_factors,
    source, is_verified, data_confidence, manufacturer, fssai_license
) VALUES (
    '8901491101833',
    'Kurkure Masala Munch',
    'Kurkure (PepsiCo)',
    'Namkeen & Snacks',
    'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80',
    '85g',
    '30g',
    'Rice Meal, Edible Vegetable Oil (Palmolein), Corn Meal, Gram Meal, Spices and Condiments, Iodised Salt, Flavour Enhancers (INS 627, INS 631), Antioxidant (INS 319)',
    '["Contains Soy"]',
    '{"calories": 560, "total_sugar": 2.5, "sodium": 980, "total_fat": 36.0, "saturated_fat": 16.5}',
    '{"calories": 168}',
    4.2,
    3.8,
    4.5,
    'high',
    '{"positive": ["Zero trans-fat declaration", "FSSAI registered plant"], "negative": ["Contains artificial flavour enhancers INS 627 and INS 631", "High saturated palm oil content (16.5g/100g)", "Excessive sodium exceeding single-snack threshold (980mg)"], "verdict": "High safety and nutritional concern due to deep frying in palmolein and artificial chemical flavour enhancers."}',
    'verified_label',
    1,
    0.95,
    'PepsiCo India Holdings Pvt. Ltd.',
    '10014064000435'
)
""")

# 2. Sting Energy Drink (RED - 3.4 Score)
c.execute("""
INSERT OR REPLACE INTO products (
    barcode, name, brand, category, image_url, package_weight, serving_size,
    ingredients_text, allergens_declared, nutrition_per_100g, nutrition_per_serving,
    overall_rating, safety_score, nutrition_score, concern_level, rating_factors,
    source, is_verified, data_confidence, manufacturer, fssai_license
) VALUES (
    '8902080000018',
    'Sting Caffeinated Energy Drink',
    'Sting (PepsiCo)',
    'Beverages & Energy Drinks',
    'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
    '250ml',
    '250ml',
    'Carbonated Water, Sugar, Acidity Regulators (INS 330, INS 331), Taurine, Caffeine (72mg), Preservatives (INS 211, INS 202), Inositol, Vitamins, Colour (INS 129 Red 40)',
    '["High caffeine content: Not recommended for children, pregnant women"]',
    '{"calories": 115, "total_sugar": 29.0, "sodium": 85, "total_fat": 0.0, "saturated_fat": 0.0}',
    '{"calories": 115}',
    3.4,
    3.0,
    3.8,
    'high',
    '{"positive": ["Contains B-complex vitamins (B3, B6, B12)"], "negative": ["Extreme added sugar content (29g in 250ml)", "Contains controversial artificial azo-dye Allura Red (INS 129)", "High caffeine concentration (72mg per can)"], "verdict": "Not recommended for daily consumption due to severe sugar overload and synthetic color additives."}',
    'verified_label',
    1,
    0.98,
    'Varun Beverages Limited / PepsiCo India',
    '10012011000120'
)
""")

# 3. True Elements Rolled Oats (GREEN - 9.4 Score)
c.execute("""
INSERT OR REPLACE INTO products (
    barcode, name, brand, category, image_url, package_weight, serving_size,
    ingredients_text, allergens_declared, nutrition_per_100g, nutrition_per_serving,
    overall_rating, safety_score, nutrition_score, concern_level, rating_factors,
    source, is_verified, data_confidence, manufacturer, fssai_license
) VALUES (
    '8906074710014',
    'True Elements 100% Whole Rolled Oats',
    'True Elements',
    'Breakfast Cereals',
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
    '500g',
    '40g',
    '100% Whole Grain Rolled Oats',
    '["Contains Gluten. May contain traces of tree nuts."]',
    '{"calories": 389, "total_sugar": 0.0, "sodium": 4, "total_fat": 6.8, "saturated_fat": 1.2, "protein": 13.0, "fiber": 10.5}',
    '{"calories": 155}',
    9.4,
    9.8,
    9.2,
    'low',
    '{"positive": ["100% single whole grain ingredient with zero additives", "Zero added sugar and naturally rich in beta-glucan fiber", "Certified non-GMO and FSSAI clean label"], "negative": [], "verdict": "Exceptional whole-food rating with clean nutritional profile and zero preservatives."}',
    'verified_label',
    1,
    0.99,
    'HW Wellness Solutions Pvt. Ltd.',
    '10019022009855'
)
""")

conn.commit()
print("All demonstration products inserted successfully!")
conn.close()

