
import { supabase, withRetry, safeJsonParse } from '@/integrations/supabase/client';
import { Report, Subsidiary } from '@/context/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

// Track in-flight requests to avoid duplicates
const activeLoadRequests = new Map();

export const useReportFetchOperations = () => {
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();

  // Load reports for a specific company
  const loadReports = async (companyId: string): Promise<Report[]> => {
    try {
      if (!user) {
        console.log("No user, returning empty reports array");
        return [];
      }

      // Generate a cache key for this request
      const cacheKey = `loadReports-${companyId}-${user.id}`;
      
      // If this exact request is already in progress, return the promise
      if (activeLoadRequests.has(cacheKey)) {
        console.log(`Re-using in-flight request for ${cacheKey}`);
        return activeLoadRequests.get(cacheKey);
      }

      console.log("Loading reports for company", companyId, "isAdmin:", isAdmin);
      
      // Create the promise for this request
      const reportsPromise = withRetry(async () => {
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
          console.error("Error in loading reports:", error.message);
          throw error;
        }

        console.log("Reports loaded:", data?.length || 0);
        
        // Remove the companies data from the result
        const cleanedData = data?.map(item => {
          if (!item) return null;
          const { companies, ...reportData } = item;
          return reportData;
        }).filter(Boolean) as Report[]; // Filter out null values

        return cleanedData || [];
      }, 2, 200);
      
      // Store the promise in the cache
      activeLoadRequests.set(cacheKey, reportsPromise);
      
      // Remove from cache when complete
      reportsPromise.finally(() => {
        setTimeout(() => {
          activeLoadRequests.delete(cacheKey);
        }, 100);
      });
      
      return await reportsPromise;
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

      // Generate a cache key for this request
      const cacheKey = `loadReport-${reportId}-${user.id}`;
      
      // If this exact request is already in progress, return the promise
      if (activeLoadRequests.has(cacheKey)) {
        console.log(`Re-using in-flight request for ${cacheKey}`);
        return activeLoadRequests.get(cacheKey);
      }

      // Create the promise for this request
      const reportPromise = withRetry(async () => {
        let query = supabase
          .from('reports')
          .select('*, companies(*)')  // Use simpler select to get complete company data
          .eq('id', reportId);
        
        // For regular users, only load reports from companies they created
        if (!isAdmin) {
          query = query.eq('companies.created_by', user.id);
        }
        
        const { data, error } = await query.maybeSingle();

        if (error) {
          console.error("Error in loading report:", error.message);
          throw error;
        }

        // Process the data if it exists
        if (data) {
          // Create a proper Report object that includes the company property
          const { companies, ...reportData } = data;
          
          // Safely handle the data parsing, whether it's already an object or still a string
          const parsedReport = {
            ...reportData,
            company: companies,
            environmental_metrics: safeJsonParse(reportData.environmental_metrics, {}),
            social_metrics: safeJsonParse(reportData.social_metrics, {}),
            conduct_metrics: safeJsonParse(reportData.conduct_metrics, {}),
            materiality_analysis: safeJsonParse(reportData.materiality_analysis, { issues: [], stakeholders: [] }),
            narrative_pat_metrics: safeJsonParse(reportData.narrative_pat_metrics, {})
          };
          
          console.log("Loaded report data:", JSON.stringify(parsedReport));
          
          // Load subsidiaries if the report is consolidated
          let subsidiaries = undefined;
          if (parsedReport.is_consolidated) {
            const { data: subsData, error: subsError } = await supabase
              .from('subsidiaries')
              .select('*')
              .eq('report_id', reportId);
            
            if (subsError) {
              console.error("Error loading subsidiaries:", subsError.message);
            }
            
            if (!subsError && subsData) {
              subsidiaries = subsData;
            }
          }

          return { report: parsedReport as Report, subsidiaries };
        }

        return { report: null };
      }, 2, 200);
      
      // Store the promise in the cache
      activeLoadRequests.set(cacheKey, reportPromise);
      
      // Remove from cache when complete
      reportPromise.finally(() => {
        setTimeout(() => {
          activeLoadRequests.delete(cacheKey);
        }, 100);
      });
      
      return await reportPromise;
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
