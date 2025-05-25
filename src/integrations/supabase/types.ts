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
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      affiliate_clicks: {
        Row: {
          category: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          provider_id: string
          provider_name: string
          referrer: string | null
          timestamp: string | null
          url: string
          user_agent: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          provider_id: string
          provider_name: string
          referrer?: string | null
          timestamp?: string | null
          url: string
          user_agent?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          provider_id?: string
          provider_name?: string
          referrer?: string | null
          timestamp?: string | null
          url?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      data_sources: {
        Row: {
          api_endpoint: string | null
          category: string
          created_at: string | null
          id: string
          is_active: boolean | null
          last_successful_fetch: string | null
          provider_name: string
          reliability_score: number | null
          source_type: string
          source_url: string | null
          updated_at: string | null
        }
        Insert: {
          api_endpoint?: string | null
          category: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_successful_fetch?: string | null
          provider_name: string
          reliability_score?: number | null
          source_type: string
          source_url?: string | null
          updated_at?: string | null
        }
        Update: {
          api_endpoint?: string | null
          category?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_successful_fetch?: string | null
          provider_name?: string
          reliability_score?: number | null
          source_type?: string
          source_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      provider_configs: {
        Row: {
          api_config: Json | null
          category: string
          consecutive_failures: number | null
          created_at: string | null
          id: string
          is_enabled: boolean | null
          last_successful_scrape: string | null
          provider_name: string
          scrape_frequency: string | null
          scrape_method: string | null
          scrape_url: string
          selectors: Json | null
          updated_at: string | null
        }
        Insert: {
          api_config?: Json | null
          category: string
          consecutive_failures?: number | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          last_successful_scrape?: string | null
          provider_name: string
          scrape_frequency?: string | null
          scrape_method?: string | null
          scrape_url: string
          selectors?: Json | null
          updated_at?: string | null
        }
        Update: {
          api_config?: Json | null
          category?: string
          consecutive_failures?: number | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          last_successful_scrape?: string | null
          provider_name?: string
          scrape_frequency?: string | null
          scrape_method?: string | null
          scrape_url?: string
          selectors?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      provider_offers: {
        Row: {
          category: string
          contract_length: string | null
          created_at: string | null
          data_allowance: string | null
          direct_link: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          monthly_price: number
          offer_url: string
          plan_name: string
          provider_name: string
          scraped_at: string | null
          source_url: string
          speed: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          contract_length?: string | null
          created_at?: string | null
          data_allowance?: string | null
          direct_link?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          monthly_price: number
          offer_url: string
          plan_name: string
          provider_name: string
          scraped_at?: string | null
          source_url: string
          speed?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          contract_length?: string | null
          created_at?: string | null
          data_allowance?: string | null
          direct_link?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          monthly_price?: number
          offer_url?: string
          plan_name?: string
          provider_name?: string
          scraped_at?: string | null
          source_url?: string
          speed?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      scraping_jobs: {
        Row: {
          category: string
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          offers_found: number
          provider_name: string
          started_at: string
          status: string
          updated_at: string
        }
        Insert: {
          category: string
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          offers_found?: number
          provider_name: string
          started_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          category?: string
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          offers_found?: number
          provider_name?: string
          started_at?: string
          status?: string
          updated_at?: string
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
