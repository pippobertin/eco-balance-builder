import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Report } from '@/context/types';

export const useReportWriteOperationsRefactored = () => {
  const { toast } = useToast();

  const createReport = async (reportData: Omit<Report, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Validate required fields
      if (!reportData.company_id || !reportData.report_year || !reportData.report_type) {
        throw new Error('Missing required report fields');
      }

      // Insert the report record, passing report as a single object in an array
      const { data, error } = await supabase
        .from('reports')
        .insert([reportData])
        .select()
        .single();

      if (error) throw error;

      // Notify success
      toast({
        title: 'Report Created',
        description: `Successfully created report for ${reportData.report_year}`,
      });

      return { success: true, reportId: data.id };
    } catch (error: any) {
      // Handle errors
      console.error('Error creating report:', error.message);
      toast({
        title: 'Error',
        description: `Failed to create report: ${error.message}`,
        variant: 'destructive',
      });

      return { success: false, error: error.message };
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

  return {
    createReport,
    deleteReport
  };
};
