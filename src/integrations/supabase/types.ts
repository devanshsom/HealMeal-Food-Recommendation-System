export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      meal_allergens: {
        Row: {
          allergen_name: string
          id: string
          meal_id: string
        }
        Insert: {
          allergen_name: string
          id?: string
          meal_id: string
        }
        Update: {
          allergen_name?: string
          id?: string
          meal_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_allergens_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_health_conditions: {
        Row: {
          condition_name: string
          id: string
          meal_id: string
        }
        Insert: {
          condition_name: string
          id?: string
          meal_id: string
        }
        Update: {
          condition_name?: string
          id?: string
          meal_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_health_conditions_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_ingredients: {
        Row: {
          id: string
          ingredient_name: string
          meal_id: string
        }
        Insert: {
          id?: string
          ingredient_name: string
          meal_id: string
        }
        Update: {
          id?: string
          ingredient_name?: string
          meal_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_ingredients_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_log_items: {
        Row: {
          id: string
          log_id: string
          meal_id: string | null
          meal_type: string
          notes: string | null
          time_consumed: string | null
        }
        Insert: {
          id?: string
          log_id: string
          meal_id?: string | null
          meal_type: string
          notes?: string | null
          time_consumed?: string | null
        }
        Update: {
          id?: string
          log_id?: string
          meal_id?: string | null
          meal_type?: string
          notes?: string | null
          time_consumed?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meal_log_items_log_id_fkey"
            columns: ["log_id"]
            isOneToOne: false
            referencedRelation: "meal_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_log_items_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_logs: {
        Row: {
          created_at: string | null
          id: string
          log_date: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          log_date?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          log_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_tags: {
        Row: {
          id: string
          meal_id: string
          tag_name: string
        }
        Insert: {
          id?: string
          meal_id: string
          tag_name: string
        }
        Update: {
          id?: string
          meal_id?: string
          tag_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_tags_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: {
          calories: number | null
          carbs: number | null
          created_at: string | null
          description: string | null
          fats: number | null
          id: string
          image: string | null
          meal_type: string | null
          name: string
          preparation: string | null
          price: number | null
          protein: number | null
        }
        Insert: {
          calories?: number | null
          carbs?: number | null
          created_at?: string | null
          description?: string | null
          fats?: number | null
          id?: string
          image?: string | null
          meal_type?: string | null
          name: string
          preparation?: string | null
          price?: number | null
          protein?: number | null
        }
        Update: {
          calories?: number | null
          carbs?: number | null
          created_at?: string | null
          description?: string | null
          fats?: number | null
          id?: string
          image?: string | null
          meal_type?: string | null
          name?: string
          preparation?: string | null
          price?: number | null
          protein?: number | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          meal_id: string | null
          order_id: string
          price: number
          quantity: number
        }
        Insert: {
          id?: string
          meal_id?: string | null
          order_id: string
          price: number
          quantity: number
        }
        Update: {
          id?: string
          meal_id?: string | null
          order_id?: string
          price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          delivery_address: string | null
          id: string
          order_date: string | null
          payment_method: string | null
          status: string | null
          total_price: number
          user_id: string | null
        }
        Insert: {
          delivery_address?: string | null
          id?: string
          order_date?: string | null
          payment_method?: string | null
          status?: string | null
          total_price: number
          user_id?: string | null
        }
        Update: {
          delivery_address?: string | null
          id?: string
          order_date?: string | null
          payment_method?: string | null
          status?: string | null
          total_price?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          bmi: number | null
          gender: string | null
          height: number | null
          id: string
          name: string | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          age?: number | null
          bmi?: number | null
          gender?: string | null
          height?: number | null
          id: string
          name?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          age?: number | null
          bmi?: number | null
          gender?: string | null
          height?: number | null
          id?: string
          name?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      user_allergies: {
        Row: {
          allergy_name: string
          id: string
          user_id: string
        }
        Insert: {
          allergy_name: string
          id?: string
          user_id: string
        }
        Update: {
          allergy_name?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_allergies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_dietary_preferences: {
        Row: {
          id: string
          preference_name: string
          user_id: string
        }
        Insert: {
          id?: string
          preference_name: string
          user_id: string
        }
        Update: {
          id?: string
          preference_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_dietary_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_health_conditions: {
        Row: {
          condition_name: string
          id: string
          user_id: string
        }
        Insert: {
          condition_name: string
          id?: string
          user_id: string
        }
        Update: {
          condition_name?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_health_conditions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
