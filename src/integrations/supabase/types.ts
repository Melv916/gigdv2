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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      dvf_transactions: {
        Row: {
          adresse_nom_voie: string | null
          adresse_numero: string | null
          code_commune: string | null
          code_departement: string | null
          code_postal: string | null
          date_mutation: string | null
          id: number
          id_mutation: string | null
          id_parcelle: string | null
          latitude: number | null
          longitude: number | null
          nature_mutation: string | null
          nom_commune: string | null
          nombre_pieces_principales: number | null
          surface_reelle_bati: number | null
          surface_terrain: number | null
          type_local: string | null
          valeur_fonciere: number | null
        }
        Insert: {
          adresse_nom_voie?: string | null
          adresse_numero?: string | null
          code_commune?: string | null
          code_departement?: string | null
          code_postal?: string | null
          date_mutation?: string | null
          id?: number
          id_mutation?: string | null
          id_parcelle?: string | null
          latitude?: number | null
          longitude?: number | null
          nature_mutation?: string | null
          nom_commune?: string | null
          nombre_pieces_principales?: number | null
          surface_reelle_bati?: number | null
          surface_terrain?: number | null
          type_local?: string | null
          valeur_fonciere?: number | null
        }
        Update: {
          adresse_nom_voie?: string | null
          adresse_numero?: string | null
          code_commune?: string | null
          code_departement?: string | null
          code_postal?: string | null
          date_mutation?: string | null
          id?: number
          id_mutation?: string | null
          id_parcelle?: string | null
          latitude?: number | null
          longitude?: number | null
          nature_mutation?: string | null
          nom_commune?: string | null
          nombre_pieces_principales?: number | null
          surface_reelle_bati?: number | null
          surface_terrain?: number | null
          type_local?: string | null
          valeur_fonciere?: number | null
        }
        Relationships: []
      }
      ai_cache: {
        Row: {
          ai_text: string
          cache_key: string
          canonical_url: string
          cost: number | null
          created_at: string
          inputs_json: Json
          mode: string
          tokens: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ai_text: string
          cache_key: string
          canonical_url: string
          cost?: number | null
          created_at?: string
          inputs_json?: Json
          mode: string
          tokens?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ai_text?: string
          cache_key?: string
          canonical_url?: string
          cost?: number | null
          created_at?: string
          inputs_json?: Json
          mode?: string
          tokens?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      analyses: {
        Row: {
          analysis_text: string | null
          cache_hit: boolean
          canonical_url: string
          created_at: string
          dvf_json: Json | null
          ia_mode: string
          id: string
          inputs_json: Json
          listing_json: Json | null
          strategy: string
          url: string
          user_id: string
        }
        Insert: {
          analysis_text?: string | null
          cache_hit?: boolean
          canonical_url: string
          created_at?: string
          dvf_json?: Json | null
          ia_mode: string
          id?: string
          inputs_json?: Json
          listing_json?: Json | null
          strategy: string
          url: string
          user_id: string
        }
        Update: {
          analysis_text?: string | null
          cache_hit?: boolean
          canonical_url?: string
          created_at?: string
          dvf_json?: Json | null
          ia_mode?: string
          id?: string
          inputs_json?: Json
          listing_json?: Json | null
          strategy?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          current_period_end: string | null
          current_period_start: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          plan: string
          stripe_customer_id: string | null
          stripe_status: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          current_period_end?: string | null
          current_period_start?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          plan?: string
          stripe_customer_id?: string | null
          stripe_status?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          current_period_end?: string | null
          current_period_start?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          plan?: string
          stripe_customer_id?: string | null
          stripe_status?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_analyses: {
        Row: {
          adr: number | null
          analysis_result: Json | null
          autres_couts: number | null
          charges_mensuelles: number | null
          code_postal: string | null
          created_at: string
          dpe: string | null
          dvf_summary: Json | null
          id: string
          listing_data: Json | null
          loyer_estime: number | null
          occupation_cible: number | null
          pieces: number | null
          prix: number | null
          project_id: string
          surface: number | null
          taxe_fonciere: number | null
          travaux_estimes: number | null
          type_local: string | null
          url: string | null
          user_id: string
          ville: string | null
        }
        Insert: {
          adr?: number | null
          analysis_result?: Json | null
          autres_couts?: number | null
          charges_mensuelles?: number | null
          code_postal?: string | null
          created_at?: string
          dpe?: string | null
          dvf_summary?: Json | null
          id?: string
          listing_data?: Json | null
          loyer_estime?: number | null
          occupation_cible?: number | null
          pieces?: number | null
          prix?: number | null
          project_id: string
          surface?: number | null
          taxe_fonciere?: number | null
          travaux_estimes?: number | null
          type_local?: string | null
          url?: string | null
          user_id: string
          ville?: string | null
        }
        Update: {
          adr?: number | null
          analysis_result?: Json | null
          autres_couts?: number | null
          charges_mensuelles?: number | null
          code_postal?: string | null
          created_at?: string
          dpe?: string | null
          dvf_summary?: Json | null
          id?: string
          listing_data?: Json | null
          loyer_estime?: number | null
          occupation_cible?: number | null
          pieces?: number | null
          prix?: number | null
          project_id?: string
          surface?: number | null
          taxe_fonciere?: number | null
          travaux_estimes?: number | null
          type_local?: string | null
          url?: string | null
          user_id?: string
          ville?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_analyses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          apport: number | null
          assurance_emprunteur: number | null
          budget_travaux: number | null
          charges_non_recup: number | null
          created_at: string
          croissance_loyers: number | null
          croissance_valeur: number | null
          duree_credit: number | null
          financement: string
          frais_notaire_pct: number | null
          id: string
          inflation_charges: number | null
          name: string
          objectif: string
          status: string | null
          strategie: string
          taux_interet: number | null
          updated_at: string
          user_id: string
          vacance_locative: number | null
        }
        Insert: {
          apport?: number | null
          assurance_emprunteur?: number | null
          budget_travaux?: number | null
          charges_non_recup?: number | null
          created_at?: string
          croissance_loyers?: number | null
          croissance_valeur?: number | null
          duree_credit?: number | null
          financement?: string
          frais_notaire_pct?: number | null
          id?: string
          inflation_charges?: number | null
          name: string
          objectif?: string
          status?: string | null
          strategie?: string
          taux_interet?: number | null
          updated_at?: string
          user_id: string
          vacance_locative?: number | null
        }
        Update: {
          apport?: number | null
          assurance_emprunteur?: number | null
          budget_travaux?: number | null
          charges_non_recup?: number | null
          created_at?: string
          croissance_loyers?: number | null
          croissance_valeur?: number | null
          duree_credit?: number | null
          financement?: string
          frais_notaire_pct?: number | null
          id?: string
          inflation_charges?: number | null
          name?: string
          objectif?: string
          status?: string | null
          strategie?: string
          taux_interet?: number | null
          updated_at?: string
          user_id?: string
          vacance_locative?: number | null
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          billing_cycle: string
          created_at: string
          id: string
          plan_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_cycle?: string
          created_at?: string
          id?: string
          plan_id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_cycle?: string
          created_at?: string
          id?: string
          plan_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      usage_tracking: {
        Row: {
          analyses_count: number
          created_at: string
          id: string
          period_key: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analyses_count?: number
          created_at?: string
          id?: string
          period_key: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analyses_count?: number
          created_at?: string
          id?: string
          period_key?: string
          updated_at?: string
          user_id?: string
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
    Enums: {},
  },
} as const
