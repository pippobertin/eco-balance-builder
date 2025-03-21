
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useReport } from '@/hooks/use-report-context';

interface UseWaterMetricsProps {
  reportId: string | undefined;
}

export interface WaterMetricsData {
  current_water_withdrawal: number | null;
  current_water_consumption: number | null;
  current_water_stress_areas: number | null;
  previous_water_withdrawal: number | null;
  previous_water_consumption: number | null;
  previous_water_stress_areas: number | null;
  waterDetails: string | null;
  areaUnit: string;
}

export const useWaterMetrics = ({ reportId }: UseWaterMetricsProps) => {
  const [data, setData] = useState<WaterMetricsData>({
    current_water_withdrawal: null,
    current_water_consumption: null,
    current_water_stress_areas: null,
    previous_water_withdrawal: null,
    previous_water_consumption: null,
    previous_water_stress_areas: null,
    waterDetails: null,
    areaUnit: 'm³'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();
  const { setLastSaved: setGlobalLastSaved } = useReport();
  
  // Calculate percentage changes
  const percentageChanges = {
    withdrawal: calculatePercentageChange(
      data.previous_water_withdrawal, 
      data.current_water_withdrawal
    ),
    consumption: calculatePercentageChange(
      data.previous_water_consumption, 
      data.current_water_consumption
    ),
    stressAreas: calculatePercentageChange(
      data.previous_water_stress_areas, 
      data.current_water_stress_areas
    )
  };
  
  // Load water metrics on component mount
  useEffect(() => {
    if (reportId) {
      loadWaterMetrics();
    }
  }, [reportId]);
  
  const loadWaterMetrics = async () => {
    if (!reportId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('water_metrics')
        .select(`
          current_water_withdrawal, 
          current_water_consumption,
          current_water_stress_areas,
          previous_water_withdrawal, 
          previous_water_consumption,
          previous_water_stress_areas,
          water_details,
          area_unit,
          updated_at
        `)
        .eq('report_id', reportId)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "row not found" error
        throw error;
      }
      
      if (data) {
        setData({
          current_water_withdrawal: data.current_water_withdrawal,
          current_water_consumption: data.current_water_consumption,
          current_water_stress_areas: data.current_water_stress_areas,
          previous_water_withdrawal: data.previous_water_withdrawal,
          previous_water_consumption: data.previous_water_consumption,
          previous_water_stress_areas: data.previous_water_stress_areas,
          waterDetails: data.water_details,
          areaUnit: data.area_unit || 'm³'
        });
        
        if (data.updated_at) {
          setLastSaved(new Date(data.updated_at));
        }
      }
    } catch (error) {
      console.error('Error loading water metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveData = async (newData: WaterMetricsData): Promise<boolean> => {
    if (!reportId) return false;
    
    setIsSaving(true);
    try {
      const now = new Date();
      const isoDate = now.toISOString();
      
      // Check if record exists
      const { data: existingData } = await supabase
        .from('water_metrics')
        .select('id')
        .eq('report_id', reportId)
        .maybeSingle();
      
      let result;
      
      if (existingData) {
        // Update existing record
        result = await supabase
          .from('water_metrics')
          .update({
            current_water_withdrawal: newData.current_water_withdrawal,
            current_water_consumption: newData.current_water_consumption,
            current_water_stress_areas: newData.current_water_stress_areas,
            previous_water_withdrawal: newData.previous_water_withdrawal,
            previous_water_consumption: newData.previous_water_consumption,
            previous_water_stress_areas: newData.previous_water_stress_areas,
            water_details: newData.waterDetails,
            area_unit: newData.areaUnit,
            updated_at: isoDate
          })
          .eq('report_id', reportId);
      } else {
        // Insert new record
        result = await supabase
          .from('water_metrics')
          .insert({
            report_id: reportId,
            current_water_withdrawal: newData.current_water_withdrawal,
            current_water_consumption: newData.current_water_consumption,
            current_water_stress_areas: newData.current_water_stress_areas,
            previous_water_withdrawal: newData.previous_water_withdrawal,
            previous_water_consumption: newData.previous_water_consumption,
            previous_water_stress_areas: newData.previous_water_stress_areas,
            water_details: newData.waterDetails,
            area_unit: newData.areaUnit,
            updated_at: isoDate
          });
      }
      
      if (result.error) throw result.error;
      
      // Update state
      setData(newData);
      
      // Update both local and global timestamps
      setLastSaved(now);
      setGlobalLastSaved(now);
      
      toast({
        title: "Salvato con successo",
        description: "I dati sull'acqua sono stati salvati",
      });
      
      return true;
    } catch (error) {
      console.error('Error saving water metrics:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio dei dati sull'acqua",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  const updateField = (field: keyof WaterMetricsData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };
  
  return {
    data,
    isLoading,
    isSaving,
    saveData,
    updateField,
    percentageChanges,
    lastSaved
  };
};

// Helper function to calculate percentage change
function calculatePercentageChange(previous: number | null, current: number | null): number | null {
  if (previous === null || current === null || previous === 0) return null;
  return ((current - previous) / previous) * 100;
}
