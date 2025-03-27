import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LocationEnvironmentalMetrics } from '@/context/types';

export const useLocationData = (reportId: string | undefined) => {
  const [locations, setLocations] = useState<LocationEnvironmentalMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    loadLocations();
  }, [reportId]);
  
  const loadLocations = async () => {
    if (!reportId) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('location_metrics')
        .select('*')
        .eq('report_id', reportId);
        
      if (error) {
        console.error("Error loading locations:", error);
        toast({
          title: "Errore",
          description: "Impossibile caricare le sedi",
          variant: "destructive"
        });
        return;
      }
      
      if (data && data.length > 0) {
        const mappedLocations: LocationEnvironmentalMetrics[] = data.map(item => ({
          id: item.id,
          name: item.location_name || '',
          locationId: item.location_id || '', // Use location_id but map it to locationId
          metrics: item.metrics || {},
          location_id: item.location_id, // Keep original for backward compatibility
          location_name: item.location_name,
          location_type: item.location_type
        }));
        
        console.log("Loaded locations:", mappedLocations);
        setLocations(mappedLocations);
      } else {
        console.log("No locations found");
        setLocations([]);
      }
    } catch (error) {
      console.error("Error in loadLocations:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il caricamento delle sedi",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const addLocation = async (name: string, locationId: string): Promise<LocationEnvironmentalMetrics | null> => {
    if (!reportId) return null;
    
    try {
      setIsSaving(true);
      
      const newLocation: LocationEnvironmentalMetrics = {
        name,
        locationId,
        location_id: locationId, // Add for backwards compatibility
        metrics: {}
      };
      
      const { data, error } = await supabase
        .from('location_metrics')
        .insert([{ 
          report_id: reportId,
          location_id: newLocation.locationId,
          location_name: newLocation.name,
          location_type: newLocation.location_type || 'site',
          metrics: newLocation.metrics || {}
        }])
        .select('*')
        .single();
        
      if (error) {
        console.error("Error adding location:", error);
        toast({
          title: "Errore",
          description: "Impossibile aggiungere la sede",
          variant: "destructive"
        });
        return null;
      }
      
      const addedLocation: LocationEnvironmentalMetrics = {
        id: data.id,
        name: data.location_name || '',
        locationId: data.location_id || '',
        metrics: data.metrics || {},
        location_id: data.location_id, // Keep original for backward compatibility
        location_name: data.location_name,
        location_type: data.location_type
      };
      
      setLocations(current => [...current, addedLocation]);
      return addedLocation;
    } catch (error) {
      console.error("Error in addLocation:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiunta della sede",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };
  
  const updateLocation = async (location: LocationEnvironmentalMetrics): Promise<boolean> => {
    if (!reportId || !location.id) return false;
    
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('location_metrics')
        .update({
          location_name: location.name,
          location_type: location.location_type || 'site',
          metrics: location.metrics || {}
        })
        .eq('id', location.id);
        
      if (error) {
        console.error("Error updating location:", error);
        toast({
          title: "Errore",
          description: "Impossibile aggiornare la sede",
          variant: "destructive"
        });
        return false;
      }
      
      setLocations(current => 
        current.map(loc => loc.id === location.id ? location : loc)
      );
      return true;
    } catch (error) {
      console.error("Error in updateLocation:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiornamento della sede",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  const saveLocation = async (location: LocationEnvironmentalMetrics): Promise<boolean> => {
    if (!reportId) return false;
    
    try {
      setIsSaving(true);
      
      const locationData = {
        report_id: reportId,
        location_id: location.locationId, // Use locationId but save as location_id
        location_name: location.name,
        location_type: location.location_type || 'site',
        metrics: location.metrics || {}
      };
      
      const { data, error } = await supabase
        .from('location_metrics')
        .upsert([locationData], { onConflict: 'report_id, location_id' })
        .select('*')
        .single();
        
      if (error) {
        console.error("Error saving location:", error);
        toast({
          title: "Errore",
          description: "Impossibile salvare la sede",
          variant: "destructive"
        });
        return false;
      }
      
      // Update the location in the state
      setLocations(current =>
        current.map(loc =>
          loc.locationId === location.locationId
            ? { ...loc, ...location }
            : loc
        )
      );
      
      return true;
    } catch (error) {
      console.error("Error in saveLocation:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio della sede",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  const deleteLocation = async (locationId: string): Promise<boolean> => {
    if (!reportId) return false;
    
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('location_metrics')
        .delete()
        .eq('report_id', reportId)
        .eq('location_id', locationId);
        
      if (error) {
        console.error("Error deleting location:", error);
        toast({
          title: "Errore",
          description: "Impossibile eliminare la sede",
          variant: "destructive"
        });
        return false;
      }
      
      setLocations(current => current.filter(loc => loc.locationId !== locationId));
      return true;
    } catch (error) {
      console.error("Error in deleteLocation:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione della sede",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    locations,
    isLoading,
    isSaving,
    loadLocations,
    addLocation,
    updateLocation,
    saveLocation,
    deleteLocation
  };
};
