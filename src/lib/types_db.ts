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
      logs: {
        Row: {
          created_at: string
          id: number
          level: string | null
          message: string | null
          metadata: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          level?: string | null
          message?: string | null
          metadata?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          level?: string | null
          message?: string | null
          metadata?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          alpha_tester: boolean
          avatar_url: string | null
          conversion_count: number
          conversion_count_lifetime: number
          email: string | null
          full_name: string | null
          generation_count: number
          generation_count_lifetime: number
          id: string
          is_admin: boolean
          pro_overriden: boolean
          suspended: boolean
          tier: Database["public"]["Enums"]["user_tier"]
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          alpha_tester?: boolean
          avatar_url?: string | null
          conversion_count?: number
          conversion_count_lifetime?: number
          email?: string | null
          full_name?: string | null
          generation_count?: number
          generation_count_lifetime?: number
          id: string
          is_admin?: boolean
          pro_overriden?: boolean
          suspended?: boolean
          tier?: Database["public"]["Enums"]["user_tier"]
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          alpha_tester?: boolean
          avatar_url?: string | null
          conversion_count?: number
          conversion_count_lifetime?: number
          email?: string | null
          full_name?: string | null
          generation_count?: number
          generation_count_lifetime?: number
          id?: string
          is_admin?: boolean
          pro_overriden?: boolean
          suspended?: boolean
          tier?: Database["public"]["Enums"]["user_tier"]
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      stripe_customers: {
        Row: {
          id: string
          latest_address: Json | null
          latest_currency: string | null
          plan_active: boolean
          plan_expires: number | null
          stripe_customer_id: string | null
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          id?: string
          latest_address?: Json | null
          latest_currency?: string | null
          plan_active?: boolean
          plan_expires?: number | null
          stripe_customer_id?: string | null
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          id?: string
          latest_address?: Json | null
          latest_currency?: string | null
          plan_active?: boolean
          plan_expires?: number | null
          stripe_customer_id?: string | null
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      stripe_events: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          processed_at: string
          retry_count: number | null
          status: string | null
          stripe_event_id: string
          type: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          processed_at: string
          retry_count?: number | null
          status?: string | null
          stripe_event_id: string
          type: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          processed_at?: string
          retry_count?: number | null
          status?: string | null
          stripe_event_id?: string
          type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_tier: "NONE" | "PRO"
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
    Enums: {
      user_tier: ["NONE", "PRO"],
    },
  },
} as const
