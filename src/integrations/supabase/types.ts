export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_date: string
          contact_phone: string | null
          created_at: string
          id: string
          package_id: string
          participants: number
          payment_id: string | null
          special_requests: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_date: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          package_id: string
          participants?: number
          payment_id?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_date?: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          package_id?: string
          participants?: number
          payment_id?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "travel_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      community_posts: {
        Row: {
          comments_count: number | null
          content: string
          created_at: string
          id: string
          images: Json | null
          is_featured: boolean | null
          latitude: number | null
          likes_count: number | null
          location: string | null
          longitude: number | null
          tags: Json | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          comments_count?: number | null
          content: string
          created_at?: string
          id?: string
          images?: Json | null
          is_featured?: boolean | null
          latitude?: number | null
          likes_count?: number | null
          location?: string | null
          longitude?: number | null
          tags?: Json | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          comments_count?: number | null
          content?: string
          created_at?: string
          id?: string
          images?: Json | null
          is_featured?: boolean | null
          latitude?: number | null
          likes_count?: number | null
          location?: string | null
          longitude?: number | null
          tags?: Json | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      heritage_badges: {
        Row: {
          badge_level: Database["public"]["Enums"]["badge_level"]
          earned_at: string
          id: string
          quiz_score: number
          site_id: string
          user_id: string
        }
        Insert: {
          badge_level: Database["public"]["Enums"]["badge_level"]
          earned_at?: string
          id?: string
          quiz_score: number
          site_id: string
          user_id: string
        }
        Update: {
          badge_level?: Database["public"]["Enums"]["badge_level"]
          earned_at?: string
          id?: string
          quiz_score?: number
          site_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "heritage_badges_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "heritage_sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "heritage_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      heritage_sites: {
        Row: {
          audio_story_url: string | null
          best_time_to_visit: string | null
          category: Database["public"]["Enums"]["package_category"] | null
          created_at: string
          description: string | null
          entry_fee: number | null
          historical_significance: string | null
          id: string
          images: Json | null
          languages: Json | null
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          opening_hours: Json | null
          updated_at: string
          virtual_tour_url: string | null
        }
        Insert: {
          audio_story_url?: string | null
          best_time_to_visit?: string | null
          category?: Database["public"]["Enums"]["package_category"] | null
          created_at?: string
          description?: string | null
          entry_fee?: number | null
          historical_significance?: string | null
          id?: string
          images?: Json | null
          languages?: Json | null
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          opening_hours?: Json | null
          updated_at?: string
          virtual_tour_url?: string | null
        }
        Update: {
          audio_story_url?: string | null
          best_time_to_visit?: string | null
          category?: Database["public"]["Enums"]["package_category"] | null
          created_at?: string
          description?: string | null
          entry_fee?: number | null
          historical_significance?: string | null
          id?: string
          images?: Json | null
          languages?: Json | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          opening_hours?: Json | null
          updated_at?: string
          virtual_tour_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          location: string | null
          phone: string | null
          preferences: Json | null
          updated_at: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"] | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          location?: string | null
          phone?: string | null
          preferences?: Json | null
          updated_at?: string
          user_id: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          location?: string | null
          phone?: string | null
          preferences?: Json | null
          updated_at?: string
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          content: string | null
          created_at: string
          helpful_count: number | null
          id: string
          images: Json | null
          is_verified: boolean | null
          package_id: string | null
          rating: number
          site_id: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          helpful_count?: number | null
          id?: string
          images?: Json | null
          is_verified?: boolean | null
          package_id?: string | null
          rating: number
          site_id?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          helpful_count?: number | null
          id?: string
          images?: Json | null
          is_verified?: boolean | null
          package_id?: string | null
          rating?: number
          site_id?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "travel_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "heritage_sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      travel_packages: {
        Row: {
          agency_id: string | null
          category: Database["public"]["Enums"]["package_category"] | null
          created_at: string
          description: string | null
          difficulty_level: string | null
          duration_days: number
          excludes: Json | null
          heritage_sites: Json | null
          id: string
          images: Json | null
          includes: Json | null
          is_active: boolean | null
          itinerary: Json | null
          max_participants: number | null
          price: number
          rating: number | null
          review_count: number | null
          title: string
          updated_at: string
        }
        Insert: {
          agency_id?: string | null
          category?: Database["public"]["Enums"]["package_category"] | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_days: number
          excludes?: Json | null
          heritage_sites?: Json | null
          id?: string
          images?: Json | null
          includes?: Json | null
          is_active?: boolean | null
          itinerary?: Json | null
          max_participants?: number | null
          price: number
          rating?: number | null
          review_count?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          agency_id?: string | null
          category?: Database["public"]["Enums"]["package_category"] | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_days?: number
          excludes?: Json | null
          heritage_sites?: Json | null
          id?: string
          images?: Json | null
          includes?: Json | null
          is_active?: boolean | null
          itinerary?: Json | null
          max_participants?: number | null
          price?: number
          rating?: number | null
          review_count?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "travel_packages_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
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
      badge_level: "bronze" | "silver" | "gold"
      booking_status: "pending" | "confirmed" | "completed" | "cancelled"
      package_category:
        | "culture"
        | "adventure"
        | "nature"
        | "pilgrimage"
        | "heritage"
      user_type: "tourist" | "local_guide" | "agency" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      badge_level: ["bronze", "silver", "gold"],
      booking_status: ["pending", "confirmed", "completed", "cancelled"],
      package_category: [
        "culture",
        "adventure",
        "nature",
        "pilgrimage",
        "heritage",
      ],
      user_type: ["tourist", "local_guide", "agency", "admin"],
    },
  },
} as const
