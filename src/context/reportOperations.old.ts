
import { supabase, withRetry } from '@/integrations/supabase/client';
import { Report, Subsidiary, ReportData } from './types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export const useReportOperations = () => {
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();

  // Load reports for a specific company
  const loadReports = async (companyId: string): Promise<Report[]> => {
    try {
      if (!user) {
        return [];
      }

      console.log("Loading reports for company", companyId, "isAdmin:", isAdmin);
      
      return await withRetry(async () => {
        let query = supabase
          .from('reports')
          .select('*, companies!inner(created_by)')
          .eq('company_id', companyId);
        
        // For regular users, only load reports from companies they created
        if (!isAdmin) {
          console.log("Filtering reports for user:", user.id);
          query = query.eq('companies.created_by', user.id);
        }
        
        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        console.log("Reports loaded:", data?.length || 0);
        
        // Remove the companies data from the result
        const cleanedData = data?.map(item => {
          const { companies, ...reportData } = item;
          return reportData;
        });

        return cleanedData || [];
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

  // Load a specific report
  const loadReport = async (reportId: string): Promise<{ report: Report | null, subsidiaries?: Subsidiary[] }> => {
    try {
      if (!user) {
        return { report: null };
      }

      return await withRetry(async () => {
        let query = supabase
          .from('reports')
          .select('*, companies!inner(created_by)')
          .eq('id', reportId);
        
        // For regular users, only load reports from companies they created
        if (!isAdmin) {
          query = query.eq('companies.created_by', user.id);
        }
        
        const { data, error } = await query.single();

        if (error) {
          throw error;
        }

        // Remove the companies data from the result
        if (data) {
          const { companies, ...reportData } = data;
          
          // Load subsidiaries if the report is consolidated
          let subsidiaries = undefined;
          if (reportData.is_consolidated) {
            const { data: subsData, error: subsError } = await supabase
              .from('subsidiaries')
              .select('*')
              .eq('report_id', reportId);
            
            if (!subsError && subsData) {
              subsidiaries = subsData;
            }
          }

          return { report: reportData, subsidiaries };
        }

        return { report: null };
      });
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

  // Save report data
  const saveReportData = async (reportId: string, reportData: ReportData): Promise<boolean> => {
    try {
      if (!user) {
        throw new Error('User must be logged in to save report data');
      }
      
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
        
        const { data, error: accessError } = await query.single();
        
        if (accessError || !data) {
          throw new Error('You do not have permission to save this report');
        }
        
        // Convert complex objects to strings to match JSON type in database
        const { error } = await supabase
          .from('reports')
          .update({
            environmental_metrics: JSON.stringify(reportData.environmentalMetrics),
            social_metrics: JSON.stringify(reportData.socialMetrics),
            conduct_metrics: JSON.stringify(reportData.conductMetrics),
            materiality_analysis: JSON.stringify(reportData.materialityAnalysis),
            narrative_pat_metrics: JSON.stringify(reportData.narrativePATMetrics),
            updated_at: new Date().toISOString()
          })
          .eq('id', reportId);
          
        if (error) throw error;
        
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
    loadReports, 
    createReport, 
    loadReport, 
    saveReportData, 
    saveSubsidiaries,
    deleteReport
  };
};
