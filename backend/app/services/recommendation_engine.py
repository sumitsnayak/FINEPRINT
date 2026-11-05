"""
LabelLens Healthier Alternatives Engine
Finds and ranks category-specific healthier options respecting user allergies & diets.
"""

from typing import List, Dict, Any, Optional

HEALTHIER_ALTERNATIVES_CATALOG = [
    # Noodles / Quick Meals
    {
        "category": "Noodles & Pasta",
        "name": "Slurrp Farm Foxtail Millet Noodles",
        "brand": "Slurrp Farm",
        "image_url": "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=300&q=80",
        "overall_score": 8.4,
        "nutrition_per_100g": {"calories": 360, "protein": 11.2, "carbs": 68.0, "total_fat": 3.5, "fiber": 7.5, "sodium": 320},
        "why_better": "Made from whole millets instead of refined maida. Not deep-fried (air-dried), contains 50% less fat and 3x more dietary fiber.",
        "allergens": ["Gluten"],
        "dietary_compatibility": {"vegetarian": True, "vegan": True}
    },
    {
        "category": "Noodles & Pasta",
        "name": "WickedGud 100% Whole Wheat & Chickpea Noodles",
        "brand": "WickedGud",
        "image_url": "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=300&q=80",
        "overall_score": 8.1,
        "nutrition_per_100g": {"calories": 355, "protein": 14.0, "carbs": 66.0, "total_fat": 2.8, "fiber": 9.0, "sodium": 290},
        "why_better": "No palm oil, zero maida, boosted with chickpea protein and lentils. Air-dried rather than oil-fried.",
        "allergens": ["Wheat"],
        "dietary_compatibility": {"vegetarian": True, "vegan": True}
    },
    # Chips & Savory Snacks
    {
        "category": "Chips & Crisps",
        "name": "Farmley Roasted Peri Peri Makhana (Fox Nuts)",
        "brand": "Farmley",
        "image_url": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&q=80",
        "overall_score": 8.8,
        "nutrition_per_100g": {"calories": 390, "protein": 9.5, "carbs": 64.0, "total_fat": 10.0, "saturated_fat": 1.8, "trans_fat": 0.0, "sodium": 380},
        "why_better": "Slow roasted instead of deep fried in palm oil. Zero trans fat, 70% less saturated fat than potato chips, rich in magnesium and antioxidants.",
        "allergens": [],
        "dietary_compatibility": {"vegetarian": True, "vegan": True}
    },
    {
        "category": "Chips & Crisps",
        "name": "The Whole Truth Multigrain Baked Crisps",
        "brand": "The Whole Truth",
        "image_url": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=300&q=80",
        "overall_score": 8.2,
        "nutrition_per_100g": {"calories": 410, "protein": 8.5, "carbs": 62.0, "total_fat": 12.0, "saturated_fat": 2.2, "trans_fat": 0.0, "sodium": 420},
        "why_better": "Baked with cold-pressed sunflower oil. Contains no synthetic flavor enhancers (no MSG/E627/E631), no maltodextrin, and clean transparent spices.",
        "allergens": [],
        "dietary_compatibility": {"vegetarian": True, "vegan": True}
    },
    # Biscuits & Cookies
    {
        "category": "Biscuits & Cookies",
        "name": "Early Foods Ragi & Almond Jaggery Cookies",
        "brand": "Early Foods",
        "image_url": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=300&q=80",
        "overall_score": 8.6,
        "nutrition_per_100g": {"calories": 420, "protein": 9.0, "carbs": 60.0, "total_sugar": 14.0, "added_sugar": 0.0, "total_fat": 16.0, "sodium": 80},
        "why_better": "100% whole grain organic ragi (finger millet) and real butter. Sweetened with natural unrefined jaggery. Zero refined white sugar, zero palm oil, zero preservatives.",
        "allergens": ["Milk", "Tree Nuts"],
        "dietary_compatibility": {"vegetarian": True, "vegan": False}
    },
    # Sweetened Beverages & Juices
    {
        "category": "Beverages & Juices",
        "name": "Raw Pressery Tender Coconut Water (100% Pure)",
        "brand": "Raw Pressery",
        "image_url": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=300&q=80",
        "overall_score": 9.4,
        "nutrition_per_100g": {"calories": 20, "protein": 0.5, "carbs": 4.8, "total_sugar": 4.2, "added_sugar": 0.0, "total_fat": 0.0, "sodium": 25},
        "why_better": "Naturally isotonic with zero added sugar, no artificial colors, no preservatives, and naturally rich in potassium and hydration electrolytes.",
        "allergens": [],
        "dietary_compatibility": {"vegetarian": True, "vegan": True}
    },
    # Breakfast Cereals
    {
        "category": "Breakfast Cereals",
        "name": "True Elements Rolled Oats & Seeds Mix",
        "brand": "True Elements",
        "image_url": "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=300&q=80",
        "overall_score": 9.1,
        "nutrition_per_100g": {"calories": 385, "protein": 13.5, "carbs": 62.0, "total_sugar": 1.2, "added_sugar": 0.0, "total_fat": 8.0, "fiber": 10.5, "sodium": 15},
        "why_better": "100% whole grain oats with pumpkin and chia seeds. Zero added sugar or syrups, high in beta-glucan soluble fiber that helps lower LDL cholesterol.",
        "allergens": ["Oats"],
        "dietary_compatibility": {"vegetarian": True, "vegan": True}
    }
]

def find_healthier_alternatives(
    current_product: Dict[str, Any],
    user_profile: Optional[Dict[str, Any]] = None,
    limit: int = 3
) -> List[Dict[str, Any]]:
    """
    Identifies healthier alternatives within the same or adjacent product category,
    strictly filtering out user allergens.
    """
    category = current_product.get("category", "").lower()
    product_name = current_product.get("name", "").lower()
    current_score = current_product.get("overall_score", 5.0)
    
    user_allergies = [a.lower() for a in (user_profile.get("allergies", []) if user_profile else [])]
    user_diets = [d.lower() for d in (user_profile.get("dietary_preferences", []) if user_profile else [])]
    
    matches = []
    
    for alt in HEALTHIER_ALTERNATIVES_CATALOG:
        alt_category = alt["category"].lower()
        alt_name = alt["name"].lower()
        
        # Don't suggest the exact same product
        if alt_name in product_name or product_name in alt_name:
            continue
            
        # Match category or broad keywords (noodles, chips, biscuits, juice)
        is_category_match = (
            alt_category in category or category in alt_category or
            ("noodle" in product_name and "noodle" in alt_category) or
            ("chip" in product_name and "chip" in alt_category) or
            ("biscuit" in product_name and "biscuit" in alt_category) or
            ("juice" in product_name and "juice" in alt_category)
        )
        
        if not is_category_match:
            continue
            
        # Check allergy safety (NEVER recommend conflicting allergen)
        has_allergen_conflict = False
        for alt_allergen in alt.get("allergens", []):
            for ua in user_allergies:
                if ua in alt_allergen.lower() or alt_allergen.lower() in ua:
                    has_allergen_conflict = True
                    break
            if has_allergen_conflict:
                break
                
        if has_allergen_conflict:
            continue
            
        # Check dietary preference (veg / vegan)
        compat = alt.get("dietary_compatibility", {})
        if "vegetarian" in user_diets and not compat.get("vegetarian", True):
            continue
        if "vegan" in user_diets and not compat.get("vegan", True):
            continue
            
        matches.append(alt)
        
    # If no specific category match, pick generally high-scoring clean options
    if not matches:
        for alt in HEALTHIER_ALTERNATIVES_CATALOG:
            # Check allergens
            conflict = any(ua in a.lower() for a in alt.get("allergens", []) for ua in user_allergies)
            if not conflict:
                matches.append(alt)
                if len(matches) >= limit:
                    break
                    
    # Sort by overall score descending
    matches.sort(key=lambda x: x.get("overall_score", 0), reverse=True)
    return matches[:limit]

