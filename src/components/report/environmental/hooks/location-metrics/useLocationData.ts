
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LocationEnvironmentalMetrics } from './types';
import { toast } from 'sonner';
import { useReport } from '@/hooks/use-report-context';

// Helper function to format the location name
export const formatLocationName = (name: string): string => {
  return name.trim();
};

export const useLocationData = () => {
  const [locations, setLocations] = useState<LocationEnvironmentalMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasMultipleLocations, setHasMultipleLocations] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const { currentReport, updateReportData } = useReport();

  // Load locations for the current report
  const loadLocations = useCallback(async () => {
    if (!currentReport?.id) {
      console.log("No current report ID, cannot load locations");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Loading locations for report:", currentReport.id);
      const { data, error } = await supabase
        .from('location_metrics')
        .select('*')
        .eq('report_id', currentReport.id);

      if (error) {
        console.error("Error loading locations:", error);
        toast({
          title: "Errore",
          description: "Impossibile caricare le sedi",
          variant: "destructive"
        });
        return;
      }

      console.log("Locations loaded:", data);
      
      // Transform data to match our expected format
      const transformedData: LocationEnvironmentalMetrics[] = data.map(item => ({
        id: item.id,
        report_id: item.report_id,
        locationId: item.location_id || '',
        name: item.location_name || '',
        location_type: item.location_type,
        metrics: item.metrics || {},
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
      
      setLocations(transformedData);
      setHasMultipleLocations(transformedData.length > 1);
      
      // Select the first location by default if none is selected
      if (transformedData.length > 0 && !selectedLocationId) {
        setSelectedLocationId(transformedData[0].locationId);
      }
    } catch (error) {
      console.error("Error loading locations:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il caricamento delle sedi",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentReport?.id, selectedLocationId, toast]);

  // Add a new location
  const addLocation = useCallback(async (name: string, locationId: string) => {
    if (!currentReport?.id) {
      console.error("No current report ID, cannot add location");
      return;
    }

    setIsSaving(true);
    try {
      const formattedName = formatLocationName(name);
      console.log(`Adding location: ${formattedName} with ID: ${locationId}`);

      const newLocation = {
        report_id: currentReport.id,
        location_id: locationId,
        location_name: formattedName,
        location_type: 'operation',
        metrics: {
          energyConsumption: 0,
          waterConsumption: 0,
          wasteGenerated: 0
        }
      };

      const { error } = await supabase
        .from('location_metrics')
        .insert([newLocation]);

      if (error) {
        console.error("Error adding location:", error);
        toast({
          title: "Errore",
          description: "Impossibile aggiungere la sede",
          variant: "destructive"
        });
        return;
      }

      await loadLocations();
      toast({
        title: "Sede aggiunta",
        description: "La sede è stata aggiunta con successo",
      });
    } catch (error) {
      console.error("Error adding location:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiunta della sede",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  }, [currentReport?.id, loadLocations, toast]);

  // Update an existing location
  const updateLocation = useCallback(async (location: LocationEnvironmentalMetrics) => {
    setIsSaving(true);
    try {
      console.log("Updating location:", location);

      // Convert to database format
      const dbLocation = {
        location_id: location.locationId,
        location_name: location.name,
        location_type: location.location_type,
        metrics: location.metrics
      };

      const { error } = await supabase
        .from('location_metrics')
        .update(dbLocation)
        .eq('id', location.id);

      if (error) {
        console.error("Error updating location:", error);
        toast({
          title: "Errore",
          description: "Impossibile aggiornare la sede",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Sede aggiornata",
        description: "La sede è stata aggiornata con successo",
      });
    } catch (error) {
      console.error("Error updating location:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiornamento della sede",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  // Save location data
  const saveLocation = useCallback(async (location: LocationEnvironmentalMetrics) => {
    if (!currentReport?.id) {
      console.error("No current report ID, cannot save location");
      return;
    }

    setIsSaving(true);
    try {
      console.log("Saving location:", location);

      // Convert to database format
      const dbLocation = {
        report_id: currentReport.id,
        location_id: location.locationId,
        location_name: location.name,
        location_type: location.location_type || 'operation',
        metrics: location.metrics || {}
      };

      const { error } = await supabase
        .from('location_metrics')
        .upsert(dbLocation);

      if (error) {
        console.error("Error saving location:", error);
        toast({
          title: "Errore",
          description: "Impossibile salvare la sede",
          variant: "destructive"
        });
        return;
      }

      await loadLocations();
      toast({
        title: "Sede salvata",
        description: "La sede è stata salvata con successo",
      });

      // Update report data with the new location metrics
      updateReportData({
        environmentalMetrics: {
          locationMetrics: locations
        }
      });
    } catch (error) {
      console.error("Error saving location:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio della sede",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  }, [currentReport?.id, loadLocations, toast, locations, updateReportData]);

  return {
    locations,
    isLoading,
    isSaving,
    hasMultipleLocations,
    selectedLocationId,
    setSelectedLocationId,
    loadLocations,
    addLocation,
    updateLocation,
    saveLocation
  };
};
