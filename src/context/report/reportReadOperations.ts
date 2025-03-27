
import { supabase, withRetry } from '@/integrations/supabase/client';
import { Report } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useReportReadOperations = () => {
  const { toast } = useToast();

  // Load reports for a company
  const loadReports = async (companyId: string): Promise<Report[]> => {
    try {
      return await withRetry(async () => {
        const { data, error } = await supabase
          .from('reports')
          .select('*, company:companies(*)')
          .eq('company_id', companyId)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        return data || [];
      });
    } catch (error: any) {
      console.error('Error loading reports:', error.message);
      toast({
        title: "Errore",
        description: `Impossibile caricare i report: ${error.message}`,
        variant: "destructive"
      });
      return [];
    }
  };

  // Load a specific report by ID
  const loadReport = async (reportId: string) => {
    try {
      return await withRetry(async () => {
        const { data, error } = await supabase
          .from('reports')
          .select('*, company:companies(*)')
          .eq('id', reportId)
          .single();

        if (error) {
          throw error;
        }

        return { report: data, success: true };
      });
    } catch (error: any) {
      console.error('Error loading report:', error.message);
      toast({
        title: "Errore",
        description: `Impossibile caricare il report: ${error.message}`,
        variant: "destructive"
      });
      return { report: null, success: false };
    }
  };

  return { loadReports, loadReport };
};
