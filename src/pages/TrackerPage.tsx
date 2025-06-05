import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon, X, Clock, MapPin, Archive, Receipt, BookOpen } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Tabs,
  TabsContent, 
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMealLog } from "@/context/MealLogContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { meals as staticMeals } from "@/data/meals";
import ReceiptComponent from "@/components/tracker/Receipt";
import { useCart } from "@/context/CartContext";
import { fetchMealRecommendations } from "@/services/spoonacularApi";
import { useUser } from "@/context/UserContext";
import { Meal } from "@/types";

const MealTypeDetails = {
  breakfast: { label: "Breakfast", color: "bg-calm-100 text-calm-800" },
  lunch: { label: "Lunch", color: "bg-heal-100 text-heal-800" },
  dinner: { label: "Dinner", color: "bg-secondary text-secondary-foreground" },
  snack: { label: "Snack", color: "bg-muted text-muted-foreground" },
};

const TrackerPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [mealToAdd, setMealToAdd] = useState<string>("");
  const [mealTypeToAdd, setMealTypeToAdd] = useState<
    "breakfast" | "lunch" | "dinner" | "snack"
  >("breakfast");
  const [activeTab, setActiveTab] = useState<string>("meals");
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingMeals, setIsLoadingMeals] = useState(false);
  const [selectedRecipeMeal, setSelectedRecipeMeal] = useState<Meal | null>(null);
  const [recipeDialogOpen, setRecipeDialogOpen] = useState(false);

  const { 
    mealLogs, 
    addMealToLog, 
    removeMealFromLog, 
    getMealsByDate, 
    getMealById, 
    getOrderHistory,
    availableMeals,
    setAvailableMeals
  } = useMealLog();
  const { orders, fetchOrders } = useCart();
  const { toast } = useToast();
  const { userProfile } = useUser();

  const formattedDate = format(date, "yyyy-MM-dd");
  const dayLog = getMealsByDate(formattedDate);

  useEffect(() => {
    // Load both static meals and personalized meal suggestions
    loadAvailableMeals();
  }, [userProfile]);

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrderHistory();
    }
  }, [activeTab]);

  const loadAvailableMeals = async () => {
    setIsLoadingMeals(true);
    try {
      // Make sure we start with all static meals to ensure they're available
      let meals = [...staticMeals];
      
      // If we have a user profile with conditions and allergies, fetch personalized recommendations
      if (userProfile && (userProfile.conditions?.length > 0 || userProfile.allergies?.length > 0)) {
        try {
          const personalizedMeals = await fetchMealRecommendations(
            userProfile.conditions || [],
            userProfile.allergies || [],
            undefined,
            50 // Increased number of meals to fetch
          );
          
          if (personalizedMeals && personalizedMeals.length > 0) {
            // Add restaurant information if missing
            const enhancedPersonalizedMeals = personalizedMeals.map(meal => {
              if (!meal.restaurant) {
                const randomRestaurant = {
                  id: `rest${Math.floor(Math.random() * 1000)}`,
                  name: "Health Haven",
                  address: "123 Nutrition St",
                  distance: 1.2,
                  rating: 4.7,
                  deliveryTime: 25
                };
                return {...meal, restaurant: randomRestaurant};
              }
              return meal;
            });
            
            // Combine without duplicates (based on id)
            const mealIds = new Set(meals.map(m => m.id));
            enhancedPersonalizedMeals.forEach(meal => {
              if (!mealIds.has(meal.id)) {
                meals.push(meal);
                mealIds.add(meal.id);
              }
            });
          }
        } catch (apiError) {
          console.error("API Error when loading personalized meals:", apiError);
          // Continue with static meals if API fails
        }
      }
      
      console.log(`Successfully loaded ${meals.length} meals for the tracker`);
      setAvailableMeals(meals);
    } catch (error) {
      console.error("Error loading meals:", error);
      toast({
        title: "Error loading meals",
        description: "Could not load all available meals. Using default options.",
        variant: "destructive",
      });
      // Fallback to static meals if there's any error
      setAvailableMeals(staticMeals);
    } finally {
      setIsLoadingMeals(false);
    }
  };

  const fetchOrderHistory = async () => {
    setIsLoadingOrders(true);
    try {
      // First try to get orders from the cart context
      await fetchOrders();
      setOrderHistory(orders);
    } catch (error) {
      console.error("Error fetching order history:", error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleAddMeal = async () => {
    if (!mealToAdd) {
      toast({
        title: "Please select a meal",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Adding meal with ID:", mealToAdd);
      await addMealToLog(mealToAdd, formattedDate, mealTypeToAdd);
      setMealToAdd("");
      
      toast({
        title: "Meal added",
        description: `Added to your ${format(date, "MMMM d, yyyy")} log`,
      });
    } catch (error) {
      console.error("Error adding meal to log:", error);
      toast({
        title: "Error adding meal",
        description: "Could not add meal to your log",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMeal = async (mealId: string) => {
    if (dayLog) {
      try {
        await removeMealFromLog(dayLog.id, mealId);
        
        toast({
          title: "Meal removed",
          description: "Removed from your meal log",
        });
      } catch (error) {
        console.error("Error removing meal:", error);
        toast({
          title: "Error",
          description: "Could not remove meal from your log",
          variant: "destructive",
        });
      }
    }
  };

  const getMealDetailsById = (mealId: string) => {
    // Updated to use the getMealById function from context
    // This ensures we correctly find meals in both static and personalized recommendations
    return getMealById(mealId);
  };

  const handleViewRecipe = (mealId: string) => {
    const meal = getMealDetailsById(mealId);
    if (meal) {
      setSelectedRecipeMeal(meal);
      setRecipeDialogOpen(true);
    } else {
      toast({
        title: "Recipe not found",
        description: "The recipe details are not available",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Health Tracker</h1>
        <p className="text-muted-foreground mb-8 text-center">
          Keep track of your meals and orders to monitor your nutrition and wellness journey
        </p>

        <Tabs
          defaultValue="meals"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-8"
        >
          <TabsList className="grid grid-cols-2 w-[400px] max-w-full mx-auto">
            <TabsTrigger value="meals">Meal Tracker</TabsTrigger>
            <TabsTrigger value="orders">
              <Receipt className="h-4 w-4 mr-2" />
              Receipts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="meals" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                  <CardDescription>
                    Choose a date to view or add meals
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="w-full overflow-x-auto pb-2">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => newDate && setDate(newDate)}
                      className="border rounded-md max-w-full mx-auto"
                      disabled={{
                        after: new Date(),
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>
                    Meals for {format(date, "MMMM d, yyyy")}
                  </CardTitle>
                  <CardDescription>
                    Add meals or view what you've logged for this day
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Select
                        value={mealToAdd}
                        onValueChange={setMealToAdd}
                      >
                        <SelectTrigger className="flex-grow">
                          <SelectValue placeholder="Select a meal" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px] overflow-y-auto z-50">
                          {isLoadingMeals ? (
                            <div className="p-2 text-center text-sm text-muted-foreground">
                              Loading meals...
                            </div>
                          ) : (
                            <>
                              {/* Show static meals first - FIX: Ensure headers have non-empty values */}
                              <SelectItem value="static-header" disabled>Static Meals</SelectItem>
                              {staticMeals.map((meal) => (
                                <SelectItem key={`static-${meal.id}`} value={meal.id}>
                                  {meal.name}
                                </SelectItem>
                              ))}
                              
                              {/* Then show personalized meals if available - FIX: Ensure headers have non-empty values */}
                              {availableMeals.length > staticMeals.length && (
                                <>
                                  <SelectItem value="personalized-header" disabled>
                                    Personalized Recommendations
                                  </SelectItem>
                                  {availableMeals
                                    .filter(meal => !staticMeals.some(sm => sm.id === meal.id))
                                    .map((meal) => (
                                      <SelectItem key={`api-${meal.id}`} value={meal.id}>
                                        {meal.name}
                                      </SelectItem>
                                    ))}
                                </>
                              )}
                            </>
                          )}
                        </SelectContent>
                      </Select>

                      <Select
                        value={mealTypeToAdd}
                        onValueChange={(value: string) =>
                          setMealTypeToAdd(value as "breakfast" | "lunch" | "dinner" | "snack")
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Meal type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="breakfast">Breakfast</SelectItem>
                          <SelectItem value="lunch">Lunch</SelectItem>
                          <SelectItem value="dinner">Dinner</SelectItem>
                          <SelectItem value="snack">Snack</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button onClick={handleAddMeal}>Add</Button>
                    </div>

                    <Separator />

                    {dayLog && dayLog.meals.length > 0 ? (
                      <div className="space-y-6">
                        {["breakfast", "lunch", "dinner", "snack"].map((type) => {
                          const mealsOfType = dayLog.meals.filter(
                            (m) => m.mealType === type
                          );

                          if (mealsOfType.length === 0) return null;

                          return (
                            <div key={type} className="space-y-2">
                              <h3 className="font-medium text-xl">
                                {MealTypeDetails[type as keyof typeof MealTypeDetails].label}
                              </h3>
                              <div className="space-y-2">
                                {mealsOfType.map((mealEntry) => {
                                  const meal = getMealDetailsById(mealEntry.mealId);
                                  if (!meal) return null;

                                  return (
                                    <div
                                      key={`${mealEntry.mealId}-${mealEntry.timeConsumed}`}
                                      className="flex items-center justify-between bg-card p-4 rounded-md border"
                                    >
                                      <div className="flex-1">
                                        <p className="font-medium text-lg">{meal.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                          <Badge
                                            variant="outline"
                                            className={
                                              MealTypeDetails[mealEntry.mealType].color
                                            }
                                          >
                                            {MealTypeDetails[mealEntry.mealType].label}
                                          </Badge>
                                          <p className="text-xs text-muted-foreground">
                                            {mealEntry.timeConsumed && format(
                                              parseISO(mealEntry.timeConsumed),
                                              "h:mm a"
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          size="icon"
                                          variant="outline"
                                          onClick={() => handleViewRecipe(mealEntry.mealId)}
                                          title="View Recipe"
                                          className="rounded-full"
                                        >
                                          <BookOpen className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          size="icon"
                                          variant="outline"
                                          onClick={() => handleRemoveMeal(mealEntry.mealId)}
                                          className="rounded-full"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          No meals logged for this day yet
                        </p>
                        <p className="text-xs mt-2">
                          Add meals using the form above
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recipe Dialog */}
            <Dialog open={recipeDialogOpen} onOpenChange={setRecipeDialogOpen}>
              <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                {selectedRecipeMeal && (
                  <>
                    <DialogHeader>
                      <DialogTitle className="text-2xl">{selectedRecipeMeal.name}</DialogTitle>
                      <DialogDescription className="text-base mt-1">
                        {selectedRecipeMeal.description}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="mt-4">
                      <img 
                        src={selectedRecipeMeal.image} 
                        alt={selectedRecipeMeal.name} 
                        className="w-full h-48 object-cover rounded-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
                        }}
                      />
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="font-semibold text-lg">Nutrition Information</h3>
                      <div className="grid grid-cols-4 gap-2 my-2">
                        <div className="text-center p-2 bg-muted rounded-md">
                          <p className="text-xs text-muted-foreground">Calories</p>
                          <p className="font-semibold">{selectedRecipeMeal.calories}</p>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-md">
                          <p className="text-xs text-muted-foreground">Protein</p>
                          <p className="font-semibold">{selectedRecipeMeal.protein}g</p>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-md">
                          <p className="text-xs text-muted-foreground">Carbs</p>
                          <p className="font-semibold">{selectedRecipeMeal.carbs}g</p>
                        </div>
                        <div className="text-center p-2 bg-muted rounded-md">
                          <p className="text-xs text-muted-foreground">Fats</p>
                          <p className="font-semibold">{selectedRecipeMeal.fats}g</p>
                        </div>
                      </div>
                    </div>
                    
                    {selectedRecipeMeal.ingredients && selectedRecipeMeal.ingredients.length > 0 && (
                      <div className="mt-4">
                        <h3 className="font-semibold text-lg">Ingredients</h3>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          {selectedRecipeMeal.ingredients.map((ingredient, index) => (
                            <li key={index} className="text-sm">{ingredient}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {selectedRecipeMeal.preparation && (
                      <div className="mt-4">
                        <h3 className="font-semibold text-lg">Preparation</h3>
                        <p className="text-sm mt-2">{selectedRecipeMeal.preparation}</p>
                      </div>
                    )}
                    
                    {selectedRecipeMeal.tags && selectedRecipeMeal.tags.length > 0 && (
                      <div className="mt-4">
                        <h3 className="font-semibold text-lg">Tags</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedRecipeMeal.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </DialogContent>
            </Dialog>

            {dayLog && dayLog.meals.length > 0 && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Nutrition Summary</CardTitle>
                  <CardDescription>
                    Nutritional overview of your logged meals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {(() => {
                      const totalNutrition = dayLog.meals.reduce(
                        (acc, mealEntry) => {
                          const meal = getMealDetailsById(mealEntry.mealId);
                          if (meal) {
                            acc.calories += meal.calories || 0;
                            acc.protein += meal.protein || 0;
                            acc.carbs += meal.carbs || 0;
                            acc.fats += meal.fats || 0;
                          }
                          return acc;
                        },
                        { calories: 0, protein: 0, carbs: 0, fats: 0 }
                      );

                      return (
                        <>
                          <div className="bg-muted rounded-lg p-4 text-center">
                            <p className="text-sm text-muted-foreground">Calories</p>
                            <p className="text-2xl font-semibold">
                              {totalNutrition.calories}
                            </p>
                          </div>
                          <div className="bg-muted rounded-lg p-4 text-center">
                            <p className="text-sm text-muted-foreground">Protein</p>
                            <p className="text-2xl font-semibold">
                              {totalNutrition.protein}g
                            </p>
                          </div>
                          <div className="bg-muted rounded-lg p-4 text-center">
                            <p className="text-sm text-muted-foreground">Carbs</p>
                            <p className="text-2xl font-semibold">
                              {totalNutrition.carbs}g
                            </p>
                          </div>
                          <div className="bg-muted rounded-lg p-4 text-center">
                            <p className="text-sm text-muted-foreground">Fats</p>
                            <p className="text-2xl font-semibold">
                              {totalNutrition.fats}g
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Archive className="mr-2 h-5 w-5" />
                  Order Receipts
                </CardTitle>
                <CardDescription>
                  Review your past orders and delivery information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="text-center py-8">
                    <p>Loading your order history...</p>
                  </div>
                ) : orders && orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <ReceiptComponent key={order.id} order={order} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Archive className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                    <p className="text-muted-foreground mb-2">You don't have any orders yet</p>
                    <Button variant="outline" onClick={() => {
                      window.location.href = '/meals';
                    }}>
                      Browse Meals
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TrackerPage;
