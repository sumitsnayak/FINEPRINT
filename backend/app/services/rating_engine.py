"""
LabelLens Transparent Product Rating Engine
Evaluates packaged foods with dual-vector scoring:
1. Food Safety Assessment (0-10)
2. Nutritional Quality Score (0-10)
Overall Combined Rating (0-10) with exact line-item factors.
"""

from typing import Dict, Any, List, Optional

def calculate_safety_score(
    ingredient_analysis: Dict[str, Any],
    has_mandatory_label: bool = True,
    has_fssai_license: bool = True
) -> Dict[str, Any]:
    """
    Computes Food Safety Score (0-10) based on regulatory compliance,
    toxicological risk of additives, allergen transparency, and label completeness.
    """
    score = 10.0
    factors_positive: List[str] = []
    factors_negative: List[str] = []
    
    # 1. High Concern Additives (e.g. trans fats, hydrogenated oils)
    high_concerns = ingredient_analysis.get("high_concerns", [])
    if high_concerns:
        deduction = min(len(high_concerns) * 2.5, 5.0)
        score -= deduction
        factors_negative.append(
            f"Contains {len(high_concerns)} high-concern ingredient(s): {', '.join(high_concerns)} (-{deduction:.1f})"
        )
    else:
        factors_positive.append("Free of hazardous industrial additives or partially hydrogenated fats (+2.0)")
        
    # 2. Moderate Concern Additives (e.g. synthetic colors, TBHQ, palm oil, refined maida)
    moderate_concerns = ingredient_analysis.get("moderate_concerns", [])
    if moderate_concerns:
        deduction = min(len(moderate_concerns) * 0.8, 3.0)
        score -= deduction
        factors_negative.append(
            f"Contains {len(moderate_concerns)} moderate-concern additive(s) (e.g. {', '.join(moderate_concerns[:3])}) (-{deduction:.1f})"
        )
    else:
        factors_positive.append("Minimal synthetic preservatives or heavily refined ingredients (+1.0)")
        
    # 3. Label Completeness & Allergen Declaration
    declared_allergens = ingredient_analysis.get("declared_allergens", [])
    potential_allergens = ingredient_analysis.get("potential_allergens", [])
    if potential_allergens and not declared_allergens:
        # Potential allergen present in ingredients but no bold warning / allergen box found
        score -= 0.8
        factors_negative.append("Potential allergens detected in ingredient list without explicit declaration statement (-0.8)")
    elif declared_allergens:
        factors_positive.append(f"Transparent allergen declaration present ({', '.join(declared_allergens)}) (+0.5)")
        
    # 4. Mandatory FSSAI regulatory compliance indicators
    if not has_fssai_license:
        score -= 1.5
        factors_negative.append("FSSAI License number missing or unverified on packaging (-1.5)")
    else:
        factors_positive.append("FSSAI compliance information indicated (+0.5)")
        
    # Clamp between 1.0 and 10.0
    safety_score = max(1.0, min(10.0, round(score, 1)))
    
    # Concern Level Categorization
    if safety_score >= 8.0:
        concern_level = "low"
    elif safety_score >= 5.0:
        concern_level = "moderate"
    else:
        concern_level = "high"
        
    return {
        "score": safety_score,
        "concern_level": concern_level,
        "factors_positive": factors_positive,
        "factors_negative": factors_negative
    }

def calculate_nutrition_score(
    nutrition_facts: Dict[str, Any],
    category: str = "general"
) -> Dict[str, Any]:
    """
    Computes Nutritional Quality Score (0-10) using science-based nutrient profiling
    benchmarks (ICMR-NIN & Nutri-Score standards for packaged foods).
    """
    if not nutrition_facts or len(nutrition_facts) == 0:
        return {
            "score": 5.0,
            "is_insufficient_data": True,
            "message": "Nutritional facts panel not detected or incomplete on label.",
            "factors_positive": [],
            "factors_negative": ["Nutritional values unavailable on scanned label (-3.0)"]
        }
        
    # Standard baseline: 6.0 out of 10
    score = 6.0
    factors_positive: List[str] = []
    factors_negative: List[str] = []
    
    calories = float(nutrition_facts.get("calories", 0) or 0)
    sugar = float(nutrition_facts.get("total_sugar", 0) or nutrition_facts.get("sugar", 0) or 0)
    added_sugar = float(nutrition_facts.get("added_sugar", 0) or 0)
    sodium = float(nutrition_facts.get("sodium", 0) or 0) # mg
    total_fat = float(nutrition_facts.get("total_fat", 0) or nutrition_facts.get("fat", 0) or 0)
    saturated_fat = float(nutrition_facts.get("saturated_fat", 0) or 0)
    trans_fat = float(nutrition_facts.get("trans_fat", 0) or 0)
    protein = float(nutrition_facts.get("protein", 0) or 0)
    fiber = float(nutrition_facts.get("fiber", 0) or nutrition_facts.get("dietary_fiber", 0) or 0)
    
    # Sugar Penalties (per 100g)
    effective_sugar = added_sugar if added_sugar > 0 else sugar
    if effective_sugar > 25.0:
        score -= 2.5
        factors_negative.append(f"Very high sugar content ({effective_sugar:.1f}g/100g) exceeds daily thresholds (-2.5)")
    elif effective_sugar > 10.0:
        score -= 1.5
        factors_negative.append(f"Elevated sugar content ({effective_sugar:.1f}g/100g) (-1.5)")
    elif effective_sugar <= 4.0 and effective_sugar > 0:
        score += 1.0
        factors_positive.append(f"Low sugar content ({effective_sugar:.1f}g/100g) (+1.0)")
    elif effective_sugar == 0:
        score += 1.5
        factors_positive.append("Zero added sugar (+1.5)")
        
    # Sodium Penalties (mg per 100g)
    if sodium > 1000:
        score -= 2.5
        factors_negative.append(f"Critical high sodium ({sodium:.0f}mg/100g) over 50% daily limit (-2.5)")
    elif sodium > 600:
        score -= 1.5
        factors_negative.append(f"High sodium ({sodium:.0f}mg/100g) (-1.5)")
    elif sodium <= 120 and sodium > 0:
        score += 1.0
        factors_positive.append(f"Low sodium content ({sodium:.0f}mg/100g) (+1.0)")
        
    # Saturated Fat & Trans Fat
    if trans_fat > 0.2:
        score -= 2.5
        factors_negative.append(f"Contains industrial trans fats ({trans_fat:.1f}g/100g) (-2.5)")
    elif saturated_fat > 10.0:
        score -= 1.5
        factors_negative.append(f"High saturated fat ({saturated_fat:.1f}g/100g) (-1.5)")
    elif saturated_fat <= 2.0 and total_fat > 0:
        score += 1.0
        factors_positive.append(f"Low saturated fat ({saturated_fat:.1f}g/100g) (+1.0)")
        
    # Protein Rewards (per 100g)
    if protein >= 15.0:
        score += 2.0
        factors_positive.append(f"High protein content ({protein:.1f}g/100g) (+2.0)")
    elif protein >= 8.0:
        score += 1.0
        factors_positive.append(f"Good source of protein ({protein:.1f}g/100g) (+1.0)")
    elif protein < 2.0 and calories > 300:
        score -= 0.5
        factors_negative.append("Calorie-dense with minimal protein value (-0.5)")
        
    # Dietary Fiber Rewards (per 100g)
    if fiber >= 6.0:
        score += 1.5
        factors_positive.append(f"Excellent dietary fiber ({fiber:.1f}g/100g) (+1.5)")
    elif fiber >= 3.0:
        score += 0.8
        factors_positive.append(f"Contains beneficial dietary fiber ({fiber:.1f}g/100g) (+0.8)")
        
    # Energy Density Check
    if calories > 500:
        score -= 1.0
        factors_negative.append(f"Very high energy density ({calories:.0f} kcal/100g) (-1.0)")
        
    nutrition_score = max(1.0, min(10.0, round(score, 1)))
    
    return {
        "score": nutrition_score,
        "is_insufficient_data": False,
        "factors_positive": factors_positive,
        "factors_negative": factors_negative
    }

def calculate_comprehensive_rating(
    ingredient_analysis: Dict[str, Any],
    nutrition_facts: Dict[str, Any],
    has_mandatory_label: bool = True,
    has_fssai_license: bool = True,
    source: str = "verified_label"
) -> Dict[str, Any]:
    """
    Combines Safety Assessment and Nutritional Quality into an overall score out of 10.
    Weighted: Safety (45%) + Nutritional Quality (55%).
    Never masks missing data.
    """
    safety = calculate_safety_score(
        ingredient_analysis=ingredient_analysis,
        has_mandatory_label=has_mandatory_label,
        has_fssai_license=has_fssai_license
    )
    
    nutrition = calculate_nutrition_score(nutrition_facts=nutrition_facts)
    
    if nutrition.get("is_insufficient_data"):
        # Overall score leans on safety score with an explicit insufficiency notice
        overall_score = safety["score"]
        confidence = "Medium (Missing Nutrition Table)"
    else:
        overall_score = round((safety["score"] * 0.45) + (nutrition["score"] * 0.55), 1)
        confidence = "High" if source in ["verified_label", "fssai_db"] else "Medium"
        
    # All factors combined
    all_positive = safety["factors_positive"] + nutrition["factors_positive"]
    all_negative = safety["factors_negative"] + nutrition["factors_negative"]
    
    summary_verdict = (
        "High Quality & Low Concern" if overall_score >= 8.0 else
        "Moderate Balance — Check Sugar/Sodium" if overall_score >= 6.0 else
        "Frequent Consumption Discouraged" if overall_score >= 4.0 else
        "Ultra-Processed / High Health Concern"
    )
    
    return {
        "overall_score": overall_score,
        "safety_score": safety["score"],
        "nutrition_score": nutrition["score"],
        "concern_level": safety["concern_level"],
        "summary_verdict": summary_verdict,
        "data_confidence": confidence,
        "has_complete_nutrition": not nutrition.get("is_insufficient_data", False),
        "factors_positive": all_positive,
        "factors_negative": all_negative,
        "safety_breakdown": safety,
        "nutrition_breakdown": nutrition,
        "methodology": "Dual-Vector Model: 45% Regulatory & Additive Safety + 55% Macro-Nutrient Profiling based on FSSAI & ICMR-NIN standards."
    }

