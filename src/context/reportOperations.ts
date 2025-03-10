
import { supabase } from '@/integrations/supabase/client';
import { Report, Subsidiary, ReportData } from './types';
import { useToast } from '@/hooks/use-toast';

export const useReportOperations = () => {
  const { toast } = useToast();

  // Load reports for a specific company
  const loadReports = async (companyId: string): Promise<Report[]> => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
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

  // Create a new report
  const createReport = async (report: Omit<Report, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> => {
    try {
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

  // Load a specific report
  const loadReport = async (reportId: string): Promise<{ report: Report | null, subsidiaries?: Subsidiary[] }> => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (error) {
        throw error;
      }

      // Load subsidiaries if the report is consolidated
      let subsidiaries = undefined;
      if (data.is_consolidated) {
        const { data: subsData, error: subsError } = await supabase
          .from('subsidiaries')
          .select('*')
          .eq('report_id', reportId);
        
        if (!subsError && subsData) {
          subsidiaries = subsData;
        }
      }

      return { report: data, subsidiaries };
    } catch (error: any) {
      console.error('Error loading report:', error.message);
      toast({
        title: "Errore",
        description: `Impossibile caricare il report: ${error.message}`,
        variant: "destructive"
      });
      return { report: null };
    }
  };

  // Save report data
  const saveReportData = async (reportId: string, reportData: ReportData): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({
          environmental_metrics: reportData.environmentalMetrics,
          social_metrics: reportData.socialMetrics,
          conduct_metrics: reportData.conductMetrics,
          materiality_analysis: reportData.materialityAnalysis,
          narrative_pat_metrics: reportData.narrativePATMetrics,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);
        
      if (error) throw error;
      
      return true;
    } catch (error: any) {
      console.error('Error saving report data:', error.message);
      return false;
    }
  };

  // Save subsidiaries for a report
  const saveSubsidiaries = async (subsidiaries: Subsidiary[], reportId: string): Promise<boolean> => {
    try {
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
    loadReports, 
    createReport, 
    loadReport, 
    saveReportData, 
    saveSubsidiaries 
  };
};
