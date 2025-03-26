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
        // BP1
        const { data: bp1Data, error: bp1Error } = await supabase
          .from('bp1_revenue_sectors')
          .select('*')
          .eq('report_id', reportId)
          .single();
          
        if (!bp1Error && bp1Data) {
          setFormData(prev => ({
            ...prev,
            bp1: {
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
            }
          }));
          
          const updateDate = new Date(bp1Data.updated_at);
          if (updateDate > latestSaved) {
            latestSaved.setTime(updateDate.getTime());
          }
        }
        
        // BP2
        const { data: bp2Data, error: bp2Error } = await supabase
          .from('bp2_gender_diversity')
          .select('*')
          .eq('report_id', reportId)
          .single();
          
        if (!bp2Error && bp2Data) {
          setFormData(prev => ({
            ...prev,
            bp2: {
              maleGovernanceMembers: bp2Data.male_governance_members,
              femaleGovernanceMembers: bp2Data.female_governance_members,
              otherGenderGovernanceMembers: bp2Data.other_gender_governance_members,
              genderDiversityIndex: bp2Data.gender_diversity_index
            }
          }));
          
          const updateDate = new Date(bp2Data.updated_at);
          if (updateDate > latestSaved) {
            latestSaved.setTime(updateDate.getTime());
          }
        }
        
        // BP3
        const { data: bp3Data, error: bp3Error } = await supabase
          .from('bp3_ghg_targets')
          .select('*')
          .eq('report_id', reportId)
          .single();
          
        if (!bp3Error && bp3Data) {
          setFormData(prev => ({
            ...prev,
            bp3: {
              hasGhgReductionTargets: bp3Data.has_ghg_reduction_targets,
              ghgReductionTargetScope1: bp3Data.ghg_reduction_target_scope1,
              ghgReductionTargetScope2: bp3Data.ghg_reduction_target_scope2,
              ghgReductionTargetScope3: bp3Data.ghg_reduction_target_scope3,
              ghgReductionTargetYear: bp3Data.ghg_reduction_target_year,
              ghgReductionBaselineYear: bp3Data.ghg_reduction_baseline_year
            }
          }));
          
          const updateDate = new Date(bp3Data.updated_at);
          if (updateDate > latestSaved) {
            latestSaved.setTime(updateDate.getTime());
          }
        }
        
        // BP4
        const { data: bp4Data, error: bp4Error } = await supabase
          .from('bp4_transition_plan')
          .select('*')
          .eq('report_id', reportId)
          .single();
          
        if (!bp4Error && bp4Data) {
          setFormData(prev => ({
            ...prev,
            bp4: {
              hasTransitionPlan: bp4Data.has_transition_plan,
              transitionPlanDetails: bp4Data.transition_plan_details
            }
          }));
          
          const updateDate = new Date(bp4Data.updated_at);
          if (updateDate > latestSaved) {
            latestSaved.setTime(updateDate.getTime());
          }
        }
        
        // BP5
        const { data: bp5Data, error: bp5Error } = await supabase
          .from('bp5_physical_risks')
          .select('*')
          .eq('report_id', reportId)
          .single();
          
        if (!bp5Error && bp5Data) {
          setFormData(prev => ({
            ...prev,
            bp5: {
              hasPhysicalClimateRisks: bp5Data.has_physical_climate_risks,
              assetsAtRiskAmount: bp5Data.assets_at_risk_amount,
              assetsAtRiskPercentage: bp5Data.assets_at_risk_percentage,
              adaptationCoverage: bp5Data.adaptation_coverage,
              revenueAtRiskPercentage: bp5Data.revenue_at_risk_percentage,
              riskAssetsLocation: bp5Data.risk_assets_location,
              realEstateEnergyEfficiency: bp5Data.real_estate_energy_efficiency
            }
          }));
          
          const updateDate = new Date(bp5Data.updated_at);
          if (updateDate > latestSaved) {
            latestSaved.setTime(updateDate.getTime());
          }
        }
        
        // BP6
        const { data: bp6Data, error: bp6Error } = await supabase
          .from('bp6_hazardous_waste')
          .select('*')
          .eq('report_id', reportId)
          .single();
          
        if (!bp6Error && bp6Data) {
          setFormData(prev => ({
            ...prev,
            bp6: {
              hasHazardousWaste: bp6Data.has_hazardous_waste,
              hazardousWasteTotal: bp6Data.hazardous_waste_total,
              radioactiveWasteTotal: bp6Data.radioactive_waste_total
            }
          }));
          
          const updateDate = new Date(bp6Data.updated_at);
          if (updateDate > latestSaved) {
            latestSaved.setTime(updateDate.getTime());
          }
        }
        
        // BP7
        const { data: bp7Data, error: bp7Error } = await supabase
          .from('bp7_policy_alignment')
          .select('*')
          .eq('report_id', reportId)
          .single();
          
        if (!bp7Error && bp7Data) {
          setFormData(prev => ({
            ...prev,
            bp7: {
              hasPoliciesAligned: bp7Data.has_policies_aligned,
              alignedInstruments: bp7Data.aligned_instruments
            }
          }));
          
          const updateDate = new Date(bp7Data.updated_at);
          if (updateDate > latestSaved) {
            latestSaved.setTime(updateDate.getTime());
          }
        }
        
        // BP8
        const { data: bp8Data, error: bp8Error } = await supabase
          .from('bp8_compliance_processes')
          .select('*')
          .eq('report_id', reportId)
          .single();
          
        if (!bp8Error && bp8Data) {
          setFormData(prev => ({
            ...prev,
            bp8: {
              hasComplianceProcesses: bp8Data.has_compliance_processes,
              complianceProcessesDetails: bp8Data.compliance_processes_details
            }
          }));
          
          const updateDate = new Date(bp8Data.updated_at);
          if (updateDate > latestSaved) {
            latestSaved.setTime(updateDate.getTime());
          }
        }
        
        // BP9
        const { data: bp9Data, error: bp9Error } = await supabase
          .from('bp9_violations')
          .select('*')
          .eq('report_id', reportId)
          .single();
          
        if (!bp9Error && bp9Data) {
          setFormData(prev => ({
            ...prev,
            bp9: {
              hasViolations: bp9Data.has_violations,
              violationsDetails: bp9Data.violations_details
            }
          }));
          
          const updateDate = new Date(bp9Data.updated_at);
          if (updateDate > latestSaved) {
            latestSaved.setTime(updateDate.getTime());
          }
        }
        
        // BP10
        const { data: bp10Data, error: bp10Error } = await supabase
          .from('bp10_work_life_balance')
          .select('*')
          .eq('report_id', reportId)
          .single();
          
        if (!bp10Error && bp10Data) {
          setFormData(prev => ({
            ...prev,
            bp10: {
              maleFamilyLeaveEligible: bp10Data.male_family_leave_eligible,
              femaleFamilyLeaveEligible: bp10Data.female_family_leave_eligible,
              maleFamilyLeaveUsed: bp10Data.male_family_leave_used,
              femaleFamilyLeaveUsed: bp10Data.female_family_leave_used
            }
          }));
          
          const updateDate = new Date(bp10Data.updated_at);
          if (updateDate > latestSaved) {
            latestSaved.setTime(updateDate.getTime());
          }
        }
        
        // BP11
        const { data: bp11Data, error: bp11Error } = await supabase
          .from('bp11_apprentices')
          .select('*')
          .eq('report_id', reportId)
          .single();
          
        if (!bp11Error && bp11Data) {
          setFormData(prev => ({
            ...prev,
            bp11: {
              hasApprentices: bp11Data.has_apprentices,
              apprenticesNumber: bp11Data.apprentices_number,
              apprenticesPercentage: bp11Data.apprentices_percentage
            }
          }));
          
          const updateDate = new Date(bp11Data.updated_at);
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
      if (sectionNeedsSaving.bp1 && formData.bp1) {
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
        }
      }
      
      if (sectionNeedsSaving.bp2 && formData.bp2) {
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
        }
      }
      
      if (sectionNeedsSaving.bp3 && formData.bp3) {
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
        }
      }
      
      if (sectionNeedsSaving.bp4 && formData.bp4) {
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
        }
      }
      
      if (sectionNeedsSaving.bp5 && formData.bp5) {
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
        }
      }
      
      if (sectionNeedsSaving.bp6 && formData.bp6) {
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
        }
      }
      
      if (sectionNeedsSaving.bp7 && formData.bp7) {
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
        }
      }
      
      if (sectionNeedsSaving.bp8 && formData.bp8) {
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
        }
      }
      
      if (sectionNeedsSaving.bp9 && formData.bp9) {
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
        }
      }
      
      if (sectionNeedsSaving.bp10 && formData.bp10) {
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
        }
      }
      
      if (sectionNeedsSaving.bp11 && formData.bp11) {
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
  };

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
