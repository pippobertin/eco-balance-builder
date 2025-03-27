
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Report } from '../types';

export const useReportWriteOperationsRefactored = () => {
  const { toast } = useToast();

  // Create a new report
  const createReport = async (reportData: Omit<Report, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> => {
    try {
      if (!reportData.company_id || !reportData.report_year || !reportData.report_type) {
        throw new Error('Missing required report fields');
      }

      // Fix: Ensure we're passing an array with a single report object
      const { data, error } = await supabase
        .from('reports')
        .insert([reportData])
        .select()
        .single();

      if (error) {
        throw error;
      }

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

  // Delete a report
  const deleteReport = async (reportId: string): Promise<boolean> => {
    try {
      // Delete all related data for this report
      
      // Delete subsidiaries
      await supabase
        .from('subsidiaries')
        .delete()
        .eq('report_id', reportId);
        
      // Delete the report itself
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

  return { createReport, deleteReport };
};
