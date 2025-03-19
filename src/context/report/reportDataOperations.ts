
import { supabase } from '@/integrations/supabase/client';
import { Report, ReportData } from '@/context/types';
import { safeJsonParse, safeJsonStringify, prepareJsonForDb } from '@/integrations/supabase/utils/jsonUtils';

export const saveReportData = async (reportId: string, reportData: ReportData) => {
  try {
    // Format environmental metrics for database
    const environmentalMetrics = prepareJsonForDb(reportData.environmentalMetrics || {});
    
    // Format social metrics for database
    const socialMetrics = prepareJsonForDb(reportData.socialMetrics || {});
    
    // Format conduct metrics for database 
    const conductMetrics = prepareJsonForDb(reportData.conductMetrics || {});
    
    // Format business partners metrics for database
    const businessPartnersMetrics = prepareJsonForDb(reportData.businessPartnersMetrics || {});
    
    // Format materiality analysis for database
    const materialityAnalysis = prepareJsonForDb(reportData.materialityAnalysis || {});
    
    // Prepare narrative PAT metrics
    const narrativePATMetrics = reportData.narrativePATMetrics ? 
      prepareJsonForDb(reportData.narrativePATMetrics) : null;
    
    // Update report in the database
    const { error } = await supabase
      .from('reports')
      .update({
        environmental_metrics: environmentalMetrics,
        social_metrics: socialMetrics,
        conduct_metrics: conductMetrics,
        materiality_analysis: materialityAnalysis,
        narrative_pat_metrics: narrativePATMetrics,
        updated_at: new Date().toISOString()
      })
      .eq('id', reportId);
    
    if (error) {
      console.error("Error saving report data:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error in saveReportData:", error);
    throw error;
  }
};

export const loadReportData = async (report: Report): Promise<ReportData> => {
  try {
    // Initialize default data
    const reportData: ReportData = {
      environmentalMetrics: {},
      socialMetrics: {},
      conductMetrics: {},
      businessPartnersMetrics: {},
      materialityAnalysis: {
        issues: [],
        stakeholders: []
      }
    };
    
    // Parse JSON data from the report
    if (report.environmental_metrics) {
      reportData.environmentalMetrics = safeJsonParse(
        safeJsonStringify(report.environmental_metrics), 
        reportData.environmentalMetrics
      );
    }
    
    if (report.social_metrics) {
      reportData.socialMetrics = safeJsonParse(
        safeJsonStringify(report.social_metrics), 
        reportData.socialMetrics
      );
    }
    
    if (report.conduct_metrics) {
      reportData.conductMetrics = safeJsonParse(
        safeJsonStringify(report.conduct_metrics), 
        reportData.conductMetrics
      );
    }
    
    if (report.materiality_analysis) {
      reportData.materialityAnalysis = safeJsonParse(
        safeJsonStringify(report.materiality_analysis), 
        reportData.materialityAnalysis
      );
    }
    
    if (report.narrative_pat_metrics) {
      reportData.narrativePATMetrics = safeJsonParse(
        safeJsonStringify(report.narrative_pat_metrics), 
        null
      );
    }
    
    return reportData;
  } catch (error) {
    console.error("Error in loadReportData:", error);
    throw error;
  }
};
