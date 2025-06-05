
export type HealthCondition = 
  | 'diabetes'
  | 'hypertension'
  | 'celiac_disease'
  | 'crohns_disease'
  | 'ulcerative_colitis'
  | 'ibs'
  | 'cancer'
  | 'hypothyroidism'
  | 'hyperthyroidism'
  | 'arthritis'
  | 'lupus'
  | 'multiple_sclerosis'
  | 'parkinsons'
  | 'alzheimers'
  | 'heart_disease'
  | 'kidney_disease'
  | 'liver_disease'
  | 'high_cholesterol'
  | 'none';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  height: number; // in cm
  weight: number; // in kg
  gender: 'male' | 'female' | 'other';
  conditions: HealthCondition[];
  allergies: string[];
  dietaryPreferences: string[];
  bmi?: number; // calculated field
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  distance: number; // in km
  rating: number;
  deliveryTime: number; // in minutes
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  image: string;
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fats: number; // in grams
  suitableFor: HealthCondition[];
  allergens: string[];
  ingredients: string[];
  preparation: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  tags: string[];
  price: number; // Always ensure price is present
  restaurant?: Restaurant; // Associated restaurant information
}

export interface MealLog {
  id: string;
  userId: string;
  date: string;
  meals: {
    mealId: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    timeConsumed: string;
    notes?: string;
  }[];
}

export interface MealPlan {
  id: string;
  userId: string;
  name: string;
  description?: string;
  meals: {
    day: number;
    breakfast?: string; // meal id
    lunch?: string; // meal id
    dinner?: string; // meal id
    snacks?: string[]; // meal ids
  }[];
}

export interface CartItem {
  mealId: string;
  quantity: number;
  price: number;
  restaurantId?: string;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  orderDate: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  deliveryAddress?: string;
  paymentMethod?: string;
  estimatedDeliveryTime?: string; // New field for estimated delivery
  restaurantInfo?: {
    name: string;
    address: string;
  };
}

export interface SupabaseUserData {
  id: string;
  email?: string;
}
