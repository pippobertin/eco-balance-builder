
import { supabase, withRetry } from '@/integrations/supabase/client';
import { Report } from '@/context/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export const useReportWriteOperations = () => {
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();

  // Create a new report
  const createReport = async (report: Omit<Report, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> => {
    try {
      if (!user) {
        throw new Error('User must be logged in to create a report');
      }
      
      return await withRetry(async () => {
        const { data, error } = await supabase
          .from('reports')
          .insert([report])
          .select('*')
          .single();

        if (error) {
          throw error;
        }
        
        toast({
          title: "Successo",
          description: `Report creato con successo`,
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
      if (!user) {
        throw new Error('User must be logged in to delete a report');
      }

      return await withRetry(async () => {
        // Check if user has access to this report
        let query = supabase
          .from('reports')
          .select('*, companies!inner(created_by)')
          .eq('id', reportId);
        
        // For regular users, only allow deleting reports from companies they created
        if (!isAdmin) {
          query = query.eq('companies.created_by', user.id);
        }
        
        const { data, error: accessError } = await query.single();
        
        if (accessError || !data) {
          throw new Error('You do not have permission to delete this report');
        }
        
        // First delete any subsidiaries associated with this report
        await supabase
          .from('subsidiaries')
          .delete()
          .eq('report_id', reportId);
        
        // Then delete the report
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

  return {
    createReport,
    deleteReport
  };
};
