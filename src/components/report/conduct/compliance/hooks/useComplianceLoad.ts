
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ComplianceFormData, ComplianceAPIData } from './types';
import { useToast } from '@/hooks/use-toast';

export const useComplianceLoad = (
  reportId: string, 
  setFormData: React.Dispatch<React.SetStateAction<ComplianceFormData>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>
) => {
  const { toast } = useToast();
  
  const loadData = useCallback(async () => {
    if (!reportId) {
      console.error("No reportId provided to useComplianceLoad");
      setIsLoading(false);
      return false;
    }

    setIsLoading(true);
    console.log("Loading compliance data for reportId:", reportId);

    try {
      const { data, error } = await supabase
        .from('compliance_standards')
        .select('compliance_standards, compliance_monitoring, updated_at')
        .eq('report_id', reportId)
        .maybeSingle();

      if (error) {
        console.error('Error loading compliance data:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i dati di compliance",
          variant: "destructive"
        });
        setIsLoading(false);
        return false;
      }

      console.log("Compliance data loaded:", data);

      if (data) {
        const apiData = data as ComplianceAPIData;
        
        // Set form data with nullish coalescing to ensure empty strings
        const formDataToSet = {
          complianceStandards: apiData.compliance_standards ?? '',
          complianceMonitoring: apiData.compliance_monitoring ?? ''
        };
        
        console.log("Setting form data with:", formDataToSet);
        setFormData(formDataToSet);
        
        if (apiData.updated_at) {
          setLastSaved(new Date(apiData.updated_at));
        }
        
        setIsLoading(false);
        return true;
      } else {
        console.log("No compliance data found for this report");
        // Reset form to empty values
        setFormData({
          complianceStandards: '',
          complianceMonitoring: ''
        });
        setLastSaved(null);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Error in compliance data loading:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il caricamento dei dati",
        variant: "destructive"
      });
      setIsLoading(false);
      return false;
    }
  }, [reportId, setFormData, setIsLoading, setLastSaved, toast]);

  return { loadData };
};
