import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart, CartItem, Order, Meal } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useMealLog } from '@/context/MealLogContext';
import { format } from 'date-fns';

interface CartContextProps {
  cart: Cart;
  addToCart: (meal: Meal, quantity?: number) => void;
  removeFromCart: (mealId: string) => void;
  updateQuantity: (mealId: string, quantity: number) => void;
  clearCart: () => void;
  checkout: (address: string, paymentMethod: string) => Promise<Order | null>;
  orders: Order[];
  fetchOrders: () => Promise<void>;
}

const CartContext = createContext<CartContextProps>({
  cart: { items: [], totalPrice: 0 },
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  checkout: async () => null,
  orders: [],
  fetchOrders: async () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : { items: [], totalPrice: 0 };
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const { addMealToLog } = useMealLog();

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Fetch orders on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Helper function to add delivered meals to meal log
  const addDeliveredMealsToLog = async (order: Order) => {
    if (!user) return;
    
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      // Distribute meals across meal types based on their quantities
      const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
      let typeIndex = 0;
      
      for (const item of order.items) {
        // For each quantity of the item, add it to the meal log with a different meal type
        for (let i = 0; i < item.quantity; i++) {
          const mealType = mealTypes[typeIndex % mealTypes.length];
          await addMealToLog(item.mealId, today, mealType as any);
          typeIndex++;
        }
      }
      
      toast({
        title: "Meals added to tracker",
        description: "Your ordered meals have been added to your meal tracker",
      });
    } catch (error) {
      console.error('Error adding delivered meals to log:', error);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user.id)
        .order('order_date', { ascending: false });
      
      if (error) throw error;
      
      // Transform to match our Order type
      const transformedOrders: Order[] = data.map((order: any) => ({
        id: order.id,
        userId: order.user_id,
        items: order.order_items.map((item: any) => ({
          mealId: item.meal_id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: order.total_price,
        orderDate: order.order_date,
        status: order.status,
        deliveryAddress: order.delivery_address,
        paymentMethod: order.payment_method,
        estimatedDeliveryTime: new Date(new Date(order.order_date).getTime() + 30 * 60000).toISOString(),
        restaurantInfo: {
          name: 'Demo Restaurant',
          address: '123 Health St, Wellness City'
        }
      }));
      
      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Could not load your orders",
        variant: "destructive",
      });
    }
  };

  const addToCart = (meal: Meal, quantity = 1) => {
    if (!meal.price) {
      console.error('Meal does not have a price', meal);
      toast({
        title: "Error",
        description: "Cannot add meal to cart without price",
        variant: "destructive",
      });
      return;
    }
    
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.items.findIndex(item => item.mealId === meal.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        
        // Recalculate total price
        const totalPrice = updatedItems.reduce(
          (sum, item) => sum + (item.price * item.quantity), 
          0
        );
        
        return { items: updatedItems, totalPrice };
      } else {
        // Add new item
        const newItem: CartItem = {
          mealId: meal.id,
          quantity,
          price: meal.price,
          restaurantId: meal.restaurant?.id
        };
        
        // Add to items array and recalculate total
        const updatedItems = [...prevCart.items, newItem];
        const totalPrice = updatedItems.reduce(
          (sum, item) => sum + (item.price * item.quantity), 
          0
        );
        
        return { items: updatedItems, totalPrice };
      }
    });
    
    toast({
      title: "Added to cart",
      description: `${meal.name} added to your cart`,
    });
  };

  const removeFromCart = (mealId: string) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item.mealId !== mealId);
      const totalPrice = updatedItems.reduce(
        (sum, item) => sum + (item.price * item.quantity), 
        0
      );
      
      return { items: updatedItems, totalPrice };
    });
  };

  const updateQuantity = (mealId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(mealId);
      return;
    }
    
    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item => 
        item.mealId === mealId ? { ...item, quantity } : item
      );
      
      const totalPrice = updatedItems.reduce(
        (sum, item) => sum + (item.price * item.quantity), 
        0
      );
      
      return { items: updatedItems, totalPrice };
    });
  };

  const clearCart = () => {
    setCart({ items: [], totalPrice: 0 });
  };

  const checkout = async (address: string, paymentMethod: string): Promise<Order | null> => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to checkout",
        variant: "destructive",
      });
      return null;
    }

    try {
      // Get current date and time
      const orderDate = new Date().toISOString();
      
      // Create the order in Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_price: cart.totalPrice + 5.99, // Add delivery fee
          order_date: orderDate,
          status: 'confirmed',
          delivery_address: address,
          payment_method: paymentMethod
        })
        .select('id')
        .single();

      if (orderError) throw orderError;

      // Check if there are any non-UUID format meal IDs (mock data)
      const validItems = cart.items.filter(item => {
        // UUID format validation - should be a string with hyphens
        const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.mealId);
        return isValidUuid;
      });
      
      // Only insert valid items into the database
      if (validItems.length > 0) {
        const orderItems = validItems.map(item => ({
          order_id: orderData.id,
          meal_id: item.mealId,
          quantity: item.quantity,
          price: item.price
        }));

        if (orderItems.length > 0) {
          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

          if (itemsError) throw itemsError;
        }
      }

      // Create a new order object to return and add to local state
      const newOrder: Order = {
        id: orderData.id,
        userId: user.id,
        items: [...cart.items],
        totalPrice: cart.totalPrice + 5.99,
        orderDate,
        status: 'confirmed',
        deliveryAddress: address,
        paymentMethod,
        estimatedDeliveryTime: new Date(new Date(orderDate).getTime() + 30 * 60000).toISOString(),
        restaurantInfo: {
          name: 'Healthy Eats Restaurant',
          address: '123 Nutrition Ave, Wellness City'
        }
      };
      
      // Add the order to the orders list
      setOrders(prevOrders => [newOrder, ...prevOrders]);
      
      // Automatically add meals to meal log after "delivery"
      setTimeout(() => {
        addDeliveredMealsToLog(newOrder);
      }, 5000); // Simulate a short delay for "delivery"
      
      // Clear the cart
      clearCart();
      
      toast({
        title: "Order Placed Successfully",
        description: "Your order has been confirmed",
      });
      
      return newOrder;
    } catch (error) {
      console.error('Error during checkout:', error);
      toast({
        title: "Checkout Failed",
        description: "There was a problem processing your order",
        variant: "destructive",
      });
      return null;
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      checkout,
      orders,
      fetchOrders
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
