
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BiodiversityLandUseData {
  currentTotalLandUse: number | null;
  currentImpermeableSurface: number | null;
  currentNatureSurfaceOnsite: number | null;
  currentNatureSurfaceOffsite: number | null;
  previousTotalLandUse: number | null;
  previousImpermeableSurface: number | null;
  previousNatureSurfaceOnsite: number | null;
  previousNatureSurfaceOffsite: number | null;
  sensitiveSitesDetails: string;
  areaUnit: string;
}

interface UseBiodiversityLandUseProps {
  reportId: string | undefined;
}

export const useBiodiversityLandUse = ({ reportId }: UseBiodiversityLandUseProps) => {
  const [data, setData] = useState<BiodiversityLandUseData>({
    currentTotalLandUse: null,
    currentImpermeableSurface: null,
    currentNatureSurfaceOnsite: null,
    currentNatureSurfaceOffsite: null,
    previousTotalLandUse: null,
    previousImpermeableSurface: null,
    previousNatureSurfaceOnsite: null,
    previousNatureSurfaceOffsite: null,
    sensitiveSitesDetails: '',
    areaUnit: 'ha'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Calculate percentage changes
  const calculatePercentageChanges = () => {
    const changes = {
      totalLandUseChange: calculateChange(data.previousTotalLandUse, data.currentTotalLandUse),
      impermeableSurfaceChange: calculateChange(data.previousImpermeableSurface, data.currentImpermeableSurface),
      natureSurfaceOnsiteChange: calculateChange(data.previousNatureSurfaceOnsite, data.currentNatureSurfaceOnsite),
      natureSurfaceOffsiteChange: calculateChange(data.previousNatureSurfaceOffsite, data.currentNatureSurfaceOffsite),
    };
    return changes;
  };

  const calculateChange = (previous: number | null, current: number | null): number | null => {
    if (previous === null || current === null || previous === 0) return null;
    return ((current - previous) / previous) * 100;
  };

  // Load biodiversity data from database
  useEffect(() => {
    if (reportId) {
      loadData();
    }
  }, [reportId]);

  // Load data from Supabase
  const loadData = async () => {
    if (!reportId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('biodiversity_land_use')
        .select('*')
        .eq('report_id', reportId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "row not found" error
        throw error;
      }
      
      if (data) {
        setData({
          currentTotalLandUse: data.current_total_land_use,
          currentImpermeableSurface: data.current_impermeable_surface,
          currentNatureSurfaceOnsite: data.current_nature_surface_onsite,
          currentNatureSurfaceOffsite: data.current_nature_surface_offsite,
          previousTotalLandUse: data.previous_total_land_use,
          previousImpermeableSurface: data.previous_impermeable_surface,
          previousNatureSurfaceOnsite: data.previous_nature_surface_onsite,
          previousNatureSurfaceOffsite: data.previous_nature_surface_offsite,
          sensitiveSitesDetails: data.sensitive_sites_details || '',
          areaUnit: data.area_unit || 'ha'
        });
      }
    } catch (error) {
      console.error('Error loading biodiversity land use data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save data to Supabase
  const saveData = async (newData: BiodiversityLandUseData): Promise<boolean> => {
    if (!reportId) return false;
    
    setIsSaving(true);
    try {
      // Check if record exists
      const { data: existingData } = await supabase
        .from('biodiversity_land_use')
        .select('id')
        .eq('report_id', reportId)
        .single();
      
      let result;
      
      if (existingData) {
        // Update existing record
        result = await supabase
          .from('biodiversity_land_use')
          .update({
            current_total_land_use: newData.currentTotalLandUse,
            current_impermeable_surface: newData.currentImpermeableSurface,
            current_nature_surface_onsite: newData.currentNatureSurfaceOnsite,
            current_nature_surface_offsite: newData.currentNatureSurfaceOffsite,
            previous_total_land_use: newData.previousTotalLandUse,
            previous_impermeable_surface: newData.previousImpermeableSurface,
            previous_nature_surface_onsite: newData.previousNatureSurfaceOnsite,
            previous_nature_surface_offsite: newData.previousNatureSurfaceOffsite,
            sensitive_sites_details: newData.sensitiveSitesDetails,
            area_unit: newData.areaUnit,
            updated_at: new Date().toISOString()
          })
          .eq('report_id', reportId);
      } else {
        // Insert new record
        result = await supabase
          .from('biodiversity_land_use')
          .insert({
            report_id: reportId,
            current_total_land_use: newData.currentTotalLandUse,
            current_impermeable_surface: newData.currentImpermeableSurface,
            current_nature_surface_onsite: newData.currentNatureSurfaceOnsite,
            current_nature_surface_offsite: newData.currentNatureSurfaceOffsite,
            previous_total_land_use: newData.previousTotalLandUse,
            previous_impermeable_surface: newData.previousImpermeableSurface,
            previous_nature_surface_onsite: newData.previousNatureSurfaceOnsite,
            previous_nature_surface_offsite: newData.previousNatureSurfaceOffsite,
            sensitive_sites_details: newData.sensitiveSitesDetails,
            area_unit: newData.areaUnit
          });
      }
      
      if (result.error) throw result.error;
      
      // Update local state
      setData(newData);
      
      toast({
        title: "Salvato con successo",
        description: "I dati sulla biodiversità e l'uso del suolo sono stati salvati",
      });
      
      return true;
    } catch (error) {
      console.error('Error saving biodiversity land use data:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio dei dati",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Handle field updates
  const updateField = (field: keyof BiodiversityLandUseData, value: any) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    data,
    isLoading,
    isSaving,
    saveData,
    updateField,
    percentageChanges: calculatePercentageChanges()
  };
};
