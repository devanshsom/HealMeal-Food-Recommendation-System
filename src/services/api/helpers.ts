
// Helper to determine meal type from recipe dish types
export function determineDefaultMealType(dishTypes?: string[]): 'breakfast' | 'lunch' | 'dinner' | 'snack' {
  if (!dishTypes || dishTypes.length === 0) return 'dinner';
  
  if (dishTypes.some(type => 
    ['breakfast', 'brunch', 'morning meal'].includes(type.toLowerCase())
  )) {
    return 'breakfast';
  }
  
  if (dishTypes.some(type => 
    ['lunch', 'main course', 'main dish', 'salad'].includes(type.toLowerCase())
  )) {
    return 'lunch';
  }
  
  if (dishTypes.some(type => 
    ['dinner', 'main course', 'main dish'].includes(type.toLowerCase())
  )) {
    return 'dinner';
  }
  
  if (dishTypes.some(type => 
    ['snack', 'appetizer', 'side dish', 'dessert'].includes(type.toLowerCase())
  )) {
    return 'snack';
  }
  
  return 'dinner'; // Default to dinner
}

// Build query parameters for Spoonacular API
export function buildQueryParams(
  diets: string[],
  intolerances: string[],
  apiKey: string,
  mealType?: string,
  numberOfMeals: number = 6
): URLSearchParams {
  const params = new URLSearchParams({
    apiKey: apiKey,
    number: numberOfMeals.toString(),
    addRecipeInformation: 'true',
    fillIngredients: 'true',
    instructionsRequired: 'true',
    sort: 'healthiness',
    sortDirection: 'desc'
  });

  // Add diet filters if any
  if (diets.length > 0) {
    params.append('diet', diets.join(','));
  }
  
  // Add intolerance filters if any
  if (intolerances.length > 0) {
    params.append('intolerances', intolerances.join(','));
  }
  
  // Add meal type filter if specified
  if (mealType) {
    params.append('type', mealType);
  }
  
  return params;
}
