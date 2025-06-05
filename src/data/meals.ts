
import { Meal, Restaurant } from "../types";

// Define some restaurants
const restaurants: Restaurant[] = [
  {
    id: "r1",
    name: "Healing Kitchen",
    address: "123 Wellness Ave, Healthyville",
    distance: 1.2,
    rating: 4.8,
    deliveryTime: 25
  },
  {
    id: "r2",
    name: "Nourish Cafe",
    address: "456 Nutrition Blvd, Fitnesstown",
    distance: 0.8,
    rating: 4.6,
    deliveryTime: 20
  },
  {
    id: "r3",
    name: "Vitality Foods",
    address: "789 Energy St, Activeville",
    distance: 1.5,
    rating: 4.7,
    deliveryTime: 30
  }
];

// Assign restaurants to meals in a round-robin fashion
export const meals: Meal[] = [
  {
    id: "m1",
    name: "Anti-Inflammatory Berry Smoothie",
    description: "A nutrient-packed smoothie with berries rich in antioxidants to help reduce inflammation and support immune function.",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    calories: 285,
    protein: 15,
    carbs: 42,
    fats: 7,
    suitableFor: ["arthritis", "lupus", "heart_disease", "cancer"],
    allergens: [],
    ingredients: [
      "1 cup mixed berries (blueberries, strawberries, raspberries)",
      "1 small banana",
      "1 tablespoon ground flaxseed",
      "1 tablespoon chia seeds",
      "1/4 teaspoon turmeric",
      "1 cup unsweetened almond milk",
      "1 scoop plant-based protein powder (optional)"
    ],
    preparation: "Add all ingredients to a blender and blend until smooth. Serve immediately.",
    mealType: "breakfast",
    tags: ["anti-inflammatory", "high-fiber", "antioxidant-rich", "gluten-free", "dairy-free"],
    price: 8.99,
    restaurant: restaurants[0]
  },
  {
    id: "m2",
    name: "Gut-Healing Bone Broth Soup",
    description: "A soothing soup that helps heal the digestive tract and provides essential nutrients for gut health.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554",
    calories: 220,
    protein: 18,
    carbs: 15,
    fats: 10,
    suitableFor: ["crohns_disease", "ulcerative_colitis", "ibs", "celiac_disease"],
    allergens: [],
    ingredients: [
      "2 cups homemade bone broth (chicken or beef)",
      "1 cup mixed vegetables (carrots, celery, zucchini), diced",
      "1 tablespoon olive oil",
      "1 teaspoon grated ginger",
      "1 clove garlic, minced",
      "Sea salt and herbs to taste"
    ],
    preparation: "In a pot, sauté garlic in olive oil. Add vegetables and cook until softened. Add bone broth and ginger, then simmer for 15-20 minutes. Season to taste.",
    mealType: "lunch",
    tags: ["gut-healing", "easy-to-digest", "anti-inflammatory", "gluten-free", "dairy-free"],
    price: 12.99,
    restaurant: restaurants[1]
  },
  {
    id: "m3",
    name: "Blood Sugar-Balancing Plate",
    description: "A balanced meal designed to help regulate blood sugar levels and provide sustained energy.",
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975",
    calories: 390,
    protein: 30,
    carbs: 30,
    fats: 15,
    suitableFor: ["diabetes", "hypothyroidism", "hyperthyroidism"],
    allergens: [],
    ingredients: [
      "4 oz grilled wild-caught salmon or tempeh",
      "1/2 cup cooked quinoa",
      "2 cups steamed non-starchy vegetables (broccoli, spinach, bell peppers)",
      "1 tablespoon olive oil",
      "Lemon juice, herbs and spices to taste"
    ],
    preparation: "Cook protein of choice. Steam vegetables and prepare quinoa. Combine on a plate with olive oil drizzled over top. Add seasonings to taste.",
    mealType: "dinner",
    tags: ["low-glycemic", "balanced-macros", "omega-3-rich", "gluten-free"],
    price: 15.99,
    restaurant: restaurants[2]
  },
  {
    id: "m4",
    name: "Heart-Healthy Mediterranean Bowl",
    description: "A nutrient-dense bowl inspired by the Mediterranean diet to support cardiovascular health.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    calories: 420,
    protein: 15,
    carbs: 45,
    fats: 22,
    suitableFor: ["heart_disease", "hypertension", "high_cholesterol"],
    allergens: ["nuts"],
    ingredients: [
      "1/2 cup cooked farro or brown rice",
      "1/2 cup chickpeas",
      "1 cup mixed greens",
      "1/4 cup cucumber, diced",
      "1/4 cup cherry tomatoes, halved",
      "2 tablespoons hummus",
      "2 tablespoons olive oil",
      "1 tablespoon lemon juice",
      "1 tablespoon walnuts",
      "Fresh herbs (parsley, mint) to garnish"
    ],
    preparation: "Layer all ingredients in a bowl, starting with grains, then vegetables, chickpeas, and hummus. Drizzle with olive oil and lemon juice, top with walnuts and herbs.",
    mealType: "lunch",
    tags: ["heart-healthy", "high-fiber", "plant-based", "omega-3-rich"],
    price: 13.99,
    restaurant: restaurants[0]
  },
  {
    id: "m5",
    name: "Immune-Supporting Vegetable Soup",
    description: "A nourishing soup packed with vegetables, herbs, and spices to support immune function.",
    image: "https://images.unsplash.com/photo-1578020190125-f4f7c18bc9cb",
    calories: 180,
    protein: 8,
    carbs: 25,
    fats: 6,
    suitableFor: ["cancer", "lupus", "multiple_sclerosis", "heart_disease"],
    allergens: [],
    ingredients: [
      "1 onion, diced",
      "2 carrots, diced",
      "2 celery stalks, diced",
      "1 zucchini, diced",
      "2 garlic cloves, minced",
      "1 tablespoon grated ginger",
      "1 teaspoon turmeric",
      "4 cups vegetable broth",
      "1 cup kale, chopped",
      "1 tablespoon olive oil",
      "Fresh herbs (thyme, parsley) to taste",
      "Sea salt and black pepper to taste"
    ],
    preparation: "Sauté onion, carrots, and celery in olive oil. Add garlic, ginger, and turmeric, then add broth and remaining vegetables. Simmer for 20-25 minutes until vegetables are tender. Add herbs and season to taste.",
    mealType: "dinner",
    tags: ["immune-supporting", "anti-inflammatory", "nutrient-dense", "vegan", "gluten-free"],
    price: 11.99,
    restaurant: restaurants[1]
  },
  {
    id: "m6",
    name: "Anti-Inflammatory Golden Milk",
    description: "A warming, spiced milk drink with turmeric to help reduce inflammation and support overall health.",
    image: "https://images.unsplash.com/photo-1589881133595-a3c085cb731d",
    calories: 120,
    protein: 4,
    carbs: 8,
    fats: 7,
    suitableFor: ["arthritis", "lupus", "heart_disease", "ibs"],
    allergens: [],
    ingredients: [
      "1 cup unsweetened coconut or almond milk",
      "1 teaspoon turmeric powder",
      "1/2 teaspoon cinnamon",
      "1/4 teaspoon ginger powder",
      "1 pinch black pepper",
      "1 teaspoon honey or maple syrup (optional)",
      "1/2 teaspoon coconut oil"
    ],
    preparation: "Heat milk in a small saucepan. Whisk in turmeric, cinnamon, ginger, and black pepper. Simmer for 5 minutes, then add sweetener and coconut oil if using. Strain and serve warm.",
    mealType: "snack",
    tags: ["anti-inflammatory", "soothing", "dairy-free", "caffeine-free"],
    price: 6.99,
    restaurant: restaurants[2]
  }
];
