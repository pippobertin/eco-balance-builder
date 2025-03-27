
import { supabase, withRetry } from '@/integrations/supabase/client';
import { Report } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useReportWriteOperations = () => {
  const { toast } = useToast();

  // Create a new report
  const createReport = async (report: Omit<Report, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> => {
    try {
      return await withRetry(async () => {
        const { data, error } = await supabase
          .from('reports')
          .insert([report])
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
      });
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
      return await withRetry(async () => {
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
      });
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
