
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ComplianceAPIData, ComplianceFormData } from './types';
import { toast } from 'sonner';

export const useComplianceLoad = (
  reportId: string,
  setFormData: React.Dispatch<React.SetStateAction<ComplianceFormData>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>
) => {
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('compliance_standards')
          .select('*')
          .eq('report_id', reportId)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          const apiData = data as ComplianceAPIData;
          setFormData({
            complianceStandards: apiData.compliance_standards || '',
            complianceMonitoring: apiData.compliance_monitoring || ''
          });
          
          if (apiData.updated_at) {
            setLastSaved(new Date(apiData.updated_at));
          }
        } else {
          setFormData({
            complianceStandards: '',
            complianceMonitoring: ''
          });
          setLastSaved(null);
        }
      } catch (error: any) {
        console.error('Error loading compliance data:', error.message);
        toast.error(`Impossibile caricare i dati di conformità: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (reportId) {
      loadData();
    }
  }, [reportId, setFormData, setIsLoading, setLastSaved]);
};
