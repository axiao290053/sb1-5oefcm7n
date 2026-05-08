import { useState } from 'react';
import { Goal, DietType, UserPreferences } from '../types';
import { Flame, Zap, Leaf, Activity, Ban, Sparkles } from 'lucide-react';

interface Props {
  onGenerate: (prefs: UserPreferences) => void;
  loading: boolean;
}

const GOALS: { value: Goal; label: string; description: string; icon: React.ReactNode; color: string }[] = [
  {
    value: 'lose_weight',
    label: 'Lose Weight',
    description: 'Calorie deficit meals',
    icon: <Flame size={18} />,
    color: 'peer-checked:border-orange-400 peer-checked:bg-orange-50',
  },
  {
    value: 'gain_muscle',
    label: 'Gain Muscle',
    description: 'High protein & energy',
    icon: <Zap size={18} />,
    color: 'peer-checked:border-blue-400 peer-checked:bg-blue-50',
  },
  {
    value: 'eat_healthy',
    label: 'Eat Healthy',
    description: 'Balanced & nutritious',
    icon: <Leaf size={18} />,
    color: 'peer-checked:border-brand-400 peer-checked:bg-brand-50',
  },
];

const DIETS: { value: DietType; label: string; description: string }[] = [
  { value: 'high_protein', label: 'High Protein', description: '30%+ protein ratio' },
  { value: 'vegetarian', label: 'Vegetarian', description: 'No meat or fish' },
  { value: 'low_carb', label: 'Low Carb', description: 'Under 100g carbs/day' },
];

const GOAL_ACTIVE: Record<Goal, string> = {
  lose_weight: 'border-orange-400 bg-orange-50 shadow-sm',
  gain_muscle: 'border-blue-400 bg-blue-50 shadow-sm',
  eat_healthy: 'border-brand-400 bg-brand-50 shadow-sm',
};

const GOAL_ICON_ACTIVE: Record<Goal, string> = {
  lose_weight: 'text-orange-500',
  gain_muscle: 'text-blue-500',
  eat_healthy: 'text-brand-500',
};

const GOAL_TEXT_ACTIVE: Record<Goal, string> = {
  lose_weight: 'text-orange-700',
  gain_muscle: 'text-blue-700',
  eat_healthy: 'text-brand-700',
};

export default function PlannerForm({ onGenerate, loading }: Props) {
  const [goal, setGoal] = useState<Goal>('eat_healthy');
  const [dietType, setDietType] = useState<DietType>('high_protein');
  const [calories, setCalories] = useState('');
  const [avoidInput, setAvoidInput] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const avoidFoods = avoidInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    onGenerate({ goal, dietType, calories: calories ? parseInt(calories, 10) : null, avoidFoods });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Goal */}
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Your Goal
        </legend>
        <div className="grid grid-cols-3 gap-2.5">
          {GOALS.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => setGoal(g.value)}
              className={`group relative flex flex-col items-start gap-1.5 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                goal === g.value
                  ? GOAL_ACTIVE[g.value]
                  : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white'
              }`}
            >
              <span className={`transition-colors duration-200 ${
                goal === g.value ? GOAL_ICON_ACTIVE[g.value] : 'text-gray-400'
              }`}>
                {g.icon}
              </span>
              <span className={`font-semibold text-[13px] leading-tight transition-colors duration-200 ${
                goal === g.value ? GOAL_TEXT_ACTIVE[g.value] : 'text-gray-600'
              }`}>
                {g.label}
              </span>
              <span className="text-[11px] text-gray-400 leading-tight hidden sm:block">{g.description}</span>
              {goal === g.value && (
                <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-current opacity-60" />
              )}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Diet type */}
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Diet Type
        </legend>
        <div className="grid grid-cols-3 gap-2.5">
          {DIETS.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setDietType(d.value)}
              className={`flex flex-col items-start gap-1 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                dietType === d.value
                  ? 'border-brand-400 bg-brand-50 shadow-sm'
                  : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white'
              }`}
            >
              <span className={`font-semibold text-[13px] transition-colors duration-200 ${
                dietType === d.value ? 'text-brand-700' : 'text-gray-600'
              }`}>
                {d.label}
              </span>
              <span className="text-[11px] text-gray-400 leading-tight hidden sm:block">{d.description}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* Optional fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
            <Activity size={11} />
            Daily Calories
            <span className="font-normal normal-case tracking-normal text-gray-300">(optional)</span>
          </label>
          <div className="relative">
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="e.g. 2000"
              min={800}
              max={5000}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[14px] text-gray-700 placeholder-gray-300 shadow-inner-sm focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400 transition-all duration-150"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
            <Ban size={11} />
            Foods to Avoid
            <span className="font-normal normal-case tracking-normal text-gray-300">(optional)</span>
          </label>
          <input
            type="text"
            value={avoidInput}
            onChange={(e) => setAvoidInput(e.target.value)}
            placeholder="nuts, eggs, shellfish…"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[14px] text-gray-700 placeholder-gray-300 shadow-inner-sm focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400 transition-all duration-150"
          />
        </div>
      </div>

      {/* CTA */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-bold text-[15px] tracking-tight transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 group"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white/80" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="font-semibold">Generating your meal plan…</span>
          </>
        ) : (
          <>
            <Sparkles size={16} className="group-hover:rotate-12 transition-transform duration-200" />
            Generate My Meal Plan
          </>
        )}
      </button>
    </form>
  );
}
