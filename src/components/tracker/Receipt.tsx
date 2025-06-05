
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Receipt as ReceiptIcon, Clock, MapPin } from 'lucide-react';
import { meals } from '@/data/meals';

type OrderItemType = {
  mealId: string;
  quantity: number;
  price: number;
};

type OrderType = {
  id: string;
  orderDate: string;
  status: string;
  items: OrderItemType[];
  totalPrice: number;
  deliveryAddress?: string;
  estimatedDeliveryTime?: string;
  restaurantInfo?: {
    name: string;
    address: string;
  };
};

interface ReceiptProps {
  order: OrderType;
}

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'preparing':
      return 'bg-orange-100 text-orange-800';
    case 'out_for_delivery':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getMealDetailsById = (mealId: string) => {
  return meals.find(meal => meal.id === mealId);
};

const Receipt: React.FC<ReceiptProps> = ({ order }) => {
  // Check if order is undefined or doesn't have all required properties
  if (!order || !order.id || !order.orderDate || !order.items) {
    return (
      <Card className="border-2 bg-white shadow-md">
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Receipt details unavailable</p>
        </CardContent>
      </Card>
    );
  }

  const orderDate = new Date(order.orderDate);
  // Add a safety check for order.items
  const totalItems = order.items && Array.isArray(order.items) 
    ? order.items.reduce((sum, item) => sum + item.quantity, 0) 
    : 0;

  return (
    <Card className="border-2 bg-white shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <ReceiptIcon className="h-5 w-5 mr-2 text-primary" />
            <div>
              <CardTitle className="text-lg">Receipt #{order.id.substring(0, 8)}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {format(orderDate, "MMMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>
          <Badge className={getStatusBadgeColor(order.status)}>
            {order.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Items:</span>
            <span className="font-medium">{totalItems} items</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="font-medium">${(order.totalPrice - 5.99).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery:</span>
            <span className="font-medium">$5.99</span>
          </div>
          <div className="flex justify-between text-sm font-semibold">
            <span>Total:</span>
            <span>${order.totalPrice.toFixed(2)}</span>
          </div>
          
          {order.deliveryAddress && (
            <div className="flex gap-2 items-start text-sm mt-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span className="flex-grow">{order.deliveryAddress}</span>
            </div>
          )}
        </div>
        
        <Separator className="my-3" />
        
        <div className="space-y-2">
          <h3 className="text-sm font-semibold mb-2">Order Items</h3>
          {order.items && order.items.length > 0 ? (
            order.items.map((item, index) => {
              const meal = getMealDetailsById(item.mealId);
              return (
                <div key={`${item.mealId}-${index}`} className="flex justify-between text-sm">
                  <span>{meal?.name || "Unknown Meal"} × {item.quantity}</span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              );
            })
          ) : (
            <div className="text-sm text-muted-foreground">No items in this order</div>
          )}
        </div>
      </CardContent>
      {order.estimatedDeliveryTime && (
        <CardFooter className="bg-muted/30 text-sm flex items-center">
          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
          <span>
            {order.status === 'delivered' 
              ? `Delivered on ${format(new Date(order.estimatedDeliveryTime), "MMM d 'at' h:mm a")}`
              : `Estimated delivery by ${format(new Date(order.estimatedDeliveryTime), "h:mm a")}`
            }
          </span>
        </CardFooter>
      )}
    </Card>
  );
};

export default Receipt;
