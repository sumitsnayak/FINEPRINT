"""
LabelLens AI Intelligence Service
Integrates Google Gemini REST API with fallback to deterministic expert knowledge engine.
Handles AI ingredient explanations, personalized food recommendations, and AI Food Assistant chatbot.
"""

import json
import httpx
from typing import Dict, Any, List, Optional
from app.config import settings
from app.services.ingredient_engine import analyze_full_ingredient_text
from app.services.rating_engine import calculate_comprehensive_rating

SYSTEM_PROMPT_LABEL_ANALYSIS = """You are LabelLens AI, a specialized food scientist and nutritional expert.
Your job is to objectively analyze packaged food labels, ingredient lists, and nutritional facts.
Strict rules:
1. Do not make medical claims or diagnose health conditions.
2. Explain scientific chemical names simply (e.g. Ascorbic Acid is Vitamin C).
3. Do not demonize safe ingredients; distinguish established evidence from unfounded fears.
4. Highlight real concerns: industrial trans fats, excessive added sugars, high sodium, unregulated additives.
5. Respect Indian food safety guidelines (FSSAI) and international Codex standards.
6. Provide output in clear, structured, compassionate language.
"""

async def query_gemini_api(prompt: str, system_instruction: str = "") -> Optional[str]:
    """
    Direct HTTP call to Google Gemini REST API (gemini-1.5-flash or configured model).
    """
    if not settings.GEMINI_API_KEY:
        return None
        
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"
    
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": f"{system_instruction}\n\n{prompt}" if system_instruction else prompt}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 1000
        }
    }
    
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(url, json=payload)
            if response.status_code == 200:
                data = response.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return text
            else:
                print(f"Gemini API returned status {response.status_code}: {response.text}")
                return None
    except Exception as e:
        print(f"Gemini API error: {e}")
        return None

async def analyze_label_ai(
    product_name: str,
    ingredients_text: str,
    nutrition_facts: Dict[str, Any],
    user_profile: Optional[Dict[str, Any]] = None,
    fssai_license: Optional[str] = None
) -> Dict[str, Any]:
    """
    Produces complete food intelligence report by fusing the deterministic engine
    with optional Gemini AI enhancements.
    """
    # 1. Deterministic baseline analysis (accurate, verified)
    ingredient_report = analyze_full_ingredient_text(ingredients_text, user_profile)
    rating_report = calculate_comprehensive_rating(
        ingredient_analysis=ingredient_report,
        nutrition_facts=nutrition_facts,
        has_fssai_license=bool(fssai_license)
    )
    
    # 2. Try Gemini for personalized AI summary and plain-language insights
    ai_summary = ""
    is_live_ai = False
    
    prompt = f"""
    Analyze this packaged food product:
    Product: {product_name}
    Ingredients: {ingredients_text}
    Nutrition (per 100g): {json.dumps(nutrition_facts)}
    User Dietary Profile: {json.dumps(user_profile or {})}
    
    Provide a concise 3-4 sentence plain-language summary for a consumer:
    - What are the primary building blocks of this product?
    - Are there any additives or allergens to watch out for?
    - How does it align with healthy nutrition?
    """
    
    gemini_text = await query_gemini_api(prompt, SYSTEM_PROMPT_LABEL_ANALYSIS)
    if gemini_text:
        ai_summary = gemini_text.strip()
        is_live_ai = True
    else:
        # High quality built-in summary generator
        ing_count = ingredient_report["ingredient_count"]
        high_concerns = ingredient_report["high_concerns"]
        mod_concerns = ingredient_report["moderate_concerns"]
        verdict = rating_report["summary_verdict"]
        
        reasons = []
        if high_concerns:
            reasons.append(f"contains high-concern ingredients ({', '.join(high_concerns)})")
        if mod_concerns:
            reasons.append(f"uses {len(mod_concerns)} regulated additive(s)")
        sugar = nutrition_facts.get("total_sugar", 0)
        if sugar > 15:
            reasons.append(f"has notable sugar content ({sugar}g/100g)")
            
        summary_details = f" It {', '.join(reasons)}." if reasons else " Its ingredient profile is relatively standard."
        ai_summary = f"{product_name} is evaluated as '{verdict}'.{summary_details} Always check the full nutritional breakdown and individual allergen tags before consuming."
        is_live_ai = False

    return {
        "product_name": product_name,
        "ai_summary": ai_summary,
        "engine_source": "Google Gemini 1.5 Flash (Live AI)" if is_live_ai else "LabelLens Verified Knowledge Engine (Offline Mode)",
        "is_live_ai": is_live_ai,
        "overall_score": rating_report["overall_score"],
        "safety_score": rating_report["safety_score"],
        "nutrition_score": rating_report["nutrition_score"],
        "concern_level": rating_report["concern_level"],
        "summary_verdict": rating_report["summary_verdict"],
        "data_confidence": rating_report["data_confidence"],
        "factors_positive": rating_report["factors_positive"],
        "factors_negative": rating_report["factors_negative"],
        "methodology": rating_report["methodology"],
        "ingredient_analysis": ingredient_report,
        "nutrition_facts": nutrition_facts,
        "fssai_license": fssai_license
    }

async def answer_assistant_chat(
    user_message: str,
    history: List[Dict[str, str]],
    user_profile: Optional[Dict[str, Any]] = None,
    active_product: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Answers questions from the user in the AI Personal Food Assistant chat.
    Uses real context from user's current scanned product, allergies, and food diary.
    """
    context_str = ""
    if active_product:
        context_str += f"\nCurrently Scanned Product: {active_product.get('name')}\n"
        context_str += f"Ingredients: {active_product.get('ingredients_text')}\n"
        context_str += f"Nutrition: {json.dumps(active_product.get('nutrition_facts', {}))}\n"
        context_str += f"Score: {active_product.get('overall_score')}/10\n"
        
    if user_profile:
        context_str += f"\nUser Dietary Preferences: {user_profile.get('dietary_preferences', [])}\n"
        context_str += f"User Allergies: {user_profile.get('allergies', [])}\n"
        context_str += f"Daily Calorie Target: {user_profile.get('target_calories', 2000)} kcal\n"
        
    full_prompt = f"Context:\n{context_str}\nUser Question: {user_message}"
    
    gemini_reply = await query_gemini_api(
        full_prompt,
        "You are LabelLens Assistant, an intelligent, empathetic Indian food and nutrition companion. Answer concisely in markdown. Base answers strictly on facts and avoid medical diagnoses."
    )
    
    if gemini_reply:
        return {
            "reply": gemini_reply.strip(),
            "source": "Gemini AI"
        }
        
    # Smart local responder based on question intent
    q = user_message.lower()
    if "ingredient" in q or "mean" in q:
        reply = (
            "### Ingredient Breakdown\n\n"
            "Packaged food ingredients are listed in descending order by weight. "
            "The top three ingredients usually make up the vast majority of the product! "
            "For example, in many biscuits and noodles, refined wheat flour (maida) and palm oil are the primary ingredients. "
            "Additives with numbers (like INS 322 or INS 621) are regulated food additives serving specific functions like emulsification or flavor enhancement."
        )
    elif "sugar" in q:
        reply = (
            "### Sugar Awareness\n\n"
            "The World Health Organization (WHO) and ICMR recommend limiting free sugars to **less than 25 grams (about 6 teaspoons) per day** for adults. "
            "Watch out for hidden names of sugar on labels, such as *invert sugar syrup, maltodextrin, high fructose corn syrup, liquid glucose, and dextrose*."
        )
    elif "allergen" in q or "allergic" in q:
        allergies = user_profile.get("allergies", []) if user_profile else []
        reply = (
            f"### Allergen Check\n\n"
            f"Your declared allergies are: **{', '.join(allergies) if allergies else 'None configured in profile'}**.\n\n"
            "Always inspect the bold allergen disclaimer on the back of the packet (e.g. *Contains Wheat, Soy. May contain traces of Milk and Tree Nuts*). Even if an allergen is not an active ingredient, shared factory lines can cause cross-contact."
        )
    elif "protein" in q:
        reply = (
            "### Protein Nutrition\n\n"
            "Healthy adults generally need approximately **0.8g to 1.0g of protein per kilogram of body weight** each day. "
            "Packaged snacks with more than 8g of protein per 100g are considered a moderate-to-good protein source, but check that they are not also overloaded with sodium or saturated fat!"
        )
    else:
        reply = (
            "### LabelLens Food Intelligence\n\n"
            "I'm here to help you inspect food labels, unpack complicated additives, compare packaged products, "
            "and ensure foods align with your dietary requirements and health goals.\n\n"
            "You can scan any packaged food label using the Scanner tab or ask me about specific ingredients like Palm Oil, MSG, Aspartame, or TBHQ!"
        )
        
    return {
        "reply": reply,
        "source": "LabelLens Knowledge Engine (Offline Mode)"
    }

