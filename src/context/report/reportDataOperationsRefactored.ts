
import { supabase, withRetry } from '@/integrations/supabase/client';
import { Subsidiary, ReportData } from '@/context/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export const useReportDataOperations = () => {
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();

  // Save report data
  const saveReportData = async (reportId: string, reportData: ReportData): Promise<boolean> => {
    try {
      if (!user) {
        throw new Error('User must be logged in to save report data');
      }
      
      console.log("About to save report data with ID:", reportId);
      
      return await withRetry(async () => {
        // Check if user has access to this report
        let query = supabase
          .from('reports')
          .select('*, companies!inner(created_by)')
          .eq('id', reportId);
        
        // For regular users, only allow saving reports from companies they created
        if (!isAdmin) {
          query = query.eq('companies.created_by', user.id);
        }
        
        const { data, error: accessError } = await query.maybeSingle();
        
        if (accessError || !data) {
          console.error("Access error or no data:", accessError?.message || "No data found");
          throw new Error('You do not have permission to save this report');
        }
        
        // Stringifizza i dati complessi prima del salvataggio
        console.log("Saving report data to Supabase, payload:", {
          environmental_metrics: reportData.environmentalMetrics,
          social_metrics: reportData.socialMetrics,
          conduct_metrics: reportData.conductMetrics,
          materiality_analysis: reportData.materialityAnalysis,
          narrative_pat_metrics: reportData.narrativePATMetrics
        });
        
        const { error } = await supabase
          .from('reports')
          .update({
            environmental_metrics: JSON.stringify(reportData.environmentalMetrics || {}),
            social_metrics: JSON.stringify(reportData.socialMetrics || {}),
            conduct_metrics: JSON.stringify(reportData.conductMetrics || {}),
            materiality_analysis: JSON.stringify(reportData.materialityAnalysis || { issues: [], stakeholders: [] }),
            narrative_pat_metrics: JSON.stringify(reportData.narrativePATMetrics || {}),
            updated_at: new Date().toISOString()
          })
          .eq('id', reportId);
          
        if (error) {
          console.error("Error saving report data:", error.message);
          throw error;
        }
        
        console.log("Report data saved successfully with ID:", reportId);
        return true;
      });
    } catch (error: any) {
      console.error('Error saving report data:', error.message);
      return false;
    }
  };

  // Save subsidiaries for a report
  const saveSubsidiaries = async (subsidiaries: Subsidiary[], reportId: string): Promise<boolean> => {
    try {
      if (!user) {
        throw new Error('User must be logged in to save subsidiaries');
      }
      
      return await withRetry(async () => {
        // Check if user has access to this report
        let query = supabase
          .from('reports')
          .select('*, companies!inner(created_by)')
          .eq('id', reportId);
        
        // For regular users, only allow saving subsidiaries for reports from companies they created
        if (!isAdmin) {
          query = query.eq('companies.created_by', user.id);
        }
        
        const { data, error: accessError } = await query.single();
        
        if (accessError || !data) {
          throw new Error('You do not have permission to save subsidiaries for this report');
        }
        
        // First delete all existing subsidiaries for this report
        await supabase
          .from('subsidiaries')
          .delete()
          .eq('report_id', reportId);
        
        // Then insert the new ones
        if (subsidiaries.length > 0) {
          const subsToInsert = subsidiaries.map(sub => ({
            report_id: reportId,
            name: sub.name,
            location: sub.location
          }));
          
          const { error } = await supabase
            .from('subsidiaries')
            .insert(subsToInsert);
            
          if (error) throw error;
        }
        
        return true;
      });
    } catch (error: any) {
      console.error('Error saving subsidiaries:', error.message);
      toast({
        title: "Errore",
        description: `Impossibile salvare le imprese figlie: ${error.message}`,
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    saveReportData,
    saveSubsidiaries
  };
};
