
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Ensures that the location data (provinces and municipalities) is loaded in the database
 * If no data is found, this function will call the edge function to populate the data
 * @param forcePopulate If true, will force calling the populate function regardless of existing data
 */
export const ensureLocationDataLoaded = async (forcePopulate = false): Promise<void> => {
  try {
    // Check if provinces exist
    const { count, error: countError } = await supabase
      .from('provinces')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error checking provinces count:', countError);
      return;
    }

    // Check if municipalities exist
    const { count: municipalityCount, error: municipalityCountError } = await supabase
      .from('municipalities')
      .select('*', { count: 'exact', head: true });
      
    if (municipalityCountError) {
      console.error('Error checking municipalities count:', municipalityCountError);
    }

    const shouldPopulate = forcePopulate || !count || count === 0 || !municipalityCount || municipalityCount === 0;

    if (shouldPopulate) {
      console.log(`${forcePopulate ? 'Forcing population of' : 'No or insufficient'} location data, calling populate-italian-locations function`);
      
      // Show loading toast
      toast.loading('Caricamento dei dati geografici in corso...');
      
      const { data, error } = await supabase.functions.invoke('populate-italian-locations');
      
      if (error) {
        console.error('Error calling populate-italian-locations function:', error);
        toast.error('Errore nel caricamento dei dati geografici. Alcuni comuni potrebbero non essere disponibili.');
      } else {
        console.log('Location data population result:', data);
        toast.success('Dati geografici caricati con successo');
      }
    } else {
      console.log(`Province: ${count}, Municipalities: ${municipalityCount} - No need to populate`);
    }
  } catch (error) {
    console.error('Error ensuring location data is loaded:', error);
    toast.error('Si è verificato un errore durante il caricamento dei dati geografici');
  }
};
