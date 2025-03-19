
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EmissionCalculationLogs } from '@/hooks/emissions-calculator/types';

export const useEmissionsLoad = (reportId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load emissions data from the database
  const loadEmissionsData = async (reportId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading emissions data for report:', reportId);
      
      const { data, error } = await supabase
        .from('emissions')
        .select('*')
        .eq('report_id', reportId)
        .single();
      
      if (error) {
        console.error('Error loading emissions data:', error);
        setError(error.message);
        return null;
      }
      
      if (data) {
        console.log('Emissions data loaded successfully:', data);
        
        // Make sure calculation_logs is parsed properly
        try {
          if (data.calculation_logs && typeof data.calculation_logs === 'string') {
            data.calculation_logs = JSON.parse(data.calculation_logs);
          }
        } catch (e) {
          console.error('Error parsing calculation logs:', e);
          data.calculation_logs = {
            scope1Calculations: [],
            scope2Calculations: [],
            scope3Calculations: []
          };
        }
      }
      
      return data;
    } catch (error: any) {
      console.error('Unexpected error loading emissions data:', error);
      setError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create initial emissions data if none exists
  const createInitialEmissionsData = async (reportId: string) => {
    try {
      console.log('Creating initial emissions data for report:', reportId);
      
      const initialData = {
        report_id: reportId,
        scope1_emissions: 0,
        scope2_emissions: 0,
        scope3_emissions: 0,
        total_emissions: 0,
        calculation_logs: JSON.stringify({
          scope1Calculations: [],
          scope2Calculations: [],
          scope3Calculations: []
        }),
        created_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('emissions')
        .insert(initialData);
      
      if (error) {
        console.error('Error creating initial emissions data:', error);
        setError(error.message);
        return null;
      }
      
      return initialData;
    } catch (error: any) {
      console.error('Unexpected error creating initial emissions data:', error);
      setError(error.message);
      return null;
    }
  };

  return {
    isLoading,
    error,
    loadEmissionsData,
    createInitialEmissionsData
  };
};
