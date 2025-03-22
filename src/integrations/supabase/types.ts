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
      anti_corruption_metrics: {
        Row: {
          additional_details: string | null
          convictions_number: number | null
          created_at: string
          id: string
          report_id: string
          sanctions_amount: number | null
          updated_at: string
        }
        Insert: {
          additional_details?: string | null
          convictions_number?: number | null
          created_at?: string
          id?: string
          report_id: string
          sanctions_amount?: number | null
          updated_at?: string
        }
        Update: {
          additional_details?: string | null
          convictions_number?: number | null
          created_at?: string
          id?: string
          report_id?: string
          sanctions_amount?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "anti_corruption_metrics_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      biodiversity_land_use: {
        Row: {
          area_unit: string
          created_at: string
          current_impermeable_surface: number | null
          current_nature_surface_offsite: number | null
          current_nature_surface_onsite: number | null
          current_total_land_use: number | null
          id: string
          previous_impermeable_surface: number | null
          previous_nature_surface_offsite: number | null
          previous_nature_surface_onsite: number | null
          previous_total_land_use: number | null
          report_id: string
          sensitive_sites_details: string | null
          updated_at: string
        }
        Insert: {
          area_unit?: string
          created_at?: string
          current_impermeable_surface?: number | null
          current_nature_surface_offsite?: number | null
          current_nature_surface_onsite?: number | null
          current_total_land_use?: number | null
          id?: string
          previous_impermeable_surface?: number | null
          previous_nature_surface_offsite?: number | null
          previous_nature_surface_onsite?: number | null
          previous_total_land_use?: number | null
          report_id: string
          sensitive_sites_details?: string | null
          updated_at?: string
        }
        Update: {
          area_unit?: string
          created_at?: string
          current_impermeable_surface?: number | null
          current_nature_surface_offsite?: number | null
          current_nature_surface_onsite?: number | null
          current_total_land_use?: number | null
          id?: string
          previous_impermeable_surface?: number | null
          previous_nature_surface_offsite?: number | null
          previous_nature_surface_onsite?: number | null
          previous_total_land_use?: number | null
          report_id?: string
          sensitive_sites_details?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "biodiversity_land_use_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      circular_economy_details: {
        Row: {
          created_at: string
          id: string
          recyclable_content: number | null
          recycled_content: number | null
          report_id: string
          resources_details: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          recyclable_content?: number | null
          recycled_content?: number | null
          report_id: string
          resources_details?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          recyclable_content?: number | null
          recycled_content?: number | null
          report_id?: string
          resources_details?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "circular_economy_details_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          address_city: string | null
          address_number: string | null
          address_postal_code: string | null
          address_province: string | null
          address_street: string | null
          address_street_type: string | null
          ateco_code: string | null
          collective_agreement: string | null
          contact_email: string | null
          contact_phone: string | null
          country: string | null
          created_at: string
          created_by: string | null
          has_multiple_locations: boolean | null
          id: string
          is_part_of_group: boolean | null
          legal_form: string | null
          nace_code: string | null
          name: string
          profile_about: string | null
          profile_mission: string | null
          profile_value_chain: string | null
          profile_value_creation_factors: string | null
          profile_values: string | null
          profile_vision: string | null
          sector: string | null
          updated_at: string
          vat_number: string | null
        }
        Insert: {
          address?: string | null
          address_city?: string | null
          address_number?: string | null
          address_postal_code?: string | null
          address_province?: string | null
          address_street?: string | null
          address_street_type?: string | null
          ateco_code?: string | null
          collective_agreement?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          has_multiple_locations?: boolean | null
          id?: string
          is_part_of_group?: boolean | null
          legal_form?: string | null
          nace_code?: string | null
          name: string
          profile_about?: string | null
          profile_mission?: string | null
          profile_value_chain?: string | null
          profile_value_creation_factors?: string | null
          profile_values?: string | null
          profile_vision?: string | null
          sector?: string | null
          updated_at?: string
          vat_number?: string | null
        }
        Update: {
          address?: string | null
          address_city?: string | null
          address_number?: string | null
          address_postal_code?: string | null
          address_province?: string | null
          address_street?: string | null
          address_street_type?: string | null
          ateco_code?: string | null
          collective_agreement?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          has_multiple_locations?: boolean | null
          id?: string
          is_part_of_group?: boolean | null
          legal_form?: string | null
          nace_code?: string | null
          name?: string
          profile_about?: string | null
          profile_mission?: string | null
          profile_value_chain?: string | null
          profile_value_creation_factors?: string | null
          profile_values?: string | null
          profile_vision?: string | null
          sector?: string | null
          updated_at?: string
          vat_number?: string | null
        }
        Relationships: []
      }
      company_locations: {
        Row: {
          address_city: string | null
          address_number: string | null
          address_postal_code: string | null
          address_province: string | null
          address_street: string | null
          address_street_type: string | null
          company_id: string
          created_at: string
          id: string
          location_type: string | null
        }
        Insert: {
          address_city?: string | null
          address_number?: string | null
          address_postal_code?: string | null
          address_province?: string | null
          address_street?: string | null
          address_street_type?: string | null
          company_id: string
          created_at?: string
          id?: string
          location_type?: string | null
        }
        Update: {
          address_city?: string | null
          address_number?: string | null
          address_postal_code?: string | null
          address_province?: string | null
          address_street?: string | null
          address_street_type?: string | null
          company_id?: string
          created_at?: string
          id?: string
          location_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_locations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_standards: {
        Row: {
          compliance_monitoring: string | null
          compliance_standards: string | null
          created_at: string
          id: string
          report_id: string
          updated_at: string
        }
        Insert: {
          compliance_monitoring?: string | null
          compliance_standards?: string | null
          created_at?: string
          id?: string
          report_id: string
          updated_at?: string
        }
        Update: {
          compliance_monitoring?: string | null
          compliance_standards?: string | null
          created_at?: string
          id?: string
          report_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_standards_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      emission_calculation_records: {
        Row: {
          date: string
          description: string
          details: Json | null
          emissions: number
          id: string
          quantity: number
          report_id: string
          scope: string
          source: string
          unit: string
        }
        Insert: {
          date?: string
          description: string
          details?: Json | null
          emissions: number
          id?: string
          quantity: number
          report_id: string
          scope: string
          source: string
          unit: string
        }
        Update: {
          date?: string
          description?: string
          details?: Json | null
          emissions?: number
          id?: string
          quantity?: number
          report_id?: string
          scope?: string
          source?: string
          unit?: string
        }
        Relationships: []
      }
      emissions_data: {
        Row: {
          created_at: string
          id: string
          report_id: string
          scope1_details: Json | null
          scope1_emissions: number | null
          scope2_details: Json | null
          scope2_emissions: number | null
          scope3_details: Json | null
          scope3_emissions: number | null
          total_emissions: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          report_id: string
          scope1_details?: Json | null
          scope1_emissions?: number | null
          scope2_details?: Json | null
          scope2_emissions?: number | null
          scope3_details?: Json | null
          scope3_emissions?: number | null
          total_emissions?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          report_id?: string
          scope1_details?: Json | null
          scope1_emissions?: number | null
          scope2_details?: Json | null
          scope2_emissions?: number | null
          scope3_details?: Json | null
          scope3_emissions?: number | null
          total_emissions?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "emissions_data_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: true
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      emissions_logs: {
        Row: {
          calculation_logs: Json
          created_at: string
          id: string
          report_id: string
          updated_at: string
        }
        Insert: {
          calculation_logs?: Json
          created_at?: string
          id?: string
          report_id: string
          updated_at?: string
        }
        Update: {
          calculation_logs?: Json
          created_at?: string
          id?: string
          report_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "emissions_logs_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: true
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      group_companies: {
        Row: {
          address_city: string | null
          address_number: string | null
          address_postal_code: string | null
          address_province: string | null
          address_street: string | null
          address_street_type: string | null
          company_id: string
          created_at: string
          id: string
          name: string
          relationship_type: string
        }
        Insert: {
          address_city?: string | null
          address_number?: string | null
          address_postal_code?: string | null
          address_province?: string | null
          address_street?: string | null
          address_street_type?: string | null
          company_id: string
          created_at?: string
          id?: string
          name: string
          relationship_type: string
        }
        Update: {
          address_city?: string | null
          address_number?: string | null
          address_postal_code?: string | null
          address_province?: string | null
          address_street?: string | null
          address_street_type?: string | null
          company_id?: string
          created_at?: string
          id?: string
          name?: string
          relationship_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      location_metrics: {
        Row: {
          created_at: string
          id: string
          location_id: string
          location_name: string
          location_type: string | null
          metrics: Json | null
          report_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          location_id: string
          location_name: string
          location_type?: string | null
          metrics?: Json | null
          report_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          location_id?: string
          location_name?: string
          location_type?: string | null
          metrics?: Json | null
          report_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_metrics_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      materiality_issues: {
        Row: {
          created_at: string
          description: string | null
          financial_relevance: number | null
          id: string
          impact_relevance: number | null
          iro_selections: Json | null
          is_material: boolean | null
          issue_id: string
          name: string
          report_id: string
          stakeholder_relevance: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          financial_relevance?: number | null
          id?: string
          impact_relevance?: number | null
          iro_selections?: Json | null
          is_material?: boolean | null
          issue_id: string
          name: string
          report_id: string
          stakeholder_relevance?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          financial_relevance?: number | null
          id?: string
          impact_relevance?: number | null
          iro_selections?: Json | null
          is_material?: boolean | null
          issue_id?: string
          name?: string
          report_id?: string
          stakeholder_relevance?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "materiality_issues_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      municipalities: {
        Row: {
          id: number
          name: string
          postal_codes: string[]
          province_code: string
        }
        Insert: {
          id?: number
          name: string
          postal_codes: string[]
          province_code: string
        }
        Update: {
          id?: number
          name?: string
          postal_codes?: string[]
          province_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "municipalities_duplicate_province_code_fkey"
            columns: ["province_code"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["code"]
          },
        ]
      }
      municipalities_OLD: {
        Row: {
          id: number
          name: string
          postal_codes: string[]
          province_code: string
        }
        Insert: {
          id?: number
          name: string
          postal_codes: string[]
          province_code: string
        }
        Update: {
          id?: number
          name?: string
          postal_codes?: string[]
          province_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "municipalities_province_code_fkey"
            columns: ["province_code"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["code"]
          },
        ]
      }
      narrative_governance: {
        Row: {
          created_at: string
          id: string
          report_id: string
          sustainability_governance: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          report_id: string
          sustainability_governance?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          report_id?: string
          sustainability_governance?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "narrative_governance_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      narrative_issues_management: {
        Row: {
          actions_description: string | null
          anti_corruption_measures: string | null
          created_at: string
          energy_efficiency_actions: string | null
          id: string
          policies_actions: string | null
          policies_description: string | null
          report_id: string
          stakeholders_impacts: string | null
          updated_at: string
        }
        Insert: {
          actions_description?: string | null
          anti_corruption_measures?: string | null
          created_at?: string
          energy_efficiency_actions?: string | null
          id?: string
          policies_actions?: string | null
          policies_description?: string | null
          report_id: string
          stakeholders_impacts?: string | null
          updated_at?: string
        }
        Update: {
          actions_description?: string | null
          anti_corruption_measures?: string | null
          created_at?: string
          energy_efficiency_actions?: string | null
          id?: string
          policies_actions?: string | null
          policies_description?: string | null
          report_id?: string
          stakeholders_impacts?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "narrative_issues_management_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      narrative_material_issues: {
        Row: {
          created_at: string
          id: string
          material_issues_description: string | null
          report_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          material_issues_description?: string | null
          report_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          material_issues_description?: string | null
          report_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "narrative_material_issues_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      narrative_stakeholders: {
        Row: {
          created_at: string
          engagement_frequency: string | null
          engagement_methods: string | null
          engagement_outcomes: string | null
          id: string
          report_id: string
          stakeholder_categories: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          engagement_frequency?: string | null
          engagement_methods?: string | null
          engagement_outcomes?: string | null
          id?: string
          report_id: string
          stakeholder_categories?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          engagement_frequency?: string | null
          engagement_methods?: string | null
          engagement_outcomes?: string | null
          id?: string
          report_id?: string
          stakeholder_categories?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "narrative_stakeholders_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      narrative_strategy: {
        Row: {
          business_relations: string | null
          created_at: string
          id: string
          markets: string | null
          products_services: string | null
          report_id: string
          sustainability_strategy: string | null
          updated_at: string
        }
        Insert: {
          business_relations?: string | null
          created_at?: string
          id?: string
          markets?: string | null
          products_services?: string | null
          report_id: string
          sustainability_strategy?: string | null
          updated_at?: string
        }
        Update: {
          business_relations?: string | null
          created_at?: string
          id?: string
          markets?: string | null
          products_services?: string | null
          report_id?: string
          sustainability_strategy?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "narrative_strategy_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      pollutant_types: {
        Row: {
          created_at: string
          description: string
          id: number
          name: string
          release_medium_ids: number[]
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          name: string
          release_medium_ids: number[]
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          name?: string
          release_medium_ids?: number[]
        }
        Relationships: []
      }
      pollution_management_details: {
        Row: {
          created_at: string
          details: string | null
          id: string
          report_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          id?: string
          report_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: string
          report_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pollution_management_details_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      pollution_records: {
        Row: {
          created_at: string
          details: string | null
          id: string
          pollutant_type_id: number
          quantity: number
          release_medium_id: number
          report_id: string
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          id?: string
          pollutant_type_id: number
          quantity: number
          release_medium_id: number
          report_id: string
          unit?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: string
          pollutant_type_id?: number
          quantity?: number
          release_medium_id?: number
          report_id?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pollution_records_pollutant_type_id_fkey"
            columns: ["pollutant_type_id"]
            isOneToOne: false
            referencedRelation: "pollutant_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pollution_records_release_medium_id_fkey"
            columns: ["release_medium_id"]
            isOneToOne: false
            referencedRelation: "pollution_release_mediums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pollution_records_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      pollution_records_backup: {
        Row: {
          created_at: string | null
          details: string | null
          id: string | null
          pollutant_type_id: number | null
          quantity: number | null
          release_medium_id: number | null
          report_id: string | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          details?: string | null
          id?: string | null
          pollutant_type_id?: number | null
          quantity?: number | null
          release_medium_id?: number | null
          report_id?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          details?: string | null
          id?: string | null
          pollutant_type_id?: number | null
          quantity?: number | null
          release_medium_id?: number | null
          report_id?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pollution_release_mediums: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          id: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      provinces: {
        Row: {
          code: string
          name: string
        }
        Insert: {
          code: string
          name: string
        }
        Update: {
          code?: string
          name?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          company_id: string
          conduct_metrics: Json | null
          created_at: string
          environmental_metrics: Json | null
          id: string
          is_consolidated: boolean | null
          materiality_analysis: Json | null
          narrative_pat_metrics: Json | null
          report_type: string
          report_year: string
          social_metrics: Json | null
          status: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          conduct_metrics?: Json | null
          created_at?: string
          environmental_metrics?: Json | null
          id?: string
          is_consolidated?: boolean | null
          materiality_analysis?: Json | null
          narrative_pat_metrics?: Json | null
          report_type: string
          report_year: string
          social_metrics?: Json | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          conduct_metrics?: Json | null
          created_at?: string
          environmental_metrics?: Json | null
          id?: string
          is_consolidated?: boolean | null
          materiality_analysis?: Json | null
          narrative_pat_metrics?: Json | null
          report_type?: string
          report_year?: string
          social_metrics?: Json | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      stakeholders: {
        Row: {
          category: string | null
          contact_info: string | null
          created_at: string
          email: string | null
          id: string
          influence: number | null
          interest: number | null
          name: string
          notes: string | null
          priority: string | null
          report_id: string
          stakeholder_id: string
          survey_response: Json | null
          survey_status: string | null
          survey_token: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          contact_info?: string | null
          created_at?: string
          email?: string | null
          id?: string
          influence?: number | null
          interest?: number | null
          name: string
          notes?: string | null
          priority?: string | null
          report_id: string
          stakeholder_id: string
          survey_response?: Json | null
          survey_status?: string | null
          survey_token?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          contact_info?: string | null
          created_at?: string
          email?: string | null
          id?: string
          influence?: number | null
          interest?: number | null
          name?: string
          notes?: string | null
          priority?: string | null
          report_id?: string
          stakeholder_id?: string
          survey_response?: Json | null
          survey_status?: string | null
          survey_token?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stakeholders_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      subsidiaries: {
        Row: {
          created_at: string
          id: string
          location: string
          name: string
          report_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          location: string
          name: string
          report_id: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string
          name?: string
          report_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subsidiaries_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      supply_chain_metrics: {
        Row: {
          created_at: string
          id: string
          identified_impacts: string | null
          impact_process_description: string | null
          report_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          identified_impacts?: string | null
          impact_process_description?: string | null
          report_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          identified_impacts?: string | null
          impact_process_description?: string | null
          report_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "supply_chain_metrics_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      waste_management: {
        Row: {
          created_at: string
          disposal_waste: number | null
          id: string
          recycled_waste: number | null
          report_id: string
          total_waste: number | null
          updated_at: string
          waste_description: string
          waste_type: string
        }
        Insert: {
          created_at?: string
          disposal_waste?: number | null
          id?: string
          recycled_waste?: number | null
          report_id: string
          total_waste?: number | null
          updated_at?: string
          waste_description: string
          waste_type: string
        }
        Update: {
          created_at?: string
          disposal_waste?: number | null
          id?: string
          recycled_waste?: number | null
          report_id?: string
          total_waste?: number | null
          updated_at?: string
          waste_description?: string
          waste_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "waste_management_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      water_metrics: {
        Row: {
          area_unit: string
          created_at: string
          current_water_consumption: number | null
          current_water_stress_areas: number | null
          current_water_withdrawal: number | null
          id: string
          previous_water_consumption: number | null
          previous_water_stress_areas: number | null
          previous_water_withdrawal: number | null
          report_id: string
          updated_at: string
          water_details: string | null
        }
        Insert: {
          area_unit?: string
          created_at?: string
          current_water_consumption?: number | null
          current_water_stress_areas?: number | null
          current_water_withdrawal?: number | null
          id?: string
          previous_water_consumption?: number | null
          previous_water_stress_areas?: number | null
          previous_water_withdrawal?: number | null
          report_id: string
          updated_at?: string
          water_details?: string | null
        }
        Update: {
          area_unit?: string
          created_at?: string
          current_water_consumption?: number | null
          current_water_stress_areas?: number | null
          current_water_withdrawal?: number | null
          id?: string
          previous_water_consumption?: number | null
          previous_water_stress_areas?: number | null
          previous_water_withdrawal?: number | null
          report_id?: string
          updated_at?: string
          water_details?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "water_metrics_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      workforce_compensation: {
        Row: {
          avg_training_hours_female: number | null
          avg_training_hours_male: number | null
          collective_bargaining_coverage: number | null
          created_at: string
          entry_wage: number | null
          entry_wage_to_minimum_wage_ratio: number | null
          gender_pay_gap: number | null
          id: string
          local_minimum_wage: number | null
          report_id: string
          updated_at: string
        }
        Insert: {
          avg_training_hours_female?: number | null
          avg_training_hours_male?: number | null
          collective_bargaining_coverage?: number | null
          created_at?: string
          entry_wage?: number | null
          entry_wage_to_minimum_wage_ratio?: number | null
          gender_pay_gap?: number | null
          id?: string
          local_minimum_wage?: number | null
          report_id: string
          updated_at?: string
        }
        Update: {
          avg_training_hours_female?: number | null
          avg_training_hours_male?: number | null
          collective_bargaining_coverage?: number | null
          created_at?: string
          entry_wage?: number | null
          entry_wage_to_minimum_wage_ratio?: number | null
          gender_pay_gap?: number | null
          id?: string
          local_minimum_wage?: number | null
          report_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workforce_compensation_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      workforce_distribution: {
        Row: {
          company_or_location_name: string | null
          created_at: string
          distribution_notes: string | null
          employee_count: number | null
          female_employees: number | null
          id: string
          male_employees: number | null
          other_gender_employees: number | null
          permanent_employees: number | null
          report_id: string
          temporary_employees: number | null
          total_employees: number | null
          total_employees_fte: number | null
          updated_at: string
        }
        Insert: {
          company_or_location_name?: string | null
          created_at?: string
          distribution_notes?: string | null
          employee_count?: number | null
          female_employees?: number | null
          id?: string
          male_employees?: number | null
          other_gender_employees?: number | null
          permanent_employees?: number | null
          report_id: string
          temporary_employees?: number | null
          total_employees?: number | null
          total_employees_fte?: number | null
          updated_at?: string
        }
        Update: {
          company_or_location_name?: string | null
          created_at?: string
          distribution_notes?: string | null
          employee_count?: number | null
          female_employees?: number | null
          id?: string
          male_employees?: number | null
          other_gender_employees?: number | null
          permanent_employees?: number | null
          report_id?: string
          temporary_employees?: number | null
          total_employees?: number | null
          total_employees_fte?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workforce_distribution_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      workforce_safety: {
        Row: {
          created_at: string
          id: string
          report_id: string
          total_hours_worked: number | null
          updated_at: string
          work_accident_deaths: number | null
          work_accidents_number: number | null
          work_accidents_rate: number | null
          work_disease_deaths: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          report_id: string
          total_hours_worked?: number | null
          updated_at?: string
          work_accident_deaths?: number | null
          work_accidents_number?: number | null
          work_accidents_rate?: number | null
          work_disease_deaths?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          report_id?: string
          total_hours_worked?: number | null
          updated_at?: string
          work_accident_deaths?: number | null
          work_accidents_number?: number | null
          work_accidents_rate?: number | null
          work_disease_deaths?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "workforce_safety_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
