import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LocationEnvironmentalMetrics } from '@/context/types';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();
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
        .from('location_environmental_metrics')
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
      setLocations(data as LocationEnvironmentalMetrics[]);
      setHasMultipleLocations(data.length > 1);
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
  }, [currentReport?.id, toast]);

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

      const newLocation: LocationEnvironmentalMetrics = {
        report_id: currentReport.id,
        locationId: locationId,
        name: formattedName,
        metrics: {
          energyConsumption: 0,
          waterConsumption: 0,
          wasteGenerated: 0
        }
      };

      const { error } = await supabase
        .from('location_environmental_metrics')
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

      const { error } = await supabase
        .from('location_environmental_metrics')
        .update(location)
        .eq('locationId', location.locationId);

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

      const { error } = await supabase
        .from('location_environmental_metrics')
        .upsert(location);

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
