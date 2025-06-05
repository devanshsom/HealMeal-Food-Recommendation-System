
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, HealthCondition } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface UserContextProps {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => Promise<void>;
  isProfileComplete: boolean;
  loading: boolean;
}

const defaultUser: UserProfile = {
  id: "",
  name: "",
  age: 0,
  height: 0,
  weight: 0,
  gender: "other",
  conditions: [],
  allergies: [],
  dietaryPreferences: [],
};

const UserContext = createContext<UserContextProps>({
  userProfile: defaultUser,
  setUserProfile: async () => {},
  isProfileComplete: false,
  loading: true,
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const isProfileComplete = Boolean(
    userProfile && 
    userProfile.name && 
    userProfile.age > 0 && 
    userProfile.height > 0 && 
    userProfile.weight > 0
  );

  // Fetch data from Supabase with safety measures
  const fetchUserData = async (userId: string, tableName: "user_health_conditions" | "user_allergies" | "user_dietary_preferences", columnName: string) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select(columnName)
        .eq('user_id', userId);
        
      if (error) {
        console.error(`Error fetching ${tableName}:`, error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error(`Error in fetchUserData for ${tableName}:`, error);
      return [];
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setUserProfileState(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        console.log("Fetching profile for user ID:", user.id);

        // Fetch profile from Supabase
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          // PGRST116 means no rows returned, which is fine for new users
          console.error("Profile error:", profileError);
          throw profileError;
        }

        // Fetch health conditions
        const conditionsData = await fetchUserData(user.id, "user_health_conditions", 'condition_name');

        // Fetch allergies
        const allergiesData = await fetchUserData(user.id, "user_allergies", 'allergy_name');

        // Fetch dietary preferences
        const preferencesData = await fetchUserData(user.id, "user_dietary_preferences", 'preference_name');

        // Construct user profile with fallbacks for missing data
        const profile: UserProfile = {
          id: user.id,
          name: profileData?.name || user.user_metadata?.name || '',
          age: profileData?.age || 0,
          height: profileData?.height || 0,
          weight: profileData?.weight || 0,
          gender: (profileData?.gender as 'male' | 'female' | 'other') || 'other',
          conditions: conditionsData?.map((c: any) => c.condition_name as HealthCondition) || [],
          allergies: allergiesData?.map((a: any) => a.allergy_name) || [],
          dietaryPreferences: preferencesData?.map((p: any) => p.preference_name) || [],
          bmi: profileData?.bmi || undefined
        };

        console.log("Fetched profile:", profile);

        setUserProfileState(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        
        // Set default profile with user ID if profile fetch fails
        if (user) {
          setUserProfileState({
            ...defaultUser,
            id: user.id,
            name: user.user_metadata?.name || '',
          });
        }

        toast({
          title: 'Error loading profile',
          description: 'Could not load your profile information. Using default profile.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, toast]);

  // Function to update user profile in Supabase
  const setUserProfile = async (profile: UserProfile): Promise<void> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You need to be logged in to update your profile.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      console.log("Updating profile for user ID:", user.id);
      console.log("Profile data to save:", profile);
      
      // Ensure profile ID matches user ID
      const profileToSave = {
        ...profile,
        id: user.id
      };
      
      // Calculate BMI if height and weight are provided
      if (profileToSave.height > 0 && profileToSave.weight > 0) {
        const heightInMeters = profileToSave.height / 100;
        profileToSave.bmi = Math.round((profileToSave.weight / (heightInMeters * heightInMeters)) * 10) / 10;
      }

      // Update profile in Supabase
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: profileToSave.name,
          age: profileToSave.age,
          height: profileToSave.height,
          weight: profileToSave.weight,
          gender: profileToSave.gender,
          bmi: profileToSave.bmi,
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error("Error updating profile:", profileError);
        throw profileError;
      }

      console.log("Profile updated successfully");

      // Update health conditions
      try {
        // Delete existing conditions first
        const { error: deleteError } = await supabase
          .from('user_health_conditions')
          .delete()
          .eq('user_id', user.id);
          
        if (deleteError) {
          console.error("Error deleting conditions:", deleteError);
        }

        // Then insert new conditions if any
        if (profileToSave.conditions && profileToSave.conditions.length > 0) {
          const conditionRows = profileToSave.conditions.map(condition => ({
            user_id: user.id,
            condition_name: condition
          }));

          const { error: insertError } = await supabase
            .from('user_health_conditions')
            .insert(conditionRows);

          if (insertError) {
            console.error("Error inserting conditions:", insertError);
          }
        }
        
        console.log("Conditions updated successfully");
      } catch (error) {
        console.error("Error updating health conditions:", error);
      }

      // Update allergies
      try {
        // Delete existing allergies first
        const { error: deleteError } = await supabase
          .from('user_allergies')
          .delete()
          .eq('user_id', user.id);
          
        if (deleteError) {
          console.error("Error deleting allergies:", deleteError);
        }

        // Then insert new allergies if any
        if (profileToSave.allergies && profileToSave.allergies.length > 0) {
          const allergyRows = profileToSave.allergies.map(allergy => ({
            user_id: user.id,
            allergy_name: allergy
          }));

          const { error: insertError } = await supabase
            .from('user_allergies')
            .insert(allergyRows);

          if (insertError) {
            console.error("Error inserting allergies:", insertError);
          }
        }
        
        console.log("Allergies updated successfully");
      } catch (error) {
        console.error("Error updating allergies:", error);
      }

      // Update dietary preferences
      try {
        // Delete existing preferences first
        const { error: deleteError } = await supabase
          .from('user_dietary_preferences')
          .delete()
          .eq('user_id', user.id);
          
        if (deleteError) {
          console.error("Error deleting preferences:", deleteError);
        }

        // Then insert new preferences if any
        if (profileToSave.dietaryPreferences && profileToSave.dietaryPreferences.length > 0) {
          const preferenceRows = profileToSave.dietaryPreferences.map(preference => ({
            user_id: user.id,
            preference_name: preference
          }));

          const { error: insertError } = await supabase
            .from('user_dietary_preferences')
            .insert(preferenceRows);

          if (insertError) {
            console.error("Error inserting preferences:", insertError);
          }
        }
        
        console.log("Dietary preferences updated successfully");
      } catch (error) {
        console.error("Error updating dietary preferences:", error);
      }

      // Update state with the new profile
      setUserProfileState(profileToSave);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      
      toast({
        title: 'Update failed',
        description: 'Could not update your profile information. Please try again.',
        variant: 'destructive',
      });
      
      throw error; // Re-throw to allow handling in the component
    }
  };

  return (
    <UserContext.Provider value={{ 
      userProfile, 
      setUserProfile, 
      isProfileComplete,
      loading
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
