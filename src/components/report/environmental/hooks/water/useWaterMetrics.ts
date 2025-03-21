
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WaterMetricsData {
  previousWaterWithdrawal: number | null;
  currentWaterWithdrawal: number | null;
  previousWaterConsumption: number | null;
  currentWaterConsumption: number | null;
  previousWaterStressAreas: number | null;
  currentWaterStressAreas: number | null;
  waterDetails: string;
  areaUnit: string;
}

const defaultData: WaterMetricsData = {
  previousWaterWithdrawal: null,
  currentWaterWithdrawal: null,
  previousWaterConsumption: null,
  currentWaterConsumption: null,
  previousWaterStressAreas: null,
  currentWaterStressAreas: null,
  waterDetails: '',
  areaUnit: 'm³'
};

interface WaterMetricsOptions {
  reportId?: string;
}

export const useWaterMetrics = ({ reportId }: WaterMetricsOptions) => {
  const { toast } = useToast();
  const [data, setData] = useState<WaterMetricsData>(defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Calculate percentage changes
  const percentageChanges = {
    waterWithdrawalChange: calculatePercentageChange(
      data.previousWaterWithdrawal,
      data.currentWaterWithdrawal
    ),
    waterConsumptionChange: calculatePercentageChange(
      data.previousWaterConsumption,
      data.currentWaterConsumption
    ),
    waterStressAreasChange: calculatePercentageChange(
      data.previousWaterStressAreas,
      data.currentWaterStressAreas
    )
  };

  // Load data when report ID changes
  useEffect(() => {
    if (reportId) {
      loadData(reportId);
    }
  }, [reportId]);

  // Load data from Supabase
  const loadData = async (reportId: string) => {
    setIsLoading(true);
    try {
      const { data: waterData, error } = await supabase
        .from('water_metrics')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();

      if (error) throw error;

      if (waterData) {
        setData({
          previousWaterWithdrawal: waterData.previous_water_withdrawal,
          currentWaterWithdrawal: waterData.current_water_withdrawal,
          previousWaterConsumption: waterData.previous_water_consumption,
          currentWaterConsumption: waterData.current_water_consumption,
          previousWaterStressAreas: waterData.previous_water_stress_areas,
          currentWaterStressAreas: waterData.current_water_stress_areas,
          waterDetails: waterData.water_details || '',
          areaUnit: waterData.area_unit || 'm³'
        });
        setLastSaved(new Date(waterData.updated_at));
      }
    } catch (error) {
      console.error('Error loading water metrics:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i dati sulla gestione dell'acqua",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save data to Supabase
  const saveData = async (dataToSave: WaterMetricsData): Promise<boolean> => {
    if (!reportId) {
      toast({
        title: "Errore",
        description: "Impossibile salvare i dati sulla gestione dell'acqua: ID report mancante",
        variant: "destructive"
      });
      return false;
    }

    setIsSaving(true);
    try {
      // Check if data already exists for this report
      const { data: existingData, error: checkError } = await supabase
        .from('water_metrics')
        .select('id')
        .eq('report_id', reportId)
        .maybeSingle();

      if (checkError) throw checkError;

      const dbData = {
        report_id: reportId,
        previous_water_withdrawal: dataToSave.previousWaterWithdrawal,
        current_water_withdrawal: dataToSave.currentWaterWithdrawal,
        previous_water_consumption: dataToSave.previousWaterConsumption,
        current_water_consumption: dataToSave.currentWaterConsumption,
        previous_water_stress_areas: dataToSave.previousWaterStressAreas,
        current_water_stress_areas: dataToSave.currentWaterStressAreas,
        water_details: dataToSave.waterDetails,
        area_unit: dataToSave.areaUnit
      };

      let saveError;
      if (existingData) {
        // Update existing record
        const { error } = await supabase
          .from('water_metrics')
          .update(dbData)
          .eq('id', existingData.id);
        saveError = error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('water_metrics')
          .insert(dbData);
        saveError = error;
      }

      if (saveError) throw saveError;

      setLastSaved(new Date());
      toast({
        title: "Salvato",
        description: "I dati sulla gestione dell'acqua sono stati salvati con successo"
      });
      return true;
    } catch (error) {
      console.error('Error saving water metrics:', error);
      toast({
        title: "Errore",
        description: "Impossibile salvare i dati sulla gestione dell'acqua",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Update a field in the state
  const updateField = (field: keyof WaterMetricsData, value: any) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    data,
    isLoading,
    isSaving,
    percentageChanges,
    saveData,
    updateField,
    lastSaved
  };
};

// Helper function to calculate percentage change
function calculatePercentageChange(previous: number | null, current: number | null): number | null {
  if (previous === null || current === null) return null;
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export default useWaterMetrics;
