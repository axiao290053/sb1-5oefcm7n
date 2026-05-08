import { Meal } from '../types';

interface Props {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  meal: Meal;
}

const TYPE_CONFIG = {
  breakfast: {
    label: 'Breakfast',
    dot: 'bg-amber-400',
    badge: 'text-amber-600 bg-amber-50',
    bar: 'bg-amber-400',
  },
  lunch: {
    label: 'Lunch',
    dot: 'bg-sky-400',
    badge: 'text-sky-600 bg-sky-50',
    bar: 'bg-sky-400',
  },
  dinner: {
    label: 'Dinner',
    dot: 'bg-slate-400',
    badge: 'text-slate-600 bg-slate-50',
    bar: 'bg-slate-400',
  },
  snack: {
    label: 'Snack',
    dot: 'bg-rose-400',
    badge: 'text-rose-600 bg-rose-50',
    bar: 'bg-rose-400',
  },
};

export default function MealCard({ type, meal }: Props) {
  const cfg = TYPE_CONFIG[type];
  const totalMacros = meal.protein + meal.carbs + meal.fat || 1;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-card p-4 hover:shadow-card-md transition-all duration-200 hover:-translate-y-0.5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${cfg.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>
        <span className="text-xs font-semibold text-gray-400">{meal.calories} kcal</span>
      </div>

      {/* Name */}
      <p className="text-[13px] font-semibold text-gray-800 leading-snug mb-3">{meal.name}</p>

      {/* Macro bar */}
      <div className="flex rounded-full overflow-hidden h-1 mb-2.5 bg-gray-100">
        <div className="bg-blue-400 h-full transition-all duration-300" style={{ width: `${(meal.protein / totalMacros) * 100}%` }} />
        <div className="bg-amber-400 h-full transition-all duration-300" style={{ width: `${(meal.carbs / totalMacros) * 100}%` }} />
        <div className="bg-rose-300 h-full transition-all duration-300" style={{ width: `${(meal.fat / totalMacros) * 100}%` }} />
      </div>

      {/* Macro labels */}
      <div className="flex gap-3 text-[11px] text-gray-400">
        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />P {meal.protein}g</span>
        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />C {meal.carbs}g</span>
        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-300 inline-block" />F {meal.fat}g</span>
      </div>
    </div>
  );
}
