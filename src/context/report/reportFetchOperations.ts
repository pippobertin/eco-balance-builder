
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Company, Report, Subsidiary } from '@/context/types';
import { safeJsonParse } from '@/integrations/supabase/utils/jsonUtils';

// Define the hook
export const useReportFetchOperations = () => {
  const [loading, setLoading] = useState(false);

  // Load reports by company ID
  const loadReports = async (companyId: string): Promise<Report[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('company_id', companyId);

      if (error) {
        console.error("Error loading reports:", error);
        return [];
      }

      return data as Report[];
    } catch (error) {
      console.error("Error loading reports:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Load report by ID
  const loadReport = async (reportId: string): Promise<{report: Report | null, subsidiaries?: any[]}> => {
    setLoading(true);
    try {
      // Fetch the report data
      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (reportError) {
        console.error("Error fetching report:", reportError);
        return { report: null };
      }

      // Fetch associated subsidiaries
      const { data: subsidiariesData, error: subsidiariesError } = await supabase
        .from('subsidiaries')
        .select('*')
        .eq('report_id', reportId);

      if (subsidiariesError) {
        console.error("Error fetching subsidiaries:", subsidiariesError);
        return { report: null };
      }

      // Parse JSON fields in report data
      const parsedReportData = {
        ...reportData,
        environmental_metrics: typeof reportData.environmental_metrics === 'string' 
          ? safeJsonParse(reportData.environmental_metrics, {})
          : reportData.environmental_metrics,
        social_metrics: typeof reportData.social_metrics === 'string'
          ? safeJsonParse(reportData.social_metrics, {})
          : reportData.social_metrics,
        conduct_metrics: typeof reportData.conduct_metrics === 'string'
          ? safeJsonParse(reportData.conduct_metrics, {})
          : reportData.conduct_metrics,
        narrative_pat_metrics: typeof reportData.narrative_pat_metrics === 'string'
          ? safeJsonParse(reportData.narrative_pat_metrics, {})
          : reportData.narrative_pat_metrics,
        materiality_analysis: typeof reportData.materiality_analysis === 'string'
          ? safeJsonParse(reportData.materiality_analysis, {})
          : reportData.materiality_analysis
      } as Report;

      return { 
        report: parsedReportData,
        subsidiaries: subsidiariesData as Subsidiary[]
      };
    } catch (error) {
      console.error("Error loading report:", error);
      return { report: null };
    } finally {
      setLoading(false);
    }
  };

  const loadReportData = async (reportId: string): Promise<void> => {
    setLoading(true);
    try {
      // Fetch the report data
      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (reportError) {
        console.error("Error fetching report:", reportError);
        return;
      }

      // Parse JSON fields in report data
      const parsedReportData = {
        ...reportData,
        environmental_metrics: typeof reportData.environmental_metrics === 'string'
          ? safeJsonParse(reportData.environmental_metrics, {})
          : reportData.environmental_metrics,
        social_metrics: typeof reportData.social_metrics === 'string'
          ? safeJsonParse(reportData.social_metrics, {})
          : reportData.social_metrics,
        conduct_metrics: typeof reportData.conduct_metrics === 'string'
          ? safeJsonParse(reportData.conduct_metrics, {})
          : reportData.conduct_metrics,
        narrative_pat_metrics: typeof reportData.narrative_pat_metrics === 'string'
          ? safeJsonParse(reportData.narrative_pat_metrics, {})
          : reportData.narrative_pat_metrics,
        materiality_analysis: typeof reportData.materiality_analysis === 'string'
          ? safeJsonParse(reportData.materiality_analysis, {})
          : reportData.materiality_analysis
      } as Report;

    } catch (error) {
      console.error("Error loading report:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ensure the hook returns the correct functions including loadReports and loadReport
  return {
    loadReportData,
    loadReports,
    loadReport
  };
};
