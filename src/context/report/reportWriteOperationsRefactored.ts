
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Report } from '@/context/types';

export const useReportWriteOperationsRefactored = () => {
  const { toast } = useToast();

  const createReport = async (report: Omit<Report, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> => {
    try {
      if (!report.company_id || !report.report_year || !report.report_type) {
        throw new Error('Missing required report fields');
      }
      
      const { data, error } = await supabase
        .from('reports')
        .insert([report])
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: "Successo",
        description: `Report ${data.report_year} creato con successo`,
      });
      
      return data.id;
    } catch (error: any) {
      console.error('Error creating report:', error.message);
      toast({
        title: "Errore",
        description: `Impossibile creare il report: ${error.message}`,
        variant: "destructive"
      });
      return null;
    }
  };

  const deleteReport = async (reportId: string): Promise<boolean> => {
    try {
      await supabase
        .from('subsidiaries')
        .delete()
        .eq('report_id', reportId);
        
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', reportId);
        
      if (error) throw error;
      
      toast({
        title: "Successo",
        description: "Report eliminato con successo",
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting report:', error.message);
      toast({
        title: "Errore",
        description: `Impossibile eliminare il report: ${error.message}`,
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    createReport,
    deleteReport
  };
};
