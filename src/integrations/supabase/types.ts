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
      analysis_tax_comparisons: {
        Row: {
          analysis_id: string
          compared_regimes_json: Json
          comparison_table_json: Json
          created_at: string
        }
        Insert: {
          analysis_id: string
          compared_regimes_json?: Json
          comparison_table_json?: Json
          created_at?: string
        }
        Update: {
          analysis_id?: string
          compared_regimes_json?: Json
          comparison_table_json?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_tax_comparisons_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: true
            referencedRelation: "project_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_tax_results: {
        Row: {
          analysis_id: string
          assumptions_json: Json
          created_at: string
          regime: string
          result_json: Json
          warnings_json: Json
        }
        Insert: {
          analysis_id: string
          assumptions_json?: Json
          created_at?: string
          regime: string
          result_json?: Json
          warnings_json?: Json
        }
        Update: {
          analysis_id?: string
          assumptions_json?: Json
          created_at?: string
          regime?: string
          result_json?: Json
          warnings_json?: Json
        }
        Relationships: [
          {
            foreignKeyName: "analysis_tax_results_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "project_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          corporate_tax_rate: number | null
          current_period_end: string | null
          current_period_start: string | null
          created_at: string
          default_ownership_mode: string | null
          default_tax_regime: string | null
          display_name: string | null
          email: string | null
          id: string
          investor_objective: string | null
          plan: string
          reduced_is_eligible: boolean | null
          social_rate: number | null
          stripe_customer_id: string | null
          stripe_status: string | null
          stripe_subscription_id: string | null
          tmi: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          corporate_tax_rate?: number | null
          current_period_end?: string | null
          current_period_start?: string | null
          created_at?: string
          default_ownership_mode?: string | null
          default_tax_regime?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          investor_objective?: string | null
          plan?: string
          reduced_is_eligible?: boolean | null
          social_rate?: number | null
          stripe_customer_id?: string | null
          stripe_status?: string | null
          stripe_subscription_id?: string | null
          tmi?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          corporate_tax_rate?: number | null
          current_period_end?: string | null
          current_period_start?: string | null
          created_at?: string
          default_ownership_mode?: string | null
          default_tax_regime?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          investor_objective?: string | null
          plan?: string
          reduced_is_eligible?: boolean | null
          social_rate?: number | null
          stripe_customer_id?: string | null
          stripe_status?: string | null
          stripe_subscription_id?: string | null
          tmi?: number | null
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
          canonical_input_json: Json | null
          charges_mensuelles: number | null
          code_postal: string | null
          core_calc_version: string | null
          corporate_tax_rate: number | null
          created_at: string
          dpe: string | null
          dividend_distribution_rate: number | null
          dvf_summary: Json | null
          economic_result_json: Json | null
          exploitation_mode: string | null
          id: string
          investor_objective: string | null
          listing_data: Json | null
          loyer_estime: number | null
          mother_daughter_rate: number | null
          occupation_cible: number | null
          ownership_mode: string | null
          patrimonial_result_json: Json | null
          pieces: number | null
          prix: number | null
          project_id: string
          reduced_is_eligible: boolean | null
          social_rate: number | null
          surface: number | null
          taxe_fonciere: number | null
          tax_analysis_json: Json | null
          tax_calc_version: string | null
          tax_comparison_json: Json | null
          tax_regime: string | null
          tax_settings_json: Json | null
          tmi: number | null
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
          canonical_input_json?: Json | null
          charges_mensuelles?: number | null
          code_postal?: string | null
          core_calc_version?: string | null
          corporate_tax_rate?: number | null
          created_at?: string
          dpe?: string | null
          dividend_distribution_rate?: number | null
          dvf_summary?: Json | null
          economic_result_json?: Json | null
          exploitation_mode?: string | null
          id?: string
          investor_objective?: string | null
          listing_data?: Json | null
          loyer_estime?: number | null
          mother_daughter_rate?: number | null
          occupation_cible?: number | null
          ownership_mode?: string | null
          patrimonial_result_json?: Json | null
          pieces?: number | null
          prix?: number | null
          project_id: string
          reduced_is_eligible?: boolean | null
          social_rate?: number | null
          surface?: number | null
          taxe_fonciere?: number | null
          tax_analysis_json?: Json | null
          tax_calc_version?: string | null
          tax_comparison_json?: Json | null
          tax_regime?: string | null
          tax_settings_json?: Json | null
          tmi?: number | null
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
          canonical_input_json?: Json | null
          charges_mensuelles?: number | null
          code_postal?: string | null
          core_calc_version?: string | null
          corporate_tax_rate?: number | null
          created_at?: string
          dpe?: string | null
          dividend_distribution_rate?: number | null
          dvf_summary?: Json | null
          economic_result_json?: Json | null
          exploitation_mode?: string | null
          id?: string
          investor_objective?: string | null
          listing_data?: Json | null
          loyer_estime?: number | null
          mother_daughter_rate?: number | null
          occupation_cible?: number | null
          ownership_mode?: string | null
          patrimonial_result_json?: Json | null
          pieces?: number | null
          prix?: number | null
          project_id?: string
          reduced_is_eligible?: boolean | null
          social_rate?: number | null
          surface?: number | null
          taxe_fonciere?: number | null
          tax_analysis_json?: Json | null
          tax_calc_version?: string | null
          tax_comparison_json?: Json | null
          tax_regime?: string | null
          tax_settings_json?: Json | null
          tmi?: number | null
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
          accounting_fees: number | null
          apport: number | null
          amortization_settings_json: Json | null
          assurance_emprunteur: number | null
          budget_travaux: number | null
          charges_non_recup: number | null
          corporate_tax_rate: number | null
          created_at: string
          croissance_loyers: number | null
          croissance_valeur: number | null
          default_tax_regime: string | null
          dividend_distribution_rate: number | null
          duree_credit: number | null
          exploitation_mode: string | null
          financement: string
          furniture_amount: number | null
          frais_notaire_pct: number | null
          id: string
          inflation_charges: number | null
          investor_objective: string | null
          management_fees: number | null
          mother_daughter_rate: number | null
          name: string
          objectif: string
          ownership_mode: string | null
          property_insurance: number | null
          reduced_is_eligible: boolean | null
          social_rate: number | null
          status: string | null
          strategie: string
          tmi: number | null
          taux_interet: number | null
          updated_at: string
          user_id: string
          vacance_locative: number | null
        }
        Insert: {
          accounting_fees?: number | null
          apport?: number | null
          amortization_settings_json?: Json | null
          assurance_emprunteur?: number | null
          budget_travaux?: number | null
          charges_non_recup?: number | null
          corporate_tax_rate?: number | null
          created_at?: string
          croissance_loyers?: number | null
          croissance_valeur?: number | null
          default_tax_regime?: string | null
          dividend_distribution_rate?: number | null
          duree_credit?: number | null
          exploitation_mode?: string | null
          financement?: string
          furniture_amount?: number | null
          frais_notaire_pct?: number | null
          id?: string
          inflation_charges?: number | null
          investor_objective?: string | null
          management_fees?: number | null
          mother_daughter_rate?: number | null
          name: string
          objectif?: string
          ownership_mode?: string | null
          property_insurance?: number | null
          reduced_is_eligible?: boolean | null
          social_rate?: number | null
          status?: string | null
          strategie?: string
          tmi?: number | null
          taux_interet?: number | null
          updated_at?: string
          user_id: string
          vacance_locative?: number | null
        }
        Update: {
          accounting_fees?: number | null
          apport?: number | null
          amortization_settings_json?: Json | null
          assurance_emprunteur?: number | null
          budget_travaux?: number | null
          charges_non_recup?: number | null
          corporate_tax_rate?: number | null
          created_at?: string
          croissance_loyers?: number | null
          croissance_valeur?: number | null
          default_tax_regime?: string | null
          dividend_distribution_rate?: number | null
          duree_credit?: number | null
          exploitation_mode?: string | null
          financement?: string
          furniture_amount?: number | null
          frais_notaire_pct?: number | null
          id?: string
          inflation_charges?: number | null
          investor_objective?: string | null
          management_fees?: number | null
          mother_daughter_rate?: number | null
          name?: string
          objectif?: string
          ownership_mode?: string | null
          property_insurance?: number | null
          reduced_is_eligible?: boolean | null
          social_rate?: number | null
          status?: string | null
          strategie?: string
          tmi?: number | null
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
