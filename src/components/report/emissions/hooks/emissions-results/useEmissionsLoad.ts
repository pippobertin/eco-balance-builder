
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EmissionCalculationLogs } from '@/hooks/emissions-calculator/types';
import { safeJsonParse, safeJsonStringify } from '@/integrations/supabase/utils/jsonUtils';

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
        
        // Prepare default empty logs structure
        const defaultLogs: EmissionCalculationLogs = {
          scope1Calculations: [],
          scope2Calculations: [],
          scope3Calculations: []
        };
        
        // Parse calculation_logs if it exists
        if (data.calculation_logs) {
          // Handle string or object format
          const parsedLogs = typeof data.calculation_logs === 'string' 
            ? safeJsonParse(data.calculation_logs, defaultLogs)
            : data.calculation_logs;
          
          // Normalize the structure to ensure it has all expected properties
          data.calculation_logs = {
            scope1Calculations: Array.isArray(parsedLogs.scope1Calculations) 
              ? parsedLogs.scope1Calculations : [],
            scope2Calculations: Array.isArray(parsedLogs.scope2Calculations)
              ? parsedLogs.scope2Calculations : [],
            scope3Calculations: Array.isArray(parsedLogs.scope3Calculations)
              ? parsedLogs.scope3Calculations : []
          };
        } else {
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
      
      // Use 'as any' to bypass TypeScript type checking
      // This is necessary because EmissionCalculationLogs cannot be directly assigned to Json
      const initialData = {
        report_id: reportId,
        calculation_logs: initialLogs as any,
        created_at: new Date().toISOString()
      };
      
      // Insert into emissions_logs table
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
