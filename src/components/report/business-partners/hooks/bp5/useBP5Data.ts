
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BP5FormData } from '../types';
import { BP5HookResult } from './types';

export const useBP5Data = (reportId: string): BP5HookResult => {
  const [formData, setFormData] = useState<BP5FormData>({
    hasPhysicalClimateRisks: false,
    assetsAtRiskAmount: undefined,
    assetsAtRiskPercentage: undefined,
    adaptationCoverage: undefined,
    revenueAtRiskPercentage: undefined,
    riskAssetsLocation: undefined,
    realEstateEnergyEfficiency: undefined
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [needsSaving, setNeedsSaving] = useState(false);

  // Load data from database
  useEffect(() => {
    const fetchData = async () => {
      if (!reportId) return;
      
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('bp5_physical_risks')
          .select('*')
          .eq('report_id', reportId)
          .maybeSingle();
          
        if (error) {
          if (error.code !== 'PGRST116') { // Not found error is expected for new reports
            console.error("Error fetching BP5 data:", error);
          }
        } else if (data) {
          setFormData({
            hasPhysicalClimateRisks: data.has_physical_climate_risks,
            assetsAtRiskAmount: data.assets_at_risk_amount,
            assetsAtRiskPercentage: data.assets_at_risk_percentage,
            adaptationCoverage: data.adaptation_coverage,
            revenueAtRiskPercentage: data.revenue_at_risk_percentage,
            riskAssetsLocation: data.risk_assets_location,
            realEstateEnergyEfficiency: data.real_estate_energy_efficiency
          });
          setLastSaved(new Date(data.updated_at));
        }
      } catch (error) {
        console.error("Unexpected error fetching BP5 data:", error);
        toast.error("Errore nel caricamento dei dati sui rischi fisici climatici");
      } finally {
        setIsLoading(false);
        setNeedsSaving(false);
      }
    };

    fetchData();
  }, [reportId]);

  // Update needsSaving state when form data changes
  useEffect(() => {
    if (!isLoading) {
      setNeedsSaving(true);
    }
  }, [formData, isLoading]);

  // Save data to the database
  const saveData = async (): Promise<boolean> => {
    if (!reportId) return false;
    
    setIsLoading(true);
    
    try {
      const now = new Date();
      
      // Check if record already exists
      const { data: existingData, error: checkError } = await supabase
        .from('bp5_physical_risks')
        .select('id')
        .eq('report_id', reportId);
        
      if (checkError) {
        console.error("Error checking for existing BP5 record:", checkError);
        throw checkError;
      }
      
      let result;
      
      if (existingData && existingData.length > 0) {
        // Update existing record
        result = await supabase
          .from('bp5_physical_risks')
          .update({
            has_physical_climate_risks: formData.hasPhysicalClimateRisks,
            assets_at_risk_amount: formData.assetsAtRiskAmount,
            assets_at_risk_percentage: formData.assetsAtRiskPercentage,
            adaptation_coverage: formData.adaptationCoverage,
            revenue_at_risk_percentage: formData.revenueAtRiskPercentage,
            risk_assets_location: formData.riskAssetsLocation,
            real_estate_energy_efficiency: formData.realEstateEnergyEfficiency,
            updated_at: now.toISOString()
          })
          .eq('report_id', reportId);
      } else {
        // Insert new record
        result = await supabase
          .from('bp5_physical_risks')
          .insert({
            report_id: reportId,
            has_physical_climate_risks: formData.hasPhysicalClimateRisks,
            assets_at_risk_amount: formData.assetsAtRiskAmount,
            assets_at_risk_percentage: formData.assetsAtRiskPercentage,
            adaptation_coverage: formData.adaptationCoverage,
            revenue_at_risk_percentage: formData.revenueAtRiskPercentage,
            risk_assets_location: formData.riskAssetsLocation,
            real_estate_energy_efficiency: formData.realEstateEnergyEfficiency,
            updated_at: now.toISOString()
          });
      }
      
      if (result.error) {
        console.error("Error saving BP5 data:", result.error);
        toast.error("Errore nel salvataggio dei dati sui rischi fisici climatici");
        return false;
      }
      
      setLastSaved(now);
      setNeedsSaving(false);
      toast.success("Dati sui rischi fisici climatici salvati con successo");
      return true;
    } catch (error) {
      console.error("Unexpected error saving BP5 data:", error);
      toast.error("Errore nel salvataggio dei dati sui rischi fisici climatici");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    isLoading,
    saveData,
    lastSaved,
    needsSaving
  };
};
