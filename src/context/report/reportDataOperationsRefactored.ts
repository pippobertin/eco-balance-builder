import { SupabaseClient } from '@supabase/supabase-js';
import { ReportData } from '@/context/types';

// Prepare data for saving to database
export const prepareReportDataForSave = (reportData: ReportData): Record<string, any> => {
  return {
    environmental_metrics: reportData.environmentalMetrics || {},
    social_metrics: reportData.socialMetrics || {},
    conduct_metrics: reportData.conductMetrics || {},
    materiality_analysis: reportData.materialityAnalysis || { issues: [], stakeholders: [] },
    narrative_pat_metrics: reportData.narrativePATMetrics || {}
  };
};

// Save complete report data
export const saveCompleteReportData = async (
  supabase: SupabaseClient,
  reportId: string,
  reportData: ReportData
): Promise<void> => {
  try {
    const dataToUpdate = {
      environmental_metrics: reportData.environmentalMetrics || {},
      social_metrics: reportData.socialMetrics || {},
      conduct_metrics: reportData.conductMetrics || {},
      materiality_analysis: reportData.materialityAnalysis || { issues: [], stakeholders: [] },
      narrative_pat_metrics: reportData.narrativePATMetrics || {}
    };

    const { error } = await supabase
      .from('reports')
      .update(dataToUpdate)
      .eq('id', reportId);

    if (error) {
      console.error("Error saving report data:", error);
      throw error;
    }

    console.log("Report data saved successfully");
  } catch (error) {
    console.error("Error in saveCompleteReportData:", error);
    throw error;
  }
};
