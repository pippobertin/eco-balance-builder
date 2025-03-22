
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ComplianceAPIData, ComplianceFormData } from './types';
import { useToast } from '@/hooks/use-toast';

export const useComplianceLoad = (
  reportId: string,
  setFormData: React.Dispatch<React.SetStateAction<ComplianceFormData>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('compliance_standards')
          .select('*')
          .eq('report_id', reportId)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (data) {
          const apiData = data as ComplianceAPIData;
          setFormData({
            complianceStandards: apiData.compliance_standards || '',
            complianceMonitoring: apiData.compliance_monitoring || ''
          });
        }
      } catch (error: any) {
        console.error('Error loading compliance data:', error.message);
        toast({
          title: "Errore",
          description: `Impossibile caricare i dati di conformità: ${error.message}`,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (reportId) {
      loadData();
    }
  }, [reportId, setFormData, setIsLoading, toast]);
};
