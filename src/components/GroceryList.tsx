import { useState } from 'react';
import { GroceryItem, GroceryCategory } from '../types';
import { Check, ShoppingBasket } from 'lucide-react';

interface Props {
  items: GroceryItem[];
}

const CATEGORY_META: Record<GroceryCategory, { emoji: string; color: string; bg: string }> = {
  'Produce':           { emoji: '🥦', color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
  'Protein':           { emoji: '🥩', color: 'text-red-600',   bg: 'bg-red-50 border-red-100' },
  'Dairy & Eggs':      { emoji: '🥛', color: 'text-yellow-600',bg: 'bg-yellow-50 border-yellow-100' },
  'Grains & Bread':    { emoji: '🍞', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
  'Nuts & Seeds':      { emoji: '🥜', color: 'text-orange-600',bg: 'bg-orange-50 border-orange-100' },
  'Condiments & Spices':{ emoji: '🧂', color: 'text-gray-500', bg: 'bg-gray-50 border-gray-200' },
  'Beverages':         { emoji: '🥤', color: 'text-sky-600',   bg: 'bg-sky-50 border-sky-100' },
  'Frozen & Canned':   { emoji: '🥫', color: 'text-blue-600',  bg: 'bg-blue-50 border-blue-100' },
};

export default function GroceryList({ items }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  function toggleItem(name: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  const grouped = items.reduce<Partial<Record<GroceryCategory, GroceryItem[]>>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category]!.push(item);
    return acc;
  }, {});

  const categories = Object.keys(grouped) as GroceryCategory[];
  const checkedCount = checked.size;
  const totalCount = items.length;
  const pct = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center">
              <ShoppingBasket size={16} className="text-brand-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-[15px]">Grocery List</h3>
              <p className="text-xs text-gray-400">{totalCount} items &middot; {categories.length} categories</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-extrabold text-brand-600">{checkedCount}<span className="text-gray-300 font-normal">/{totalCount}</span></p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">checked</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Categories grid */}
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((category) => {
          const meta = CATEGORY_META[category];
          const catItems = grouped[category]!;
          const catChecked = catItems.filter((i) => checked.has(i.name)).length;

          return (
            <div key={category} className={`rounded-2xl border p-4 ${meta.bg}`}>
              {/* Category header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{meta.emoji}</span>
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${meta.color}`}>{category}</span>
                </div>
                <span className="text-[10px] text-gray-400">{catChecked}/{catItems.length}</span>
              </div>

              {/* Items */}
              <ul className="space-y-2">
                {catItems.map((item) => {
                  const isChecked = checked.has(item.name);
                  return (
                    <li key={item.name}>
                      <button
                        type="button"
                        onClick={() => toggleItem(item.name)}
                        className="flex items-center gap-2.5 w-full text-left group"
                      >
                        <div className={`flex-shrink-0 w-4 h-4 rounded-[5px] border-[1.5px] flex items-center justify-center transition-all duration-150 ${
                          isChecked
                            ? 'bg-brand-500 border-brand-500'
                            : 'border-gray-300 bg-white group-hover:border-brand-400'
                        }`}>
                          {isChecked && <Check size={9} className="text-white" strokeWidth={3.5} />}
                        </div>
                        <span className={`text-[13px] leading-snug transition-all duration-150 ${
                          isChecked ? 'line-through text-gray-300' : 'text-gray-700 group-hover:text-gray-900'
                        }`}>
                          {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
