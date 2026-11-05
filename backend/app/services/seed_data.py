"""
LabelLens Seed Data
Authentic Indian packaged food database with barcodes, ingredients, FSSAI info, and nutritional facts.
"""

import json
from sqlalchemy.orm import Session
from app.models.product import Product, Ingredient
from app.models.user import User, UserProfile
from app.services.ingredient_engine import analyze_full_ingredient_text
from app.services.rating_engine import calculate_comprehensive_rating
import bcrypt

INITIAL_PRODUCTS = [
    {
        "barcode": "8901058852345",
        "name": "Maggi 2-Minute Masala Instant Noodles",
        "brand": "Nestlé",
        "category": "Noodles & Pasta",
        "image_url": "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80",
        "package_weight": "70g",
        "serving_size": "70g (1 pack)",
        "ingredients_text": (
            "Refined wheat flour (Maida), Palm oil, Iodised salt, Wheat gluten, Mineral (Calcium carbonate), "
            "Thickeners (INS 508 & INS 412), Acidity regulators (INS 501(i) & INS 500(i)) and Humectant (INS 451(i)). "
            "Masala Tastemaker: Hydrolysed groundnut protein, Mixed spices (Onion powder, Coriander powder, Turmeric powder, "
            "Chilli powder, Cumin powder), Noodle powder, Sugar, Edible starch, Flavour enhancer (INS 635), Palm oil, Thickener (INS 508)."
        ),
        "allergens_declared": json.dumps(["Wheat", "Peanut", "May contain Milk and Soy"]),
        "nutrition_per_100g": json.dumps({
            "calories": 427.0,
            "protein": 8.0,
            "carbs": 63.5,
            "total_sugar": 2.2,
            "added_sugar": 1.0,
            "total_fat": 15.7,
            "saturated_fat": 6.8,
            "trans_fat": 0.1,
            "fiber": 3.6,
            "sodium": 850.0
        }),
        "nutrition_per_serving": json.dumps({
            "calories": 299.0,
            "protein": 5.6,
            "carbs": 44.5,
            "total_sugar": 1.5,
            "added_sugar": 0.7,
            "total_fat": 11.0,
            "saturated_fat": 4.8,
            "trans_fat": 0.07,
            "fiber": 2.5,
            "sodium": 595.0
        }),
        "source": "verified_label",
        "is_verified": True,
        "manufacturer": "Nestlé India Ltd.",
        "fssai_license": "10012011000168"
    },
    {
        "barcode": "8901719101018",
        "name": "Parle-G Original Gluco Biscuits",
        "brand": "Parle",
        "category": "Biscuits & Cookies",
        "image_url": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80",
        "package_weight": "130g",
        "serving_size": "25g (about 5 biscuits)",
        "ingredients_text": (
            "Refined Wheat Flour (Maida) (67%), Sugar (23.5%), Refined Palm Oil, Invert Sugar Syrup, "
            "Raising Agents (INS 503(ii), INS 500(ii)), Iodised Salt, Milk Solids (0.6%), "
            "Emulsifiers (INS 322 from Soy) and Dough Conditioner (INS 223)."
        ),
        "allergens_declared": json.dumps(["Wheat", "Milk", "Soy", "Sulphites"]),
        "nutrition_per_100g": json.dumps({
            "calories": 465.0,
            "protein": 6.5,
            "carbs": 78.0,
            "total_sugar": 26.5,
            "added_sugar": 24.0,
            "total_fat": 14.0,
            "saturated_fat": 6.5,
            "trans_fat": 0.0,
            "fiber": 1.5,
            "sodium": 280.0
        }),
        "nutrition_per_serving": json.dumps({
            "calories": 116.0,
            "protein": 1.6,
            "carbs": 19.5,
            "total_sugar": 6.6,
            "added_sugar": 6.0,
            "total_fat": 3.5,
            "saturated_fat": 1.6,
            "trans_fat": 0.0,
            "fiber": 0.4,
            "sodium": 70.0
        }),
        "source": "verified_label",
        "is_verified": True,
        "manufacturer": "Parle Products Pvt. Ltd.",
        "fssai_license": "10013022002253"
    },
    {
        "barcode": "8901491101826",
        "name": "Lay's India's Magic Masala Potato Chips",
        "brand": "Lay's (PepsiCo)",
        "category": "Chips & Crisps",
        "image_url": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80",
        "package_weight": "50g",
        "serving_size": "30g",
        "ingredients_text": (
            "Potato (52%), Edible Vegetable Oil (Palmolein, Rice Bran Oil), Seasoning (Spices and Condiments, "
            "Iodised Salt, Maltodextrin, Black Salt, Sugar, Tomato Powder, Acidity Regulators (INS 330, INS 296), "
            "Flavour Enhancers (INS 627, INS 631), Anticaking Agent (INS 551), Antioxidant (INS 319))."
        ),
        "allergens_declared": json.dumps(["Contains Added Flavour", "May contain Milk"]),
        "nutrition_per_100g": json.dumps({
            "calories": 544.0,
            "protein": 6.9,
            "carbs": 52.8,
            "total_sugar": 3.5,
            "added_sugar": 1.5,
            "total_fat": 33.7,
            "saturated_fat": 15.0,
            "trans_fat": 0.1,
            "fiber": 4.2,
            "sodium": 790.0
        }),
        "nutrition_per_serving": json.dumps({
            "calories": 163.0,
            "protein": 2.1,
            "carbs": 15.8,
            "total_sugar": 1.0,
            "added_sugar": 0.5,
            "total_fat": 10.1,
            "saturated_fat": 4.5,
            "trans_fat": 0.03,
            "fiber": 1.3,
            "sodium": 237.0
        }),
        "source": "verified_label",
        "is_verified": True,
        "manufacturer": "PepsiCo India Holdings Pvt. Ltd.",
        "fssai_license": "10014064000435"
    },
    {
        "barcode": "8901262010054",
        "name": "Amul Pasteurised Salted Butter",
        "brand": "Amul",
        "category": "Dairy & Spreads",
        "image_url": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80",
        "package_weight": "100g",
        "serving_size": "10g",
        "ingredients_text": "Butter (Milk Fat 80%), Common Salt, Permitted Natural Colour (INS 160a(i) Annatto).",
        "allergens_declared": json.dumps(["Milk"]),
        "nutrition_per_100g": json.dumps({
            "calories": 722.0,
            "protein": 0.5,
            "carbs": 0.0,
            "total_sugar": 0.0,
            "added_sugar": 0.0,
            "total_fat": 80.0,
            "saturated_fat": 51.0,
            "trans_fat": 1.8,
            "fiber": 0.0,
            "sodium": 830.0
        }),
        "nutrition_per_serving": json.dumps({
            "calories": 72.0,
            "protein": 0.05,
            "carbs": 0.0,
            "total_sugar": 0.0,
            "added_sugar": 0.0,
            "total_fat": 8.0,
            "saturated_fat": 5.1,
            "trans_fat": 0.18,
            "fiber": 0.0,
            "sodium": 83.0
        }),
        "source": "verified_label",
        "is_verified": True,
        "manufacturer": "Gujarat Co-operative Milk Marketing Federation Ltd.",
        "fssai_license": "10012021000071"
    },
    {
        "barcode": "8901030383119",
        "name": "Kissan Fresh Tomato Ketchup",
        "brand": "Kissan (Hindustan Unilever)",
        "category": "Sauces & Condiments",
        "image_url": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80",
        "package_weight": "200g",
        "serving_size": "15g",
        "ingredients_text": (
            "Water, Tomato Paste (26%), Sugar, Salt, Acidity Regulator (INS 260), "
            "Thickeners (INS 1422, INS 415), Spices and Condiments, Preservative (INS 211)."
        ),
        "allergens_declared": json.dumps(["None declared"]),
        "nutrition_per_100g": json.dumps({
            "calories": 142.0,
            "protein": 1.2,
            "carbs": 33.6,
            "total_sugar": 28.5,
            "added_sugar": 24.0,
            "total_fat": 0.2,
            "saturated_fat": 0.05,
            "trans_fat": 0.0,
            "fiber": 1.0,
            "sodium": 890.0
        }),
        "nutrition_per_serving": json.dumps({
            "calories": 21.0,
            "protein": 0.18,
            "carbs": 5.0,
            "total_sugar": 4.3,
            "added_sugar": 3.6,
            "total_fat": 0.03,
            "saturated_fat": 0.0,
            "trans_fat": 0.0,
            "fiber": 0.15,
            "sodium": 133.0
        }),
        "source": "verified_label",
        "is_verified": True,
        "manufacturer": "Hindustan Unilever Limited",
        "fssai_license": "10013022001897"
    },
    {
        "barcode": "8904004400588",
        "name": "Haldiram's Nagpur Aloo Bhujia",
        "brand": "Haldiram's",
        "category": "Namkeen & Snacks",
        "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80",
        "package_weight": "150g",
        "serving_size": "30g",
        "ingredients_text": (
            "Potatoes (44%), Edible Vegetable Oil (Cottonseed, Corn and Palmolein Oil), "
            "Gram Pulse Flour (15%), Tepary Bean Flour (5%), Edible Starch, Iodised Salt, "
            "Spices and Condiments (Red Chilli Powder, Black Pepper Powder, Clove Powder, Cardamom Powder, "
            "Garlic Powder, Onion Powder), Acidity Regulator (INS 330)."
        ),
        "allergens_declared": json.dumps(["Contains Nut traces and Gluten"]),
        "nutrition_per_100g": json.dumps({
            "calories": 578.0,
            "protein": 8.5,
            "carbs": 42.0,
            "total_sugar": 1.8,
            "added_sugar": 0.0,
            "total_fat": 42.0,
            "saturated_fat": 17.5,
            "trans_fat": 0.1,
            "fiber": 5.0,
            "sodium": 760.0
        }),
        "nutrition_per_serving": json.dumps({
            "calories": 173.0,
            "protein": 2.5,
            "carbs": 12.6,
            "total_sugar": 0.5,
            "added_sugar": 0.0,
            "total_fat": 12.6,
            "saturated_fat": 5.2,
            "trans_fat": 0.03,
            "fiber": 1.5,
            "sodium": 228.0
        }),
        "source": "verified_label",
        "is_verified": True,
        "manufacturer": "Haldiram Foods International Pvt. Ltd.",
        "fssai_license": "10012022000308"
    },
    {
        "barcode": "8901207010118",
        "name": "Real Fruit Power Mixed Fruit Juice",
        "brand": "Dabur Real",
        "category": "Beverages & Juices",
        "image_url": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80",
        "package_weight": "1L",
        "serving_size": "200ml",
        "ingredients_text": (
            "Water, Mixed Fruit Concentrate (18.1%) [Apple Juice Concentrate (9%), Orange Juice Concentrate (4.6%), "
            "Guava Puree (1.8%), Mango Pulp (1.5%), Banana Puree, Apricot Puree, Peach Puree], Sugar, "
            "Acidity Regulator (INS 330), Antioxidant (INS 300), Stabilizer (INS 440)."
        ),
        "allergens_declared": json.dumps(["None declared"]),
        "nutrition_per_100g": json.dumps({
            "calories": 56.0,
            "protein": 0.4,
            "carbs": 13.5,
            "total_sugar": 13.0,
            "added_sugar": 8.5,
            "total_fat": 0.0,
            "saturated_fat": 0.0,
            "trans_fat": 0.0,
            "fiber": 0.2,
            "sodium": 15.0
        }),
        "nutrition_per_serving": json.dumps({
            "calories": 112.0,
            "protein": 0.8,
            "carbs": 27.0,
            "total_sugar": 26.0,
            "added_sugar": 17.0,
            "total_fat": 0.0,
            "saturated_fat": 0.0,
            "trans_fat": 0.0,
            "fiber": 0.4,
            "sodium": 30.0
        }),
        "source": "verified_label",
        "is_verified": True,
        "manufacturer": "Dabur India Limited",
        "fssai_license": "10012011000618"
    },
    {
        "barcode": "8906079980123",
        "name": "Epigamia Greek Yogurt Natural (No Added Sugar)",
        "brand": "Epigamia",
        "category": "Dairy & Spreads",
        "image_url": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80",
        "package_weight": "85g",
        "serving_size": "85g (1 cup)",
        "ingredients_text": "Pasteurised Double Toned Milk, Active Live Cultures (Streptococcus thermophilus, Lactobacillus bulgaricus).",
        "allergens_declared": json.dumps(["Milk"]),
        "nutrition_per_100g": json.dumps({
            "calories": 78.0,
            "protein": 7.5,
            "carbs": 4.5,
            "total_sugar": 4.5,
            "added_sugar": 0.0,
            "total_fat": 3.0,
            "saturated_fat": 1.9,
            "trans_fat": 0.0,
            "fiber": 0.0,
            "sodium": 45.0
        }),
        "nutrition_per_serving": json.dumps({
            "calories": 66.0,
            "protein": 6.4,
            "carbs": 3.8,
            "total_sugar": 3.8,
            "added_sugar": 0.0,
            "total_fat": 2.5,
            "saturated_fat": 1.6,
            "trans_fat": 0.0,
            "fiber": 0.0,
            "sodium": 38.0
        }),
        "source": "verified_label",
        "is_verified": True,
        "manufacturer": "Drums Food International Pvt. Ltd.",
        "fssai_license": "10019022009876"
    }
]

def seed_database(db: Session):
    """
    Seeds initial verified Indian food products, admin account, and ingredient database.
    """
    # 1. Seed Admin User
    for admin_email in ["admin@labellens.com", "admin@fineprint.com"]:
        existing_admin = db.query(User).filter(User.email == admin_email).first()
        if not existing_admin:
            salt = bcrypt.gensalt()
            hashed = bcrypt.hashpw(b"AdminPassword2026!", salt).decode('utf-8')
            admin = User(
                email=admin_email,
                full_name="FINEPRINT Safety Officer",
                hashed_password=hashed,
                role="admin",
                is_active=True
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)
            
            # Admin Profile
            admin_profile = UserProfile(
                user_id=admin.id,
                age=32,
                gender="Other",
                height_cm=175.0,
                weight_kg=70.0,
                activity_level="moderate",
                dietary_preferences=json.dumps(["vegetarian"]),
                allergies=json.dumps([]),
                target_calories=2100.0,
                target_protein=75.0,
                target_carbs=260.0,
                target_fat=60.0,
                target_sugar=25.0,
                target_sodium=2000.0
            )
            db.add(admin_profile)
            db.commit()

    # 2. Seed Demo User
    for demo_email in ["demo@labellens.com", "demo@fineprint.com"]:
        existing_demo = db.query(User).filter(User.email == demo_email).first()
        if not existing_demo:
            salt = bcrypt.gensalt()
            hashed = bcrypt.hashpw(b"DemoUser2026!", salt).decode('utf-8')
            demo_user = User(
                email=demo_email,
                full_name="Priya Sharma",
                hashed_password=hashed,
                role="user",
                is_active=True
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)
            
            demo_profile = UserProfile(
                user_id=demo_user.id,
                age=26,
                gender="Female",
                height_cm=162.0,
                weight_kg=56.0,
                activity_level="moderate",
                dietary_preferences=json.dumps(["vegetarian"]),
                allergies=json.dumps(["Peanut", "Tree Nuts"]),
                target_calories=1850.0,
                target_protein=60.0,
                target_carbs=230.0,
                target_fat=50.0,
                target_sugar=25.0,
                target_sodium=1800.0
            )
            db.add(demo_profile)
            db.commit()

    # 3. Seed Products
    for p_data in INITIAL_PRODUCTS:
        existing = db.query(Product).filter(Product.barcode == p_data["barcode"]).first()
        if not existing:
            # Precompute scientific score
            nutr = json.loads(p_data["nutrition_per_100g"])
            ing_analysis = analyze_full_ingredient_text(p_data["ingredients_text"])
            rating = calculate_comprehensive_rating(
                ingredient_analysis=ing_analysis,
                nutrition_facts=nutr,
                has_fssai_license=bool(p_data.get("fssai_license"))
            )
            
            product = Product(
                barcode=p_data["barcode"],
                name=p_data["name"],
                brand=p_data["brand"],
                category=p_data["category"],
                image_url=p_data["image_url"],
                package_weight=p_data["package_weight"],
                serving_size=p_data["serving_size"],
                ingredients_text=p_data["ingredients_text"],
                allergens_declared=p_data["allergens_declared"],
                nutrition_per_100g=p_data["nutrition_per_100g"],
                nutrition_per_serving=p_data["nutrition_per_serving"],
                overall_rating=rating["overall_score"],
                safety_score=rating["safety_score"],
                nutrition_score=rating["nutrition_score"],
                concern_level=rating["concern_level"],
                rating_factors=json.dumps({
                    "positive": rating["factors_positive"],
                    "negative": rating["factors_negative"],
                    "verdict": rating["summary_verdict"]
                }),
                source=p_data["source"],
                is_verified=p_data["is_verified"],
                data_confidence=rating["data_confidence"],
                manufacturer=p_data["manufacturer"],
                fssai_license=p_data["fssai_license"]
            )
            db.add(product)
            db.commit()

