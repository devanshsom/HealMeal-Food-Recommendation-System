
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Order } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Clock, CheckCircle, Truck, Package, Utensils, AlertTriangle } from 'lucide-react';
import { meals as staticMeals } from '@/data/meals';

// Demo delivery statuses
type DeliveryStatus = 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered';

interface DeliveryStep {
  status: DeliveryStatus;
  title: string;
  description: string;
  icon: React.ReactNode;
  time: string | null;
}

const DeliveryTrackingPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const order = state?.order as Order | undefined;
  
  const [currentStatus, setCurrentStatus] = useState<DeliveryStatus>('confirmed');
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);
  
  // Demo delivery ETAs
  const getDeliverySteps = (): DeliveryStep[] => {
    const orderTime = order ? new Date(order.orderDate) : new Date();
    
    // Set estimated times for each step
    const confirmTime = new Date(orderTime);
    const prepTime = new Date(orderTime.getTime() + 5 * 60000); // 5 minutes after order 
    const readyTime = new Date(orderTime.getTime() + 15 * 60000); // 15 minutes after order
    const outForDeliveryTime = new Date(orderTime.getTime() + 17 * 60000); // 17 minutes after order
    const deliveredTime = new Date(orderTime.getTime() + 30 * 60000); // 30 minutes after order
    
    const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return [
      { 
        status: 'confirmed', 
        title: 'Order Confirmed', 
        description: 'Your order has been received by the restaurant',
        icon: <CheckCircle className="h-6 w-6 text-blue-500" />,
        time: formatTime(confirmTime)
      },
      { 
        status: 'preparing', 
        title: 'Preparing Your Food', 
        description: 'The chef is preparing your meal',
        icon: <Utensils className="h-6 w-6 text-orange-500" />,
        time: currentStatus === 'confirmed' ? null : formatTime(prepTime)
      },
      { 
        status: 'ready', 
        title: 'Order Ready', 
        description: 'Your food is packaged and ready for delivery',
        icon: <Package className="h-6 w-6 text-purple-500" />,
        time: currentStatus === 'confirmed' || currentStatus === 'preparing' ? null : formatTime(readyTime)
      },
      { 
        status: 'out_for_delivery', 
        title: 'Out for Delivery', 
        description: 'Your order is on its way',
        icon: <Truck className="h-6 w-6 text-indigo-500" />,
        time: currentStatus === 'confirmed' || currentStatus === 'preparing' || currentStatus === 'ready' ? null : formatTime(outForDeliveryTime)
      },
      { 
        status: 'delivered', 
        title: 'Delivered', 
        description: 'Your order has been delivered',
        icon: <MapPin className="h-6 w-6 text-green-500" />,
        time: currentStatus === 'delivered' ? formatTime(deliveredTime) : null
      },
    ];
  };
  
  // Get meal details
  const getMealDetails = (mealId: string) => {
    return staticMeals.find(meal => meal.id === mealId);
  };
  
  // Simulate delivery status updates
  useEffect(() => {
    if (!order || !isLiveUpdating) return;
    
    const statusSequence: DeliveryStatus[] = ['confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
    const currentIndex = statusSequence.indexOf(currentStatus);
    
    if (currentIndex < statusSequence.length - 1) {
      const timeouts = [5000, 10000, 2000, 13000]; // Times in ms for each status transition
      
      const timer = setTimeout(() => {
        const nextStatus = statusSequence[currentIndex + 1];
        setCurrentStatus(nextStatus);
        
        if (nextStatus === 'delivered') {
          toast({
            title: "Order delivered!",
            description: "Your order has been delivered. Enjoy your meal!",
          });
          setIsLiveUpdating(false);
        }
      }, timeouts[currentIndex]);
      
      return () => clearTimeout(timer);
    }
  }, [currentStatus, order, isLiveUpdating, toast]);
  
  // Validate order data
  useEffect(() => {
    if (!order) {
      toast({
        title: "Missing order information",
        description: "Please go through the checkout process",
        variant: "destructive"
      });
      navigate('/cart');
    }
  }, [order, navigate, toast]);
  
  if (!order) return null;
  
  const deliverySteps = getDeliverySteps();
  const activeStepIndex = deliverySteps.findIndex(step => step.status === currentStatus);
  
  // Calculate estimated delivery time
  const calculateETA = () => {
    const orderTime = new Date(order.orderDate);
    const deliveryTime = new Date(orderTime.getTime() + 30 * 60000); // 30 minutes after order
    
    return deliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Track Your Order</h1>
        <p className="text-center text-muted-foreground mb-8">
          Order #{order.id.substring(0, 8)} • {new Date(order.orderDate).toLocaleDateString()}
        </p>
        
        <div className="mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Delivery Status</CardTitle>
                  <CardDescription>
                    Estimated delivery by {calculateETA()}
                  </CardDescription>
                </div>
                <Badge className={
                  currentStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                  currentStatus === 'out_for_delivery' ? 'bg-indigo-100 text-indigo-800' :
                  currentStatus === 'ready' ? 'bg-purple-100 text-purple-800' :
                  currentStatus === 'preparing' ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }>
                  {currentStatus.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Delivery progress bar */}
              <div className="relative mb-6 mt-2">
                <div className="overflow-hidden h-2 text-xs flex bg-muted rounded-full">
                  <div 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
                    style={{ width: `${(activeStepIndex / (deliverySteps.length - 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Delivery steps */}
              <div className="space-y-6">
                {deliverySteps.map((step, index) => {
                  const isActive = index <= activeStepIndex;
                  const isCurrent = index === activeStepIndex;
                  
                  return (
                    <div key={step.status} className={`flex ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                        isCurrent ? 'bg-primary/20' : isActive ? 'bg-primary/10' : 'bg-muted'
                      }`}>
                        {step.icon}
                      </div>
                      
                      <div className="ml-4 flex-grow">
                        <div className="flex justify-between">
                          <h3 className={`font-medium ${isCurrent ? 'text-primary' : ''}`}>{step.title}</h3>
                          {step.time && <span className="text-sm text-muted-foreground">{step.time}</span>}
                        </div>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Demo controls */}
              {currentStatus !== 'delivered' && (
                <div className="mt-6 p-3 bg-amber-50 border border-amber-100 rounded-md">
                  <div className="flex gap-2 items-center">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <p className="text-sm text-amber-700">This is a demo. Live updates simulated.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Order details */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Delivery details */}
            <div className="space-y-3">
              <div className="flex gap-2 items-start">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Delivery Address</p>
                  <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
                </div>
              </div>
              
              <div className="flex gap-2 items-start">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Estimated Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.orderDate).toLocaleDateString()} by {calculateETA()}
                  </p>
                </div>
              </div>
              
              {order.restaurantInfo && (
                <div className="flex gap-2 items-start">
                  <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Delivery From</p>
                    <p className="text-sm text-muted-foreground">{order.restaurantInfo.name}</p>
                    <p className="text-xs text-muted-foreground">{order.restaurantInfo.address}</p>
                  </div>
                </div>
              )}
            </div>
            
            <Separator />
            
            {/* Order items */}
            <div>
              <h3 className="font-medium mb-2">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => {
                  const meal = getMealDetails(item.mealId);
                  return (
                    <div key={index} className="flex justify-between">
                      <div className="flex-grow">
                        <p className="font-medium">{meal?.name || "Meal"}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <Separator />
            
            {/* Order totals */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${(order.totalPrice - 5.99).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>$5.99</span>
              </div>
              <div className="flex justify-between font-semibold mt-2">
                <span>Total</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/tracker')}
          >
            View Order History
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTrackingPage;
