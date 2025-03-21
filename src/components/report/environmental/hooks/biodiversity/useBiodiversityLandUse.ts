
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useReport } from '@/hooks/use-report-context';

interface UseBiodiversityLandUseProps {
  reportId: string | undefined;
}

export interface BiodiversityData {
  previous_total_land_use: number | null;
  previous_nature_surface_onsite: number | null;
  previous_nature_surface_offsite: number | null;
  previous_impermeable_surface: number | null;
  current_total_land_use: number | null;
  current_nature_surface_onsite: number | null;
  current_nature_surface_offsite: number | null;
  current_impermeable_surface: number | null;
  sensitiveSitesDetails: string | null;
  areaUnit: string;
}

export const useBiodiversityLandUse = ({ reportId }: UseBiodiversityLandUseProps) => {
  const [data, setData] = useState<BiodiversityData>({
    previous_total_land_use: null,
    previous_nature_surface_onsite: null,
    previous_nature_surface_offsite: null,
    previous_impermeable_surface: null,
    current_total_land_use: null,
    current_nature_surface_onsite: null,
    current_nature_surface_offsite: null,
    current_impermeable_surface: null,
    sensitiveSitesDetails: null,
    areaUnit: 'ha'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();
  const { setLastSaved: setGlobalLastSaved } = useReport();
  
  // Calculate percentage changes
  const percentageChanges = {
    total: calculatePercentageChange(
      data.previous_total_land_use, 
      data.current_total_land_use
    ),
    natureOnsite: calculatePercentageChange(
      data.previous_nature_surface_onsite, 
      data.current_nature_surface_onsite
    ),
    natureOffsite: calculatePercentageChange(
      data.previous_nature_surface_offsite, 
      data.current_nature_surface_offsite
    ),
    impermeable: calculatePercentageChange(
      data.previous_impermeable_surface, 
      data.current_impermeable_surface
    )
  };
  
  // Load biodiversity data on component mount
  useEffect(() => {
    if (reportId) {
      loadBiodiversityData();
    }
  }, [reportId]);
  
  const loadBiodiversityData = async () => {
    if (!reportId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('biodiversity_land_use')
        .select(`
          previous_total_land_use,
          previous_nature_surface_onsite,
          previous_nature_surface_offsite,
          previous_impermeable_surface,
          current_total_land_use,
          current_nature_surface_onsite,
          current_nature_surface_offsite,
          current_impermeable_surface,
          sensitive_sites_details,
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
          previous_total_land_use: data.previous_total_land_use,
          previous_nature_surface_onsite: data.previous_nature_surface_onsite,
          previous_nature_surface_offsite: data.previous_nature_surface_offsite,
          previous_impermeable_surface: data.previous_impermeable_surface,
          current_total_land_use: data.current_total_land_use,
          current_nature_surface_onsite: data.current_nature_surface_onsite,
          current_nature_surface_offsite: data.current_nature_surface_offsite,
          current_impermeable_surface: data.current_impermeable_surface,
          sensitiveSitesDetails: data.sensitive_sites_details,
          areaUnit: data.area_unit || 'ha'
        });
        
        if (data.updated_at) {
          setLastSaved(new Date(data.updated_at));
        }
      }
    } catch (error) {
      console.error('Error loading biodiversity data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveData = async (newData: BiodiversityData): Promise<boolean> => {
    if (!reportId) return false;
    
    setIsSaving(true);
    try {
      const now = new Date();
      const isoDate = now.toISOString();
      
      // Check if record exists
      const { data: existingData } = await supabase
        .from('biodiversity_land_use')
        .select('id')
        .eq('report_id', reportId)
        .maybeSingle();
      
      let result;
      
      if (existingData) {
        // Update existing record
        result = await supabase
          .from('biodiversity_land_use')
          .update({
            previous_total_land_use: newData.previous_total_land_use,
            previous_nature_surface_onsite: newData.previous_nature_surface_onsite,
            previous_nature_surface_offsite: newData.previous_nature_surface_offsite,
            previous_impermeable_surface: newData.previous_impermeable_surface,
            current_total_land_use: newData.current_total_land_use,
            current_nature_surface_onsite: newData.current_nature_surface_onsite,
            current_nature_surface_offsite: newData.current_nature_surface_offsite,
            current_impermeable_surface: newData.current_impermeable_surface,
            sensitive_sites_details: newData.sensitiveSitesDetails,
            area_unit: newData.areaUnit,
            updated_at: isoDate
          })
          .eq('report_id', reportId);
      } else {
        // Insert new record
        result = await supabase
          .from('biodiversity_land_use')
          .insert({
            report_id: reportId,
            previous_total_land_use: newData.previous_total_land_use,
            previous_nature_surface_onsite: newData.previous_nature_surface_onsite,
            previous_nature_surface_offsite: newData.previous_nature_surface_offsite,
            previous_impermeable_surface: newData.previous_impermeable_surface,
            current_total_land_use: newData.current_total_land_use,
            current_nature_surface_onsite: newData.current_nature_surface_onsite,
            current_nature_surface_offsite: newData.current_nature_surface_offsite,
            current_impermeable_surface: newData.current_impermeable_surface,
            sensitive_sites_details: newData.sensitiveSitesDetails,
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
        description: "I dati sulla biodiversità sono stati salvati",
      });
      
      return true;
    } catch (error) {
      console.error('Error saving biodiversity data:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio dei dati sulla biodiversità",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  const updateField = (field: keyof BiodiversityData, value: any) => {
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
