import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, ShieldCheck, Heart, Check } from 'lucide-react';

export const ProfileSettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const profile = user?.profile;

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [age, setAge] = useState<number | ''>(profile?.age || '');
  const [gender, setGender] = useState(profile?.gender || 'Female');
  const [heightCm, setHeightCm] = useState<number | ''>(profile?.height_cm || '');
  const [weightKg, setWeightKg] = useState<number | ''>(profile?.weight_kg || '');
  const [activityLevel, setActivityLevel] = useState(profile?.activity_level || 'moderate');

  const [dietaryPrefs, setDietaryPrefs] = useState<string[]>(profile?.dietary_preferences || ['vegetarian']);
  const [allergies, setAllergies] = useState<string[]>(profile?.allergies || ['Peanut']);

  const [targetCalories, setTargetCalories] = useState(profile?.target_calories || 2000);
  const [targetProtein, setTargetProtein] = useState(profile?.target_protein || 60);
  const [targetSugar, setTargetSugar] = useState(profile?.target_sugar || 30);

  const [notifications] = useState(profile?.notifications_enabled ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const allDiets = ['vegetarian', 'vegan', 'gluten_free', 'lactose_free', 'jain', 'halal'];
  const allAllergies = [
    'Peanut',
    'Tree Nuts',
    'Milk',
    'Soy',
    'Wheat',
    'Gluten',
    'Egg',
    'Fish',
    'Mustard',
    'Sesame',
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await updateProfile({
        full_name: fullName,
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
        notifications_enabled: notifications,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      alert('Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2 shadow-xs">
            <span>🌿</span>
            <span>Personal Health Shield</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Profile & Dietary Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your personal allergen shield, health goals, and biometric info.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-1.5 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Profile Updated!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 text-slate-900">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <User className="w-5 h-5 text-emerald-600" />
            <span>Personal Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase text-slate-500 mb-1.5">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-500 mb-1.5">Email</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-sm text-slate-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-500 mb-1.5">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-500 mb-1.5">Activity Level</label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
              >
                <option value="sedentary">Sedentary</option>
                <option value="light">Lightly Active</option>
                <option value="moderate">Moderately Active</option>
                <option value="active">Very Active</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dietary Restrictions & Allergies */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 text-slate-900">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Active Allergen & Dietary Shield</span>
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
              Dietary Preferences
            </label>
            <div className="flex flex-wrap gap-2">
              {allDiets.map((d) => {
                const selected = dietaryPrefs.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() =>
                      setDietaryPrefs(
                        selected ? dietaryPrefs.filter((x) => x !== d) : [...dietaryPrefs, d]
                      )
                    }
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      selected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    {d.replace('_', ' ').toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
              Declared Allergens (Critical Alert Warnings)
            </label>
            <div className="flex flex-wrap gap-2">
              {allAllergies.map((allergy) => {
                const selected = allergies.includes(allergy);
                return (
                  <button
                    key={allergy}
                    type="button"
                    onClick={() =>
                      setAllergies(
                        selected ? allergies.filter((a) => a !== allergy) : [...allergies, allergy]
                      )
                    }
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
        </div>

        {/* Nutrition Targets */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 text-slate-900">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Heart className="w-5 h-5 text-emerald-600" />
            <span>Daily Nutrition Benchmarks</span>
          </h2>

          <div className="space-y-4">
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
                <span>Daily Protein Goal: <strong className="text-blue-700">{targetProtein} grams</strong></span>
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
                <span>Added Sugar Ceiling: <strong className="text-amber-700">{targetSugar} grams</strong></span>
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
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20 text-sm disabled:opacity-50"
          >
            {saving ? 'Saving changes...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
