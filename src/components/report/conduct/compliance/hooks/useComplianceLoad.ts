
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/integrations/supabase/utils/errorUtils';
import { ComplianceData } from './types';

export const useComplianceLoad = (reportId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const [complianceData, setComplianceData] = useState<ComplianceData | null>(null);

  // Load compliance data
  const loadComplianceData = useCallback(async () => {
    if (!reportId) {
      console.log("Cannot load compliance data: reportId is undefined");
      return null;
    }
    
    try {
      setLoading(true);
      console.log("Loading compliance data for report:", reportId);
      
      const { data, error } = await supabase
        .from('compliance_standards')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();
      
      if (error) throw error;
      
      console.log("Compliance data loaded:", data);
      
      if (data) {
        const formattedData: ComplianceData = {
          complianceStandards: data.compliance_standards,
          complianceMonitoring: data.compliance_monitoring
        };
        
        setComplianceData(formattedData);
        return formattedData;
      }
      
      return null;
    } catch (error: any) {
      console.error("Error loading compliance data:", error);
      handleSupabaseError(error, "Impossibile caricare i dati di compliance");
      return null;
    } finally {
      setLoading(false);
    }
  }, [reportId]);

  return {
    loading,
    complianceData,
    setComplianceData,
    loadComplianceData
  };
};
