import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Target, 
  Heart, 
  Utensils, 
  ArrowRight, 
  ChevronLeft, 
  Loader2, 
  Clover, 
  Flame, 
  Activity, 
  Wind,
  CheckCircle2,
  AlertCircle,
  X,
  ChefHat,
  Timer,
  ShieldAlert
} from 'lucide-react';
import { generateDayPlan, DayPlan, MealSuggestion } from './services/geminiService';

const GOALS = [
  { id: 'energy', label: 'Maximum Energy', emoji: '⚡', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  { id: 'muscle', label: 'Muscle Support', emoji: '🔥', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  { id: 'weight', label: 'Weight Balance', emoji: '⚖️', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  { id: 'gut', label: 'Gut Health', emoji: '🍀', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { id: 'focus', label: 'Mental Clarity', emoji: '🧠', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
];

const FEELINGS = [
  { id: 'sluggish', label: 'Sluggish & Heavy', emoji: '🍃' },
  { id: 'tired', label: 'Tired but Wired', emoji: '⚡' },
  { id: 'bloated', label: 'Bloated / Discomfort', emoji: '🎈' },
  { id: 'hungry', label: 'Extremely Hungry', emoji: '🍽️' },
  { id: 'calm', label: 'Stable & Ready', emoji: '⚖️' },
];

export default function App() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [feeling, setFeeling] = useState('');
  const [customFeeling, setCustomFeeling] = useState('');
  const [allergies, setAllergies] = useState('');
  const [avoidFoods, setAvoidFoods] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<DayPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<MealSuggestion | null>(null);
  const [servings, setServings] = useState(1);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateDayPlan(
        customFeeling || feeling,
        GOALS.find(g => g.id === goal)?.label || goal,
        allergies,
        avoidFoods
      );
      setPlan(result);
      setStep(3);
    } catch (err) {
      console.error(err);
      setError('I encountered an error while crafting your menu. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openMeal = (meal: MealSuggestion) => {
    setSelectedMeal(meal);
    setServings(meal.baseServings);
  };

  const reset = () => {
    setStep(1);
    setGoal('');
    setFeeling('');
    setCustomFeeling('');
    setAllergies('');
    setAvoidFoods('');
    setPlan(null);
    setError(null);
    setSelectedMeal(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-emerald-500 selection:text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-50/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="cursor-pointer" onClick={reset}>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">VitalBite<span className="text-emerald-500">.</span></h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Intuitive Nutrition Engine</p>
          </div>
          <div className="flex items-center gap-4">
            {step > 1 && (
              <button 
                onClick={() => step === 3 ? reset() : setStep(step - 1)}
                className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors flex items-center gap-1"
              >
                <ChevronLeft size={14} />
                {step === 3 ? 'Start Over' : 'Prev Step'}
              </button>
            )}
            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-800">Guest User</p>
                <p className="text-[9px] text-slate-400 uppercase font-bold">Standard Access</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-xs text-slate-500">GU</div>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold tracking-tight text-slate-800 mb-2">Core Nutrition Objective</h2>
                <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">What is your primary target today?</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {GOALS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => { setGoal(g.id); setStep(2); }}
                    className={`group relative p-8 rounded-[2rem] border transition-all duration-300 text-left overflow-hidden ${
                      goal === g.id ? 'border-emerald-500 bg-white shadow-lg' : 'border-slate-200 bg-white hover:border-emerald-300 shadow-sm'
                    }`}
                  >
                    <div className={`${g.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-2xl`}>
                      {g.emoji}
                    </div>
                    <span className="text-lg font-bold text-slate-800 block mb-1">{g.label}</span>
                    <p className="text-xs text-slate-500 font-medium">Optimize intake for {g.label.toLowerCase()}</p>
                    <ArrowRight className={`absolute bottom-8 right-8 transition-all ${goal === g.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} size={20} />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold tracking-tight text-slate-800 mb-2">Biometric Status</h2>
                <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">Calibration of current physical feelings</p>
              </div>

              <div className="grid grid-cols-12 gap-4">
                {/* Feelings Panel */}
                <div className="col-span-12 md:col-span-4 bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Current Vibe</h3>
                  <div className="flex flex-col gap-3">
                    {FEELINGS.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFeeling(f.id)}
                        className={`w-full py-4 px-5 rounded-2xl border transition-all flex items-center gap-4 text-sm font-bold ${
                          feeling === f.id 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' 
                          : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200'
                        }`}
                      >
                        <span className="text-xl">{f.emoji}</span>
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Details & Restrictions */}
                <div className="col-span-12 md:col-span-8 flex flex-col gap-4">
                  <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex-1">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Nuance & Context</h3>
                    <textarea
                      value={customFeeling}
                      onChange={(e) => setCustomFeeling(e.target.value)}
                      placeholder="Describe your current state in high fidelity..."
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none min-h-[120px] transition-all text-sm leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-4 text-slate-400">
                        <ShieldAlert size={16} />
                        <h3 className="text-[10px] font-bold uppercase tracking-widest">Allergies</h3>
                      </div>
                      <textarea
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                        placeholder="List any restrictions..."
                        className="w-full bg-slate-50 border-transparent rounded-xl px-4 py-3 focus:bg-white focus:ring-0 focus:outline-none text-sm min-h-[70px]"
                      />
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-4 text-slate-400">
                        <X size={16} />
                        <h3 className="text-[10px] font-bold uppercase tracking-widest">Avoidances</h3>
                      </div>
                      <textarea
                        value={avoidFoods}
                        onChange={(e) => setAvoidFoods(e.target.value)}
                        placeholder="Disliked ingredients..."
                        className="w-full bg-slate-50 border-transparent rounded-xl px-4 py-3 focus:bg-white focus:ring-0 focus:outline-none text-sm min-h-[70px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-12 pt-4">
                  <button
                    disabled={(!feeling && !customFeeling) || loading}
                    onClick={handleGenerate}
                    className="w-full py-6 rounded-full bg-emerald-500 text-white text-sm font-bold uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Syncing with Nutrition Engine...
                      </>
                    ) : (
                      <>
                        Update Feed & Generate Plan
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-6 p-5 bg-red-50 text-red-600 rounded-[2rem] border border-red-100 flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <AlertCircle size={20} />
                  </div>
                  <p className="text-sm font-bold">{error}</p>
                </div>
              )}
            </motion.div>
          )}

          {step === 3 && plan && (
            <motion.div
              key="step3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-12 gap-4"
            >
              {/* Header Info - Bento Style */}
              <div className="col-span-12 md:col-span-8 space-y-4">
                <div className="bg-emerald-500 rounded-[2.5rem] p-8 text-white shadow-lg overflow-hidden relative">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-100 block mb-4">Strategic Wellness Advice</span>
                  <h2 className="text-3xl font-bold leading-tight max-w-2xl relative z-10">
                    {plan.overallAdvice}
                  </h2>
                  <div className="absolute top-0 right-0 w-48 h-48 opacity-10 translate-x-12 -translate-y-12">
                    <Heart size={200} />
                  </div>
                </div>
              </div>

              {/* Status Stats - Bento Column */}
              <div className="col-span-12 md:col-span-4 grid grid-cols-1 gap-4">
                <div className="bg-indigo-600 rounded-[2.5rem] p-6 text-white shadow-lg flex flex-col justify-between">
                  <h3 className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-4">Target Goal</h3>
                  <p className="text-xl font-bold leading-tight mb-4">
                    {GOALS.find(g => g.id === goal)?.label || goal}
                  </p>
                  <div className="w-full bg-indigo-500 h-2 rounded-full overflow-hidden">
                    <div className="bg-white w-[85%] h-full"></div>
                  </div>
                </div>
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-6 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl">
                    {FEELINGS.find(f => f.id === feeling)?.emoji || '✨'}
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Inherent Vibe</h3>
                    <p className="text-sm font-bold text-slate-800">{FEELINGS.find(f => f.id === feeling)?.label || feeling}</p>
                  </div>
                </div>
              </div>

              {/* Meals Grid */}
              {[
                { key: 'breakfast', time: '08:30 • Breakfast', data: plan.breakfast, span: 'md:col-span-6' },
                { key: 'lunch', time: '13:00 • Lunch', data: plan.lunch, span: 'md:col-span-6' },
                { key: 'dinner', time: '19:30 • Dinner', data: plan.dinner, span: 'md:col-span-8' },
                { key: 'snack', time: '16:00 • Snack', data: plan.snack, span: 'md:col-span-4' },
              ].map((item, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={item.key}
                  onClick={() => openMeal(item.data)}
                  className={`group cursor-pointer bg-white rounded-[2.5rem] p-8 border border-slate-200 hover:border-emerald-500/30 shadow-sm transition-all duration-500 overflow-hidden relative flex flex-col justify-between ${item.span}`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {item.time}
                      </span>
                      <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                        <Utensils size={18} />
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 mb-8">
                      <div className="w-full md:w-40 aspect-video md:aspect-square shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                        <img 
                          src={`https://picsum.photos/seed/${item.data.imageSearchKeyword}/400/400`} 
                          alt={item.data.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2 leading-tight">{item.data.name}</h3>
                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{item.data.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-6 border-t border-slate-50">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.data.ingredients.slice(0, 3).map((ing, i) => (
                        <span key={i} className="px-3 py-1 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 rounded-full border border-slate-100">
                          {ing.name}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-start gap-2 text-emerald-600 bg-emerald-50 p-4 rounded-2xl">
                      <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                      <p className="text-xs font-bold leading-relaxed">{item.data.benefits}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="col-span-12 flex justify-center pt-12">
                <button 
                  onClick={reset}
                  className="px-10 py-4 rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
                >
                  Create New Regimen
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recipe Modal */}
        <AnimatePresence>
          {selectedMeal && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedMeal(null)}
                className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-x-6 bottom-6 top-24 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl sm:max-h-[85vh] bg-white z-[70] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-slate-200"
              >
                <div className="relative h-72 shrink-0">
                  <img 
                    src={`https://picsum.photos/seed/${selectedMeal.imageSearchKeyword}/1200/600`} 
                    alt={selectedMeal.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent p-10 flex items-end">
                    <h2 className="text-white text-4xl font-bold tracking-tight leading-tight">{selectedMeal.name}</h2>
                  </div>
                  <button 
                    onClick={() => setSelectedMeal(null)}
                    className="absolute top-6 right-6 w-10 h-10 bg-slate-900/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-slate-900/40 transition-all border border-white/20"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-10 overflow-y-auto space-y-10 custom-scrollbar">
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-2xl text-slate-500">
                      <ChefHat size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{selectedMeal.mealType}</span>
                    </div>
                    <div className="flex items-center gap-4 bg-emerald-50 px-4 py-2 rounded-2xl text-emerald-700 border border-emerald-100">
                      <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Servings</label>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setServings(Math.max(1, servings - 1))}
                          className="w-6 h-6 rounded-lg bg-white border border-emerald-200 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-30"
                          disabled={servings <= 1}
                        >
                          <X size={12} className="rotate-45" />
                        </button>
                        <span className="text-sm font-bold w-4 text-center">{servings}</span>
                        <button 
                          onClick={() => setServings(servings + 1)}
                          className="w-6 h-6 rounded-lg bg-white border border-emerald-200 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all"
                        >
                          <span className="text-lg leading-none">+</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Ingredients */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                        <Utensils size={14} />
                        Ingredients
                      </h4>
                      <ul className="space-y-4">
                        {selectedMeal.ingredients.map((ing, i) => {
                          const scaledQty = (ing.quantity * (servings / selectedMeal.baseServings)).toFixed(1).replace(/\.0$/, '');
                          return (
                            <li key={i} className="flex items-start gap-3 group text-slate-600">
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                              <p className="text-sm">
                                <span className="font-bold text-slate-900">{scaledQty} {ing.unit}</span> {ing.name}
                              </p>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* Directions */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                        <Timer size={14} />
                        Instructions
                      </h4>
                      <ol className="space-y-8">
                        {selectedMeal.instructions.map((step, i) => (
                          <li key={i} className="relative pl-10 text-sm text-slate-600 leading-relaxed">
                            <span className="absolute left-0 top-0 text-[10px] font-bold text-emerald-700 bg-emerald-50 w-7 h-7 rounded-lg flex items-center justify-center border border-emerald-100">
                              {i + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  <div className="pt-10 border-t border-slate-100">
                    <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <Zap size={20} className="text-amber-500 mt-1 shrink-0" />
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Metabolic Impact</h4>
                        <p className="text-sm text-slate-600 leading-relaxed italic">"{selectedMeal.benefits}"</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #5A5A4020;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
