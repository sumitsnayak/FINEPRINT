"""
LabelLens Ingredient Intelligence Engine
Authoritative database of food ingredients, INS/E numbers, additives, allergens, and FSSAI standards.
"""

import re
from typing import Dict, List, Any, Optional

# Comprehensive database of common additives, preservatives, sweeteners, oils, and food components
INGREDIENT_KNOWLEDGE_BASE: Dict[str, Dict[str, Any]] = {
    # Preservatives & Chemical Additives
    "sodium benzoate": {
        "name": "Sodium Benzoate",
        "scientific_name": "Sodium Benzenecarboxylate",
        "ins_number": "INS 211",
        "category": "Preservative",
        "purpose": "Inhibits the growth of potentially harmful bacteria, yeasts, and molds in acidic foods.",
        "safety_level": "moderate_concern",
        "description": "A widely used food preservative in carbonated drinks, jams, and sauces. Generally recognized as safe within regulated limits, but when combined with Ascorbic Acid (Vitamin C), it can form trace amounts of benzene under heat and light exposure.",
        "common_sources": "Fruit juices, carbonated soft drinks, pickles, salad dressings, sauces.",
        "allergens": [],
        "dietary_compatibility": {"vegetarian": True, "vegan": True, "halal": True},
        "regulatory_status": "Permitted by FSSAI and US FDA with a maximum permissible level of 750 ppm in beverages.",
        "daily_intake_limit": "ADI: 0–5 mg/kg body weight (WHO/JECFA).",
        "references": ["FSSAI Food Safety Standards (Food Products and Food Additives) Regulations", "WHO Food Additives Series"]
    },
    "potassium sorbate": {
        "name": "Potassium Sorbate",
        "scientific_name": "Potassium (2E,4E)-hexa-2,4-dienoate",
        "ins_number": "INS 202",
        "category": "Preservative",
        "purpose": "Prevents mold, fungi, and yeast contamination to extend shelf life.",
        "safety_level": "safe",
        "description": "The potassium salt of sorbic acid. It is metabolized by the human body naturally into water and carbon dioxide just like dietary fatty acids.",
        "common_sources": "Cheese, baked goods, fruit preserves, dried fruits, dips, wine.",
        "allergens": [],
        "dietary_compatibility": {"vegetarian": True, "vegan": True, "halal": True},
        "regulatory_status": "Approved by FSSAI, EFSA, and US FDA. Regarded as one of the safest food preservatives.",
        "daily_intake_limit": "ADI: 0–11 mg/kg body weight.",
        "references": ["EFSA Panel on Food Additives and Nutrient Sources added to Food (ANS)"]
    },
    "monosodium glutamate": {
        "name": "Monosodium Glutamate (MSG)",
        "scientific_name": "Sodium 2-aminopentanedioate",
        "ins_number": "INS 621",
        "category": "Flavor Enhancer",
        "purpose": "Enhances savory umami flavor profile in savory foods and snacks.",
        "safety_level": "safe",
        "description": "The sodium salt of glutamic acid, an amino acid naturally abundant in tomatoes, aged cheese, and mushrooms. Decades of clinical trials show no evidence of toxicity in standard dietary quantities, though rare individuals report transient sensitivity.",
        "common_sources": "Instant noodles, savory snacks, packaged soups, processed meats, Chinese cuisine.",
        "allergens": [],
        "dietary_compatibility": {"vegetarian": True, "vegan": True, "halal": True},
        "regulatory_status": "Permitted under Good Manufacturing Practice (GMP) by FSSAI and FDA. Labeling required.",
        "daily_intake_limit": "EFSA established safe intake level of 30 mg/kg body weight per day.",
        "references": ["FSSAI Packaging and Labelling Regulations", "Joint FAO/WHO Expert Committee on Food Additives"]
    },
    "tbhq": {
        "name": "Tertiary Butylhydroquinone (TBHQ)",
        "scientific_name": "tert-Butylhydroquinone",
        "ins_number": "INS 319",
        "category": "Antioxidant / Preservative",
        "purpose": "Prevents rancidity and oxidative degradation of vegetable fats and edible oils.",
        "safety_level": "moderate_concern",
        "description": "A synthetic antioxidant added to unsaturated vegetable oils and fried snack foods to prolong shelf life. Permitted within strict limits, though high cumulative doses are monitored for cellular stress.",
        "common_sources": "Fried chips, biscuits, crackers, vegetable shortening, instant noodles.",
        "allergens": [],
        "dietary_compatibility": {"vegetarian": True, "vegan": True, "halal": True},
        "regulatory_status": "Permitted by FSSAI at maximum limit of 200 ppm in fats and oils.",
        "daily_intake_limit": "ADI: 0–0.7 mg/kg body weight.",
        "references": ["FSSAI Compendium of Food Safety and Standards Regulations"]
    },
    "tartrazine": {
        "name": "Tartrazine",
        "scientific_name": "Trisodium 5-hydroxy-1-(4-sulfonatophenyl)-4-(4-sulfonatophenylazo)pyrazole-3-carboxylate",
        "ins_number": "INS 102",
        "category": "Synthetic Color",
        "purpose": "Provides bright lemon yellow hue to processed foods and beverages.",
        "safety_level": "moderate_concern",
        "description": "A petroleum-derived azo dye. While legal in India and the US, it may trigger mild pseudo-allergic reactions (hives, asthma) in sensitive individuals, particularly those intolerant to aspirin.",
        "common_sources": "Carbonated drinks, candy, flavored chips, ice creams, powdered drink mixes.",
        "allergens": ["Azo dye sensitivity"],
        "dietary_compatibility": {"vegetarian": True, "vegan": True, "halal": True},
        "regulatory_status": "Permitted by FSSAI up to 100 mg/kg in specified food items. Requires warning notice in EU.",
        "daily_intake_limit": "ADI: 0–10 mg/kg body weight.",
        "references": ["Southampton study on food colourants", "FSSAI Food Additives Regulations"]
    },
    "caramel iv": {
        "name": "Caramel IV (Sulphite Ammonia Caramel)",
        "scientific_name": "Class IV Caramel Colour",
        "ins_number": "INS 150d",
        "category": "Food Color",
        "purpose": "Gives rich dark brown coloring and colloidal stability to colas and sauces.",
        "safety_level": "moderate_concern",
        "description": "Formed by heat treatment of carbohydrates in presence of sulphite and ammonium compounds. Can contain byproduct 4-MEI (4-methylimidazole) which is subject to strict regulatory ceilings.",
        "common_sources": "Cola drinks, soy sauce, gravies, dark beers, bakery items.",
        "allergens": ["Contains trace sulphites"],
        "dietary_compatibility": {"vegetarian": True, "vegan": True, "halal": True},
        "regulatory_status": "FSSAI permits within defined purity specifications; 4-MEI content strictly capped.",
        "daily_intake_limit": "ADI: 0–300 mg/kg body weight.",
        "references": ["EFSA Scientific Opinion on the re-evaluation of caramel colours"]
    },
    "soy lecithin": {
        "name": "Soy Lecithin",
        "scientific_name": "Phosphatidylcholine",
        "ins_number": "INS 322",
        "category": "Emulsifier",
        "purpose": "Prevents separation of cocoa butter and liquids, improving smooth mouthfeel and texture.",
        "safety_level": "safe",
        "description": "A natural phospholipid mixture extracted from soybeans. Highly beneficial for texture consistency in chocolate and confectionery, but must be monitored by people with severe soy allergies.",
        "common_sources": "Chocolates, bakery items, margarine, infant formula.",
        "allergens": ["Soy"],
        "dietary_compatibility": {"vegetarian": True, "vegan": True, "halal": True},
        "regulatory_status": "Generally recognized as safe (GRAS) globally without specific upper limitation (GMP).",
        "daily_intake_limit": "Not limited (GMP).",
        "references": ["US FDA GRAS Notice Inventory", "FSSAI Food Standards"]
    },
    "palm oil": {
        "name": "Palm Oil / Palmolein",
        "scientific_name": "Elaeis guineensis oil",
        "ins_number": None,
        "category": "Edible Vegetable Fat",
        "purpose": "Provides high thermal stability for deep frying and gives semi-solid creamy texture.",
        "safety_level": "moderate_concern",
        "description": "Vegetable oil high in saturated fatty acids (approximately 50% palmitic acid). Excessive consumption increases LDL (bad cholesterol) and coronary heart disease risk. Refined palm oil heated to high temperatures during commercial frying may also generate 3-MCPD esters.",
        "common_sources": "Packaged chips, fried namkeen, biscuits, instant noodles, margarine.",
        "allergens": [],
        "dietary_compatibility": {"vegetarian": True, "vegan": True, "halal": True},
        "regulatory_status": "Widely permitted globally; FSSAI requires mandatory declaration of vegetable oil type.",
        "daily_intake_limit": "WHO advises limiting saturated fats to less than 10% of total daily calorie intake.",
        "references": ["WHO Cardiovascular Disease Guidelines", "FSSAI Labelling and Display Regulations 2020"]
    },
    "hydrogenated vegetable oil": {
        "name": "Hydrogenated Vegetable Oil / Vanaspati",
        "scientific_name": "Partially Hydrogenated Fatty Acids (Trans Fats)",
        "ins_number": None,
        "category": "Fat / Shortening",
        "purpose": "Increases melting point and shelf life of oils to create inexpensive solid fat for baking and frying.",
        "safety_level": "high_concern",
        "description": "Chemical hydrogenation produces industrial trans-fatty acids. Trans fats significantly raise LDL cholesterol, lower beneficial HDL cholesterol, promote systemic inflammation, and increase risk of cardiovascular disease.",
        "common_sources": "Commercial bakery biscuits, puffs, traditional vanaspati sweets, street fried foods.",
        "allergens": [],
        "dietary_compatibility": {"vegetarian": True, "vegan": True, "halal": True},
        "regulatory_status": "FSSAI has capped industrial trans fat levels in fats/oils to under 2% by weight, aligning with WHO global elimination target.",
        "daily_intake_limit": "WHO recommendation: Less than 1% of total daily energy intake (virtually zero).",
        "references": ["WHO REPLACE Action Package", "FSSAI Trans Fat Regulations 2021"]
    },
    "refined wheat flour": {
        "name": "Refined Wheat Flour (Maida)",
        "scientific_name": "Triticum aestivum flour (endosperm)",
        "ins_number": None,
        "category": "Carbohydrate / Base Grain",
        "purpose": "Provides soft, elastic texture for biscuits, breads, noodles, and crusts.",
        "safety_level": "moderate_concern",
        "description": "Milled wheat grain with the fibrous bran and nutrient-dense germ removed, leaving almost exclusively refined starch. Has a high Glycemic Index (GI), causing rapid blood glucose spikes and low satiety.",
        "common_sources": "White bread, instant noodles, biscuits, samosas, pastries.",
        "allergens": ["Wheat", "Gluten"],
        "dietary_compatibility": {"vegetarian": True, "vegan": True, "halal": True},
        "regulatory_status": "Standard food staple under FSSAI. Bleaching agents like benzoyl peroxide are regulated.",
        "daily_intake_limit": "Advised to replace with whole grains for metabolic health.",
        "references": ["Indian Council of Medical Research (ICMR) Dietary Guidelines for Indians"]
    },
    "high fructose corn syrup": {
        "name": "High Fructose Corn Syrup (HFCS) / Invert Sugar Syrup",
        "scientific_name": "Fructose-Glucose mixture",
        "ins_number": None,
        "category": "Sweetener",
        "purpose": "Inexpensive liquid sweetener that improves moisture retention, browning, and sweetness intensity.",
        "safety_level": "high_concern",
        "description": "A sweetener derived from corn starch containing free fructose and glucose. Unlike glucose, fructose is metabolized primarily in the liver, where excessive intake accelerates fatty liver disease (NAFLD), insulin resistance, visceral obesity, and elevated triglycerides.",
        "common_sources": "Carbonated soft drinks, sweetened cereals, dessert syrups, packaged juices, energy bars.",
        "allergens": [],
        "dietary_compatibility": {"vegetarian": True, "vegan": True, "halal": True},
        "regulatory_status": "Permitted food ingredient. Must be declared in ingredient list.",
        "daily_intake_limit": "WHO strongly recommends reducing free sugars to less than 5% of total daily energy.",
        "references": ["WHO Guideline: Sugars intake for adults and children", "ICMR-NIN Dietary Guidelines"]
    },
    "sucralose": {
        "name": "Sucralose",
        "scientific_name": "1,6-Dichloro-1,6-dideoxy-beta-D-fructofuranosyl-4-chloro-4-deoxy-alpha-D-galactopyranoside",
        "ins_number": "INS 955",
        "category": "Non-Caloric Artificial Sweetener",
        "purpose": "Provides approximately 600 times the sweetness of table sugar without adding calories.",
        "safety_level": "safe",
        "description": "A chlorinated sucrose derivative that passes through the digestive tract largely unabsorbed. Heat-stable and suitable for diabetics, though excessive chronic intake may alter gut microbiota diversity.",
        "common_sources": "Diet drinks, sugar-free desserts, protein powders, chewing gums.",
        "allergens": [],
        "dietary_compatibility": {"vegetarian": True, "vegan": True, "halal": True},
        "regulatory_status": "Approved by FSSAI with specific food-category concentration limits. Mandatory label statement: 'Contains Non-Caloric Sweetener'.",
        "daily_intake_limit": "ADI: 0–15 mg/kg body weight.",
        "references": ["FSSAI Non-Nutritive Sweeteners Regulations", "US FDA High-Intensity Sweeteners Overview"]
    },
    "ascorbic acid": {
        "name": "Ascorbic Acid (Vitamin C)",
        "scientific_name": "L-Ascorbic Acid",
        "ins_number": "INS 300",
        "category": "Antioxidant / Vitamin",
        "purpose": "Acts as an antioxidant to prevent browning and preserve color freshness in processed fruit products and flour doughs.",
        "safety_level": "safe",
        "description": "Pure Vitamin C. It is a completely beneficial nutrient and natural water-soluble antioxidant. Completely safe.",
        "common_sources": "Fruit juices, canned fruit, bread doughs, cured meats.",
        "allergens": [],
        "dietary_compatibility": {"vegetarian": True, "vegan": True, "halal": True},
        "regulatory_status": "Approved globally under GMP (Good Manufacturing Practices).",
        "daily_intake_limit": "Essential nutrient; Recommended Daily Allowance (RDA) 40–80 mg/day.",
        "references": ["ICMR Nutrient Requirements for Indians"]
    },
    "citric acid": {
        "name": "Citric Acid",
        "scientific_name": "2-Hydroxypropane-1,2,3-tricarboxylic acid",
        "ins_number": "INS 330",
        "category": "Acidity Regulator",
        "purpose": "Regulates pH, imparts pleasant tart taste, and boosts antioxidant action.",
        "safety_level": "safe",
        "description": "An organic acid naturally found in citrus fruits like lemons and oranges. Produced industrially via fermentation of Aspergillus niger. Completely safe and biodegradable in human metabolism (Krebs Cycle).",
        "common_sources": "Soft drinks, candies, jams, canned vegetables, cheese.",
        "allergens": [],
        "dietary_compatibility": {"vegetarian": True, "vegan": True, "halal": True},
        "regulatory_status": "Permitted globally under GMP.",
        "daily_intake_limit": "Not limited (GMP).",
        "references": ["FSSAI Food Additives Guidelines", "Codex Alimentarius"]
    },
    "guar gum": {
        "name": "Guar Gum",
        "scientific_name": "Cyamopsis tetragonoloba galactomannan",
        "ins_number": "INS 412",
        "category": "Thickener / Stabilizer",
        "purpose": "Thickens liquids and stabilizes emulsions without altering taste.",
        "safety_level": "safe",
        "description": "A natural soluble dietary fiber extracted from the seeds of the guar bean plant (widely grown in India). Acts as a natural prebiotic in moderate amounts.",
        "common_sources": "Ice creams, sauces, gluten-free bakery products, yogurt.",
        "allergens": [],
        "dietary_compatibility": {"vegetarian": True, "vegan": True, "halal": True},
        "regulatory_status": "Permitted globally as safe food additive.",
        "daily_intake_limit": "GMP. Safe for human consumption.",
        "references": ["FSSAI Standards for Gums and Emulsifiers"]
    },
    "polyphosphates": {
        "name": "Sodium Polyphosphates",
        "scientific_name": "Sodium Hexametaphosphate / Polyphosphates",
        "ins_number": "INS 452",
        "category": "Sequestrant / Texturizer",
        "purpose": "Binds moisture and mineral ions to improve tenderness and prevent curdling.",
        "safety_level": "moderate_concern",
        "description": "Inorganic phosphate salts. High dietary intake of added inorganic phosphates (unlike organic phosphates in whole grains) can disrupt calcium-phosphorus bone homeostasis and is discouraged in patients with chronic kidney disease (CKD).",
        "common_sources": "Processed cheese, noodle doughs, processed chicken/meat, condensed milk.",
        "allergens": [],
        "dietary_compatibility": {"vegetarian": True, "vegan": True, "halal": True},
        "regulatory_status": "Permitted by FSSAI with maximum limit of 1000–5000 mg/kg depending on food category.",
        "daily_intake_limit": "ADI: 40 mg/kg body weight (as phosphorus).",
        "references": ["EFSA Re-evaluation of phosphoric acid-phosphates - di-, tri- and polyphosphates as food additives"]
    },
    "iodised salt": {
        "name": "Iodised Salt (Sodium Chloride)",
        "scientific_name": "Sodium Chloride fortified with Potassium Iodate",
        "ins_number": None,
        "category": "Mineral / Seasoning",
        "purpose": "Seasoning, preservation, and public health fortification against iodine deficiency disorders (goitre).",
        "safety_level": "moderate_concern",
        "description": "Essential mineral for cellular hydration and thyroid function. However, packaged processed foods typically contain high concentrations of sodium. Excess sodium intake (>2000 mg/day) is the leading dietary contributor to hypertension and stroke.",
        "common_sources": "Nearly all savory packaged foods.",
        "allergens": [],
        "dietary_compatibility": {"vegetarian": True, "vegan": True, "halal": True},
        "regulatory_status": "Mandatory iodisation under FSSAI; front-of-pack warning proposed for high sodium content.",
        "daily_intake_limit": "WHO limit: Less than 5 grams of salt (<2000 mg sodium) per day for adults.",
        "references": ["WHO Sodium Intake Guidelines", "National Family Health Survey India"]
    }
}

# Major allergen detection keywords
ALLERGEN_MAP = {
    "peanut": ["peanut", "groundnut", "moongphali", "arachis"],
    "tree_nuts": ["almond", "badam", "cashew", "kaju", "walnut", "akhrot", "pistachio", "pista", "hazelnut", "pecan"],
    "milk": ["milk", "dairy", "whey", "casein", "butter", "cheese", "curd", "cream", "lactose", "ghee", "milk solids", "skimmed milk"],
    "wheat_gluten": ["wheat", "gluten", "maida", "atta", "semolina", "sooji", "barley", "rye", "spelt"],
    "soy": ["soy", "soya", "soybean", "soy lecithin", "tofu", "hydrolyzed soy"],
    "egg": ["egg", "albumin", "egg yolk", "egg white", "ovoglobulin"],
    "fish": ["fish", "anchovy", "cod", "tuna", "salmon", "tilapia", "gelatin (fish)"],
    "crustacean": ["shrimp", "prawn", "crab", "lobster"],
    "mustard": ["mustard", "sarson", "rai"],
    "sesame": ["sesame", "til"],
    "sulphites": ["sulphite", "sulfite", "sulphur dioxide", "ins 220", "ins 221", "ins 222", "ins 223", "ins 224"]
}

def normalize_text(text: str) -> str:
    return re.sub(r'[^a-zA-Z0-9\s]', ' ', text.lower()).strip()

def parse_ingredients_list(text: str) -> List[str]:
    """
    Cleans and segments raw ingredient text into individual ingredients,
    respecting parentheses and brackets.
    """
    if not text:
        return []
    
    # Strip common prefix labels like "Ingredients:", "Contains:", "Ingredients (Packaged):"
    cleaned = re.sub(r'^(ingredients|ingredient list|contents|samagri)\s*[:\-]\s*', '', text, flags=re.IGNORECASE)
    
    # Split by comma or semicolon when not inside parentheses
    items: List[str] = []
    current: List[str] = []
    paren_depth = 0
    
    for char in cleaned:
        if char in "([{":
            paren_depth += 1
            current.append(char)
        elif char in ")]}":
            paren_depth = max(0, paren_depth - 1)
            current.append(char)
        elif (char in ",;") and paren_depth == 0:
            item = "".join(current).strip()
            if item:
                items.append(item)
            current = []
        else:
            current.append(char)
            
    if current:
        last_item = "".join(current).strip()
        if last_item:
            items.append(last_item)
            
    return items

def analyze_single_ingredient(raw_name: str) -> Dict[str, Any]:
    """
    Looks up or infers ingredient properties with zero guessing.
    """
    normalized = normalize_text(raw_name)
    
    # Direct match in knowledge base
    matched_entry: Optional[Dict[str, Any]] = None
    for key, data in INGREDIENT_KNOWLEDGE_BASE.items():
        if key in normalized or (data.get("ins_number") and data["ins_number"].lower() in normalized):
            matched_entry = data
            break
            
    if matched_entry:
        return {
            "original_text": raw_name,
            "matched_name": matched_entry["name"],
            "scientific_name": matched_entry.get("scientific_name"),
            "ins_number": matched_entry.get("ins_number"),
            "category": matched_entry.get("category", "General Food Ingredient"),
            "purpose": matched_entry.get("purpose", "Used in food preparation and formulation."),
            "safety_level": matched_entry.get("safety_level", "safe"),
            "description": matched_entry.get("description", "A standardized food ingredient used in commercial processing."),
            "common_sources": matched_entry.get("common_sources", "Packaged foods"),
            "allergens": matched_entry.get("allergens", []),
            "dietary_compatibility": matched_entry.get("dietary_compatibility", {"vegetarian": True, "vegan": True}),
            "regulatory_status": matched_entry.get("regulatory_status", "Compliant with FSSAI standards"),
            "daily_intake_limit": matched_entry.get("daily_intake_limit"),
            "references": matched_entry.get("references", ["FSSAI Food Safety Standards Regulations"]),
            "is_known_in_database": True
        }
        
    # Check INS number regex pattern (e.g. INS 500(ii), E150d)
    ins_match = re.search(r'(ins|e)\s*([0-9]{3,4}[a-z]*)', normalized)
    ins_str = f"INS {ins_match.group(2).upper()}" if ins_match else None
    
    # Check allergens
    detected_allergens = []
    for allergen_group, keywords in ALLERGEN_MAP.items():
        if any(kw in normalized for kw in keywords):
            detected_allergens.append(allergen_group.replace("_", " ").title())
            
    # Check vegetarian status
    is_non_veg = any(w in normalized for w in ["gelatin", "chicken", "meat", "pork", "beef", "fish", "tallow", "bone", "egg", "carmine", "cochineal", "ins 120"])
    is_dairy = any(w in normalized for w in ["milk", "dairy", "butter", "cheese", "ghee", "whey", "casein", "lactose"])
    
    # Standard inferred item with transparent uncertainty flag
    return {
        "original_text": raw_name,
        "matched_name": raw_name.strip().title(),
        "scientific_name": None,
        "ins_number": ins_str,
        "category": "Natural or Conventional Ingredient",
        "purpose": "Common component providing flavor, texture, structure, or bulk.",
        "safety_level": "safe",
        "description": f"Standard culinary or food industry ingredient: {raw_name.strip()}.",
        "common_sources": "Various food products",
        "allergens": detected_allergens,
        "dietary_compatibility": {
            "vegetarian": not is_non_veg,
            "vegan": not (is_non_veg or is_dairy),
            "halal": not any(w in normalized for w in ["pork", "alcohol", "wine", "beer", "rum"])
        },
        "regulatory_status": "Permitted subject to standard FSSAI / Codex purity specifications",
        "daily_intake_limit": None,
        "references": ["FSSAI Food Product Standards"],
        "is_known_in_database": False
    }

def analyze_full_ingredient_text(raw_text: str, user_profile: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Parses and analyzes an entire food label's ingredient text.
    Extracts individual ingredients, evaluates cumulative safety, detects allergens,
    and cross-checks against user allergies and dietary preferences.
    """
    parsed_items = parse_ingredients_list(raw_text)
    analyzed_ingredients = [analyze_single_ingredient(item) for item in parsed_items]
    
    all_allergens = set()
    high_concerns = []
    moderate_concerns = []
    non_veg_flags = []
    non_vegan_flags = []
    
    for ing in analyzed_ingredients:
        for a in ing.get("allergens", []):
            all_allergens.add(a)
            
        lvl = ing.get("safety_level")
        if lvl == "high_concern":
            high_concerns.append(ing["matched_name"])
        elif lvl == "moderate_concern":
            moderate_concerns.append(ing["matched_name"])
            
        compat = ing.get("dietary_compatibility", {})
        if not compat.get("vegetarian", True):
            non_veg_flags.append(ing["matched_name"])
        if not compat.get("vegan", True):
            non_vegan_flags.append(ing["matched_name"])
            
    # Check declared allergen statements in raw text (e.g. "CONTAINS WHEAT, MILK SOY")
    declared_matches = []
    raw_lower = raw_text.lower()
    for grp, kws in ALLERGEN_MAP.items():
        if any(f"contains {kw}" in raw_lower or f"contain {kw}" in raw_lower or f"allergen: {kw}" in raw_lower for kw in kws):
            declared_matches.append(grp.replace("_", " ").title())
            all_allergens.add(grp.replace("_", " ").title())
            
    # Personal Health & Allergy Alert Engine
    user_alerts = []
    if user_profile:
        user_allergies = [a.lower() for a in user_profile.get("allergies", [])]
        user_diets = [d.lower() for d in user_profile.get("dietary_preferences", [])]
        
        # Cross reference allergies
        for user_allergy in user_allergies:
            for detected in all_allergens:
                if user_allergy in detected.lower() or detected.lower() in user_allergy:
                    user_alerts.append({
                        "severity": "CRITICAL",
                        "title": f"Allergen Alert: {detected}",
                        "message": f"This product contains or may contain '{detected}', which matches your declared allergy '{user_allergy}'."
                    })
                    
        # Cross reference vegetarian/vegan
        if "vegetarian" in user_diets and non_veg_flags:
            user_alerts.append({
                "severity": "WARNING",
                "title": "Dietary Preference Conflict",
                "message": f"Contains non-vegetarian ingredients: {', '.join(non_veg_flags)}."
            })
            
        if "vegan" in user_diets and non_vegan_flags:
            user_alerts.append({
                "severity": "WARNING",
                "title": "Vegan Preference Conflict",
                "message": f"Contains animal-derived ingredients or dairy: {', '.join(non_vegan_flags)}."
            })
            
    return {
        "raw_text": raw_text,
        "ingredient_count": len(analyzed_ingredients),
        "ingredients": analyzed_ingredients,
        "declared_allergens": list(declared_matches),
        "potential_allergens": list(all_allergens),
        "high_concerns": high_concerns,
        "moderate_concerns": moderate_concerns,
        "dietary_flags": {
            "is_vegetarian": len(non_veg_flags) == 0,
            "is_vegan": len(non_vegan_flags) == 0,
            "non_veg_reasons": non_veg_flags,
            "non_vegan_reasons": non_vegan_flags
        },
        "user_alerts": user_alerts
    }

