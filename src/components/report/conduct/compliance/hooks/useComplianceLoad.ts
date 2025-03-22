
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ComplianceFormData } from './types';

export const useComplianceLoad = (
  reportId: string, 
  setFormData: React.Dispatch<React.SetStateAction<ComplianceFormData>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>
) => {
  useEffect(() => {
    const loadComplianceData = async () => {
      if (!reportId) {
        console.log("No reportId provided to useComplianceLoad");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      console.log("Loading compliance data for reportId:", reportId);

      try {
        // We're using compliance_standards table based on errors
        const { data, error } = await supabase
          .from('compliance_standards')
          .select('compliance_standards, compliance_monitoring, updated_at')
          .eq('report_id', reportId)
          .maybeSingle();

        if (error) {
          console.error('Error loading compliance data:', error);
          throw error;
        }

        console.log("Compliance data loaded:", data);

        if (data) {
          setFormData({
            complianceStandards: data.compliance_standards || '',
            complianceMonitoring: data.compliance_monitoring || ''
          });
          
          if (data.updated_at) {
            setLastSaved(new Date(data.updated_at));
          }
        }
      } catch (error) {
        console.error('Error in compliance data loading:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadComplianceData();
  }, [reportId, setFormData, setIsLoading, setLastSaved]);
};
