
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Meal } from '@/types';
import { useMealLog } from '@/context/MealLogContext';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, MapPin, Clock } from 'lucide-react';

interface MealCardProps {
  meal: Meal;
  showAddToLog?: boolean;
  showBuyButton?: boolean;
  onBuyNow?: () => void;
}

const MealCard = ({ meal, showAddToLog = false, showBuyButton = false, onBuyNow }: MealCardProps) => {
  const { addMealToLog } = useMealLog();
  const { toast } = useToast();

  const handleAddToLog = async (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      await addMealToLog(meal.id, today, mealType);
      
      toast({
        title: "Meal added to today's log",
        description: `${meal.name} added as ${mealType}`,
      });
    } catch (error) {
      console.error("Error adding meal to log:", error);
      toast({
        title: "Error",
        description: "Failed to add meal to log. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{meal.name}</CardTitle>
            <CardDescription className="line-clamp-2">{meal.description}</CardDescription>
          </div>
          {meal.price && (
            <div className="text-lg font-bold text-primary">
              ${meal.price.toFixed(2)}
            </div>
          )}
        </div>
      </CardHeader>

      {/* Add meal image */}
      <div className="px-6">
        <div className="aspect-video w-full rounded-md overflow-hidden mb-4">
          <img 
            src={meal.image} 
            alt={meal.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback image if the original fails to load
              e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
            }}
          />
        </div>
      </div>
      
      <CardContent className="flex-grow">
        {/* Restaurant info */}
        {meal.restaurant && (
          <div className="mb-4 bg-muted/40 p-2 rounded-md">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
              <p className="text-sm font-medium">{meal.restaurant.name}</p>
            </div>
            <div className="flex items-center mt-1">
              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">{meal.restaurant.deliveryTime} min • {meal.restaurant.distance.toFixed(1)} km</p>
            </div>
          </div>
        )}

        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="text-center p-2 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground">Calories</p>
              <p className="font-semibold">{meal.calories}</p>
            </div>
            <div className="text-center p-2 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground">Protein</p>
              <p className="font-semibold">{meal.protein}g</p>
            </div>
            <div className="text-center p-2 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground">Carbs</p>
              <p className="font-semibold">{meal.carbs}g</p>
            </div>
            <div className="text-center p-2 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground">Fat</p>
              <p className="font-semibold">{meal.fats}g</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {meal.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="bg-accent">
              {tag}
            </Badge>
          ))}
          {meal.tags.length > 3 && (
            <Badge variant="outline" className="bg-muted">
              +{meal.tags.length - 3}
            </Badge>
          )}
        </div>

        {meal.allergens.length > 0 && (
          <div className="text-xs text-muted-foreground mb-2">
            <span className="font-semibold">Contains: </span>
            {meal.allergens.join(", ")}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col pt-2 gap-2">
        {showBuyButton && (
          <Button 
            onClick={onBuyNow} 
            className="w-full"
            variant="default"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        )}
        
        {showAddToLog && (
          <div className="w-full">
            <p className="text-xs text-muted-foreground mb-2">Add to today's meal log:</p>
            <div className="flex gap-2 flex-wrap">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleAddToLog('breakfast')}
              >
                Breakfast
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleAddToLog('lunch')}
              >
                Lunch
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleAddToLog('dinner')}
              >
                Dinner
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleAddToLog('snack')}
              >
                Snack
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default MealCard;
