
import { SupabaseClient } from '@supabase/supabase-js';
import { ReportData } from '@/context/types';
import { supabase } from '@/integrations/supabase/client';

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
  client: SupabaseClient,
  reportId: string,
  reportData: ReportData
): Promise<boolean> => {
  try {
    const dataToUpdate = {
      environmental_metrics: reportData.environmentalMetrics || {},
      social_metrics: reportData.socialMetrics || {},
      conduct_metrics: reportData.conductMetrics || {},
      materiality_analysis: reportData.materialityAnalysis || { issues: [], stakeholders: [] },
      narrative_pat_metrics: reportData.narrativePATMetrics || {}
    };

    const { error } = await client
      .from('reports')
      .update(dataToUpdate)
      .eq('id', reportId);

    if (error) {
      console.error("Error saving report data:", error);
      throw error;
    }

    console.log("Report data saved successfully");
    return true;
  } catch (error) {
    console.error("Error in saveCompleteReportData:", error);
    return false;
  }
};

// Simplified version that uses the global Supabase client
export const saveReportData = async (
  reportId: string,
  reportData: ReportData
): Promise<boolean> => {
  return saveCompleteReportData(supabase, reportId, reportData);
};
