
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
          // Safely convert the data to a proper structure
          // First, get either the JSON object or parse the string
          let logsData: any;
          
          if (typeof data.calculation_logs === 'string') {
            try {
              logsData = JSON.parse(data.calculation_logs);
            } catch (e) {
              console.error('Failed to parse calculation_logs string:', e);
              logsData = {};
            }
          } else {
            logsData = data.calculation_logs;
          }
          
          // Now ensure the structure is correct
          data.calculation_logs = {
            scope1Calculations: Array.isArray(logsData.scope1Calculations) 
              ? logsData.scope1Calculations 
              : [],
            scope2Calculations: Array.isArray(logsData.scope2Calculations)
              ? logsData.scope2Calculations 
              : [],
            scope3Calculations: Array.isArray(logsData.scope3Calculations)
              ? logsData.scope3Calculations 
              : []
          };
        } else {
          // If no calculation_logs exist, use the default empty structure
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
      
      // Convert the EmissionCalculationLogs to a JSON string first
      const logsString = safeJsonStringify(initialLogs);
      
      // Then parse it back to a plain JavaScript object that Supabase can handle
      const initialData = {
        report_id: reportId,
        calculation_logs: JSON.parse(logsString),
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
