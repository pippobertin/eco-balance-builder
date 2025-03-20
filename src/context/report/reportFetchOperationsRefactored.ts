
import { supabase, withRetry } from '@/integrations/supabase/client';
import { Report, Subsidiary } from '@/context/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export const useReportFetchOperations = () => {
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
          .select('*, companies!inner(created_by, name, id)')
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
        
        // Process the data to have proper company structure
        const cleanedData = data?.map(item => {
          const { companies, ...reportData } = item;
          // Create a proper company property
          return {
            ...reportData,
            company: companies
          };
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

  // Load a specific report
  const loadReport = async (reportId: string): Promise<{ report: Report | null, subsidiaries?: Subsidiary[] }> => {
    try {
      if (!user) {
        return { report: null };
      }

      return await withRetry(async () => {
        let query = supabase
          .from('reports')
          .select('*, companies(*)')
          .eq('id', reportId);
        
        // For regular users, only load reports from companies they created
        if (!isAdmin) {
          query = query.eq('companies.created_by', user.id);
        }
        
        const { data, error } = await query.maybeSingle();

        if (error) {
          throw error;
        }

        // Process the data to have proper structure
        if (data) {
          const { companies, ...reportData } = data;
          
          // Create a proper report object with company data
          const report = {
            ...reportData,
            company: companies
          } as Report;
          
          // Load subsidiaries if the report is consolidated
          let subsidiaries = undefined;
          if (report.is_consolidated) {
            const { data: subsData, error: subsError } = await supabase
              .from('subsidiaries')
              .select('*')
              .eq('report_id', reportId);
            
            if (!subsError && subsData) {
              subsidiaries = subsData;
            }
          }

          return { report, subsidiaries };
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

  return { 
    loadReports, 
    loadReport,
  };
};
