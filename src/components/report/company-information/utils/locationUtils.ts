
import { supabase } from '@/integrations/supabase/client';

/**
 * Ensures that the location data (provinces and municipalities) is loaded in the database
 * If no data is found, this function will call the edge function to populate the data
 */
export const ensureLocationDataLoaded = async (): Promise<void> => {
  try {
    const { count, error: countError } = await supabase
      .from('provinces')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error checking provinces count:', countError);
      return;
    }

    if (!count || count === 0) {
      console.log('No provinces found, calling populate-italian-locations function');
      const { data, error } = await supabase.functions.invoke('populate-italian-locations');
      
      if (error) {
        console.error('Error calling populate-italian-locations function:', error);
      } else {
        console.log('Location data population result:', data);
      }
    } else {
      console.log(`Provinces already loaded (${count} provinces)`);
    }
  } catch (error) {
    console.error('Error ensuring location data is loaded:', error);
  }
};
