import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { DailyDiaryData } from '../types';
import {
  Plus,
  Trash2,
  Sparkles,
  Coffee,
  Sun,
  Moon,
  Cookie,
} from 'lucide-react';

interface FoodDiaryPageProps {
  onNavigate: (tab: string) => void;
}

export const FoodDiaryPage: React.FC<FoodDiaryPageProps> = () => {
  const [diaryData, setDiaryData] = useState<DailyDiaryData | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Modal for adding meal
  const [showAddModal, setShowAddModal] = useState(false);
  const [mealCategory, setMealCategory] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [foodName, setFoodName] = useState('');
  const [portionAmount, setPortionAmount] = useState(1);
  const [portionUnit, setPortionUnit] = useState('serving');
  const [calories, setCalories] = useState(300);
  const [protein, setProtein] = useState(10);
  const [carbs, setCarbs] = useState(40);
  const [fat, setFat] = useState(10);
  const [sugar, setSugar] = useState(5);
  const [sodium, setSodium] = useState(400);

  // AI Meal Estimation state
  const [aiPrompt, setAiPrompt] = useState('');
  const [isEstimating, setIsEstimating] = useState(false);

  const fetchDiary = async (dayStr: string) => {
    try {
      const data = await api.getDailyDiary(dayStr);
      setDiaryData(data);
    } catch (err) {
      console.error('Failed to load food diary:', err);
    }
  };

  useEffect(() => {
    fetchDiary(selectedDate);
  }, [selectedDate]);

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;

    try {
      await api.addMealEntry({
        meal_type: mealCategory,
        food_name: foodName,
        portion_amount: portionAmount,
        portion_unit: portionUnit,
        calories,
        protein,
        carbs,
        fat,
        sugar,
        sodium,
        entry_date: selectedDate,
        source_type: aiPrompt ? 'photo_ai' : 'manual',
      });
      setShowAddModal(false);
      setFoodName('');
      setAiPrompt('');
      fetchDiary(selectedDate);
    } catch {
      alert('Failed to log meal entry.');
    }
  };

  const handleDeleteEntry = async (entryId: number) => {
    try {
      await api.deleteMealEntry(entryId);
      fetchDiary(selectedDate);
    } catch {
      alert('Could not delete meal entry.');
    }
  };

  const handleAiEstimate = async () => {
    if (!aiPrompt.trim()) return;
    setIsEstimating(true);
    try {
      const est = await api.estimateMeal(aiPrompt);
      if (est) {
        setFoodName(est.food_name || aiPrompt);
        setPortionAmount(est.portion_amount || 1);
        setPortionUnit(est.portion_unit || 'serving');
        setCalories(est.calories || 250);
        setProtein(est.protein || 8);
        setCarbs(est.carbs || 35);
        setFat(est.fat || 8);
        setSugar(est.sugar || 3);
        setSodium(est.sodium || 400);
      }
    } catch {
      alert('Could not estimate dish. You can enter values manually.');
    } finally {
      setIsEstimating(false);
    }
  };

  const sections = [
    { id: 'breakfast', title: 'Breakfast', icon: Coffee, items: diaryData?.meals?.breakfast || [] },
    { id: 'lunch', title: 'Lunch', icon: Sun, items: diaryData?.meals?.lunch || [] },
    { id: 'dinner', title: 'Dinner', icon: Moon, items: diaryData?.meals?.dinner || [] },
    { id: 'snack', title: 'Snacks & Packaged Food', icon: Cookie, items: diaryData?.meals?.snack || [] },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header & Date Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2 shadow-xs">
            <span>🌿</span>
            <span>Nutrition & Intake Journal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">Daily Food Diary</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track daily calorie consumption and nutrient safety thresholds.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600 transition-colors shadow-sm"
          />

          <button
            onClick={() => {
              setMealCategory('lunch');
              setShowAddModal(true);
            }}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20 flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Log Food</span>
          </button>
        </div>
      </div>

      {/* Daily Progress Overview Cards */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-inner">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Calories</span>
            <span className="text-2xl font-black text-slate-900 font-mono">
              {diaryData?.totals?.calories || 0}
            </span>
            <span className="text-[10px] text-slate-500 block font-medium mt-1">
              / {diaryData?.targets?.calories || 2000} kcal
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-inner">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Protein</span>
            <span className="text-2xl font-black text-emerald-700 font-mono">
              {diaryData?.totals?.protein || 0}g
            </span>
            <span className="text-[10px] text-slate-500 block font-medium mt-1">
              / {diaryData?.targets?.protein || 60}g target
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-inner">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Carbs</span>
            <span className="text-2xl font-black text-teal-700 font-mono">
              {diaryData?.totals?.carbs || 0}g
            </span>
            <span className="text-[10px] text-slate-500 block font-medium mt-1">
              / {diaryData?.targets?.carbs || 250}g
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-inner">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Sugar</span>
            <span
              className={`text-2xl font-black font-mono ${(diaryData?.totals?.sugar || 0) > (diaryData?.targets?.sugar || 30)
                  ? 'text-rose-600'
                  : 'text-slate-900'
                }`}
            >
              {diaryData?.totals?.sugar || 0}g
            </span>
            <span className="text-[10px] text-slate-500 block font-medium mt-1">
              / Max {diaryData?.targets?.sugar || 30}g
            </span>
          </div>
        </div>
      </div>

      {/* Meal Category Blocks */}
      <div className="space-y-4">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const sectionCals = sec.items.reduce((sum, item) => sum + item.calories, 0);

          return (
            <div
              key={sec.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm"
            >
              <div className="p-4 sm:p-5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">{sec.title}</h3>
                    <span className="text-[11px] font-mono font-semibold text-slate-500">
                      {sectionCals} kcal
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMealCategory(sec.id as any);
                    setShowAddModal(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-300 text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors flex items-center space-x-1 bg-white shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
              </div>

              {sec.items.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {sec.items.map((meal) => (
                    <div
                      key={meal.id}
                      className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50/60 transition-colors"
                    >
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900 text-sm">{meal.food_name}</h4>
                        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                          <span>
                            {meal.portion_amount} {meal.portion_unit}
                          </span>
                          <span>·</span>
                          <span className="font-mono font-semibold text-slate-900">{meal.calories} kcal</span>
                          <span>·</span>
                          <span className="font-mono text-emerald-700 font-semibold">P: {meal.protein}g</span>
                          <span>·</span>
                          <span className="font-mono text-slate-700">C: {meal.carbs}g</span>
                          <span>·</span>
                          <span className="font-mono text-amber-700">S: {meal.sugar}g</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteEntry(meal.id)}
                        className="text-slate-400 hover:text-rose-600 p-2 transition-colors"
                        title="Delete meal entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-400 italic">
                  No items logged for {sec.title.toLowerCase()}.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Meal Modal with AI Estimation Support */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 text-slate-900">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black text-slate-900">Log Food or Dish</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter meal details manually or let AI estimate traditional dishes.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 text-base font-bold"
              >
                ✕
              </button>
            </div>

            {/* AI Estimation Strip */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>AI Meal Estimation (e.g. "2 Rotis with Dal and Curd")</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe dish in plain English..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-emerald-600"
                />
                <button
                  type="button"
                  disabled={isEstimating || !aiPrompt.trim()}
                  onClick={handleAiEstimate}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-md shadow-emerald-600/20"
                >
                  {isEstimating ? 'Estimating...' : 'Estimate'}
                </button>
              </div>
            </div>

            <form onSubmit={handleAddMeal} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-500 mb-1">Meal Period</label>
                  <select
                    value={mealCategory}
                    onChange={(e) => setMealCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-600"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-500 mb-1">Portion Unit</label>
                  <input
                    type="text"
                    value={portionUnit}
                    onChange={(e) => setPortionUnit(e.target.value)}
                    placeholder="plate / bowl / serving"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">Food / Dish Name</label>
                <input
                  type="text"
                  required
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g. Masala Dosa or Oats"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-500 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={protein}
                    onChange={(e) => setProtein(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-500 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={carbs}
                    onChange={(e) => setCarbs(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-500 mb-1">Fat (g)</label>
                  <input
                    type="number"
                    value={fat}
                    onChange={(e) => setFat(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-500 mb-1">Sugar (g)</label>
                  <input
                    type="number"
                    value={sugar}
                    onChange={(e) => setSugar(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-500 mb-1">Sodium (mg)</label>
                  <input
                    type="number"
                    value={sodium}
                    onChange={(e) => setSodium(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
