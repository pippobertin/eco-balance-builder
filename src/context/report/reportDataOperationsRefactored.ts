
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
        
        // Properly stringify all complex data before saving
        console.log("Saving report data to Supabase, data structure before stringification:", {
          environmentalMetrics: typeof reportData.environmentalMetrics,
          socialMetrics: typeof reportData.socialMetrics,
          conductMetrics: typeof reportData.conductMetrics,
          materialityAnalysis: typeof reportData.materialityAnalysis,
          narrativePATMetrics: typeof reportData.narrativePATMetrics
        });
        
        // Ensure environmental_metrics is properly serialized (deep copy and stringify)
        const environmentalMetricsJson = JSON.stringify(reportData.environmentalMetrics || {});
        
        // Ensure other metrics are properly serialized
        const socialMetricsJson = JSON.stringify(reportData.socialMetrics || {});
        const conductMetricsJson = JSON.stringify(reportData.conductMetrics || {});
        const materialityAnalysisJson = JSON.stringify(reportData.materialityAnalysis || { issues: [], stakeholders: [] });
        const narrativePATMetricsJson = JSON.stringify(reportData.narrativePATMetrics || {});
        
        console.log("Environmental metrics JSON (first 100 chars):", environmentalMetricsJson.substring(0, 100) + "...");
        
        const { error } = await supabase
          .from('reports')
          .update({
            environmental_metrics: environmentalMetricsJson,
            social_metrics: socialMetricsJson,
            conduct_metrics: conductMetricsJson,
            materiality_analysis: materialityAnalysisJson,
            narrative_pat_metrics: narrativePATMetricsJson,
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
