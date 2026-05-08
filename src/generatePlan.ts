import { UserPreferences, DayPlan, WeekPlan, Meal, GroceryItem, GroceryCategory } from './types';
import { BREAKFASTS, LUNCHES, DINNERS, SNACKS } from './mealData';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const INGREDIENT_CATEGORIES: Record<string, GroceryCategory> = {
  'chicken breast': 'Protein',
  'salmon fillet': 'Protein',
  'ground turkey': 'Protein',
  'turkey breast': 'Protein',
  'lean beef': 'Protein',
  'ground beef': 'Protein',
  'shrimp': 'Protein',
  'cod fillet': 'Protein',
  'canned tuna': 'Protein',
  'smoked salmon': 'Protein',
  'eggs': 'Dairy & Eggs',
  'egg whites': 'Dairy & Eggs',
  'hard boiled eggs': 'Dairy & Eggs',
  'greek yogurt': 'Dairy & Eggs',
  'cottage cheese': 'Dairy & Eggs',
  'feta cheese': 'Dairy & Eggs',
  'parmesan': 'Dairy & Eggs',
  'cream cheese': 'Dairy & Eggs',
  'fresh mozzarella': 'Dairy & Eggs',
  'cheese': 'Dairy & Eggs',
  'almond milk': 'Beverages',
  'coconut milk': 'Beverages',
  'mixed berries': 'Produce',
  'banana': 'Produce',
  'apple': 'Produce',
  'cherry tomatoes': 'Produce',
  'tomatoes': 'Produce',
  'tomato': 'Produce',
  'spinach': 'Produce',
  'mixed greens': 'Produce',
  'romaine lettuce': 'Produce',
  'lettuce': 'Produce',
  'broccoli': 'Produce',
  'asparagus': 'Produce',
  'bell peppers': 'Produce',
  'bell pepper': 'Produce',
  'cucumber': 'Produce',
  'zucchini': 'Produce',
  'mushrooms': 'Produce',
  'avocado': 'Produce',
  'celery': 'Produce',
  'carrots': 'Produce',
  'onion': 'Produce',
  'red onion': 'Produce',
  'garlic': 'Produce',
  'ginger': 'Produce',
  'lemon': 'Produce',
  'lime': 'Produce',
  'mango': 'Produce',
  'pineapple chunks': 'Produce',
  'strawberries': 'Produce',
  'blueberries': 'Produce',
  'green beans': 'Produce',
  'snap peas': 'Produce',
  'peas': 'Produce',
  'corn': 'Produce',
  'edamame': 'Produce',
  'cauliflower': 'Produce',
  'sweet potato': 'Produce',
  'cabbage': 'Produce',
  'red cabbage': 'Produce',
  'basil': 'Produce',
  'cilantro': 'Produce',
  'jalapeño': 'Produce',
  'green onion': 'Produce',
  'dill': 'Condiments & Spices',
  'rolled oats': 'Grains & Bread',
  'granola': 'Grains & Bread',
  'whole grain bread': 'Grains & Bread',
  'whole wheat wrap': 'Grains & Bread',
  'whole wheat bagel': 'Grains & Bread',
  'pita bread': 'Grains & Bread',
  'brown rice': 'Grains & Bread',
  'quinoa': 'Grains & Bread',
  'corn tortillas': 'Grains & Bread',
  'almonds': 'Nuts & Seeds',
  'walnuts': 'Nuts & Seeds',
  'cashews': 'Nuts & Seeds',
  'peanuts': 'Nuts & Seeds',
  'almond butter': 'Nuts & Seeds',
  'peanut butter': 'Nuts & Seeds',
  'chia seeds': 'Nuts & Seeds',
  'flaxseeds': 'Nuts & Seeds',
  'sesame seeds': 'Nuts & Seeds',
  'mixed nuts': 'Nuts & Seeds',
  'dried cranberries': 'Nuts & Seeds',
  'olive oil': 'Condiments & Spices',
  'sesame oil': 'Condiments & Spices',
  'soy sauce': 'Condiments & Spices',
  'fish sauce': 'Condiments & Spices',
  'balsamic vinegar': 'Condiments & Spices',
  'honey': 'Condiments & Spices',
  'vanilla extract': 'Condiments & Spices',
  'cumin': 'Condiments & Spices',
  'turmeric': 'Condiments & Spices',
  'curry powder': 'Condiments & Spices',
  'paprika': 'Condiments & Spices',
  'cinnamon': 'Condiments & Spices',
  'sea salt': 'Condiments & Spices',
  'caesar dressing': 'Condiments & Spices',
  'salsa': 'Condiments & Spices',
  'hummus': 'Condiments & Spices',
  'tzatziki': 'Condiments & Spices',
  'tomato sauce': 'Frozen & Canned',
  'black beans': 'Frozen & Canned',
  'chickpeas': 'Frozen & Canned',
  'lentils': 'Frozen & Canned',
  'olives': 'Frozen & Canned',
  'capers': 'Frozen & Canned',
  'frozen berries': 'Frozen & Canned',
  'protein powder': 'Protein',
  'protein bar': 'Protein',
};

function containsAvoidedFood(meal: Meal, avoidFoods: string[]): boolean {
  const lowerIngredients = meal.ingredients.map((i) => i.toLowerCase());
  const lowerName = meal.name.toLowerCase();
  return avoidFoods.some((food) => {
    const lowerFood = food.toLowerCase().trim();
    return (
      lowerIngredients.some((ing) => ing.includes(lowerFood)) ||
      lowerName.includes(lowerFood)
    );
  });
}

function scoreMeal(meal: Meal, prefs: UserPreferences, targetCaloriesPerMeal: number): number {
  let score = 0;

  if (meal.tags.includes(prefs.dietType)) score += 3;
  if (meal.goals.includes(prefs.goal)) score += 2;

  const calDiff = Math.abs(meal.calories - targetCaloriesPerMeal);
  score -= calDiff / 100;

  return score;
}

function pickMeal(pool: Meal[], prefs: UserPreferences, targetCal: number, usedNames: Set<string>): Meal {
  const filtered = pool.filter(
    (m) => !usedNames.has(m.name) && !containsAvoidedFood(m, prefs.avoidFoods)
  );

  const candidates = filtered.length > 0 ? filtered : pool.filter((m) => !containsAvoidedFood(m, prefs.avoidFoods));
  const fallback = candidates.length > 0 ? candidates : pool;

  const scored = fallback.map((m) => ({ meal: m, score: scoreMeal(m, prefs, targetCal) }));
  scored.sort((a, b) => b.score - a.score);

  const topN = Math.min(3, scored.length);
  const pick = scored[Math.floor(Math.random() * topN)];
  return pick.meal;
}

export function generateWeekPlan(prefs: UserPreferences): WeekPlan {
  const targetCalories = prefs.calories ?? (prefs.goal === 'gain_muscle' ? 2500 : prefs.goal === 'lose_weight' ? 1600 : 2000);

  const breakfastTarget = targetCalories * 0.28;
  const lunchTarget = targetCalories * 0.33;
  const dinnerTarget = targetCalories * 0.30;
  const snackTarget = targetCalories * 0.09;

  const usedBreakfasts = new Set<string>();
  const usedLunches = new Set<string>();
  const usedDinners = new Set<string>();
  const usedSnacks = new Set<string>();

  const days: DayPlan[] = DAYS.map((day) => {
    const breakfast = pickMeal(BREAKFASTS, prefs, breakfastTarget, usedBreakfasts);
    const lunch = pickMeal(LUNCHES, prefs, lunchTarget, usedLunches);
    const dinner = pickMeal(DINNERS, prefs, dinnerTarget, usedDinners);
    const snack = pickMeal(SNACKS, prefs, snackTarget, usedSnacks);

    usedBreakfasts.add(breakfast.name);
    usedLunches.add(lunch.name);
    usedDinners.add(dinner.name);
    usedSnacks.add(snack.name);

    return {
      day,
      breakfast,
      lunch,
      dinner,
      snack,
      totalCalories: breakfast.calories + lunch.calories + dinner.calories + snack.calories,
    };
  });

  const groceryList = buildGroceryList(days);

  return { days, groceryList };
}

function buildGroceryList(days: DayPlan[]): GroceryItem[] {
  const seen = new Set<string>();
  const items: GroceryItem[] = [];

  for (const day of days) {
    for (const meal of [day.breakfast, day.lunch, day.dinner, day.snack]) {
      for (const ingredient of meal.ingredients) {
        const lower = ingredient.toLowerCase();
        if (!seen.has(lower)) {
          seen.add(lower);
          const category: GroceryCategory = INGREDIENT_CATEGORIES[lower] ?? 'Condiments & Spices';
          items.push({ name: ingredient, category });
        }
      }
    }
  }

  items.sort((a, b) => {
    const catOrder: GroceryCategory[] = ['Produce', 'Protein', 'Dairy & Eggs', 'Grains & Bread', 'Nuts & Seeds', 'Frozen & Canned', 'Condiments & Spices', 'Beverages'];
    return catOrder.indexOf(a.category) - catOrder.indexOf(b.category);
  });

  return items;
}
