
import { useState, useEffect } from 'react';
import { BusinessPartnersFormData, BusinessPartnersHookResult } from './types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBusinessPartnersData = (reportId: string): BusinessPartnersHookResult => {
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
      maleParentalLeaveEligible: undefined,
      femaleParentalLeaveEligible: undefined,
      maleParentalLeaveUsed: undefined,
      femaleParentalLeaveUsed: undefined
    },
    bp11: {
      hasApprentices: false
    }
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [needsSaving, setNeedsSaving] = useState<boolean>(false);
  const [sectionNeedsSaving, setSectionNeedsSaving] = useState<Record<string, boolean>>({
    bp1: false,
    bp2: false,
    bp3: false,
    bp4: false,
    bp5: false,
    bp6: false,
    bp7: false,
    bp8: false,
    bp9: false,
    bp10: false,
    bp11: false
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!reportId) return;
      
      setIsLoading(true);
      const latestSaved = new Date(0);
      
      try {
        // BP1 - don't use .single() to avoid 406 errors
        const { data: bp1Data, error: bp1Error } = await supabase
          .from('bp1_revenue_sectors')
          .select('*')
          .eq('report_id', reportId);
          
        if (!bp1Error && bp1Data && bp1Data.length > 0) {
          setFormData(prev => ({
            ...prev,
            bp1: {
              controversialWeapons: bp1Data[0].controversial_weapons || false,
              tobacco: bp1Data[0].tobacco || false,
              fossilFuels: bp1Data[0].fossil_fuels || false,
              chemicals: bp1Data[0].chemicals || false,
              controversialWeaponsRevenue: bp1Data[0].controversial_weapons_revenue,
              tobaccoRevenue: bp1Data[0].tobacco_revenue,
              coalRevenue: bp1Data[0].coal_revenue,
              oilRevenue: bp1Data[0].oil_revenue,
              gasRevenue: bp1Data[0].gas_revenue,
              chemicalsRevenue: bp1Data[0].chemicals_revenue
            }
          }));
          
          const updateDate = new Date(bp1Data[0].updated_at);
          if (updateDate > latestSaved) {
            latestSaved.setTime(updateDate.getTime());
          }
        }
        
        // BP2
        const { data: bp2Data, error: bp2Error } = await supabase
          .from('bp2_gender_diversity')
          .select('*')
          .eq('report_id', reportId);
          
        if (!bp2Error && bp2Data && bp2Data.length > 0) {
          setFormData(prev => ({
            ...prev,
            bp2: {
              maleGovernanceMembers: bp2Data[0].male_governance_members,
              femaleGovernanceMembers: bp2Data[0].female_governance_members,
              otherGenderGovernanceMembers: bp2Data[0].other_gender_governance_members,
              genderDiversityIndex: bp2Data[0].gender_diversity_index
            }
          }));
          
          const updateDate = new Date(bp2Data[0].updated_at);
          if (updateDate > latestSaved) {
            latestSaved.setTime(updateDate.getTime());
          }
        }
        
        // BP3
        const { data: bp3Data, error: bp3Error } = await supabase
          .from('bp3_ghg_targets')
          .select('*')
          .eq('report_id', reportId);
          
        if (!bp3Error && bp3Data && bp3Data.length > 0) {
          setFormData(prev => ({
            ...prev,
            bp3: {
              hasGhgReductionTargets: bp3Data[0].has_ghg_reduction_targets || false,
              ghgReductionTargetScope1: bp3Data[0].ghg_reduction_target_scope1,
              ghgReductionTargetScope2: bp3Data[0].ghg_reduction_target_scope2,
              ghgReductionTargetScope3: bp3Data[0].ghg_reduction_target_scope3,
              ghgReductionTargetYear: bp3Data[0].ghg_reduction_target_year,
              ghgReductionBaselineYear: bp3Data[0].ghg_reduction_baseline_year
            }
          }));
          
          const updateDate = new Date(bp3Data[0].updated_at);
          if (updateDate > latestSaved) {
            latestSaved.setTime(updateDate.getTime());
          }
        }
        
        // BP4
        const { data: bp4Data, error: bp4Error } = await supabase
          .from('bp4_transition_plan')
          .select('*')
          .eq('report_id', reportId);
          
        if (!bp4Error && bp4Data && bp4Data.length > 0) {
          setFormData(prev => ({
            ...prev,
            bp4: {
              hasTransitionPlan: bp4Data[0].has_transition_plan || false,
              transitionPlanDetails: bp4Data[0].transition_plan_details
            }
          }));
          
          const updateDate = new Date(bp4Data[0].updated_at);
          if (updateDate > latestSaved) {
            latestSaved.setTime(updateDate.getTime());
          }
        }
        
        // BP5
        const { data: bp5Data, error: bp5Error } = await supabase
          .from('bp5_physical_risks')
          .select('*')
          .eq('report_id', reportId);
          
        if (!bp5Error && bp5Data && bp5Data.length > 0) {
          setFormData(prev => ({
            ...prev,
            bp5: {
              hasPhysicalClimateRisks: bp5Data[0].has_physical_climate_risks || false,
              assetsAtRiskAmount: bp5Data[0].assets_at_risk_amount,
              assetsAtRiskPercentage: bp5Data[0].assets_at_risk_percentage,
              adaptationCoverage: bp5Data[0].adaptation_coverage,
              revenueAtRiskPercentage: bp5Data[0].revenue_at_risk_percentage,
              riskAssetsLocation: bp5Data[0].risk_assets_location,
              realEstateEnergyEfficiency: bp5Data[0].real_estate_energy_efficiency
            }
          }));
          
          const updateDate = new Date(bp5Data[0].updated_at);
          if (updateDate > latestSaved) {
            latestSaved.setTime(updateDate.getTime());
          }
        }
        
        // BP6
        const { data: bp6Data, error: bp6Error } = await supabase
          .from('bp6_hazardous_waste')
          .select('*')
          .eq('report_id', reportId);
          
        if (!bp6Error && bp6Data && bp6Data.length > 0) {
          setFormData(prev => ({
            ...prev,
            bp6: {
              hasHazardousWaste: bp6Data[0].has_hazardous_waste || false,
              hazardousWasteTotal: bp6Data[0].hazardous_waste_total,
              radioactiveWasteTotal: bp6Data[0].radioactive_waste_total
            }
          }));
          
          const updateDate = new Date(bp6Data[0].updated_at);
          if (updateDate > latestSaved) {
            latestSaved.setTime(updateDate.getTime());
          }
        }
        
        // BP7
        const { data: bp7Data, error: bp7Error } = await supabase
          .from('bp7_policy_alignment')
          .select('*')
          .eq('report_id', reportId);
          
        if (!bp7Error && bp7Data && bp7Data.length > 0) {
          setFormData(prev => ({
            ...prev,
            bp7: {
              hasPoliciesAligned: bp7Data[0].has_policies_aligned || false,
              alignedInstruments: bp7Data[0].aligned_instruments
            }
          }));
          
          const updateDate = new Date(bp7Data[0].updated_at);
          if (updateDate > latestSaved) {
            latestSaved.setTime(updateDate.getTime());
          }
        }
        
        // BP8
        const { data: bp8Data, error: bp8Error } = await supabase
          .from('bp8_compliance_processes')
          .select('*')
          .eq('report_id', reportId);
          
        if (!bp8Error && bp8Data && bp8Data.length > 0) {
          setFormData(prev => ({
            ...prev,
            bp8: {
              hasComplianceProcesses: bp8Data[0].has_compliance_processes || false,
              complianceProcessesDetails: bp8Data[0].compliance_processes_details
            }
          }));
          
          const updateDate = new Date(bp8Data[0].updated_at);
          if (updateDate > latestSaved) {
            latestSaved.setTime(updateDate.getTime());
          }
        }
        
        // BP9
        const { data: bp9Data, error: bp9Error } = await supabase
          .from('bp9_violations')
          .select('*')
          .eq('report_id', reportId);
          
        if (!bp9Error && bp9Data && bp9Data.length > 0) {
          setFormData(prev => ({
            ...prev,
            bp9: {
              hasViolations: bp9Data[0].has_violations || false,
              violationsDetails: bp9Data[0].violations_details
            }
          }));
          
          const updateDate = new Date(bp9Data[0].updated_at);
          if (updateDate > latestSaved) {
            latestSaved.setTime(updateDate.getTime());
          }
        }
        
        // BP10
        const { data: bp10Data, error: bp10Error } = await supabase
          .from('bp10_work_life_balance')
          .select('*')
          .eq('report_id', reportId);
          
        if (!bp10Error && bp10Data && bp10Data.length > 0) {
          setFormData(prev => ({
            ...prev,
            bp10: {
              maleParentalLeaveEligible: bp10Data[0].male_family_leave_eligible,
              femaleParentalLeaveEligible: bp10Data[0].female_family_leave_eligible,
              maleParentalLeaveUsed: bp10Data[0].male_family_leave_used,
              femaleParentalLeaveUsed: bp10Data[0].female_family_leave_used
            }
          }));
          
          const updateDate = new Date(bp10Data[0].updated_at);
          if (updateDate > latestSaved) {
            latestSaved.setTime(updateDate.getTime());
          }
        }
        
        // BP11
        const { data: bp11Data, error: bp11Error } = await supabase
          .from('bp11_apprentices')
          .select('*')
          .eq('report_id', reportId);
          
        if (!bp11Error && bp11Data && bp11Data.length > 0) {
          setFormData(prev => ({
            ...prev,
            bp11: {
              hasApprentices: bp11Data[0].has_apprentices || false,
              apprenticesNumber: bp11Data[0].apprentices_number,
              apprenticesPercentage: bp11Data[0].apprentices_percentage
            }
          }));
          
          const updateDate = new Date(bp11Data[0].updated_at);
          if (updateDate > latestSaved) {
            latestSaved.setTime(updateDate.getTime());
          }
        }
        
      } catch (error) {
        console.error("Unexpected error fetching business partners data:", error);
        toast.error("Errore nel caricamento dei dati sui partner commerciali");
      } finally {
        setLastSaved(latestSaved.getTime() > 0 ? latestSaved : null);
        setSectionNeedsSaving({
          bp1: false,
          bp2: false,
          bp3: false,
          bp4: false,
          bp5: false,
          bp6: false,
          bp7: false,
          bp8: false,
          bp9: false,
          bp10: false,
          bp11: false
        });
        setNeedsSaving(false);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [reportId]);

  const saveData = async (): Promise<boolean> => {
    if (!reportId) return false;
    
    setIsLoading(true);
    let success = true;
    const now = new Date();
    
    try {
      // BP1
      if (sectionNeedsSaving.bp1 && formData.bp1) {
        try {
          // Check if record exists
          const { data: existingData, error: checkError } = await supabase
            .from('bp1_revenue_sectors')
            .select('id')
            .eq('report_id', reportId);
            
          if (checkError) throw new Error(checkError.message);
          
          if (existingData && existingData.length > 0) {
            // Update existing record
            const { error } = await supabase
              .from('bp1_revenue_sectors')
              .update({
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
              })
              .eq('report_id', reportId);
              
            if (error) throw new Error(error.message);
          } else {
            // Insert new record
            const { error } = await supabase
              .from('bp1_revenue_sectors')
              .insert({
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
              });
              
            if (error) throw new Error(error.message);
          }
        } catch (error: any) {
          console.error(`Error saving BP1 data:`, error);
          success = false;
        }
      }
      
      // BP2
      if (sectionNeedsSaving.bp2 && formData.bp2) {
        try {
          // Check if record exists
          const { data: existingData, error: checkError } = await supabase
            .from('bp2_gender_diversity')
            .select('id')
            .eq('report_id', reportId);
            
          if (checkError) throw new Error(checkError.message);
          
          if (existingData && existingData.length > 0) {
            // Update existing record
            const { error } = await supabase
              .from('bp2_gender_diversity')
              .update({
                male_governance_members: formData.bp2.maleGovernanceMembers,
                female_governance_members: formData.bp2.femaleGovernanceMembers,
                other_gender_governance_members: formData.bp2.otherGenderGovernanceMembers,
                gender_diversity_index: formData.bp2.genderDiversityIndex,
                updated_at: now.toISOString()
              })
              .eq('report_id', reportId);
              
            if (error) throw new Error(error.message);
          } else {
            // Insert new record
            const { error } = await supabase
              .from('bp2_gender_diversity')
              .insert({
                report_id: reportId,
                male_governance_members: formData.bp2.maleGovernanceMembers,
                female_governance_members: formData.bp2.femaleGovernanceMembers,
                other_gender_governance_members: formData.bp2.otherGenderGovernanceMembers,
                gender_diversity_index: formData.bp2.genderDiversityIndex,
                updated_at: now.toISOString()
              });
              
            if (error) throw new Error(error.message);
          }
        } catch (error: any) {
          console.error(`Error saving BP2 data:`, error);
          success = false;
        }
      }
      
      // BP3
      if (sectionNeedsSaving.bp3 && formData.bp3) {
        try {
          // Check if record exists
          const { data: existingData, error: checkError } = await supabase
            .from('bp3_ghg_targets')
            .select('id')
            .eq('report_id', reportId);
            
          if (checkError) throw new Error(checkError.message);
          
          if (existingData && existingData.length > 0) {
            // Update existing record
            const { error } = await supabase
              .from('bp3_ghg_targets')
              .update({
                has_ghg_reduction_targets: formData.bp3.hasGhgReductionTargets,
                ghg_reduction_target_scope1: formData.bp3.ghgReductionTargetScope1,
                ghg_reduction_target_scope2: formData.bp3.ghgReductionTargetScope2,
                ghg_reduction_target_scope3: formData.bp3.ghgReductionTargetScope3,
                ghg_reduction_target_year: formData.bp3.ghgReductionTargetYear,
                ghg_reduction_baseline_year: formData.bp3.ghgReductionBaselineYear,
                updated_at: now.toISOString()
              })
              .eq('report_id', reportId);
              
            if (error) throw new Error(error.message);
          } else {
            // Insert new record
            const { error } = await supabase
              .from('bp3_ghg_targets')
              .insert({
                report_id: reportId,
                has_ghg_reduction_targets: formData.bp3.hasGhgReductionTargets,
                ghg_reduction_target_scope1: formData.bp3.ghgReductionTargetScope1,
                ghg_reduction_target_scope2: formData.bp3.ghgReductionTargetScope2,
                ghg_reduction_target_scope3: formData.bp3.ghgReductionTargetScope3,
                ghg_reduction_target_year: formData.bp3.ghgReductionTargetYear,
                ghg_reduction_baseline_year: formData.bp3.ghgReductionBaselineYear,
                updated_at: now.toISOString()
              });
              
            if (error) throw new Error(error.message);
          }
        } catch (error: any) {
          console.error(`Error saving BP3 data:`, error);
          success = false;
        }
      }
      
      // BP4
      if (sectionNeedsSaving.bp4 && formData.bp4) {
        try {
          // Check if record exists
          const { data: existingData, error: checkError } = await supabase
            .from('bp4_transition_plan')
            .select('id')
            .eq('report_id', reportId);
            
          if (checkError) throw new Error(checkError.message);
          
          if (existingData && existingData.length > 0) {
            // Update existing record
            const { error } = await supabase
              .from('bp4_transition_plan')
              .update({
                has_transition_plan: formData.bp4.hasTransitionPlan,
                transition_plan_details: formData.bp4.transitionPlanDetails,
                updated_at: now.toISOString()
              })
              .eq('report_id', reportId);
              
            if (error) throw new Error(error.message);
          } else {
            // Insert new record
            const { error } = await supabase
              .from('bp4_transition_plan')
              .insert({
                report_id: reportId,
                has_transition_plan: formData.bp4.hasTransitionPlan,
                transition_plan_details: formData.bp4.transitionPlanDetails,
                updated_at: now.toISOString()
              });
              
            if (error) throw new Error(error.message);
          }
        } catch (error: any) {
          console.error(`Error saving BP4 data:`, error);
          success = false;
        }
      }
      
      // BP5
      if (sectionNeedsSaving.bp5 && formData.bp5) {
        try {
          // Check if record exists
          const { data: existingData, error: checkError } = await supabase
            .from('bp5_physical_risks')
            .select('id')
            .eq('report_id', reportId);
            
          if (checkError) throw new Error(checkError.message);
          
          if (existingData && existingData.length > 0) {
            // Update existing record
            const { error } = await supabase
              .from('bp5_physical_risks')
              .update({
                has_physical_climate_risks: formData.bp5.hasPhysicalClimateRisks,
                assets_at_risk_amount: formData.bp5.assetsAtRiskAmount,
                assets_at_risk_percentage: formData.bp5.assetsAtRiskPercentage,
                adaptation_coverage: formData.bp5.adaptationCoverage,
                revenue_at_risk_percentage: formData.bp5.revenueAtRiskPercentage,
                risk_assets_location: formData.bp5.riskAssetsLocation,
                real_estate_energy_efficiency: formData.bp5.realEstateEnergyEfficiency,
                updated_at: now.toISOString()
              })
              .eq('report_id', reportId);
              
            if (error) throw new Error(error.message);
          } else {
            // Insert new record
            const { error } = await supabase
              .from('bp5_physical_risks')
              .insert({
                report_id: reportId,
                has_physical_climate_risks: formData.bp5.hasPhysicalClimateRisks,
                assets_at_risk_amount: formData.bp5.assetsAtRiskAmount,
                assets_at_risk_percentage: formData.bp5.assetsAtRiskPercentage,
                adaptation_coverage: formData.bp5.adaptationCoverage,
                revenue_at_risk_percentage: formData.bp5.revenueAtRiskPercentage,
                risk_assets_location: formData.bp5.riskAssetsLocation,
                real_estate_energy_efficiency: formData.bp5.realEstateEnergyEfficiency,
                updated_at: now.toISOString()
              });
              
            if (error) throw new Error(error.message);
          }
        } catch (error: any) {
          console.error(`Error saving BP5 data:`, error);
          success = false;
        }
      }
      
      // BP6
      if (sectionNeedsSaving.bp6 && formData.bp6) {
        try {
          // Check if record exists
          const { data: existingData, error: checkError } = await supabase
            .from('bp6_hazardous_waste')
            .select('id')
            .eq('report_id', reportId);
            
          if (checkError) throw new Error(checkError.message);
          
          if (existingData && existingData.length > 0) {
            // Update existing record
            const { error } = await supabase
              .from('bp6_hazardous_waste')
              .update({
                has_hazardous_waste: formData.bp6.hasHazardousWaste,
                hazardous_waste_total: formData.bp6.hazardousWasteTotal,
                radioactive_waste_total: formData.bp6.radioactiveWasteTotal,
                updated_at: now.toISOString()
              })
              .eq('report_id', reportId);
              
            if (error) throw new Error(error.message);
          } else {
            // Insert new record
            const { error } = await supabase
              .from('bp6_hazardous_waste')
              .insert({
                report_id: reportId,
                has_hazardous_waste: formData.bp6.hasHazardousWaste,
                hazardous_waste_total: formData.bp6.hazardousWasteTotal,
                radioactive_waste_total: formData.bp6.radioactiveWasteTotal,
                updated_at: now.toISOString()
              });
              
            if (error) throw new Error(error.message);
          }
        } catch (error: any) {
          console.error(`Error saving BP6 data:`, error);
          success = false;
        }
      }
      
      // BP7
      if (sectionNeedsSaving.bp7 && formData.bp7) {
        try {
          // Check if record exists
          const { data: existingData, error: checkError } = await supabase
            .from('bp7_policy_alignment')
            .select('id')
            .eq('report_id', reportId);
            
          if (checkError) throw new Error(checkError.message);
          
          if (existingData && existingData.length > 0) {
            // Update existing record
            const { error } = await supabase
              .from('bp7_policy_alignment')
              .update({
                has_policies_aligned: formData.bp7.hasPoliciesAligned,
                aligned_instruments: formData.bp7.alignedInstruments,
                updated_at: now.toISOString()
              })
              .eq('report_id', reportId);
              
            if (error) throw new Error(error.message);
          } else {
            // Insert new record
            const { error } = await supabase
              .from('bp7_policy_alignment')
              .insert({
                report_id: reportId,
                has_policies_aligned: formData.bp7.hasPoliciesAligned,
                aligned_instruments: formData.bp7.alignedInstruments,
                updated_at: now.toISOString()
              });
              
            if (error) throw new Error(error.message);
          }
        } catch (error: any) {
          console.error(`Error saving BP7 data:`, error);
          success = false;
        }
      }
      
      // BP8
      if (sectionNeedsSaving.bp8 && formData.bp8) {
        try {
          // Check if record exists
          const { data: existingData, error: checkError } = await supabase
            .from('bp8_compliance_processes')
            .select('id')
            .eq('report_id', reportId);
            
          if (checkError) throw new Error(checkError.message);
          
          if (existingData && existingData.length > 0) {
            // Update existing record
            const { error } = await supabase
              .from('bp8_compliance_processes')
              .update({
                has_compliance_processes: formData.bp8.hasComplianceProcesses,
                compliance_processes_details: formData.bp8.complianceProcessesDetails,
                updated_at: now.toISOString()
              })
              .eq('report_id', reportId);
              
            if (error) throw new Error(error.message);
          } else {
            // Insert new record
            const { error } = await supabase
              .from('bp8_compliance_processes')
              .insert({
                report_id: reportId,
                has_compliance_processes: formData.bp8.hasComplianceProcesses,
                compliance_processes_details: formData.bp8.complianceProcessesDetails,
                updated_at: now.toISOString()
              });
              
            if (error) throw new Error(error.message);
          }
        } catch (error: any) {
          console.error(`Error saving BP8 data:`, error);
          success = false;
        }
      }
      
      // BP9
      if (sectionNeedsSaving.bp9 && formData.bp9) {
        try {
          // Check if record exists
          const { data: existingData, error: checkError } = await supabase
            .from('bp9_violations')
            .select('id')
            .eq('report_id', reportId);
            
          if (checkError) throw new Error(checkError.message);
          
          if (existingData && existingData.length > 0) {
            // Update existing record
            const { error } = await supabase
              .from('bp9_violations')
              .update({
                has_violations: formData.bp9.hasViolations,
                violations_details: formData.bp9.violationsDetails,
                updated_at: now.toISOString()
              })
              .eq('report_id', reportId);
              
            if (error) throw new Error(error.message);
          } else {
            // Insert new record
            const { error } = await supabase
              .from('bp9_violations')
              .insert({
                report_id: reportId,
                has_violations: formData.bp9.hasViolations,
                violations_details: formData.bp9.violationsDetails,
                updated_at: now.toISOString()
              });
              
            if (error) throw new Error(error.message);
          }
        } catch (error: any) {
          console.error(`Error saving BP9 data:`, error);
          success = false;
        }
      }
      
      // BP10
      if (sectionNeedsSaving.bp10 && formData.bp10) {
        try {
          // Check if record exists
          const { data: existingData, error: checkError } = await supabase
            .from('bp10_work_life_balance')
            .select('id')
            .eq('report_id', reportId);
            
          if (checkError) throw new Error(checkError.message);
          
          if (existingData && existingData.length > 0) {
            // Update existing record
            const { error } = await supabase
              .from('bp10_work_life_balance')
              .update({
                male_family_leave_eligible: formData.bp10.maleParentalLeaveEligible,
                female_family_leave_eligible: formData.bp10.femaleParentalLeaveEligible,
                male_family_leave_used: formData.bp10.maleParentalLeaveUsed,
                female_family_leave_used: formData.bp10.femaleParentalLeaveUsed,
                updated_at: now.toISOString()
              })
              .eq('report_id', reportId);
              
            if (error) throw new Error(error.message);
          } else {
            // Insert new record
            const { error } = await supabase
              .from('bp10_work_life_balance')
              .insert({
                report_id: reportId,
                male_family_leave_eligible: formData.bp10.maleParentalLeaveEligible,
                female_family_leave_eligible: formData.bp10.femaleParentalLeaveEligible,
                male_family_leave_used: formData.bp10.maleParentalLeaveUsed,
                female_family_leave_used: formData.bp10.femaleParentalLeaveUsed,
                updated_at: now.toISOString()
              });
              
            if (error) throw new Error(error.message);
          }
        } catch (error: any) {
          console.error(`Error saving BP10 data:`, error);
          success = false;
        }
      }
      
      // BP11
      if (sectionNeedsSaving.bp11 && formData.bp11) {
        try {
          // Check if record exists
          const { data: existingData, error: checkError } = await supabase
            .from('bp11_apprentices')
            .select('id')
            .eq('report_id', reportId);
            
          if (checkError) throw new Error(checkError.message);
          
          if (existingData && existingData.length > 0) {
            // Update existing record
            const { error } = await supabase
              .from('bp11_apprentices')
              .update({
                has_apprentices: formData.bp11.hasApprentices,
                apprentices_number: formData.bp11.apprenticesNumber,
                apprentices_percentage: formData.bp11.apprenticesPercentage,
                updated_at: now.toISOString()
              })
              .eq('report_id', reportId);
              
            if (error) throw new Error(error.message);
          } else {
            // Insert new record
            const { error } = await supabase
              .from('bp11_apprentices')
              .insert({
                report_id: reportId,
                has_apprentices: formData.bp11.hasApprentices,
                apprentices_number: formData.bp11.apprenticesNumber,
                apprentices_percentage: formData.bp11.apprenticesPercentage,
                updated_at: now.toISOString()
              });
              
            if (error) throw new Error(error.message);
          }
        } catch (error: any) {
          console.error(`Error saving BP11 data:`, error);
          success = false;
        }
      }
      
      if (success) {
        setLastSaved(now);
        setSectionNeedsSaving({
          bp1: false,
          bp2: false,
          bp3: false,
          bp4: false,
          bp5: false,
          bp6: false,
          bp7: false,
          bp8: false,
          bp9: false,
          bp10: false,
          bp11: false
        });
        setNeedsSaving(false);
        toast.success("Dati sui partner commerciali salvati con successo");
      } else {
        toast.error("Si è verificato un errore durante il salvataggio dei dati sui partner commerciali");
      }
      
    } catch (error) {
      console.error("Error saving business partners data:", error);
      toast.error("Errore nel salvataggio dei dati sui partner commerciali");
      success = false;
    } finally {
      setIsLoading(false);
    }
    
    return success;
  };

  // Function to update data for a specific module
  const updateData = (module: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [module]: data
    }));
    
    setSectionNeedsSaving(prev => ({
      ...prev,
      [module]: true
    }));
    
    setNeedsSaving(true);
  };

  return {
    data: formData,
    updateData,
    saveAll: saveData,
    isLoading,
    lastSaved,
    needsSaving
  };
};
