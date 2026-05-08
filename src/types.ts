export type Goal = 'lose_weight' | 'gain_muscle' | 'eat_healthy';
export type DietType = 'high_protein' | 'vegetarian' | 'low_carb';

export interface UserPreferences {
  goal: Goal;
  dietType: DietType;
  calories: number | null;
  avoidFoods: string[];
}

export interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  tags: DietType[];
  goals: Goal[];
}

export interface DayPlan {
  day: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snack: Meal;
  totalCalories: number;
}

export interface WeekPlan {
  days: DayPlan[];
  groceryList: GroceryItem[];
}

export interface GroceryItem {
  name: string;
  category: GroceryCategory;
}

export type GroceryCategory =
  | 'Produce'
  | 'Protein'
  | 'Dairy & Eggs'
  | 'Grains & Bread'
  | 'Nuts & Seeds'
  | 'Condiments & Spices'
  | 'Beverages'
  | 'Frozen & Canned';
