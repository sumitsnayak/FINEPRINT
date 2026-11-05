import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

interface OnboardingPageProps {
  onNavigate: (tab: string) => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onNavigate }) => {
  const { updateProfile } = useAuth();
  const [step, setStep] = useState(1);

  // Form states
  const [age, setAge] = useState<number | ''>(26);
  const [gender, setGender] = useState('Female');
  const [heightCm, setHeightCm] = useState<number | ''>(165);
  const [weightKg, setWeightKg] = useState<number | ''>(58);
  const [activityLevel, setActivityLevel] = useState('moderate');

  const [dietaryPrefs, setDietaryPrefs] = useState<string[]>(['vegetarian']);
  const [allergies, setAllergies] = useState<string[]>(['Peanut', 'Tree Nuts']);

  const [targetCalories, setTargetCalories] = useState(2000);
  const [targetProtein, setTargetProtein] = useState(60);
  const [targetSugar, setTargetSugar] = useState(25);

  const availableDiets = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'gluten_free', label: 'Gluten-Free' },
    { id: 'lactose_free', label: 'Lactose-Free' },
    { id: 'jain', label: 'Jain' },
    { id: 'halal', label: 'Halal' },
  ];

  const availableAllergies = [
    'Peanut',
    'Tree Nuts',
    'Milk',
    'Soy',
    'Wheat',
    'Gluten',
    'Egg',
    'Fish',
    'Crustaceans',
    'Mustard',
    'Sesame',
    'Sulphites',
  ];

  const toggleDiet = (id: string) => {
    if (dietaryPrefs.includes(id)) {
      setDietaryPrefs(dietaryPrefs.filter((d) => d !== id));
    } else {
      setDietaryPrefs([...dietaryPrefs, id]);
    }
  };

  const toggleAllergy = (allergy: string) => {
    if (allergies.includes(allergy)) {
      setAllergies(allergies.filter((a) => a !== allergy));
    } else {
      setAllergies([...allergies, allergy]);
    }
  };

  const handleFinish = async () => {
    try {
      await updateProfile({
        age: age ? Number(age) : undefined,
        gender,
        height_cm: heightCm ? Number(heightCm) : undefined,
        weight_kg: weightKg ? Number(weightKg) : undefined,
        activity_level: activityLevel,
        dietary_preferences: dietaryPrefs,
        allergies,
        target_calories: targetCalories,
        target_protein: targetProtein,
        target_sugar: targetSugar,
      });
      onNavigate('dashboard');
    } catch {
      onNavigate('dashboard');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 animate-in fade-in duration-300">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 flex items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                step === s
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                  : step > s
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {step > s ? <Check className="w-5 h-5 text-emerald-700" /> : s}
            </div>
            {s < 3 && (
              <div
                className={`flex-1 h-1 mx-2 rounded ${
                  step > s ? 'bg-emerald-400' : 'bg-slate-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl text-slate-900">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-700">
                Step 1 of 3
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Tell us about your physical profile
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Used to calculate recommended daily nutritional benchmarks and calories.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Daily Activity Level
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
              >
                <option value="sedentary">Sedentary (Desk job, minimal exercise)</option>
                <option value="light">Lightly Active (Walking, light workouts 1-3 days)</option>
                <option value="moderate">Moderately Active (Moderate exercise 3-5 days)</option>
                <option value="active">Very Active (Heavy training / active lifestyle)</option>
              </select>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="text-xs font-bold text-slate-500 hover:text-slate-900"
              >
                Skip for now
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-2xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20 flex items-center space-x-1"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-700">
                Step 2 of 3
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Dietary Preferences & Food Allergies
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                We will highlight potential hazards and conflict warnings automatically when you scan products.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Dietary Lifestyle
              </label>
              <div className="flex flex-wrap gap-2">
                {availableDiets.map((d) => {
                  const selected = dietaryPrefs.includes(d.id);
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => toggleDiet(d.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        selected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Declared Food Allergies & Intolerances
              </label>
              <div className="flex flex-wrap gap-2">
                {availableAllergies.map((allergy) => {
                  const selected = allergies.includes(allergy);
                  return (
                    <button
                      key={allergy}
                      type="button"
                      onClick={() => toggleAllergy(allergy)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        selected
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-rose-300'
                      }`}
                    >
                      {allergy}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-2xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20 flex items-center space-x-1"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-700">
                Step 3 of 3
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Personal Nutrition Targets
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Customize your daily limits to track your nutrition diary effectively.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Daily Calories: <strong className="text-emerald-700">{targetCalories} kcal</strong></span>
                </div>
                <input
                  type="range"
                  min="1200"
                  max="3500"
                  step="50"
                  value={targetCalories}
                  onChange={(e) => setTargetCalories(Number(e.target.value))}
                  className="w-full accent-emerald-600 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Protein Target: <strong className="text-blue-700">{targetProtein} grams</strong></span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="180"
                  step="5"
                  value={targetProtein}
                  onChange={(e) => setTargetProtein(Number(e.target.value))}
                  className="w-full accent-blue-600 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Max Added Sugar Limit: <strong className="text-amber-700">{targetSugar} grams</strong></span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={targetSugar}
                  onChange={(e) => setTargetSugar(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-200 rounded-lg cursor-pointer"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  WHO recommends keeping free added sugar under 25g/day.
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="px-8 py-3 rounded-2xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20 flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Save Profile & Enter Platform</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
