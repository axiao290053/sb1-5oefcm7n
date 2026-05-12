import { useState, useRef } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { UserPreferences, WeekPlan as WeekPlanType } from './types';
import { generateWeekPlan } from './generatePlan';
import { generatePlanFromAI } from './generatePlanFromAI';
import PlannerForm from './components/PlannerForm';
import DayCard from './components/DayCard';
import GroceryList from './components/GroceryList';
import { Sparkles, RefreshCw, UtensilsCrossed, ShoppingBasket, ArrowDown } from 'lucide-react';

type Tab = 'plan' | 'grocery';

export default function App() {
  const [plan, setPlan] = useState<WeekPlanType | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('plan');
  const [lastPrefs, setLastPrefs] = useState<UserPreferences | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  async function handleGenerate(prefs: UserPreferences) {
    setLoading(true);
    setLastPrefs(prefs);
    try {
      const aiPlan = await generatePlanFromAI(prefs);
      setPlan(aiPlan);
    } catch {
      setPlan(generateWeekPlan(prefs));
    } finally {
      setLoading(false);
      setActiveTab('plan');
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  }

  function handleRegenerate() {
    if (lastPrefs) handleGenerate(lastPrefs);
  }

  const avgCalories = plan
    ? Math.round(plan.days.reduce((sum, d) => sum + d.totalCalories, 0) / plan.days.length)
    : null;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Analytics />
      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center shadow-sm">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-[15px] tracking-tight">MealPlan AI</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-slow" />
              Free &middot; No account needed
            </span>
          </div>
        </div>
      </nav>

      <main className="pt-14">
        {/* ── Hero ── */}
        <section className="max-w-5xl mx-auto px-6 pt-20 pb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-brand-100 mb-6">
            <Sparkles size={11} />
            AI-Powered Meal Planning
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-5">
            Your personalized<br />
            <span className="text-brand-500">7-day meal plan</span>
            <br />in seconds
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed mb-8 font-[350]">
            Tell us your goals, dietary preferences, and foods to avoid — we'll instantly build a balanced week of meals with a complete grocery list.
          </p>

          {!plan && (
            <div className="flex items-center justify-center gap-2 text-gray-300 text-sm">
              <ArrowDown size={16} className="animate-bounce" />
            </div>
          )}
        </section>

        {/* ── Form card ── */}
        <section className="max-w-2xl mx-auto px-6 pb-16">
          <div className="bg-white rounded-3xl shadow-card-lg border border-gray-100 overflow-hidden">
            {plan && (
              <div className="px-8 pt-7 pb-0 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-500">Adjust preferences</p>
                <button
                  onClick={handleRegenerate}
                  disabled={loading}
                  className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-100 px-3 py-1.5 rounded-full transition-all duration-150 disabled:opacity-50"
                >
                  <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                  Regenerate
                </button>
              </div>
            )}
            <div className="p-8">
              <PlannerForm onGenerate={handleGenerate} loading={loading} />
            </div>
          </div>
        </section>

        {/* ── Results ── */}
        {plan && (
          <section
            ref={resultsRef}
            className="max-w-3xl mx-auto px-6 pb-24 space-y-8 animate-fade-up"
          >
            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Avg. Calories', value: `${avgCalories}`, unit: 'kcal / day' },
                { label: 'Days Planned', value: '7', unit: 'days' },
                { label: 'Total Meals', value: '28', unit: 'meals' },
                { label: 'Grocery Items', value: `${plan.groceryList.length}`, unit: 'items' },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={`bg-white rounded-2xl border border-gray-100 shadow-card px-5 py-4 animate-fade-up animate-stagger-${i + 1}`}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-extrabold text-gray-900 leading-none">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.unit}</p>
                </div>
              ))}
            </div>

            {/* Tab switcher */}
            <div className="bg-gray-100/80 backdrop-blur-sm rounded-2xl p-1 flex gap-1">
              {([
                { id: 'plan', label: '7-Day Meal Plan', icon: <UtensilsCrossed size={14} /> },
                { id: 'grocery', label: 'Grocery List', icon: <ShoppingBasket size={14} /> },
              ] as { id: Tab; label: string; icon: React.ReactNode }[]).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-card'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Meal plan */}
            {activeTab === 'plan' && (
              <div className="space-y-3">
                {plan.days.map((day, i) => (
                  <div key={day.day} className={`animate-fade-up animate-stagger-${Math.min(i + 1, 7)}`}>
                    <DayCard dayPlan={day} index={i} />
                  </div>
                ))}
              </div>
            )}

            {/* Grocery list */}
            {activeTab === 'grocery' && (
              <div className="animate-fade-up">
                <GroceryList items={plan.groceryList} />
              </div>
            )}
          </section>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-8">
        <p className="text-center text-xs text-gray-300 font-medium">
          MealPlan AI &mdash; free, private, no account required.
        </p>
      </footer>
    </div>
  );
}
