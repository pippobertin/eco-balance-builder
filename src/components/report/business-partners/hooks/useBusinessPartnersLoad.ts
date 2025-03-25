
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BusinessPartnersFormData } from './types';
import { toast } from 'sonner';

export const useBusinessPartnersLoad = (reportId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<BusinessPartnersFormData>({
    bp1: {}, bp2: {}, bp3: {}, bp4: {}, bp5: {},
    bp6: {}, bp7: {}, bp8: {}, bp9: {}, bp10: {}, bp11: {}
  });

  const loadData = useCallback(async () => {
    if (!reportId) {
      console.error("Cannot load data without a reportId");
      return;
    }
    
    console.log("Loading business partners data for reportId:", reportId);
    setIsLoading(true);
    
    try {
      // Load BP1 data
      const { data: bp1Data, error: bp1Error } = await supabase
        .from('bp1_revenue_sectors')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();
        
      if (bp1Error && bp1Error.code !== 'PGRST116') {
        console.error("Error loading BP1 data:", bp1Error);
        toast.error("Errore nel caricamento dei dati dei settori di ricavo");
      }
      
      // Load BP2 data
      const { data: bp2Data, error: bp2Error } = await supabase
        .from('bp2_gender_diversity')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();
        
      if (bp2Error && bp2Error.code !== 'PGRST116') {
        console.error("Error loading BP2 data:", bp2Error);
      }
      
      // Load BP3 data
      const { data: bp3Data, error: bp3Error } = await supabase
        .from('bp3_ghg_targets')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();
        
      if (bp3Error && bp3Error.code !== 'PGRST116') {
        console.error("Error loading BP3 data:", bp3Error);
      }
      
      // Load BP4 data
      const { data: bp4Data, error: bp4Error } = await supabase
        .from('bp4_transition_plan')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();
        
      if (bp4Error && bp4Error.code !== 'PGRST116') {
        console.error("Error loading BP4 data:", bp4Error);
      }
      
      // Load BP5 data
      const { data: bp5Data, error: bp5Error } = await supabase
        .from('bp5_physical_risks')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();
        
      if (bp5Error && bp5Error.code !== 'PGRST116') {
        console.error("Error loading BP5 data:", bp5Error);
      }
      
      // Load BP6 data
      const { data: bp6Data, error: bp6Error } = await supabase
        .from('bp6_hazardous_waste')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();
        
      if (bp6Error && bp6Error.code !== 'PGRST116') {
        console.error("Error loading BP6 data:", bp6Error);
      }
      
      // Load BP7 data
      const { data: bp7Data, error: bp7Error } = await supabase
        .from('bp7_policy_alignment')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();
        
      if (bp7Error && bp7Error.code !== 'PGRST116') {
        console.error("Error loading BP7 data:", bp7Error);
      }
      
      // Load BP8 data
      const { data: bp8Data, error: bp8Error } = await supabase
        .from('bp8_compliance_processes')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();
        
      if (bp8Error && bp8Error.code !== 'PGRST116') {
        console.error("Error loading BP8 data:", bp8Error);
      }
      
      // Load BP9 data
      const { data: bp9Data, error: bp9Error } = await supabase
        .from('bp9_violations')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();
        
      if (bp9Error && bp9Error.code !== 'PGRST116') {
        console.error("Error loading BP9 data:", bp9Error);
      }
      
      // Load BP10 data
      const { data: bp10Data, error: bp10Error } = await supabase
        .from('bp10_work_life_balance')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();
        
      if (bp10Error && bp10Error.code !== 'PGRST116') {
        console.error("Error loading BP10 data:", bp10Error);
      }
      
      // Load BP11 data
      const { data: bp11Data, error: bp11Error } = await supabase
        .from('bp11_apprentices')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();
        
      if (bp11Error && bp11Error.code !== 'PGRST116') {
        console.error("Error loading BP11 data:", bp11Error);
      }
      
      // Update form data with loaded data
      setFormData({
        bp1: bp1Data ? {
          controversialWeapons: bp1Data.controversial_weapons,
          tobacco: bp1Data.tobacco,
          fossilFuels: bp1Data.fossil_fuels,
          chemicals: bp1Data.chemicals,
          controversialWeaponsRevenue: bp1Data.controversial_weapons_revenue,
          tobaccoRevenue: bp1Data.tobacco_revenue,
          coalRevenue: bp1Data.coal_revenue,
          oilRevenue: bp1Data.oil_revenue,
          gasRevenue: bp1Data.gas_revenue,
          chemicalsRevenue: bp1Data.chemicals_revenue
        } : {},
        
        bp2: bp2Data ? {
          maleGovernanceMembers: bp2Data.male_governance_members,
          femaleGovernanceMembers: bp2Data.female_governance_members,
          otherGenderGovernanceMembers: bp2Data.other_gender_governance_members,
          genderDiversityIndex: bp2Data.gender_diversity_index
        } : {},
        
        bp3: bp3Data ? {
          hasGhgReductionTargets: bp3Data.has_ghg_reduction_targets,
          ghgReductionTargetScope1: bp3Data.ghg_reduction_target_scope1,
          ghgReductionTargetScope2: bp3Data.ghg_reduction_target_scope2,
          ghgReductionTargetScope3: bp3Data.ghg_reduction_target_scope3,
          ghgReductionTargetYear: bp3Data.ghg_reduction_target_year,
          ghgReductionBaselineYear: bp3Data.ghg_reduction_baseline_year
        } : {},
        
        bp4: bp4Data ? {
          hasTransitionPlan: bp4Data.has_transition_plan,
          transitionPlanDetails: bp4Data.transition_plan_details
        } : {},
        
        bp5: bp5Data ? {
          hasPhysicalClimateRisks: bp5Data.has_physical_climate_risks,
          assetsAtRiskAmount: bp5Data.assets_at_risk_amount,
          assetsAtRiskPercentage: bp5Data.assets_at_risk_percentage,
          adaptationCoverage: bp5Data.adaptation_coverage,
          revenueAtRiskPercentage: bp5Data.revenue_at_risk_percentage,
          riskAssetsLocation: bp5Data.risk_assets_location,
          realEstateEnergyEfficiency: bp5Data.real_estate_energy_efficiency // Now correctly handled as string
        } : {},
        
        bp6: bp6Data ? {
          hasHazardousWaste: bp6Data.has_hazardous_waste,
          hazardousWasteTotal: bp6Data.hazardous_waste_total,
          radioactiveWasteTotal: bp6Data.radioactive_waste_total
        } : {},
        
        bp7: bp7Data ? {
          hasPoliciesAligned: bp7Data.has_policies_aligned,
          alignedInstruments: bp7Data.aligned_instruments
        } : {},
        
        bp8: bp8Data ? {
          hasComplianceProcesses: bp8Data.has_compliance_processes,
          complianceProcessesDetails: bp8Data.compliance_processes_details
        } : {},
        
        bp9: bp9Data ? {
          hasViolations: bp9Data.has_violations,
          violationsDetails: bp9Data.violations_details
        } : {},
        
        bp10: bp10Data ? {
          maleFamilyLeaveEligible: bp10Data.male_family_leave_eligible,
          femaleFamilyLeaveEligible: bp10Data.female_family_leave_eligible,
          maleFamilyLeaveUsed: bp10Data.male_family_leave_used,
          femaleFamilyLeaveUsed: bp10Data.female_family_leave_used
        } : {},
        
        bp11: bp11Data ? {
          hasApprentices: bp11Data.has_apprentices,
          apprenticesNumber: bp11Data.apprentices_number,
          apprenticesPercentage: bp11Data.apprentices_percentage
        } : {}
      });
      
      console.log("Business partners data loaded successfully");
    } catch (error) {
      console.error("Unexpected error loading business partners data:", error);
      toast.error("Si è verificato un errore durante il caricamento dei dati dei business partners");
    } finally {
      setIsLoading(false);
    }
  }, [reportId]);

  return {
    formData,
    setFormData,
    isLoading,
    loadData
  };
};
