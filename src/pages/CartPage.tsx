
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { MinusCircle, PlusCircle, ShoppingCart, Loader2, MapPin, Clock, Truck } from 'lucide-react';
import { meals as staticMeals } from '@/data/meals';
import { useAuth } from '@/context/AuthContext';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, checkout } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Find meals from static data - in a real app this would be a database lookup
  const getMealDetails = (mealId: string) => {
    return staticMeals.find(meal => meal.id === mealId);
  };
  
  const handleQuantityChange = (mealId: string, change: number) => {
    const item = cart.items.find(item => item.mealId === mealId);
    if (item) {
      updateQuantity(mealId, item.quantity + change);
    }
  };
  
  // Group items by restaurant for better display
  const getItemsByRestaurant = () => {
    const restaurantGroups: Record<string, {
      restaurantName: string;
      restaurantAddress: string;
      deliveryTime: number;
      items: {item: typeof cart.items[0], meal: ReturnType<typeof getMealDetails>}[]
    }> = {};
    
    cart.items.forEach(item => {
      const meal = getMealDetails(item.mealId);
      if (meal && meal.restaurant) {
        const restaurantId = meal.restaurant.id;
        
        if (!restaurantGroups[restaurantId]) {
          restaurantGroups[restaurantId] = {
            restaurantName: meal.restaurant.name,
            restaurantAddress: meal.restaurant.address,
            deliveryTime: meal.restaurant.deliveryTime,
            items: []
          };
        }
        
        restaurantGroups[restaurantId].items.push({ item, meal });
      } else if (meal) {
        // For meals without restaurant info
        const noRestaurantId = 'no-restaurant';
        if (!restaurantGroups[noRestaurantId]) {
          restaurantGroups[noRestaurantId] = {
            restaurantName: 'Other Items',
            restaurantAddress: '',
            deliveryTime: 30,
            items: []
          };
        }
        restaurantGroups[noRestaurantId].items.push({ item, meal });
      }
    });
    
    return Object.values(restaurantGroups);
  };
  
  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to checkout",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    if (!address) {
      toast({
        title: "Missing delivery address",
        description: "Please enter a delivery address",
        variant: "destructive",
      });
      return;
    }
    
    setIsCheckingOut(true);
    
    try {
      const order = await checkout(address, paymentMethod);
      
      if (order) {
        toast({
          title: "Order placed successfully!",
          description: `Your order #${order.id.substring(0, 8)} has been confirmed.`,
        });
        
        // Redirect to payment page
        navigate('/payment', { state: { order } });
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast({
        title: "Checkout failed",
        description: "We couldn't process your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };
  
  // Calculate estimated delivery time (the longest one from all restaurants)
  const getEstimatedDeliveryTime = () => {
    const restaurantGroups = getItemsByRestaurant();
    if (restaurantGroups.length === 0) return 30;
    
    // Find the longest delivery time
    return Math.max(...restaurantGroups.map(group => group.deliveryTime));
  };
  
  // Format delivery time into human-readable string
  const formatDeliveryTime = () => {
    const minutes = getEstimatedDeliveryTime();
    const now = new Date();
    const deliveryTime = new Date(now.getTime() + minutes * 60000);
    
    return deliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <ShoppingCart className="mr-2 h-6 w-6" /> Your Cart
        </h1>
        
        {cart.items.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-xl font-semibold">Your cart is empty</h2>
                <p className="mt-2 text-muted-foreground">
                  Browse our healing meals and add some items to your cart.
                </p>
                <Button onClick={() => navigate('/meals')} className="mt-6">
                  Browse Meals
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Your Items ({cart.items.length})</CardTitle>
                  <CardDescription>
                    Review the items you've added to your cart
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {getItemsByRestaurant().map((group, index) => (
                    <div key={index} className="mb-6">
                      <div className="flex items-center mb-2">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        <h3 className="font-medium">{group.restaurantName}</h3>
                      </div>
                      {group.restaurantAddress && (
                        <p className="text-sm text-muted-foreground mb-2 pl-6">
                          {group.restaurantAddress}
                        </p>
                      )}
                      <div className="flex items-center mb-3 pl-6">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Delivery in {group.deliveryTime} minutes
                        </p>
                      </div>
                      
                      {group.items.map(({ item, meal }) => meal ? (
                        <div key={item.mealId} className="py-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium">{meal.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {meal.calories} calories per serving
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">${item.price.toFixed(2)}</div>
                            </div>
                          </div>
                          
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-8 w-8 rounded-full p-0"
                                onClick={() => handleQuantityChange(item.mealId, -1)}
                                disabled={item.quantity <= 1}
                              >
                                <MinusCircle className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-8 w-8 rounded-full p-0"
                                onClick={() => handleQuantityChange(item.mealId, 1)}
                              >
                                <PlusCircle className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-muted-foreground hover:text-red-500"
                              onClick={() => removeFromCart(item.mealId)}
                            >
                              Remove
                            </Button>
                          </div>
                          
                          <Separator className="mt-4" />
                        </div>
                      ) : null)}
                      
                      {index < getItemsByRestaurant().length - 1 && (
                        <Separator className="my-6" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 p-3 bg-muted/30 rounded-md flex items-center">
                    <Truck className="mr-2 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Estimated Delivery</p>
                      <p className="text-xs text-muted-foreground">Today by {formatDeliveryTime()}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${cart.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span>$5.99</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${(cart.totalPrice + 5.99).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <div className="mb-4 w-full">
                    <Label htmlFor="address">Delivery Address</Label>
                    <Input 
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your delivery address"
                      className="mt-1"
                    />
                  </div>
                  
                  <Button
                    className="w-full"
                    onClick={handleCheckout}
                    disabled={isCheckingOut || !address}
                  >
                    {isCheckingOut ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Proceed to Checkout"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
