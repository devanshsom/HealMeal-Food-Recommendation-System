
import { Meal, HealthCondition } from '@/types';
import { mockRestaurants, healthConditionToDietMap } from './constants';
import { determineDefaultMealType } from './helpers';

// Map Spoonacular API response to our Meal model
export function mapSpoonacularResponseToMeals(data: any): Meal[] {
  if (!data || !data.results || !Array.isArray(data.results)) {
    return [];
  }

  return data.results.map((recipe: any, index: number) => {
    // Calculate approximate macros (if not available in API response)
    const caloriesPerServing = recipe.nutrition?.nutrients.find((n: any) => n.name === 'Calories')?.amount || 
                          Math.floor(Math.random() * 300) + 200; // Fallback random value
                          
    const proteinPerServing = recipe.nutrition?.nutrients.find((n: any) => n.name === 'Protein')?.amount || 
                        Math.floor(Math.random() * 20) + 10;
                        
    const carbsPerServing = recipe.nutrition?.nutrients.find((n: any) => n.name === 'Carbohydrates')?.amount || 
                       Math.floor(Math.random() * 30) + 20;
                       
    const fatsPerServing = recipe.nutrition?.nutrients.find((n: any) => n.name === 'Fat')?.amount || 
                      Math.floor(Math.random() * 15) + 5;
    
    // Extract allergens from recipe
    const allergens: string[] = [];
    if (recipe.dairyFree === false) allergens.push('Dairy');
    if (recipe.glutenFree === false) allergens.push('Gluten');
    
    // Extract ingredients
    const ingredients = recipe.extendedIngredients?.map((ing: any) => ing.original) || [];
    
    // Determine suitable conditions based on diets and other properties
    const suitableConditions: HealthCondition[] = [];
    
    // Map back from diets to conditions
    Object.entries(healthConditionToDietMap).forEach(([condition, mapping]) => {
      const matchingDiets = mapping.diets.some(diet => 
        recipe.diets?.includes(diet) || 
        recipe.dishTypes?.includes(diet) ||
        (recipe.veryHealthy && diet === 'anti-inflammatory')
      );
      
      if (matchingDiets) {
        suitableConditions.push(condition as HealthCondition);
      }
    });
    
    // If no specific conditions matched, add 'none'
    if (suitableConditions.length === 0) {
      suitableConditions.push('none');
    }
    
    // Generate random price between $8.99 and $16.99
    const price = parseFloat((Math.random() * 8 + 8.99).toFixed(2));
    
    // Assign a restaurant from our mock data (round-robin)
    const restaurant = mockRestaurants[index % mockRestaurants.length];
    
    return {
      id: recipe.id.toString(),
      name: recipe.title,
      description: recipe.summary?.replace(/<[^>]*>/g, '') || 'A healthy and delicious meal.',
      // Make sure we have a valid image URL
      image: recipe.image || `https://spoonacular.com/recipeImages/${recipe.id}-556x370.jpg`,
      calories: Math.round(caloriesPerServing),
      protein: Math.round(proteinPerServing),
      carbs: Math.round(carbsPerServing),
      fats: Math.round(fatsPerServing),
      suitableFor: suitableConditions,
      allergens,
      ingredients,
      preparation: recipe.instructions?.replace(/<[^>]*>/g, '') || 
                  'Please visit the recipe source for detailed instructions.',
      mealType: determineDefaultMealType(recipe.dishTypes),
      tags: [...(recipe.diets || []), ...(recipe.dishTypes || [])],
      price,
      restaurant
    };
  });
}
