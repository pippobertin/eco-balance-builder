
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
      maleFamilyLeaveEligible: undefined,
      femaleFamilyLeaveEligible: undefined,
      maleFamilyLeaveUsed: undefined,
      femaleFamilyLeaveUsed: undefined
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
              maleFamilyLeaveEligible: bp10Data[0].male_family_leave_eligible,
              femaleFamilyLeaveEligible: bp10Data[0].female_family_leave_eligible,
              maleFamilyLeaveUsed: bp10Data[0].male_family_leave_used,
              femaleFamilyLeaveUsed: bp10Data[0].female_family_leave_used
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
      // Helper function to check if a record exists and then insert or update
      const upsertData = async (
        table: string, 
        data: any, 
        needsSaving: boolean
      ) => {
        if (!needsSaving) return true;
        
        try {
          // Check if record exists
          const { data: existingData, error: checkError } = await supabase
            .from(table)
            .select('id')
            .eq('report_id', reportId);
            
          if (checkError) throw new Error(checkError.message);
          
          if (existingData && existingData.length > 0) {
            // Update existing record
            const { error } = await supabase
              .from(table)
              .update({ ...data, updated_at: now.toISOString() })
              .eq('report_id', reportId);
              
            if (error) throw new Error(error.message);
          } else {
            // Insert new record
            const { error } = await supabase
              .from(table)
              .insert({ report_id: reportId, ...data, updated_at: now.toISOString() });
              
            if (error) throw new Error(error.message);
          }
          
          return true;
        } catch (error: any) {
          console.error(`Error saving ${table} data:`, error);
          return false;
        }
      };
      
      // BP1
      if (sectionNeedsSaving.bp1 && formData.bp1) {
        const bp1Success = await upsertData('bp1_revenue_sectors', {
          controversial_weapons: formData.bp1.controversialWeapons,
          tobacco: formData.bp1.tobacco,
          fossil_fuels: formData.bp1.fossilFuels,
          chemicals: formData.bp1.chemicals,
          controversial_weapons_revenue: formData.bp1.controversialWeaponsRevenue,
          tobacco_revenue: formData.bp1.tobaccoRevenue,
          coal_revenue: formData.bp1.coalRevenue,
          oil_revenue: formData.bp1.oilRevenue,
          gas_revenue: formData.bp1.gasRevenue,
          chemicals_revenue: formData.bp1.chemicalsRevenue
        }, sectionNeedsSaving.bp1);
        
        success = success && bp1Success;
      }
      
      // BP2
      if (sectionNeedsSaving.bp2 && formData.bp2) {
        const bp2Success = await upsertData('bp2_gender_diversity', {
          male_governance_members: formData.bp2.maleGovernanceMembers,
          female_governance_members: formData.bp2.femaleGovernanceMembers,
          other_gender_governance_members: formData.bp2.otherGenderGovernanceMembers,
          gender_diversity_index: formData.bp2.genderDiversityIndex
        }, sectionNeedsSaving.bp2);
        
        success = success && bp2Success;
      }
      
      // BP3
      if (sectionNeedsSaving.bp3 && formData.bp3) {
        const bp3Success = await upsertData('bp3_ghg_targets', {
          has_ghg_reduction_targets: formData.bp3.hasGhgReductionTargets,
          ghg_reduction_target_scope1: formData.bp3.ghgReductionTargetScope1,
          ghg_reduction_target_scope2: formData.bp3.ghgReductionTargetScope2,
          ghg_reduction_target_scope3: formData.bp3.ghgReductionTargetScope3,
          ghg_reduction_target_year: formData.bp3.ghgReductionTargetYear,
          ghg_reduction_baseline_year: formData.bp3.ghgReductionBaselineYear
        }, sectionNeedsSaving.bp3);
        
        success = success && bp3Success;
      }
      
      // BP4
      if (sectionNeedsSaving.bp4 && formData.bp4) {
        const bp4Success = await upsertData('bp4_transition_plan', {
          has_transition_plan: formData.bp4.hasTransitionPlan,
          transition_plan_details: formData.bp4.transitionPlanDetails
        }, sectionNeedsSaving.bp4);
        
        success = success && bp4Success;
      }
      
      // BP5
      if (sectionNeedsSaving.bp5 && formData.bp5) {
        const bp5Success = await upsertData('bp5_physical_risks', {
          has_physical_climate_risks: formData.bp5.hasPhysicalClimateRisks,
          assets_at_risk_amount: formData.bp5.assetsAtRiskAmount,
          assets_at_risk_percentage: formData.bp5.assetsAtRiskPercentage,
          adaptation_coverage: formData.bp5.adaptationCoverage,
          revenue_at_risk_percentage: formData.bp5.revenueAtRiskPercentage,
          risk_assets_location: formData.bp5.riskAssetsLocation,
          real_estate_energy_efficiency: formData.bp5.realEstateEnergyEfficiency
        }, sectionNeedsSaving.bp5);
        
        success = success && bp5Success;
      }
      
      // BP6
      if (sectionNeedsSaving.bp6 && formData.bp6) {
        const bp6Success = await upsertData('bp6_hazardous_waste', {
          has_hazardous_waste: formData.bp6.hasHazardousWaste,
          hazardous_waste_total: formData.bp6.hazardousWasteTotal,
          radioactive_waste_total: formData.bp6.radioactiveWasteTotal
        }, sectionNeedsSaving.bp6);
        
        success = success && bp6Success;
      }
      
      // BP7
      if (sectionNeedsSaving.bp7 && formData.bp7) {
        const bp7Success = await upsertData('bp7_policy_alignment', {
          has_policies_aligned: formData.bp7.hasPoliciesAligned,
          aligned_instruments: formData.bp7.alignedInstruments
        }, sectionNeedsSaving.bp7);
        
        success = success && bp7Success;
      }
      
      // BP8
      if (sectionNeedsSaving.bp8 && formData.bp8) {
        const bp8Success = await upsertData('bp8_compliance_processes', {
          has_compliance_processes: formData.bp8.hasComplianceProcesses,
          compliance_processes_details: formData.bp8.complianceProcessesDetails
        }, sectionNeedsSaving.bp8);
        
        success = success && bp8Success;
      }
      
      // BP9
      if (sectionNeedsSaving.bp9 && formData.bp9) {
        const bp9Success = await upsertData('bp9_violations', {
          has_violations: formData.bp9.hasViolations,
          violations_details: formData.bp9.violationsDetails
        }, sectionNeedsSaving.bp9);
        
        success = success && bp9Success;
      }
      
      // BP10
      if (sectionNeedsSaving.bp10 && formData.bp10) {
        const bp10Success = await upsertData('bp10_work_life_balance', {
          male_family_leave_eligible: formData.bp10.maleFamilyLeaveEligible,
          female_family_leave_eligible: formData.bp10.femaleFamilyLeaveEligible,
          male_family_leave_used: formData.bp10.maleFamilyLeaveUsed,
          female_family_leave_used: formData.bp10.femaleFamilyLeaveUsed
        }, sectionNeedsSaving.bp10);
        
        success = success && bp10Success;
      }
      
      // BP11
      if (sectionNeedsSaving.bp11 && formData.bp11) {
        const bp11Success = await upsertData('bp11_apprentices', {
          has_apprentices: formData.bp11.hasApprentices,
          apprentices_number: formData.bp11.apprenticesNumber,
          apprentices_percentage: formData.bp11.apprenticesPercentage
        }, sectionNeedsSaving.bp11);
        
        success = success && bp11Success;
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
        toast.success("Tutti i dati sui partner commerciali sono stati salvati con successo");
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
  };

  // Individual section change triggers
  useEffect(() => {
    if (!isLoading) {
      setSectionNeedsSaving(prev => ({
        ...prev,
        bp1: true
      }));
      setNeedsSaving(true);
    }
  }, [formData.bp1]);
  
  useEffect(() => {
    if (!isLoading) {
      setSectionNeedsSaving(prev => ({
        ...prev,
        bp2: true
      }));
      setNeedsSaving(true);
    }
  }, [formData.bp2]);
  
  useEffect(() => {
    if (!isLoading) {
      setSectionNeedsSaving(prev => ({
        ...prev,
        bp3: true
      }));
      setNeedsSaving(true);
    }
  }, [formData.bp3]);
  
  useEffect(() => {
    if (!isLoading) {
      setSectionNeedsSaving(prev => ({
        ...prev,
        bp4: true
      }));
      setNeedsSaving(true);
    }
  }, [formData.bp4]);
  
  useEffect(() => {
    if (!isLoading) {
      setSectionNeedsSaving(prev => ({
        ...prev,
        bp5: true
      }));
      setNeedsSaving(true);
    }
  }, [formData.bp5]);
  
  useEffect(() => {
    if (!isLoading) {
      setSectionNeedsSaving(prev => ({
        ...prev,
        bp6: true
      }));
      setNeedsSaving(true);
    }
  }, [formData.bp6]);
  
  useEffect(() => {
    if (!isLoading) {
      setSectionNeedsSaving(prev => ({
        ...prev,
        bp7: true
      }));
      setNeedsSaving(true);
    }
  }, [formData.bp7]);
  
  useEffect(() => {
    if (!isLoading) {
      setSectionNeedsSaving(prev => ({
        ...prev,
        bp8: true
      }));
      setNeedsSaving(true);
    }
  }, [formData.bp8]);
  
  useEffect(() => {
    if (!isLoading) {
      setSectionNeedsSaving(prev => ({
        ...prev,
        bp9: true
      }));
      setNeedsSaving(true);
    }
  }, [formData.bp9]);
  
  useEffect(() => {
    if (!isLoading) {
      setSectionNeedsSaving(prev => ({
        ...prev,
        bp10: true
      }));
      setNeedsSaving(true);
    }
  }, [formData.bp10]);
  
  useEffect(() => {
    if (!isLoading) {
      setSectionNeedsSaving(prev => ({
        ...prev,
        bp11: true
      }));
      setNeedsSaving(true);
    }
  }, [formData.bp11]);

  return {
    data: formData,
    updateData: setFormData,
    isLoading,
    saveAll: saveData,
    lastSaved,
    needsSaving
  };
};
