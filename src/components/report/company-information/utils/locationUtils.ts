
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Ensures that the location data (provinces and municipalities) is loaded in the database
 * If no data is found, this function will call the edge function to populate the data
 * @param forcePopulate If true, will force calling the populate function regardless of existing data
 * @param provinceCode Optional province code to specifically populate municipalities for that province
 */
export const ensureLocationDataLoaded = async (forcePopulate = false, provinceCode?: string): Promise<void> => {
  try {
    // Check if provinces exist
    const { count, error: countError } = await supabase
      .from('provinces')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error checking provinces count:', countError);
      toast.error('Errore nel verificare i dati geografici');
      return;
    }

    // Check if municipalities exist
    const { count: municipalityCount, error: municipalityCountError } = await supabase
      .from('municipalities')
      .select('*', { count: 'exact', head: true });
      
    if (municipalityCountError) {
      console.error('Error checking municipalities count:', municipalityCountError);
      toast.error('Errore nel verificare i dati dei comuni');
    }

    const shouldPopulate = forcePopulate || !count || count === 0 || !municipalityCount || municipalityCount === 0;

    // If specifically requesting municipalities for a province
    if (provinceCode) {
      // Check if municipalities for this province exist
      const { count: provinceMunicipalityCount, error: provinceMunicipalityCountError } = await supabase
        .from('municipalities')
        .select('*', { count: 'exact', head: true })
        .eq('province_code', provinceCode);
        
      if (provinceMunicipalityCountError) {
        console.error(`Error checking municipalities count for province ${provinceCode}:`, provinceMunicipalityCountError);
      }

      // If no municipalities for this province or force populate
      if (forcePopulate || !provinceMunicipalityCount || provinceMunicipalityCount === 0) {
        console.log(`No municipalities found for province ${provinceCode}, calling populate function`);
        
        // Show loading toast
        const toastId = toast.loading(`Caricamento dei comuni per la provincia ${provinceCode}...`);
        
        // Call the function with province parameter in the body instead of query
        const { data, error } = await supabase.functions.invoke('populate-italian-locations', {
          body: { province: provinceCode }
        });
        
        if (error) {
          console.error(`Error calling populate function for province ${provinceCode}:`, error);
          toast.error(`Errore nel caricamento dei comuni per la provincia ${provinceCode}`, {
            id: toastId
          });
        } else {
          console.log(`Province ${provinceCode} municipality data population result:`, data);
          toast.success(`Comuni per la provincia ${provinceCode} caricati con successo`, {
            id: toastId
          });
        }
        return;
      } else {
        console.log(`Province ${provinceCode} already has ${provinceMunicipalityCount} municipalities - No need to populate`);
        return;
      }
    }

    // General population if needed
    if (shouldPopulate) {
      console.log(`${forcePopulate ? 'Forcing population of' : 'No or insufficient'} location data, calling populate-italian-locations function`);
      
      // Show loading toast
      const toastId = toast.loading('Caricamento dei dati geografici in corso...');
      
      const { data, error } = await supabase.functions.invoke('populate-italian-locations');
      
      if (error) {
        console.error('Error calling populate-italian-locations function:', error);
        toast.error('Errore nel caricamento dei dati geografici. Alcuni comuni potrebbero non essere disponibili.', {
          id: toastId
        });
      } else {
        console.log('Location data population result:', data);
        toast.success('Dati geografici caricati con successo', {
          id: toastId
        });
      }
    } else {
      console.log(`Province: ${count}, Municipalities: ${municipalityCount} - No need to populate`);
    }
  } catch (error) {
    console.error('Error ensuring location data is loaded:', error);
    toast.error('Si è verificato un errore durante il caricamento dei dati geografici');
  }
};

/**
 * Populates municipalities for a specific province
 * @param provinceCode The province code to populate municipalities for
 */
export const populateMunicipalitiesForProvince = async (provinceCode: string): Promise<boolean> => {
  try {
    const toastId = toast.loading(`Caricamento dei comuni per la provincia ${provinceCode}...`);
    
    // Pass province as part of the body instead of query
    const { data, error } = await supabase.functions.invoke('populate-italian-locations', {
      body: { province: provinceCode }
    });
    
    if (error) {
      console.error(`Error populating municipalities for province ${provinceCode}:`, error);
      toast.error(`Errore nel caricamento dei comuni per la provincia ${provinceCode}`, {
        id: toastId
      });
      return false;
    }
    
    console.log(`Municipalities for province ${provinceCode} populated:`, data);
    toast.success(`Comuni per la provincia ${provinceCode} caricati con successo`, {
      id: toastId
    });
    return true;
  } catch (error) {
    console.error(`Error populating municipalities for province ${provinceCode}:`, error);
    toast.error(`Errore nel caricamento dei comuni per la provincia ${provinceCode}`);
    return false;
  }
};
