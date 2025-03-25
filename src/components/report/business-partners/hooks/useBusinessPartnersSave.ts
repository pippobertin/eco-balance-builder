
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BusinessPartnersFormData } from './types';

export const useBusinessPartnersSave = (
  reportId: string,
  formData: BusinessPartnersFormData,
  setIsLoading: (isLoading: boolean) => void
) => {
  const [lastSaved, setLastSaved] = useState<Record<string, Date | null>>({
    bp1: null, bp2: null, bp3: null, bp4: null, bp5: null,
    bp6: null, bp7: null, bp8: null, bp9: null, bp10: null, bp11: null
  });
  
  const [needsSaving, setNeedsSaving] = useState<Record<string, boolean>>({
    bp1: false, bp2: false, bp3: false, bp4: false, bp5: false,
    bp6: false, bp7: false, bp8: false, bp9: false, bp10: false, bp11: false
  });

  const saveData = useCallback(async (): Promise<boolean> => {
    if (!reportId) return false;
    
    setIsLoading(true);
    let success = true;
    const now = new Date();
    const newLastSaved = { ...lastSaved };
    
    try {
      // BP1
      if (needsSaving.bp1 && formData.bp1) {
        const { error: bp1Error } = await supabase
          .from('bp1_revenue_sectors')
          .upsert({
            report_id: reportId,
            controversial_weapons: formData.bp1.controversialWeapons,
            tobacco: formData.bp1.tobacco,
            fossil_fuels: formData.bp1.fossilFuels,
            chemicals: formData.bp1.chemicals,
            controversial_weapons_revenue: formData.bp1.controversialWeaponsRevenue,
            tobacco_revenue: formData.bp1.tobaccoRevenue,
            coal_revenue: formData.bp1.coalRevenue,
            oil_revenue: formData.bp1.oilRevenue,
            gas_revenue: formData.bp1.gasRevenue,
            chemicals_revenue: formData.bp1.chemicalsRevenue,
            updated_at: now.toISOString()
          }, { onConflict: 'report_id' });
          
        if (bp1Error) {
          console.error("Error saving BP1 data:", bp1Error);
          success = false;
        } else {
          newLastSaved.bp1 = now;
        }
      }
      
      // BP2
      if (needsSaving.bp2 && formData.bp2) {
        const { error: bp2Error } = await supabase
          .from('bp2_gender_diversity')
          .upsert({
            report_id: reportId,
            male_governance_members: formData.bp2.maleGovernanceMembers,
            female_governance_members: formData.bp2.femaleGovernanceMembers,
            other_gender_governance_members: formData.bp2.otherGenderGovernanceMembers,
            gender_diversity_index: formData.bp2.genderDiversityIndex,
            updated_at: now.toISOString()
          }, { onConflict: 'report_id' });
          
        if (bp2Error) {
          console.error("Error saving BP2 data:", bp2Error);
          success = false;
        } else {
          newLastSaved.bp2 = now;
        }
      }
      
      // BP3
      if (needsSaving.bp3 && formData.bp3) {
        const { error: bp3Error } = await supabase
          .from('bp3_ghg_targets')
          .upsert({
            report_id: reportId,
            has_ghg_reduction_targets: formData.bp3.hasGhgReductionTargets,
            ghg_reduction_target_scope1: formData.bp3.ghgReductionTargetScope1,
            ghg_reduction_target_scope2: formData.bp3.ghgReductionTargetScope2,
            ghg_reduction_target_scope3: formData.bp3.ghgReductionTargetScope3,
            ghg_reduction_target_year: formData.bp3.ghgReductionTargetYear,
            ghg_reduction_baseline_year: formData.bp3.ghgReductionBaselineYear,
            updated_at: now.toISOString()
          }, { onConflict: 'report_id' });
          
        if (bp3Error) {
          console.error("Error saving BP3 data:", bp3Error);
          success = false;
        } else {
          newLastSaved.bp3 = now;
        }
      }
      
      // BP4
      if (needsSaving.bp4 && formData.bp4) {
        const { error: bp4Error } = await supabase
          .from('bp4_transition_plan')
          .upsert({
            report_id: reportId,
            has_transition_plan: formData.bp4.hasTransitionPlan,
            transition_plan_details: formData.bp4.transitionPlanDetails,
            updated_at: now.toISOString()
          }, { onConflict: 'report_id' });
          
        if (bp4Error) {
          console.error("Error saving BP4 data:", bp4Error);
          success = false;
        } else {
          newLastSaved.bp4 = now;
        }
      }
      
      // BP5
      if (needsSaving.bp5 && formData.bp5) {
        const { error: bp5Error } = await supabase
          .from('bp5_physical_risks')
          .upsert({
            report_id: reportId,
            has_physical_climate_risks: formData.bp5.hasPhysicalClimateRisks,
            assets_at_risk_amount: formData.bp5.assetsAtRiskAmount,
            assets_at_risk_percentage: formData.bp5.assetsAtRiskPercentage,
            adaptation_coverage: formData.bp5.adaptationCoverage,
            revenue_at_risk_percentage: formData.bp5.revenueAtRiskPercentage,
            risk_assets_location: formData.bp5.riskAssetsLocation,
            real_estate_energy_efficiency: formData.bp5.realEstateEnergyEfficiency,
            updated_at: now.toISOString()
          }, { onConflict: 'report_id' });
          
        if (bp5Error) {
          console.error("Error saving BP5 data:", bp5Error);
          success = false;
        } else {
          newLastSaved.bp5 = now;
        }
      }
      
      // BP6
      if (needsSaving.bp6 && formData.bp6) {
        const { error: bp6Error } = await supabase
          .from('bp6_hazardous_waste')
          .upsert({
            report_id: reportId,
            has_hazardous_waste: formData.bp6.hasHazardousWaste,
            hazardous_waste_total: formData.bp6.hazardousWasteTotal,
            radioactive_waste_total: formData.bp6.radioactiveWasteTotal,
            updated_at: now.toISOString()
          }, { onConflict: 'report_id' });
          
        if (bp6Error) {
          console.error("Error saving BP6 data:", bp6Error);
          success = false;
        } else {
          newLastSaved.bp6 = now;
        }
      }
      
      // BP7
      if (needsSaving.bp7 && formData.bp7) {
        const { error: bp7Error } = await supabase
          .from('bp7_policy_alignment')
          .upsert({
            report_id: reportId,
            has_policies_aligned: formData.bp7.hasPoliciesAligned,
            aligned_instruments: formData.bp7.alignedInstruments,
            updated_at: now.toISOString()
          }, { onConflict: 'report_id' });
          
        if (bp7Error) {
          console.error("Error saving BP7 data:", bp7Error);
          success = false;
        } else {
          newLastSaved.bp7 = now;
        }
      }
      
      // BP8
      if (needsSaving.bp8 && formData.bp8) {
        const { error: bp8Error } = await supabase
          .from('bp8_compliance_processes')
          .upsert({
            report_id: reportId,
            has_compliance_processes: formData.bp8.hasComplianceProcesses,
            compliance_processes_details: formData.bp8.complianceProcessesDetails,
            updated_at: now.toISOString()
          }, { onConflict: 'report_id' });
          
        if (bp8Error) {
          console.error("Error saving BP8 data:", bp8Error);
          success = false;
        } else {
          newLastSaved.bp8 = now;
        }
      }
      
      // BP9
      if (needsSaving.bp9 && formData.bp9) {
        const { error: bp9Error } = await supabase
          .from('bp9_violations')
          .upsert({
            report_id: reportId,
            has_violations: formData.bp9.hasViolations,
            violations_details: formData.bp9.violationsDetails,
            updated_at: now.toISOString()
          }, { onConflict: 'report_id' });
          
        if (bp9Error) {
          console.error("Error saving BP9 data:", bp9Error);
          success = false;
        } else {
          newLastSaved.bp9 = now;
        }
      }
      
      // BP10
      if (needsSaving.bp10 && formData.bp10) {
        const { error: bp10Error } = await supabase
          .from('bp10_work_life_balance')
          .upsert({
            report_id: reportId,
            male_family_leave_eligible: formData.bp10.maleFamilyLeaveEligible,
            female_family_leave_eligible: formData.bp10.femaleFamilyLeaveEligible,
            male_family_leave_used: formData.bp10.maleFamilyLeaveUsed,
            female_family_leave_used: formData.bp10.femaleFamilyLeaveUsed,
            updated_at: now.toISOString()
          }, { onConflict: 'report_id' });
          
        if (bp10Error) {
          console.error("Error saving BP10 data:", bp10Error);
          success = false;
        } else {
          newLastSaved.bp10 = now;
        }
      }
      
      // BP11
      if (needsSaving.bp11 && formData.bp11) {
        const { error: bp11Error } = await supabase
          .from('bp11_apprentices')
          .upsert({
            report_id: reportId,
            has_apprentices: formData.bp11.hasApprentices,
            apprentices_number: formData.bp11.apprenticesNumber,
            apprentices_percentage: formData.bp11.apprenticesPercentage,
            updated_at: now.toISOString()
          }, { onConflict: 'report_id' });
          
        if (bp11Error) {
          console.error("Error saving BP11 data:", bp11Error);
          success = false;
        } else {
          newLastSaved.bp11 = now;
        }
      }
      
      // Update last saved time
      if (success) {
        setLastSaved(newLastSaved);
        setNeedsSaving({
          bp1: false, bp2: false, bp3: false, bp4: false, bp5: false,
          bp6: false, bp7: false, bp8: false, bp9: false, bp10: false, bp11: false
        });
        toast.success("Dati salvati con successo");
      } else {
        toast.error("Si è verificato un errore durante il salvataggio di alcuni dati");
      }
      
    } catch (error) {
      console.error("Unexpected error saving business partners data:", error);
      toast.error("Errore nel salvataggio dei dati sui partner commerciali");
      success = false;
    } finally {
      setIsLoading(false);
    }
    
    return success;
  }, [reportId, formData, needsSaving, lastSaved, setIsLoading]);

  return {
    saveData,
    lastSaved,
    setLastSaved,
    needsSaving,
    setNeedsSaving
  };
};
