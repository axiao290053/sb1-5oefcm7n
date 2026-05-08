import { useState } from 'react';
import { DayPlan } from '../types';
import MealCard from './MealCard';
import { ChevronDown } from 'lucide-react';

interface Props {
  dayPlan: DayPlan;
  index: number;
}

const DAY_ABBREVS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function DayCard({ dayPlan, index }: Props) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden transition-all duration-200">
      {/* Header row */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors duration-150 text-left group"
      >
        {/* Day chip */}
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{DAY_ABBREVS[index]}</span>
          <span className="text-lg font-extrabold text-gray-800 leading-none">{index + 1}</span>
        </div>

        {/* Day name + calorie */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-[15px]">{dayPlan.day}</p>
          <p className="text-xs text-gray-400 mt-0.5">{dayPlan.totalCalories.toLocaleString()} kcal &middot; 4 meals</p>
        </div>

        {/* Macro pills (desktop) */}
        <div className="hidden md:flex items-center gap-1.5 mr-2">
          {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => {
            const labels = { breakfast: 'B', lunch: 'L', dinner: 'D', snack: 'S' };
            const colors = {
              breakfast: 'bg-amber-100 text-amber-600',
              lunch: 'bg-sky-100 text-sky-600',
              dinner: 'bg-slate-100 text-slate-600',
              snack: 'bg-rose-100 text-rose-500',
            };
            return (
              <span key={type} className={`w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center ${colors[type]}`}>
                {labels[type]}
              </span>
            );
          })}
        </div>

        {/* Chevron */}
        <ChevronDown
          size={16}
          className={`flex-shrink-0 text-gray-400 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Expanded meals */}
      {expanded && (
        <div className="border-t border-gray-100 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
          <MealCard type="breakfast" meal={dayPlan.breakfast} />
          <MealCard type="lunch" meal={dayPlan.lunch} />
          <MealCard type="dinner" meal={dayPlan.dinner} />
          <MealCard type="snack" meal={dayPlan.snack} />
        </div>
      )}
    </div>
  );
}
