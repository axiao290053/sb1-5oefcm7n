import { UserPreferences, WeekPlan } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export async function generatePlanFromAI(prefs: UserPreferences): Promise<WeekPlan> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-meal-plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(prefs),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<WeekPlan>;
}
