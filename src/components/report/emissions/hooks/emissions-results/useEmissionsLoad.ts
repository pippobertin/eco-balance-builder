
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
      
      // Use the emissions_logs table
      const { data, error } = await supabase
        .from('emissions_logs')
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
        
        // Create safe default logs structure
        const defaultLogs: EmissionCalculationLogs = {
          scope1Calculations: [],
          scope2Calculations: [],
          scope3Calculations: []
        };
        
        // If calculation_logs is available, use it, otherwise use defaults
        if (data.calculation_logs) {
          console.log('Found calculation logs in data:', data.calculation_logs);
          
          // Ensure arrays exist and are arrays
          data.calculation_logs = {
            scope1Calculations: Array.isArray(data.calculation_logs.scope1Calculations) 
              ? data.calculation_logs.scope1Calculations : [],
            scope2Calculations: Array.isArray(data.calculation_logs.scope2Calculations)
              ? data.calculation_logs.scope2Calculations : [],
            scope3Calculations: Array.isArray(data.calculation_logs.scope3Calculations)
              ? data.calculation_logs.scope3Calculations : []
          };
        } else {
          console.log('No calculation_logs found, using default empty structure');
          data.calculation_logs = defaultLogs;
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
      
      const initialLogs: EmissionCalculationLogs = {
        scope1Calculations: [],
        scope2Calculations: [],
        scope3Calculations: []
      };
      
      // Insert into emissions_logs table
      const initialData = {
        report_id: reportId,
        calculation_logs: initialLogs,
        created_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('emissions_logs')
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
