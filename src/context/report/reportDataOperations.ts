
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ReportData, Subsidiary } from '@/context/types';
import { prepareJsonForDb } from '@/integrations/supabase/utils/jsonUtils';
import { Report } from '@/context/types';

export const useReportDataOperations = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Save report data
  const saveReportData = async (reportId: string, data: ReportData): Promise<boolean> => {
    setIsSaving(true);

    try {
      console.log("Saving report data to database...", { reportId });
      
      // Convert data for database storage - need to prepare JSON fields
      const dataForDb = prepareJsonForDb({
        environmental_metrics: data.environmentalMetrics || {},
        social_metrics: data.socialMetrics || {},
        conduct_metrics: data.conductMetrics || {},
        materiality_analysis: data.materialityAnalysis || {},
        narrative_pat_metrics: data.narrativePATMetrics || {},
        updated_at: new Date().toISOString()
      });

      // Update the report data
      const { error } = await supabase
        .from('reports')
        .update(dataForDb)
        .eq('id', reportId);

      if (error) {
        console.error("Error updating report:", error);
        return false;
      }

      // Update last saved timestamp
      setLastSaved(new Date());
      return true;
    } catch (error) {
      console.error("Error in saveReportData:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Update a single field in the report
  const updateReportField = async (reportId: string, field: keyof Report, value: any): Promise<boolean> => {
    try {
      console.log(`Updating report field: ${String(field)}`, { reportId });
      
      // Prepare update object
      const updateData: Record<string, any> = {
        [field]: value,
        updated_at: new Date().toISOString()
      };

      // Update the specific field
      const { error } = await supabase
        .from('reports')
        .update(updateData)
        .eq('id', reportId);

      if (error) {
        console.error(`Error updating report field ${String(field)}:`, error);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Error in updateReportField for ${String(field)}:`, error);
      return false;
    }
  };

  // Delete report
  const deleteReport = async (reportId: string): Promise<boolean> => {
    try {
      // First delete all subsidiaries for this report
      const { error: subsidiariesError } = await supabase
        .from('subsidiaries')
        .delete()
        .eq('report_id', reportId);

      if (subsidiariesError) {
        console.error("Error deleting subsidiaries:", subsidiariesError);
      }

      // Then delete the report itself
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', reportId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error("Error deleting report:", error);
      return false;
    }
  };

  // Save subsidiaries
  const saveSubsidiaries = async (subsidiaries: Subsidiary[], reportId: string): Promise<boolean> => {
    try {
      // First, delete all existing subsidiaries for this report
      const { error: deleteError } = await supabase
        .from('subsidiaries')
        .delete()
        .eq('report_id', reportId);

      if (deleteError) {
        console.error("Error deleting existing subsidiaries:", deleteError);
        return false;
      }

      // Then, insert the new subsidiaries
      if (subsidiaries.length > 0) {
        const subsidiariesData = subsidiaries.map(sub => ({
          report_id: reportId,
          name: sub.name,
          location: sub.location
        }));

        const { error: insertError } = await supabase
          .from('subsidiaries')
          .insert(subsidiariesData);

        if (insertError) {
          console.error("Error inserting subsidiaries:", insertError);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error saving subsidiaries:", error);
      return false;
    }
  };

  return {
    saveReportData,
    updateReportField,
    deleteReport,
    saveSubsidiaries,
    isSaving,
    lastSaved
  };
};
