// LabelLens TypeScript Type Definitions

export interface UserProfile {
  age?: number;
  gender?: string;
  height_cm?: number;
  weight_kg?: number;
  activity_level?: string;
  dietary_preferences: string[]; // ["vegetarian", "vegan", "gluten_free", etc.]
  allergies: string[];           // ["peanut", "milk", "soy", "gluten", etc.]
  health_conditions: string[];   // ["diabetic", "hypertension"]
  target_calories: number;
  target_protein: number;
  target_carbs: number;
  target_fat: number;
  target_sugar: number;
  target_sodium: number;
  notifications_enabled?: boolean;
  meal_reminders?: boolean;
  safety_alerts?: boolean;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'user' | 'admin';
  profile: UserProfile;
}

export interface IngredientDetail {
  original_text: string;
  matched_name: string;
  scientific_name?: string | null;
  ins_number?: string | null;
  category: string;
  purpose: string;
  safety_level: 'safe' | 'moderate_concern' | 'high_concern' | 'limited_evidence';
  description: string;
  common_sources?: string;
  allergens: string[];
  dietary_compatibility: {
    vegetarian: boolean;
    vegan: boolean;
    halal?: boolean;
  };
  regulatory_status: string;
  daily_intake_limit?: string | null;
  references?: string[];
  is_known_in_database: boolean;
}

export interface IngredientAnalysisReport {
  raw_text: string;
  ingredient_count: number;
  ingredients: IngredientDetail[];
  declared_allergens: string[];
  potential_allergens: string[];
  high_concerns: string[];
  moderate_concerns: string[];
  dietary_flags: {
    is_vegetarian: boolean;
    is_vegan: boolean;
    non_veg_reasons: string[];
    non_vegan_reasons: string[];
  };
  user_alerts: Array<{
    severity: 'CRITICAL' | 'WARNING' | 'INFO';
    title: string;
    message: string;
  }>;
}

export interface NutritionFacts {
  calories?: number;
  protein?: number;
  carbs?: number;
  total_fat?: number;
  saturated_fat?: number;
  trans_fat?: number;
  total_sugar?: number;
  added_sugar?: number;
  fiber?: number;
  sodium?: number;
  [key: string]: number | undefined;
}

export interface HealthierAlternative {
  category: string;
  name: string;
  brand: string;
  image_url: string;
  overall_score: number;
  nutrition_per_100g: NutritionFacts;
  why_better: string;
  allergens: string[];
  dietary_compatibility: {
    vegetarian: boolean;
    vegan: boolean;
  };
}

export interface ScanResult {
  scan_id?: number;
  product_name: string;
  ai_summary: string;
  engine_source: string;
  is_live_ai: boolean;
  overall_score: number;
  safety_score: number;
  nutrition_score: number;
  concern_level: 'low' | 'moderate' | 'high' | 'insufficient_info';
  summary_verdict: string;
  data_confidence: string;
  factors_positive: string[];
  factors_negative: string[];
  methodology: string;
  ingredient_analysis: IngredientAnalysisReport;
  nutrition_facts: NutritionFacts;
  fssai_license?: string | null;
  healthier_alternatives?: HealthierAlternative[];
}

export interface ProductCatalogItem {
  id: number;
  barcode?: string;
  name: string;
  brand?: string;
  category: string;
  image_url?: string;
  package_weight?: string;
  overall_score: number;
  safety_score: number;
  nutrition_score: number;
  concern_level: 'low' | 'moderate' | 'high';
  is_verified: boolean;
  source: string;
}

export interface MealItem {
  id: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food_name: string;
  portion_amount: number;
  portion_unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  sodium: number;
  source_type: string;
  product_id?: number;
}

export interface DailyDiaryData {
  date: string;
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    sugar: number;
    sodium: number;
  };
  targets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    sugar: number;
    sodium: number;
  };
  meals: {
    breakfast: MealItem[];
    lunch: MealItem[];
    dinner: MealItem[];
    snack: MealItem[];
  };
}

export interface WeeklySummaryData {
  weekly_days: Array<{
    date: string;
    day_name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    sugar: number;
    sodium: number;
  }>;
  observations: string[];
  targets: {
    calories: number;
    protein: number;
    sugar: number;
  };
}

export interface Complaint {
  id: number;
  reference_number: string;
  category: string;
  product_name: string;
  brand_name?: string;
  seller_name?: string;
  city?: string;
  incident_date: string;
  status: 'submitted' | 'under_review' | 'additional_info_required' | 'referred_to_authority' | 'resolved' | 'closed';
  description?: string;
  evidence_image_url?: string;
  admin_notes?: string;
  created_at?: string;
}

