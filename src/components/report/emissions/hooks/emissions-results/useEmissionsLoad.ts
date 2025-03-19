
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EmissionsData } from './types';

export const useEmissionsLoad = (reportId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);

  // Function to load emissions data from database
  const loadEmissionsData = async (reportId: string) => {
    setIsLoading(true);
    try {
      console.log(`Loading emissions data for report: ${reportId}`);
      const { data, error } = await supabase
        .from('emissions_data')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();

      if (error) {
        console.error('Error loading emissions data:', error);
        return null;
      }

      // If data exists, return it
      if (data) {
        console.log('Emissions data loaded successfully:', data);
        return data;
      } else {
        console.log('No emissions data found for report:', reportId);
        return null;
      }
    } catch (error) {
      console.error('Error in loadEmissionsData:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to create initial emissions entry
  const createInitialEmissionsData = async (reportId: string) => {
    if (!reportId) {
      console.error('Cannot create initial emissions data: reportId is undefined');
      return null;
    }
    
    try {
      console.log('Creating initial emissions data for report:', reportId);
      // Create an initial entry in the database
      const emissionsData: EmissionsData = {
        report_id: reportId, // This is now required
        scope1_emissions: 0,
        scope2_emissions: 0,
        scope3_emissions: 0,
        total_emissions: 0,
        updated_at: new Date().toISOString()
      };
      
      const { error: insertError } = await supabase
        .from('emissions_data')
        .insert(emissionsData);
        
      if (insertError) {
        console.error('Error creating initial emissions data:', insertError);
        return null;
      }
      
      return emissionsData;
    } catch (error) {
      console.error('Error creating initial emissions data:', error);
      return null;
    }
  };

  return {
    isLoading,
    loadEmissionsData,
    createInitialEmissionsData
  };
};
