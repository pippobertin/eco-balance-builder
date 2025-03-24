
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { EnvironmentalMetrics } from '@/context/types';
import { LocationEnvironmentalMetrics } from './types';

export const useLocationData = (reportId: string) => {
  const [locations, setLocations] = useState<LocationEnvironmentalMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [environmentalMetrics, setEnvironmentalMetrics] = useState<EnvironmentalMetrics>({});

  const loadLocations = useCallback(async () => {
    if (!reportId) return;
    
    try {
      setIsLoading(true);
      console.log("Loading location metrics for report:", reportId);
      
      const { data, error } = await supabase
        .from('location_metrics')
        .select('*')
        .eq('report_id', reportId);
      
      if (error) {
        console.error("Error loading location metrics:", error);
        throw error;
      }
      
      if (data && data.length > 0) {
        console.log("Location metrics loaded:", data.length, "locations");
        
        const formattedLocations: LocationEnvironmentalMetrics[] = data.map(loc => ({
          locationId: loc.location_id,
          locationName: loc.location_name,
          locationType: loc.location_type,
          metrics: loc.metrics || {}
        }));
        
        setLocations(formattedLocations);
      } else {
        console.log("No location metrics found for report:", reportId);
        setLocations([]);
      }
      
    } catch (error) {
      console.error("Error in loadLocations:", error);
      toast.error("Errore nel caricamento delle metriche per località");
    } finally {
      setIsLoading(false);
    }
  }, [reportId]);
  
  // Load locations when component mounts or reportId changes
  useEffect(() => {
    loadLocations();
  }, [loadLocations, reportId]);

  // Save location metrics to Supabase
  const saveLocations = useCallback(async (): Promise<boolean> => {
    if (!reportId || locations.length === 0) {
      console.log("No reportId or locations to save");
      return false;
    }
    
    try {
      setIsLoading(true);
      
      console.log("Saving location metrics for report:", reportId, "Locations:", locations.length);
      
      // First, delete all existing location metrics for this report
      const { error: deleteError } = await supabase
        .from('location_metrics')
        .delete()
        .eq('report_id', reportId);
      
      if (deleteError) {
        console.error("Error deleting existing location metrics:", deleteError);
        throw deleteError;
      }
      
      // Then, insert all current locations
      const locationsToInsert = locations.map(loc => ({
        report_id: reportId,
        location_id: loc.locationId,
        location_name: loc.locationName,
        location_type: loc.locationType,
        metrics: loc.metrics
      }));
      
      console.log("Inserting locations:", locationsToInsert.length);
      
      const { error: insertError } = await supabase
        .from('location_metrics')
        .insert(locationsToInsert);
      
      if (insertError) {
        console.error("Error inserting location metrics:", insertError);
        throw insertError;
      }
      
      console.log("Location metrics saved successfully");
      toast.success("Metriche per località salvate con successo");
      
      // Now update the main report's environmental_metrics to include locationMetrics
      const updatedMetrics = {
        ...environmentalMetrics,
        locationMetrics: locations
      };
      
      setEnvironmentalMetrics(updatedMetrics);
      
      const { error: reportError } = await supabase
        .from('reports')
        .update({
          environmental_metrics: updatedMetrics,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);
      
      if (reportError) {
        console.error("Error updating report with location metrics:", reportError);
        throw reportError;
      }
      
      return true;
    } catch (error) {
      console.error("Error in saveLocations:", error);
      toast.error("Errore nel salvataggio delle metriche per località");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [reportId, locations, environmentalMetrics]);

  return {
    locations,
    setLocations,
    loadLocations,
    saveLocations,
    isLoading,
    environmentalMetrics,
    setEnvironmentalMetrics
  };
};
