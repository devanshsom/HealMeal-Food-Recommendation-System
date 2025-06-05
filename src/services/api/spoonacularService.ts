
import { Meal, HealthCondition } from '@/types';
import { API_KEY, allergyToIntoleranceMap, healthConditionToDietMap } from './constants';
import { buildQueryParams } from './helpers';
import { mapSpoonacularResponseToMeals } from './mappers';

// Function to fetch meals from Spoonacular based on health profile
export async function fetchMealRecommendations(
  conditions: HealthCondition[], 
  allergies: string[],
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  numberOfMeals: number = 6
): Promise<Meal[]> {
  try {
    console.log('Fetching meals with conditions:', conditions);
    console.log('Allergies:', allergies);
    
    // Convert allergies to Spoonacular intolerances
    const intolerances = allergies
      .map(allergy => allergyToIntoleranceMap[allergy])
      .filter(Boolean);
    
    // Aggregate diet tags from all conditions
    let diets: string[] = [];
    let conditionIntolerances: string[] = [];
    
    conditions.forEach(condition => {
      const mapping = healthConditionToDietMap[condition];
      if (mapping) {
        diets = [...diets, ...mapping.diets];
        conditionIntolerances = [...conditionIntolerances, ...mapping.intolerances];
      }
    });
    
    // Remove duplicates
    diets = Array.from(new Set(diets));
    const allIntolerances = Array.from(new Set([...intolerances, ...conditionIntolerances]));
    
    // Build query parameters - updated order of parameters
    const params = buildQueryParams(diets, allIntolerances, API_KEY, mealType, numberOfMeals);
    
    console.log(`Fetching meals with params: ${params.toString()}`);
    
    const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?${params.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Spoonacular API error:', errorData);
      throw new Error(`Spoonacular API error: ${errorData.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    console.log('API response:', data);
    
    // Map Spoonacular recipe format to our Meal format
    const meals = mapSpoonacularResponseToMeals(data);

    console.log(`Successfully fetched ${meals.length} meals`);
    return meals;
    
  } catch (error) {
    console.error('Error fetching meal recommendations:', error);
    return []; // Return empty array if API call fails
  }
}
