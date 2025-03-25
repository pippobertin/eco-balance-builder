
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BusinessPartnersFormData } from './types';

export const useBusinessPartnersSave = (
  reportId: string,
  formData: BusinessPartnersFormData,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
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
    if (!reportId) {
      console.error("Cannot save data without a reportId");
      toast.error("ID Report mancante. Impossibile salvare.");
      return false;
    }
    
    setIsLoading(true);
    console.log("Starting business partners data save operation");
    
    try {
      const now = new Date();
      
      // Salvataggio BP1
      if (needsSaving.bp1 && Object.keys(formData.bp1).length > 0) {
        console.log("Saving BP1 data");
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
          throw bp1Error;
        }
        
        setLastSaved(prev => ({ ...prev, bp1: now }));
        setNeedsSaving(prev => ({ ...prev, bp1: false }));
      }
      
      // Salvataggio BP2
      if (needsSaving.bp2 && Object.keys(formData.bp2).length > 0) {
        console.log("Saving BP2 data");
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
          throw bp2Error;
        }
        
        setLastSaved(prev => ({ ...prev, bp2: now }));
        setNeedsSaving(prev => ({ ...prev, bp2: false }));
      }
      
      // Salvataggio BP3
      if (needsSaving.bp3 && Object.keys(formData.bp3).length > 0) {
        console.log("Saving BP3 data");
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
          throw bp3Error;
        }
        
        setLastSaved(prev => ({ ...prev, bp3: now }));
        setNeedsSaving(prev => ({ ...prev, bp3: false }));
      }
      
      // Salvataggio BP4
      if (needsSaving.bp4 && Object.keys(formData.bp4).length > 0) {
        console.log("Saving BP4 data");
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
          throw bp4Error;
        }
        
        setLastSaved(prev => ({ ...prev, bp4: now }));
        setNeedsSaving(prev => ({ ...prev, bp4: false }));
      }
      
      // Salvataggio BP5
      if (needsSaving.bp5 && Object.keys(formData.bp5).length > 0) {
        console.log("Saving BP5 data");
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
          throw bp5Error;
        }
        
        setLastSaved(prev => ({ ...prev, bp5: now }));
        setNeedsSaving(prev => ({ ...prev, bp5: false }));
      }
      
      // Salvataggio BP6
      if (needsSaving.bp6 && Object.keys(formData.bp6).length > 0) {
        console.log("Saving BP6 data");
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
          throw bp6Error;
        }
        
        setLastSaved(prev => ({ ...prev, bp6: now }));
        setNeedsSaving(prev => ({ ...prev, bp6: false }));
      }
      
      // Salvataggio BP7
      if (needsSaving.bp7 && Object.keys(formData.bp7).length > 0) {
        console.log("Saving BP7 data");
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
          throw bp7Error;
        }
        
        setLastSaved(prev => ({ ...prev, bp7: now }));
        setNeedsSaving(prev => ({ ...prev, bp7: false }));
      }
      
      // Salvataggio BP8
      if (needsSaving.bp8 && Object.keys(formData.bp8).length > 0) {
        console.log("Saving BP8 data");
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
          throw bp8Error;
        }
        
        setLastSaved(prev => ({ ...prev, bp8: now }));
        setNeedsSaving(prev => ({ ...prev, bp8: false }));
      }
      
      // Salvataggio BP9
      if (needsSaving.bp9 && Object.keys(formData.bp9).length > 0) {
        console.log("Saving BP9 data");
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
          throw bp9Error;
        }
        
        setLastSaved(prev => ({ ...prev, bp9: now }));
        setNeedsSaving(prev => ({ ...prev, bp9: false }));
      }
      
      // Salvataggio BP10
      if (needsSaving.bp10 && Object.keys(formData.bp10).length > 0) {
        console.log("Saving BP10 data");
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
          throw bp10Error;
        }
        
        setLastSaved(prev => ({ ...prev, bp10: now }));
        setNeedsSaving(prev => ({ ...prev, bp10: false }));
      }
      
      // Salvataggio BP11
      if (needsSaving.bp11 && Object.keys(formData.bp11).length > 0) {
        console.log("Saving BP11 data");
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
          throw bp11Error;
        }
        
        setLastSaved(prev => ({ ...prev, bp11: now }));
        setNeedsSaving(prev => ({ ...prev, bp11: false }));
      }
      
      toast.success("Dati dei partner commerciali salvati con successo");
      console.log("Business partners data saved successfully");
      return true;
    } catch (error) {
      console.error("Error saving business partners data:", error);
      toast.error("Si è verificato un errore durante il salvataggio dei dati");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [reportId, formData, needsSaving, setIsLoading]);

  return {
    saveData,
    lastSaved,
    setLastSaved,
    needsSaving,
    setNeedsSaving
  };
};
