
import { HealthCondition } from '@/types';
import { Restaurant } from '@/types';

// API key for Spoonacular
export const API_KEY = '3ad37f8abd6d41a59dcb8bdb39b85be4';

// Mock restaurant data for Spoonacular API results
export const mockRestaurants: Restaurant[] = [
  {
    id: "api-r1",
    name: "Health Haven Restaurant",
    address: "123 Nutrition St, Wellness City",
    distance: 0.9,
    rating: 4.7,
    deliveryTime: 25
  },
  {
    id: "api-r2",
    name: "Balanced Bites Bistro",
    address: "456 Vitamin Ave, Fitness Valley",
    distance: 1.3,
    rating: 4.5,
    deliveryTime: 30
  },
  {
    id: "api-r3",
    name: "Mindful Meals Kitchen",
    address: "789 Organic Blvd, Clean Eating City",
    distance: 0.7,
    rating: 4.8,
    deliveryTime: 20
  }
];

// Mapping from our health conditions to Spoonacular diet/intolerance tags
export const healthConditionToDietMap: Record<HealthCondition, { diets: string[], intolerances: string[] }> = {
  'diabetes': { 
    diets: ['diabetic', 'low-carb'],
    intolerances: []
  },
  'hypertension': { 
    diets: ['dash', 'low-sodium'], 
    intolerances: [] 
  },
  'celiac_disease': { 
    diets: ['gluten-free'], 
    intolerances: ['gluten'] 
  },
  'crohns_disease': { 
    diets: ['fodmap', 'low-fiber'], 
    intolerances: ['dairy'] 
  },
  'ulcerative_colitis': { 
    diets: ['fodmap', 'low-fiber'], 
    intolerances: [] 
  },
  'ibs': { 
    diets: ['fodmap'], 
    intolerances: [] 
  },
  'cancer': { 
    diets: ['anti-inflammatory'], 
    intolerances: [] 
  },
  'hypothyroidism': { 
    diets: ['iodine-rich'], 
    intolerances: ['soy'] 
  },
  'hyperthyroidism': { 
    diets: ['low-iodine'], 
    intolerances: [] 
  },
  'arthritis': { 
    diets: ['anti-inflammatory'], 
    intolerances: [] 
  },
  'lupus': { 
    diets: ['anti-inflammatory'], 
    intolerances: [] 
  },
  'multiple_sclerosis': { 
    diets: ['anti-inflammatory'], 
    intolerances: [] 
  },
  'parkinsons': { 
    diets: ['high-protein'], 
    intolerances: [] 
  },
  'alzheimers': { 
    diets: ['mind', 'mediterranean'], 
    intolerances: [] 
  },
  'heart_disease': { 
    diets: ['dash', 'mediterranean', 'low-fat'], 
    intolerances: [] 
  },
  'kidney_disease': { 
    diets: ['low-protein', 'low-sodium', 'low-potassium'], 
    intolerances: [] 
  },
  'liver_disease': { 
    diets: ['low-protein', 'low-sodium'], 
    intolerances: [] 
  },
  'high_cholesterol': { 
    diets: ['low-fat'], 
    intolerances: [] 
  },
  'none': { 
    diets: [], 
    intolerances: [] 
  }
};

// Map allergies to Spoonacular intolerances
export const allergyToIntoleranceMap: Record<string, string> = {
  'Dairy': 'dairy',
  'Eggs': 'egg',
  'Peanuts': 'peanut',
  'Tree nuts': 'tree nut',
  'Soy': 'soy',
  'Wheat': 'wheat',
  'Fish': 'seafood',
  'Shellfish': 'shellfish',
  'Gluten': 'gluten'
};
