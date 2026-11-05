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


def explain_product_score(
    product_name: str,
    overall_score: float,
    safety_score: Optional[float] = None,
    nutrition_score: Optional[float] = None,
    concern_level: Optional[str] = None,
    nutrition_facts: Optional[Dict[str, Any]] = None,
    ingredient_analysis: Optional[Dict[str, Any]] = None,
    fssai_license: Optional[str] = None,
    processing_level: Optional[str] = None
) -> Dict[str, Any]:
    """
    Deterministic Explainable Scoring Engine.
    Generates an itemized, evidence-backed breakdown explaining how the product score
    was calculated, what influenced it, what data was missing, and the standards applied.
    """
    nf = nutrition_facts or {}
    ia = ingredient_analysis or {}
    
    # Resolve scores if missing
    calc_safety = safety_score if safety_score is not None else overall_score
    calc_nutrition = nutrition_score if nutrition_score is not None else overall_score
    calc_overall = overall_score
    
    # 1. Nutritional Evidence Items
    nutritional_evidence: List[Dict[str, Any]] = []
    positive_factors: List[str] = []
    potential_concerns: List[str] = []
    missing_information: List[str] = []
    unverified_information: List[str] = []
    
    # Added Sugar
    raw_added_sugar = nf.get("added_sugar")
    raw_total_sugar = nf.get("total_sugar") or nf.get("sugar")
    
    if raw_added_sugar is not None:
        val = float(raw_added_sugar)
        if val > 10.0:
            status = "concern"
            nutritional_evidence.append({
                "metric": "Added Sugar",
                "value": f"{val:.1f}g",
                "unit": "g / 100g",
                "status": "concern",
                "threshold": "ICMR-NIN safe ceiling: < 25g/day. High if > 10g/serving.",
                "points_impact": "-1.5 to -2.5 pts",
                "evidence": f"Declared added sugar is {val:.1f}g per 100g."
            })
            potential_concerns.append(f"Elevated added sugar: {val:.1f}g/100g (takes substantial portion of daily 25g limit).")
        elif val <= 4.0 and val > 0:
            status = "positive"
            nutritional_evidence.append({
                "metric": "Added Sugar",
                "value": f"{val:.1f}g",
                "unit": "g / 100g",
                "status": "positive",
                "threshold": "Within low-sugar profile (< 4g/100g).",
                "points_impact": "+1.0 pt",
                "evidence": f"Low added sugar content ({val:.1f}g/100g)."
            })
            positive_factors.append(f"Low added sugar: {val:.1f}g/100g.")
        elif val == 0:
            nutritional_evidence.append({
                "metric": "Added Sugar",
                "value": "0g",
                "unit": "g / 100g",
                "status": "positive",
                "threshold": "Zero added sugar formulation.",
                "points_impact": "+1.5 pts",
                "evidence": "Zero added free sugars declared."
            })
            positive_factors.append("Zero added sugar formulation.")
        else:
            nutritional_evidence.append({
                "metric": "Added Sugar",
                "value": f"{val:.1f}g",
                "unit": "g / 100g",
                "status": "neutral",
                "threshold": "Moderate level.",
                "points_impact": "0 pts",
                "evidence": f"{val:.1f}g per 100g."
            })
    elif raw_total_sugar is not None:
        val = float(raw_total_sugar)
        missing_information.append("Specific 'Added Sugar' value is not broken down separately from Total Sugar on label.")
        if val > 15.0:
            potential_concerns.append(f"Total sugars are elevated at {val:.1f}g/100g.")
            nutritional_evidence.append({
                "metric": "Total Sugar",
                "value": f"{val:.1f}g",
                "unit": "g / 100g",
                "status": "concern",
                "threshold": "High total sugar profile (> 15g/100g).",
                "points_impact": "-1.5 pts",
                "evidence": f"Declared total sugar is {val:.1f}g/100g (added sugar breakdown missing)."
            })
        else:
            nutritional_evidence.append({
                "metric": "Total Sugar",
                "value": f"{val:.1f}g",
                "unit": "g / 100g",
                "status": "neutral",
                "threshold": "Moderate total sugars.",
                "points_impact": "0 pts",
                "evidence": f"Total sugar {val:.1f}g/100g."
            })
    else:
        missing_information.append("Sugar quantification is omitted from the nutritional panel.")
        
    # Sodium
    raw_sodium = nf.get("sodium")
    if raw_sodium is not None:
        s_val = float(raw_sodium)
        if s_val > 1000:
            nutritional_evidence.append({
                "metric": "Sodium",
                "value": f"{s_val:.0f}mg",
                "unit": "mg / 100g",
                "status": "concern",
                "threshold": "ICMR-NIN Daily Limit: 2,000mg (~5g salt). High concern if > 1,000mg/100g.",
                "points_impact": "-2.5 pts",
                "evidence": f"Contains {s_val:.0f}mg sodium per 100g (over 50% of adult daily cap)."
            })
            potential_concerns.append(f"High sodium: {s_val:.0f}mg/100g exceeds single-meal safe threshold.")
        elif s_val > 600:
            nutritional_evidence.append({
                "metric": "Sodium",
                "value": f"{s_val:.0f}mg",
                "unit": "mg / 100g",
                "status": "concern",
                "threshold": "Elevated sodium profile (> 600mg/100g).",
                "points_impact": "-1.5 pts",
                "evidence": f"Sodium content is {s_val:.0f}mg per 100g."
            })
            potential_concerns.append(f"Moderately elevated sodium ({s_val:.0f}mg/100g).")
        elif s_val <= 120 and s_val > 0:
            nutritional_evidence.append({
                "metric": "Sodium",
                "value": f"{s_val:.0f}mg",
                "unit": "mg / 100g",
                "status": "positive",
                "threshold": "Low-sodium benchmark (< 120mg/100g).",
                "points_impact": "+1.0 pt",
                "evidence": f"Low sodium profile of {s_val:.0f}mg/100g."
            })
            positive_factors.append(f"Low sodium formulation: {s_val:.0f}mg/100g.")
        else:
            nutritional_evidence.append({
                "metric": "Sodium",
                "value": f"{s_val:.0f}mg",
                "unit": "mg / 100g",
                "status": "neutral",
                "threshold": "Moderate sodium profile.",
                "points_impact": "0 pts",
                "evidence": f"Sodium content {s_val:.0f}mg/100g."
            })
    else:
        missing_information.append("Sodium / Salt content not declared on scanned label.")
        
    # Saturated Fat & Trans Fat
    raw_sat_fat = nf.get("saturated_fat")
    if raw_sat_fat is not None:
        sat_val = float(raw_sat_fat)
        if sat_val > 10.0:
            nutritional_evidence.append({
                "metric": "Saturated Fat",
                "value": f"{sat_val:.1f}g",
                "unit": "g / 100g",
                "status": "concern",
                "threshold": "FSSAI advisory threshold: > 10g/100g is elevated.",
                "points_impact": "-1.5 pts",
                "evidence": f"Saturated fat measured at {sat_val:.1f}g/100g."
            })
            potential_concerns.append(f"High saturated fat ({sat_val:.1f}g/100g).")
        elif sat_val <= 2.0:
            nutritional_evidence.append({
                "metric": "Saturated Fat",
                "value": f"{sat_val:.1f}g",
                "unit": "g / 100g",
                "status": "positive",
                "threshold": "Low saturated fat (< 2.0g/100g).",
                "points_impact": "+1.0 pt",
                "evidence": f"Low saturated fat ({sat_val:.1f}g/100g)."
            })
            positive_factors.append(f"Low saturated fat: {sat_val:.1f}g/100g.")
        else:
            nutritional_evidence.append({
                "metric": "Saturated Fat",
                "value": f"{sat_val:.1f}g",
                "unit": "g / 100g",
                "status": "neutral",
                "threshold": "Moderate saturated fat.",
                "points_impact": "0 pts",
                "evidence": f"{sat_val:.1f}g per 100g."
            })
    else:
        missing_information.append("Saturated Fat breakdown omitted from nutrition table.")
        
    raw_trans_fat = nf.get("trans_fat")
    if raw_trans_fat is not None:
        trans_val = float(raw_trans_fat)
        if trans_val > 0.2:
            nutritional_evidence.append({
                "metric": "Trans Fat",
                "value": f"{trans_val:.1f}g",
                "unit": "g / 100g",
                "status": "concern",
                "threshold": "FSSAI legal cap: Maximum 0.2g industrial trans-fat per 100g.",
                "points_impact": "-2.5 pts",
                "evidence": f"Contains {trans_val:.1f}g trans fat per 100g."
            })
            potential_concerns.append(f"Exceeds FSSAI trans-fat cap ({trans_val:.1f}g/100g).")
        else:
            nutritional_evidence.append({
                "metric": "Trans Fat",
                "value": f"{trans_val:.1f}g",
                "unit": "g / 100g",
                "status": "positive",
                "threshold": "Compliant with FSSAI zero-trans-fat benchmark (<= 0.2g).",
                "points_impact": "+0.5 pts",
                "evidence": "Compliant with FSSAI trans-fat regulations."
            })
            positive_factors.append("Complies with FSSAI trans-fat limits (<= 0.2g).")
    else:
        missing_information.append("Trans fat testing statement not specified on packaging.")
        
    # Protein & Dietary Fiber
    raw_protein = nf.get("protein")
    if raw_protein is not None:
        p_val = float(raw_protein)
        if p_val >= 8.0:
            nutritional_evidence.append({
                "metric": "Protein",
                "value": f"{p_val:.1f}g",
                "unit": "g / 100g",
                "status": "positive",
                "threshold": "Beneficial source of dietary protein (>= 8g/100g).",
                "points_impact": "+1.0 to +2.0 pts",
                "evidence": f"Rich protein profile of {p_val:.1f}g/100g."
            })
            positive_factors.append(f"Good source of protein: {p_val:.1f}g/100g.")
        else:
            nutritional_evidence.append({
                "metric": "Protein",
                "value": f"{p_val:.1f}g",
                "unit": "g / 100g",
                "status": "neutral",
                "threshold": "Standard protein quantity.",
                "points_impact": "0 pts",
                "evidence": f"{p_val:.1f}g protein per 100g."
            })
    else:
        missing_information.append("Protein value not declared on label.")
        
    raw_fiber = nf.get("fiber") or nf.get("dietary_fiber")
    if raw_fiber is not None:
        fib_val = float(raw_fiber)
        if fib_val >= 3.0:
            nutritional_evidence.append({
                "metric": "Dietary Fiber",
                "value": f"{fib_val:.1f}g",
                "unit": "g / 100g",
                "status": "positive",
                "threshold": "Beneficial dietary fiber source (>= 3g/100g).",
                "points_impact": "+0.8 to +1.5 pts",
                "evidence": f"Provides {fib_val:.1f}g dietary fiber per 100g."
            })
            positive_factors.append(f"Provides dietary fiber ({fib_val:.1f}g/100g).")
    else:
        missing_information.append("Dietary Fiber is omitted from the nutritional panel.")
        
    # 2. Ingredient Assessment & Flagging
    ingredient_evidence: List[Dict[str, Any]] = []
    high_concerns = ia.get("high_concerns", [])
    moderate_concerns = ia.get("moderate_concerns", [])
    detailed_ingredients = ia.get("ingredients", [])
    
    for item in high_concerns:
        desc = "Flagged due to potential metabolic or cardiovascular risk (e.g. hydrogenated vegetable fats or forbidden additives)."
        for det in detailed_ingredients:
            if det.get("matched_name", "").lower() == item.lower() or item.lower() in det.get("original_text", "").lower():
                desc = det.get("description", desc)
                break
        ingredient_evidence.append({
            "name": item,
            "category": "High Concern Additive/Fat",
            "status": "concern",
            "reason": desc,
            "points_impact": "-2.5 pts"
        })
        potential_concerns.append(f"Contains high-concern ingredient: '{item}' ({desc[:80]}...).")
        
    for item in moderate_concerns:
        desc = "Regulated additive requiring moderation (e.g. synthetic colors, palm olein, chemical preservatives)."
        for det in detailed_ingredients:
            if det.get("matched_name", "").lower() == item.lower() or item.lower() in det.get("original_text", "").lower():
                desc = det.get("description", desc)
                break
        ingredient_evidence.append({
            "name": item,
            "category": "Regulated Additive / Refined Fat",
            "status": "caution",
            "reason": desc,
            "points_impact": "-0.8 pts"
        })
        potential_concerns.append(f"Contains regulated additive/fat: '{item}'.")
        
    if not high_concerns and not moderate_concerns:
        positive_factors.append("Free of industrial hydrogenated oils and high-risk synthetic food additives.")
        
    # 3. Allergen Information
    allergen_evidence: List[Dict[str, Any]] = []
    declared_allergens = ia.get("declared_allergens", [])
    potential_allergens = ia.get("potential_allergens", [])
    
    for a in declared_allergens:
        allergen_evidence.append({
            "allergen": a.capitalize(),
            "status": "declared",
            "source": "Declared on packaging allergen statement"
        })
        positive_factors.append(f"Explicit allergen warning provided for {a.capitalize()}.")
        
    for a in potential_allergens:
        if a not in declared_allergens:
            allergen_evidence.append({
                "allergen": a.capitalize(),
                "status": "undeclared_in_warning",
                "source": "Identified from raw ingredient list, but lacks dedicated bold allergen callout"
            })
            unverified_information.append(f"Potential allergen '{a.capitalize()}' detected in ingredients without explicit bold warning box.")
            
    if not declared_allergens and not potential_allergens:
        allergen_evidence.append({
            "allergen": "None Detected",
            "status": "clear",
            "source": "No standard priority allergens identified in formulation"
        })
        positive_factors.append("No common high-priority food allergens identified.")
        
    # 4. Processing Information
    processing_info = {}
    if processing_level and processing_level.strip():
        processing_info = {
            "status": "available",
            "classification": processing_level,
            "source": "Verified product formulation record",
            "description": f"Classified under {processing_level} based on industrial processing markers."
        }
    elif high_concerns or any("palm" in str(x).lower() for x in moderate_concerns):
        processing_info = {
            "status": "available",
            "classification": "NOVA Group 4 — Ultra-Processed Food (UPF)",
            "source": "Formulation composition analysis",
            "description": "Formulated with fractionated industrial oils and/or synthetic additives typically exclusive to mass industrial processing."
        }
    else:
        processing_info = {
            "status": "unavailable",
            "classification": None,
            "source": "No verified factory manufacturing flow sheet provided",
            "description": "Processing information unavailable."
        }
        
    # 5. FSSAI & Unverified checks
    if fssai_license:
        positive_factors.append(f"Displays 14-digit FSSAI License: {fssai_license}.")
    else:
        unverified_information.append("14-digit FSSAI License number was not detected or verified on scanned packaging surface.")
        
    return {
        "product_name": product_name,
        "overall_score": calc_overall,
        "safety_score": round(calc_safety, 1),
        "nutrition_score": round(calc_nutrition, 1),
        "concern_level": concern_level or ("low" if calc_overall >= 8 else "moderate" if calc_overall >= 5 else "high"),
        "nutritional_evidence": nutritional_evidence,
        "ingredient_evidence": ingredient_evidence,
        "allergen_evidence": allergen_evidence,
        "positive_factors": positive_factors,
        "potential_concerns": potential_concerns,
        "missing_information": missing_information,
        "unverified_information": unverified_information,
        "processing_information": processing_info,
        "methodology": {
            "model_name": "FINEPRINT Dual-Vector Food Safety & Nutritional Scoring Matrix",
            "safety_weight": "45%",
            "nutrition_weight": "55%",
            "standards_referenced": [
                "FSSAI (Food Safety and Standards Authority of India) Packaging and Labelling Regulations 2020",
                "FSSAI Food Safety Standards (Food Products Standards and Food Additives) Regulations",
                "ICMR-NIN (National Institute of Nutrition) Dietary Guidelines for Indians 2024",
                "WHO Guideline: Sugars and Sodium intake for adults and children"
            ],
            "formula_explanation": (
                "Score = (Regulatory Safety Score × 0.45) + (Nutritional Quality Score × 0.55). "
                "Safety evaluates presence of regulated food additives, trans fats, azo dyes, and allergen declaration clarity. "
                "Nutrition profiles sugar density, sodium, saturated fat, protein, and dietary fiber per 100g."
            ),
            "deterministic_rule": "Deterministic Rules Engine: AI assists solely in natural language explanation and does not generate or alter numerical ratings."
        },
        "legal_disclaimer": (
            "FinePrint's rating is an independent analytical score developed for consumer education and label transparency. "
            "It does not constitute an official FSSAI certification, government inspection report, or medical endorsement."
        )
    }


