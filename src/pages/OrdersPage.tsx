
import React from 'react';
import { useCart } from '@/context/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { meals as staticMeals } from '@/data/meals';
import { FileText, MapPin, Clock, Truck } from 'lucide-react';

const OrdersPage = () => {
  const { orders } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const newOrder = location.state?.newOrder;
  
  // Find meals from static data - in a real app this would be a database lookup
  const getMealDetails = (mealId: string) => {
    return staticMeals.find(meal => meal.id === mealId);
  };
  
  // Get status badge color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Format just the time from an ISO string
  const formatTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <FileText className="mr-2 h-6 w-6" /> Your Orders
          </h1>
          <Button onClick={() => navigate('/meals')}>
            Browse More Meals
          </Button>
        </div>
        
        {newOrder && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-700">
                Order Confirmed!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 mb-2">
                Your order has been successfully placed and will be delivered soon.
              </p>
              <p className="text-sm">
                Order #{newOrder.id.slice(-8)} • {formatDate(newOrder.orderDate)}
              </p>
              {newOrder.estimatedDeliveryTime && (
                <div className="flex items-center mt-2">
                  <Truck className="h-4 w-4 mr-2 text-green-700" />
                  <p className="text-sm text-green-700">
                    Estimated delivery by {formatTime(newOrder.estimatedDeliveryTime)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-xl font-semibold">No orders yet</h2>
                <p className="mt-2 text-muted-foreground">
                  Your order history will appear here once you place an order.
                </p>
                <Button onClick={() => navigate('/meals')} className="mt-6">
                  Browse Meals
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">
                        Order #{order.id.slice(-8)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.orderDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <p className="font-medium">
                        ${order.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  {order.restaurantInfo && (
                    <div className="mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="font-medium">{order.restaurantInfo.name}</p>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">
                        {order.restaurantInfo.address}
                      </p>
                    </div>
                  )}
                  
                  {order.estimatedDeliveryTime && (
                    <div className="mb-4 flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Delivery by:</span> {formatTime(order.estimatedDeliveryTime)}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {order.deliveryAddress && (
                    <div className="mb-4 text-sm">
                      <p className="font-medium">Delivery Address</p>
                      <p className="text-muted-foreground">{order.deliveryAddress}</p>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    {order.items.map((item) => {
                      const meal = getMealDetails(item.mealId);
                      return meal ? (
                        <div key={item.mealId} className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <div>
                              <p className="font-medium">{meal.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.quantity} x ${item.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <p className="text-right">
                            ${(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                      ) : (
                        <div key={item.mealId} className="text-muted-foreground">
                          Meal not found (ID: {item.mealId})
                        </div>
                      );
                    })}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-end">
                    <div className="space-y-1 text-right">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Subtotal: </span>
                        <span>${order.totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Delivery: </span>
                        <span>$5.99</span>
                      </div>
                      <div className="font-bold">
                        <span>Total: </span>
                        <span>${(order.totalPrice + 5.99).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
