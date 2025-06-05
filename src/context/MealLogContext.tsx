
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MealLog, Meal } from '@/types';
import { meals as staticMeals } from '@/data/meals';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface MealLogContextProps {
  mealLogs: MealLog[];
  addMealToLog: (mealId: string, date: string, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack', notes?: string) => Promise<void>;
  removeMealFromLog: (logId: string, mealId: string) => Promise<void>;
  getMealsByDate: (date: string) => MealLog | undefined;
  getMealById: (mealId: string) => Meal | undefined;
  getOrderHistory: () => Promise<any[]>;
  loading: boolean;
  availableMeals: Meal[];
  setAvailableMeals: React.Dispatch<React.SetStateAction<Meal[]>>;
}

const MealLogContext = createContext<MealLogContextProps>({
  mealLogs: [],
  addMealToLog: async () => {},
  removeMealFromLog: async () => {},
  getMealsByDate: () => undefined,
  getMealById: () => undefined,
  getOrderHistory: async () => [],
  loading: false,
  availableMeals: [],
  setAvailableMeals: () => {}
});

// Helper function to validate UUID format
const isValidUuid = (str: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export const MealLogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [availableMeals, setAvailableMeals] = useState<Meal[]>([...staticMeals]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchMealLogs = async () => {
      if (!user) {
        setMealLogs([]);
        return;
      }

      try {
        setLoading(true);

        // Fetch meal logs from Supabase
        const { data: logsData, error: logsError } = await supabase
          .from('meal_logs')
          .select('id, log_date, user_id')
          .eq('user_id', user.id);

        if (logsError) throw logsError;

        if (!logsData || logsData.length === 0) {
          setMealLogs([]);
          return;
        }

        // For each log, fetch the corresponding meal items
        const logs = await Promise.all(
          logsData.map(async (log) => {
            const { data: itemsData, error: itemsError } = await supabase
              .from('meal_log_items')
              .select('id, meal_id, meal_type, time_consumed, notes')
              .eq('log_id', log.id);

            if (itemsError) throw itemsError;

            const mealLog: MealLog = {
              id: log.id,
              userId: log.user_id,
              date: log.log_date,
              meals: itemsData ? itemsData.map(item => ({
                mealId: item.meal_id,
                mealType: item.meal_type as 'breakfast' | 'lunch' | 'dinner' | 'snack',
                timeConsumed: item.time_consumed,
                notes: item.notes || undefined
              })) : []
            };

            return mealLog;
          })
        );

        setMealLogs(logs);
      } catch (error) {
        console.error('Error fetching meal logs:', error);
        toast({
          title: 'Error loading meal logs',
          description: 'Could not load your meal history.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMealLogs();
  }, [user, toast]);

  const addMealToLog = async (mealId: string, date: string, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack', notes?: string) => {
    if (!user) return;

    // First check if the mealId is a valid UUID
    if (!isValidUuid(mealId)) {
      // For non-UUID meal IDs (like from static data), just update the local state without database
      const meal = getMealById(mealId);
      if (!meal) {
        toast({
          title: 'Error',
          description: 'Could not find the selected meal.',
          variant: 'destructive',
        });
        return;
      }

      // Create a temporary log entry for local display only
      const currentTime = new Date().toISOString();
      const tempLogId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      const existingLog = mealLogs.find(log => log.date === date);
      
      if (existingLog) {
        // Add to existing log
        setMealLogs(prevLogs => 
          prevLogs.map(log => 
            log.date === date 
              ? {
                  ...log,
                  meals: [
                    ...log.meals,
                    {
                      mealId,
                      mealType,
                      timeConsumed: currentTime,
                      notes: notes || undefined
                    }
                  ]
                }
              : log
          )
        );
      } else {
        // Create new log
        const newLog: MealLog = {
          id: tempLogId,
          userId: user.id,
          date,
          meals: [{
            mealId,
            mealType,
            timeConsumed: currentTime,
            notes: notes || undefined
          }]
        };
        
        setMealLogs(prevLogs => [...prevLogs, newLog]);
      }

      toast({
        title: 'Meal logged',
        description: `Added to your ${mealType} log for ${new Date(date).toLocaleDateString()}.`
      });
      
      return;
    }

    try {
      // Continue with normal flow for valid UUID meal IDs
      // Check if log for this date exists
      let logId: string;
      const existingLog = mealLogs.find(log => log.date === date);

      if (existingLog) {
        logId = existingLog.id;
      } else {
        // Create new log for this date
        const { data: newLog, error: newLogError } = await supabase
          .from('meal_logs')
          .insert({
            user_id: user.id,
            log_date: date
          })
          .select('id')
          .single();

        if (newLogError) throw newLogError;
        logId = newLog.id;
      }

      // Current time for the meal timestamp
      const currentTime = new Date().toISOString();

      // Add meal to the log
      const { error: itemError } = await supabase
        .from('meal_log_items')
        .insert({
          log_id: logId,
          meal_id: mealId,
          meal_type: mealType,
          time_consumed: currentTime,
          notes: notes || null
        });

      if (itemError) throw itemError;

      // Refresh meal logs
      const { data: updatedLog, error: logError } = await supabase
        .from('meal_logs')
        .select('id, log_date, user_id')
        .eq('id', logId)
        .single();

      if (logError) throw logError;

      const { data: items, error: itemsError } = await supabase
        .from('meal_log_items')
        .select('id, meal_id, meal_type, time_consumed, notes')
        .eq('log_id', logId);

      if (itemsError) throw itemsError;

      const updatedMealLog: MealLog = {
        id: updatedLog.id,
        userId: updatedLog.user_id,
        date: updatedLog.log_date,
        meals: items ? items.map(item => ({
          mealId: item.meal_id,
          mealType: item.meal_type as 'breakfast' | 'lunch' | 'dinner' | 'snack',
          timeConsumed: item.time_consumed,
          notes: item.notes || undefined
        })) : []
      };

      setMealLogs(prev => {
        const filtered = prev.filter(log => log.id !== logId);
        return [...filtered, updatedMealLog];
      });

      toast({
        title: 'Meal logged',
        description: `Added to your ${mealType} log for ${new Date(date).toLocaleDateString()}.`
      });
    } catch (error) {
      console.error('Error adding meal to log:', error);
      toast({
        title: 'Error logging meal',
        description: 'Could not add meal to your log.',
        variant: 'destructive',
      });
    }
  };

  const removeMealFromLog = async (logId: string, mealId: string) => {
    if (!user) return;

    // For temporary logs (non-UUID meal IDs), handle locally
    if (logId.startsWith('temp-')) {
      setMealLogs(prevLogs => {
        // Find the log
        const updatedLogs = prevLogs.map(log => {
          if (log.id === logId) {
            // Remove the meal from this log
            return {
              ...log,
              meals: log.meals.filter(meal => meal.mealId !== mealId)
            };
          }
          return log;
        });
        
        // Remove any empty logs
        return updatedLogs.filter(log => log.meals.length > 0);
      });
      
      toast({
        title: 'Meal removed',
        description: 'Removed meal from your log.'
      });
      
      return;
    }

    try {
      // Find the meal log item containing this meal
      const { data: items, error: findError } = await supabase
        .from('meal_log_items')
        .select('id')
        .eq('log_id', logId)
        .eq('meal_id', mealId);

      if (findError) throw findError;
      if (!items || items.length === 0) return;

      // Delete the meal log item
      const { error: deleteError } = await supabase
        .from('meal_log_items')
        .delete()
        .eq('id', items[0].id);

      if (deleteError) throw deleteError;

      // Check if any items remain in this log
      const { data: remainingItems, error: countError } = await supabase
        .from('meal_log_items')
        .select('id')
        .eq('log_id', logId);

      if (countError) throw countError;

      if (!remainingItems || remainingItems.length === 0) {
        // No items left, delete the log
        const { error: deleteLogError } = await supabase
          .from('meal_logs')
          .delete()
          .eq('id', logId);

        if (deleteLogError) throw deleteLogError;

        setMealLogs(prev => prev.filter(log => log.id !== logId));
      } else {
        // Update the log in state
        setMealLogs(prev => {
          return prev.map(log => {
            if (log.id === logId) {
              return {
                ...log,
                meals: log.meals.filter(meal => meal.mealId !== mealId)
              };
            }
            return log;
          });
        });
      }

      toast({
        title: 'Meal removed',
        description: 'Removed meal from your log.'
      });
    } catch (error) {
      console.error('Error removing meal from log:', error);
      toast({
        title: 'Error removing meal',
        description: 'Could not remove meal from your log.',
        variant: 'destructive',
      });
    }
  };

  const getMealsByDate = (date: string) => {
    return mealLogs.find(log => log.date === date);
  };

  const getMealById = (mealId: string) => {
    // First check in available meals, which includes personalized recommendations
    const meal = availableMeals.find(meal => meal.id === mealId);
    if (meal) return meal;
    
    // Fall back to static meals if not found
    return staticMeals.find(meal => meal.id === mealId);
  };

  // Get order history for the current user
  const getOrderHistory = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user.id)
        .order('order_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching order history:', error);
      toast({
        title: 'Error loading orders',
        description: 'Could not load your order history.',
        variant: 'destructive',
      });
      return [];
    }
  };

  return (
    <MealLogContext.Provider value={{ 
      mealLogs, 
      addMealToLog, 
      removeMealFromLog, 
      getMealsByDate,
      getMealById,
      getOrderHistory,
      loading,
      availableMeals,
      setAvailableMeals
    }}>
      {children}
    </MealLogContext.Provider>
  );
};

export const useMealLog = () => useContext(MealLogContext);
