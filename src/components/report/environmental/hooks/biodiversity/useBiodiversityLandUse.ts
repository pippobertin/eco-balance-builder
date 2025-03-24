
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useReport } from '@/hooks/use-report-context';

export interface BiodiversityLandUseData {
  previousTotalLandUse: number | null;
  currentTotalLandUse: number | null;
  previousImpermeableSurface: number | null;
  currentImpermeableSurface: number | null;
  previousNatureSurfaceOnsite: number | null;
  currentNatureSurfaceOnsite: number | null;
  previousNatureSurfaceOffsite: number | null;
  currentNatureSurfaceOffsite: number | null;
  sensitiveSitesDetails: string;
  areaUnit: string;
}

const defaultData: BiodiversityLandUseData = {
  previousTotalLandUse: null,
  currentTotalLandUse: null,
  previousImpermeableSurface: null,
  currentImpermeableSurface: null,
  previousNatureSurfaceOnsite: null,
  currentNatureSurfaceOnsite: null,
  previousNatureSurfaceOffsite: null,
  currentNatureSurfaceOffsite: null,
  sensitiveSitesDetails: '',
  areaUnit: 'ha'
};

interface BiodiversityLandUseOptions {
  reportId?: string;
}

export const useBiodiversityLandUse = ({ reportId }: BiodiversityLandUseOptions) => {
  const { setNeedsSaving, setLastSaved } = useReport();
  const [data, setData] = useState<BiodiversityLandUseData>(defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLocalLastSaved] = useState<Date | null>(null);

  // Calculate percentage changes
  const percentageChanges = {
    totalLandUseChange: calculatePercentageChange(
      data.previousTotalLandUse,
      data.currentTotalLandUse
    ),
    impermeableSurfaceChange: calculatePercentageChange(
      data.previousImpermeableSurface,
      data.currentImpermeableSurface
    ),
    natureSurfaceOnsiteChange: calculatePercentageChange(
      data.previousNatureSurfaceOnsite,
      data.currentNatureSurfaceOnsite
    ),
    natureSurfaceOffsiteChange: calculatePercentageChange(
      data.previousNatureSurfaceOffsite,
      data.currentNatureSurfaceOffsite
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
      const { data: biodiversityData, error } = await supabase
        .from('biodiversity_land_use')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();

      if (error) throw error;

      if (biodiversityData) {
        setData({
          previousTotalLandUse: biodiversityData.previous_total_land_use,
          currentTotalLandUse: biodiversityData.current_total_land_use,
          previousImpermeableSurface: biodiversityData.previous_impermeable_surface,
          currentImpermeableSurface: biodiversityData.current_impermeable_surface,
          previousNatureSurfaceOnsite: biodiversityData.previous_nature_surface_onsite,
          currentNatureSurfaceOnsite: biodiversityData.current_nature_surface_onsite,
          previousNatureSurfaceOffsite: biodiversityData.previous_nature_surface_offsite,
          currentNatureSurfaceOffsite: biodiversityData.current_nature_surface_offsite,
          sensitiveSitesDetails: biodiversityData.sensitive_sites_details || '',
          areaUnit: biodiversityData.area_unit || 'ha'
        });
        
        const savedDate = new Date(biodiversityData.updated_at);
        setLocalLastSaved(savedDate);
        setLastSaved(savedDate);
      }
    } catch (error) {
      console.error('Error loading biodiversity data:', error);
      toast.error("Errore", {
        description: "Impossibile caricare i dati sulla biodiversità"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save data to Supabase
  const saveData = async (dataToSave: BiodiversityLandUseData): Promise<boolean> => {
    if (!reportId) {
      toast.error("Errore", {
        description: "Impossibile salvare i dati sulla biodiversità: ID report mancante"
      });
      return false;
    }

    setIsSaving(true);
    try {
      // Check if data already exists for this report
      const { data: existingData, error: checkError } = await supabase
        .from('biodiversity_land_use')
        .select('id')
        .eq('report_id', reportId)
        .maybeSingle();

      if (checkError) throw checkError;

      const now = new Date();
      const dbData = {
        report_id: reportId,
        previous_total_land_use: dataToSave.previousTotalLandUse,
        current_total_land_use: dataToSave.currentTotalLandUse,
        previous_impermeable_surface: dataToSave.previousImpermeableSurface,
        current_impermeable_surface: dataToSave.currentImpermeableSurface,
        previous_nature_surface_onsite: dataToSave.previousNatureSurfaceOnsite,
        current_nature_surface_onsite: dataToSave.currentNatureSurfaceOnsite,
        previous_nature_surface_offsite: dataToSave.previousNatureSurfaceOffsite,
        current_nature_surface_offsite: dataToSave.currentNatureSurfaceOffsite,
        sensitive_sites_details: dataToSave.sensitiveSitesDetails,
        area_unit: dataToSave.areaUnit,
        updated_at: now.toISOString()
      };

      let saveError;
      if (existingData) {
        // Update existing record
        const { error } = await supabase
          .from('biodiversity_land_use')
          .update(dbData)
          .eq('id', existingData.id);
        saveError = error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('biodiversity_land_use')
          .insert(dbData);
        saveError = error;
      }

      if (saveError) throw saveError;

      setLocalLastSaved(now);
      setLastSaved(now);
      setNeedsSaving(false);
      
      toast.success("Dati sulla biodiversità salvati con successo");
      return true;
    } catch (error) {
      console.error('Error saving biodiversity data:', error);
      toast.error("Errore", {
        description: "Impossibile salvare i dati sulla biodiversità"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Update a field in the state
  const updateField = (field: keyof BiodiversityLandUseData, value: any) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
    setNeedsSaving(true);
  };

  return {
    data,
    isLoading,
    isSaving,
    percentageChanges,
    saveData,
    updateField,
    lastSaved: localLastSaved
  };
};

// Helper function to calculate percentage change
function calculatePercentageChange(previous: number | null, current: number | null): number | null {
  if (previous === null || current === null) return null;
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export default useBiodiversityLandUse;
