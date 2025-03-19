import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ReportData, Report } from '@/context/types';
import { useToast } from '@/hooks/use-toast';
import { prepareJsonForDb } from '@/integrations/supabase/utils/jsonUtils';

export const useReportDataOperations = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Save report data to database
  const saveReportData = useCallback(async (reportId: string, data: ReportData): Promise<boolean> => {
    if (!reportId) {
      console.error('Cannot save report: reportId is undefined');
      return false;
    }

    setIsSaving(true);
    
    try {
      // Prepare data for database by converting nested objects to JSON strings
      const preparedData = prepareJsonForDb(data);
      
      // Update report data
      const { error } = await supabase
        .from('reports')
        .update({
          ...preparedData,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) throw error;

      setLastSaved(new Date());
      return true;
    } catch (error) {
      console.error('Error saving report data:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile salvare i dati del report',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  // Update specific report field
  const updateReportField = useCallback(async (
    reportId: string, 
    field: keyof Report, 
    value: any
  ): Promise<boolean> => {
    if (!reportId) {
      console.error('Cannot update report field: reportId is undefined');
      return false;
    }

    try {
      // Prepare value for database if it's an object
      const preparedValue = typeof value === 'object' ? JSON.stringify(value) : value;
      
      // Update specific field
      const { error } = await supabase
        .from('reports')
        .update({
          [field]: preparedValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error(`Error updating report field ${field}:`, error);
      return false;
    }
  }, []);

  // Delete report
  const deleteReport = useCallback(async (reportId: string): Promise<boolean> => {
    if (!reportId) {
      console.error('Cannot delete report: reportId is undefined');
      return false;
    }

    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error deleting report:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile eliminare il report',
        variant: 'destructive'
      });
      return false;
    }
  }, [toast]);

  // Save subsidiaries
  const saveSubsidiaries = useCallback(async (subsidiaries: any): Promise<boolean> => {
    if (!subsidiaries) {
      console.error('Cannot save subsidiaries: subsidiaries is undefined');
      return false;
    }

    setIsSaving(true);
    
    try {
      // Prepare subsidiaries data for database by converting nested objects to JSON strings
      const preparedSubsidiaries = prepareJsonForDb(subsidiaries);
      
      // Update subsidiaries data
      const { error } = await supabase
        .from('subsidiaries')
        .update({
          ...preparedSubsidiaries,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setLastSaved(new Date());
      return true;
    } catch (error) {
      console.error('Error saving subsidiaries data:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile salvare i dati delle aziende',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  return {
    saveReportData,
    updateReportField,
    deleteReport,
    isSaving,
    lastSaved,
    saveSubsidiaries
  };
};
