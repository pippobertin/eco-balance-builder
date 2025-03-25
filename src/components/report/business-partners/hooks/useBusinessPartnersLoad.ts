
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BusinessPartnersFormData } from './types';

export const useBusinessPartnersLoad = (reportId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<BusinessPartnersFormData>({
    bp1: {
      controversialWeapons: false,
      tobacco: false,
      fossilFuels: false,
      chemicals: false
    },
    bp2: {
      maleGovernanceMembers: undefined,
      femaleGovernanceMembers: undefined,
      otherGenderGovernanceMembers: undefined,
      genderDiversityIndex: undefined
    },
    bp3: {
      hasGhgReductionTargets: false
    },
    bp4: {
      hasTransitionPlan: false
    },
    bp5: {
      hasPhysicalClimateRisks: false
    },
    bp6: {
      hasHazardousWaste: false
    },
    bp7: {
      hasPoliciesAligned: false
    },
    bp8: {
      hasComplianceProcesses: false
    },
    bp9: {
      hasViolations: false
    },
    bp10: {
      maleFamilyLeaveEligible: undefined,
      femaleFamilyLeaveEligible: undefined,
      maleFamilyLeaveUsed: undefined,
      femaleFamilyLeaveUsed: undefined
    },
    bp11: {
      hasApprentices: false
    }
  });

  const loadData = useCallback(async () => {
    if (!reportId) return;
    
    setIsLoading(true);
    const newFormData = { ...formData };
    
    try {
      // BP1
      const { data: bp1Data, error: bp1Error } = await supabase
        .from('bp1_revenue_sectors')
        .select('*')
        .eq('report_id', reportId)
        .single();
        
      if (!bp1Error && bp1Data) {
        newFormData.bp1 = {
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
        };
      }
      
      // BP2
      const { data: bp2Data, error: bp2Error } = await supabase
        .from('bp2_gender_diversity')
        .select('*')
        .eq('report_id', reportId)
        .single();
        
      if (!bp2Error && bp2Data) {
        newFormData.bp2 = {
          maleGovernanceMembers: bp2Data.male_governance_members,
          femaleGovernanceMembers: bp2Data.female_governance_members,
          otherGenderGovernanceMembers: bp2Data.other_gender_governance_members,
          genderDiversityIndex: bp2Data.gender_diversity_index
        };
      }
      
      // BP3
      const { data: bp3Data, error: bp3Error } = await supabase
        .from('bp3_ghg_targets')
        .select('*')
        .eq('report_id', reportId)
        .single();
        
      if (!bp3Error && bp3Data) {
        newFormData.bp3 = {
          hasGhgReductionTargets: bp3Data.has_ghg_reduction_targets,
          ghgReductionTargetScope1: bp3Data.ghg_reduction_target_scope1,
          ghgReductionTargetScope2: bp3Data.ghg_reduction_target_scope2,
          ghgReductionTargetScope3: bp3Data.ghg_reduction_target_scope3,
          ghgReductionTargetYear: bp3Data.ghg_reduction_target_year,
          ghgReductionBaselineYear: bp3Data.ghg_reduction_baseline_year
        };
      }
      
      // BP4
      const { data: bp4Data, error: bp4Error } = await supabase
        .from('bp4_transition_plan')
        .select('*')
        .eq('report_id', reportId)
        .single();
        
      if (!bp4Error && bp4Data) {
        newFormData.bp4 = {
          hasTransitionPlan: bp4Data.has_transition_plan,
          transitionPlanDetails: bp4Data.transition_plan_details
        };
      }
      
      // BP5
      const { data: bp5Data, error: bp5Error } = await supabase
        .from('bp5_physical_risks')
        .select('*')
        .eq('report_id', reportId)
        .single();
        
      if (!bp5Error && bp5Data) {
        newFormData.bp5 = {
          hasPhysicalClimateRisks: bp5Data.has_physical_climate_risks,
          assetsAtRiskAmount: bp5Data.assets_at_risk_amount,
          assetsAtRiskPercentage: bp5Data.assets_at_risk_percentage,
          adaptationCoverage: bp5Data.adaptation_coverage,
          revenueAtRiskPercentage: bp5Data.revenue_at_risk_percentage,
          riskAssetsLocation: bp5Data.risk_assets_location,
          realEstateEnergyEfficiency: bp5Data.real_estate_energy_efficiency
        };
      }
      
      // BP6
      const { data: bp6Data, error: bp6Error } = await supabase
        .from('bp6_hazardous_waste')
        .select('*')
        .eq('report_id', reportId)
        .single();
        
      if (!bp6Error && bp6Data) {
        newFormData.bp6 = {
          hasHazardousWaste: bp6Data.has_hazardous_waste,
          hazardousWasteTotal: bp6Data.hazardous_waste_total,
          radioactiveWasteTotal: bp6Data.radioactive_waste_total
        };
      }
      
      // BP7
      const { data: bp7Data, error: bp7Error } = await supabase
        .from('bp7_policy_alignment')
        .select('*')
        .eq('report_id', reportId)
        .single();
        
      if (!bp7Error && bp7Data) {
        newFormData.bp7 = {
          hasPoliciesAligned: bp7Data.has_policies_aligned,
          alignedInstruments: bp7Data.aligned_instruments
        };
      }
      
      // BP8
      const { data: bp8Data, error: bp8Error } = await supabase
        .from('bp8_compliance_processes')
        .select('*')
        .eq('report_id', reportId)
        .single();
        
      if (!bp8Error && bp8Data) {
        newFormData.bp8 = {
          hasComplianceProcesses: bp8Data.has_compliance_processes,
          complianceProcessesDetails: bp8Data.compliance_processes_details
        };
      }
      
      // BP9
      const { data: bp9Data, error: bp9Error } = await supabase
        .from('bp9_violations')
        .select('*')
        .eq('report_id', reportId)
        .single();
        
      if (!bp9Error && bp9Data) {
        newFormData.bp9 = {
          hasViolations: bp9Data.has_violations,
          violationsDetails: bp9Data.violations_details
        };
      }
      
      // BP10
      const { data: bp10Data, error: bp10Error } = await supabase
        .from('bp10_work_life_balance')
        .select('*')
        .eq('report_id', reportId)
        .single();
        
      if (!bp10Error && bp10Data) {
        newFormData.bp10 = {
          maleFamilyLeaveEligible: bp10Data.male_family_leave_eligible,
          femaleFamilyLeaveEligible: bp10Data.female_family_leave_eligible,
          maleFamilyLeaveUsed: bp10Data.male_family_leave_used,
          femaleFamilyLeaveUsed: bp10Data.female_family_leave_used
        };
      }
      
      // BP11
      const { data: bp11Data, error: bp11Error } = await supabase
        .from('bp11_apprentices')
        .select('*')
        .eq('report_id', reportId)
        .single();
        
      if (!bp11Error && bp11Data) {
        newFormData.bp11 = {
          hasApprentices: bp11Data.has_apprentices,
          apprenticesNumber: bp11Data.apprentices_number,
          apprenticesPercentage: bp11Data.apprentices_percentage
        };
      }
      
      setFormData(newFormData);
    } catch (error) {
      console.error("Unexpected error fetching business partners data:", error);
      toast.error("Errore nel caricamento dei dati sui partner commerciali");
    } finally {
      setIsLoading(false);
    }
  }, [reportId, formData]);

  return {
    formData,
    setFormData,
    isLoading,
    setIsLoading,
    loadData
  };
};
