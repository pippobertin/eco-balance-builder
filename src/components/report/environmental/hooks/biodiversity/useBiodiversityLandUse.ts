
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BiodiversityLandUseData {
  id?: string;
  report_id: string;
  
  // Current year data
  current_impermeable_surface: number | null;
  current_nature_surface_onsite: number | null;
  current_nature_surface_offsite: number | null;
  current_total_land_use: number | null;
  
  // Previous year data
  previous_impermeable_surface: number | null;
  previous_nature_surface_onsite: number | null;
  previous_nature_surface_offsite: number | null;
  previous_total_land_use: number | null;
  
  // Additional data
  area_unit: string;
  sensitive_sites_details: string | null;
}

interface UseBiodiversityLandUseProps {
  reportId: string | undefined;
}

export const useBiodiversityLandUse = ({ reportId }: UseBiodiversityLandUseProps) => {
  const { toast } = useToast();
  const [data, setData] = useState<BiodiversityLandUseData>({
    report_id: reportId || '',
    current_impermeable_surface: null,
    current_nature_surface_onsite: null,
    current_nature_surface_offsite: null,
    current_total_land_use: null,
    previous_impermeable_surface: null,
    previous_nature_surface_onsite: null,
    previous_nature_surface_offsite: null,
    previous_total_land_use: null,
    area_unit: 'ha',
    sensitive_sites_details: null
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Load data on component mount
  useEffect(() => {
    if (reportId) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [reportId]);
  
  const loadData = async () => {
    if (!reportId) return;
    
    setIsLoading(true);
    try {
      const { data: result, error } = await supabase
        .from('biodiversity_land_use')
        .select('*')
        .eq('report_id', reportId)
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') { // Record not found
          console.error('Error loading biodiversity data:', error);
          toast({
            title: 'Errore',
            description: 'Si è verificato un errore durante il caricamento dei dati sulla biodiversità',
            variant: 'destructive',
          });
        }
      } else if (result) {
        setData(result);
        setLastSaved(new Date(result.updated_at));
      }
    } catch (error) {
      console.error('Error in loadData:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const calculateChanges = () => {
    // Calculate percentage changes between current and previous year
    const calculatePercentChange = (current: number | null, previous: number | null): number | null => {
      if (current === null || previous === null || previous === 0) return null;
      return ((current - previous) / previous) * 100;
    };
    
    return {
      impermeable_surface_change: calculatePercentChange(data.current_impermeable_surface, data.previous_impermeable_surface),
      nature_surface_onsite_change: calculatePercentChange(data.current_nature_surface_onsite, data.previous_nature_surface_onsite),
      nature_surface_offsite_change: calculatePercentChange(data.current_nature_surface_offsite, data.previous_nature_surface_offsite),
      total_land_use_change: calculatePercentChange(data.current_total_land_use, data.previous_total_land_use)
    };
  };
  
  const handleInputChange = (
    field: keyof BiodiversityLandUseData, 
    value: string | number | null, 
    isNumberField: boolean = false
  ) => {
    let processedValue = value;
    
    // Convert string to number for number fields
    if (isNumberField && typeof value === 'string') {
      // Replace comma with dot for decimal input
      const normalizedValue = value.replace(',', '.');
      processedValue = normalizedValue === '' ? null : parseFloat(normalizedValue);
      
      // Check if the parsed value is a valid number
      if (processedValue !== null && isNaN(processedValue as number)) {
        console.warn(`Invalid number input for ${field}:`, value);
        return; // Don't update state with invalid number
      }
    }
    
    setData(prev => ({ ...prev, [field]: processedValue }));
  };
  
  const saveData = async (): Promise<boolean> => {
    if (!reportId) {
      toast({
        title: 'Errore',
        description: 'ID del report mancante. Impossibile salvare i dati.',
        variant: 'destructive',
      });
      return false;
    }
    
    setIsSaving(true);
    
    try {
      const dataToSave = {
        ...data,
        report_id: reportId,
        updated_at: new Date().toISOString()
      };
      
      let result;
      
      if (data.id) {
        // Update existing record
        const { data: updatedData, error } = await supabase
          .from('biodiversity_land_use')
          .update(dataToSave)
          .eq('id', data.id)
          .select()
          .single();
        
        if (error) throw error;
        result = updatedData;
      } else {
        // Insert new record
        const { data: insertedData, error } = await supabase
          .from('biodiversity_land_use')
          .insert(dataToSave)
          .select()
          .single();
        
        if (error) throw error;
        result = insertedData;
      }
      
      // Update local state with saved data
      setData(result);
      setLastSaved(new Date());
      
      toast({
        title: 'Dati salvati',
        description: 'I dati sulla biodiversità sono stati salvati con successo',
      });
      
      return true;
    } catch (error) {
      console.error('Error saving biodiversity data:', error);
      toast({
        title: 'Errore',
        description: 'Si è verificato un errore durante il salvataggio dei dati',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  return {
    data,
    setData,
    isLoading,
    isSaving,
    lastSaved,
    handleInputChange,
    saveData,
    calculateChanges
  };
};
