
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Meal } from "@/types";
import MealCard from "@/components/ui/meal-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { fetchMealRecommendations } from "@/services/spoonacularApi";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

// Fallback to static meals if API fails
import { meals as staticMeals } from "@/data/meals";

// Restaurant data for demo
const demoRestaurants = [
  { id: "rest1", name: "Health Haven", address: "123 Nutrition St", distance: 1.2, rating: 4.7, deliveryTime: 25 },
  { id: "rest2", name: "Vitality Kitchen", address: "456 Wellness Ave", distance: 0.8, rating: 4.5, deliveryTime: 20 },
  { id: "rest3", name: "Green Plate", address: "789 Organic Blvd", distance: 1.5, rating: 4.8, deliveryTime: 30 },
  { id: "rest4", name: "Nutrifit Cafe", address: "321 Balance Road", distance: 2.0, rating: 4.3, deliveryTime: 35 }
];

const MealsPage = () => {
  const { userProfile, isProfileComplete } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
  const [mealTypeFilter, setMealTypeFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const { addToCart } = useCart();
  
  useEffect(() => {
    // Redirect to profile page if profile is not complete
    if (!isProfileComplete) {
      toast({
        title: "Complete your profile",
        description: "Please complete your health profile to get personalized meal suggestions.",
        variant: "default"
      });
      navigate("/profile");
      return;
    }

    const loadMeals = async () => {
      setLoading(true);
      
      if (!userProfile) {
        setLoading(false);
        return;
      }
      
      try {
        console.log("Loading meals with user profile:", userProfile);
        
        // Use Spoonacular API to fetch meals
        const spoonacularMeals = await fetchMealRecommendations(
          userProfile.conditions,
          userProfile.allergies,
          undefined, // no specific meal type filter
          6 // Get 6 meals
        );
        
        if (spoonacularMeals && spoonacularMeals.length > 0) {
          // Add restaurant and price information to API meals
          const enhancedMeals = spoonacularMeals.map((meal: Meal) => {
            // Assign a random restaurant
            const randomRestaurant = demoRestaurants[Math.floor(Math.random() * demoRestaurants.length)];
            
            // Assign a price based on calories
            const price = Math.round((meal.calories / 100) * 1.5 * 100) / 100;
            
            return {
              ...meal,
              price: price || 9.99, // Fallback price if calculation is invalid
              restaurant: randomRestaurant
            };
          });
          
          console.log('Meals fetched from API:', enhancedMeals);
          setFilteredMeals(enhancedMeals);
          
          toast({
            title: "Meals loaded",
            description: `Found ${enhancedMeals.length} meal suggestions based on your health profile.`,
          });
        } else {
          console.log('No meals returned from API, using fallback static meals');
          // Fallback to static meals if API returns no results
          let appropriateMeals = [...staticMeals];

          // Filter by health conditions if they have any (except 'none')
          if (userProfile.conditions.length > 0 && !userProfile.conditions.includes("none")) {
            appropriateMeals = staticMeals.filter(meal => 
              userProfile.conditions.some(condition => meal.suitableFor.includes(condition))
            );
          }

          // Filter out meals with user's allergens
          if (userProfile.allergies.length > 0) {
            appropriateMeals = appropriateMeals.filter(meal => 
              !meal.allergens.some(allergen => 
                userProfile.allergies.includes(allergen)
              )
            );
          }
          
          // Make sure all meals have prices and restaurants
          appropriateMeals = appropriateMeals.map(meal => {
            const randomRestaurant = demoRestaurants[Math.floor(Math.random() * demoRestaurants.length)];
            return {
              ...meal,
              price: meal.price || (Math.round((meal.calories / 100) * 1.5 * 100) / 100) || 9.99,
              restaurant: meal.restaurant || randomRestaurant
            };
          });

          setFilteredMeals(appropriateMeals);
          
          toast({
            title: "Using demo meals",
            description: "We're showing you pre-defined meals as we couldn't connect to the meal database.",
          });
        }
      } catch (error) {
        console.error('Error loading meals:', error);
        // Use static meals as fallback with added restaurant data
        const enhancedStaticMeals = staticMeals.map(meal => {
          const randomRestaurant = demoRestaurants[Math.floor(Math.random() * demoRestaurants.length)];
          return {
            ...meal,
            price: meal.price || (Math.round((meal.calories / 100) * 1.5 * 100) / 100) || 9.99,
            restaurant: meal.restaurant || randomRestaurant
          };
        });
        
        setFilteredMeals(enhancedStaticMeals);
        
        toast({
          title: "Error loading personalized meals",
          description: "We're showing you some sample meals instead.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadMeals();
  }, [userProfile, isProfileComplete, navigate, toast]);

  const handleMealTypeChange = (value: string) => {
    setMealTypeFilter(value);
  };

  const displayMeals = mealTypeFilter === "all" 
    ? filteredMeals 
    : filteredMeals.filter(meal => meal.mealType === mealTypeFilter);

  const handleBuyNow = (meal: Meal) => {
    addToCart(meal, 1);
    toast({
      title: "Added to cart",
      description: `${meal.name} has been added to your cart.`
    });
  };

  if (!userProfile) {
    return null; // Prevent rendering if there's no user profile
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Your Personalized Meal Suggestions</h1>
          <p className="text-muted-foreground">
            Based on your health profile, here are meals that may help support your wellness journey
          </p>
        </div>

        {userProfile.conditions.length > 0 && !userProfile.conditions.includes("none") && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="mb-2">
                <p className="text-sm font-medium">Tailored for your conditions:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {userProfile.conditions.map((condition) => (
                    <Badge key={condition} variant="outline" className="bg-rose-100 text-rose-800">
                      {condition.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {userProfile.allergies.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium">Avoiding your allergens:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userProfile.allergies.map((allergy) => (
                      <Badge key={allergy} variant="outline" className="bg-amber-100 text-amber-800">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="mb-6 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {loading ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading meal suggestions...
              </span>
            ) : (
              `Showing ${displayMeals.length} meal suggestions`
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm">Filter by:</span>
            <Select value={mealTypeFilter} onValueChange={handleMealTypeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Meal Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Meals</SelectItem>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snacks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : displayMeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayMeals.map((meal) => (
              <MealCard 
                key={meal.id} 
                meal={meal} 
                showAddToLog={false} 
                showBuyButton={true} 
                onBuyNow={() => handleBuyNow(meal)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl mb-4">No meal suggestions match your current filters</p>
            <Button onClick={() => setMealTypeFilter("all")}>Show All Meals</Button>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Don't see what you're looking for? Update your health profile for more personalized suggestions.
          </p>
          <Button variant="outline" onClick={() => navigate("/profile")}>
            Update Health Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MealsPage;
