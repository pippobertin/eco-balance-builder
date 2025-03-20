
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { EmissionCalculationRecord, EmissionsResults } from './types';
import { useToast } from '@/hooks/use-toast';

export const useEmissionRecords = (reportId?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  /**
   * Load emission records for a report
   */
  const loadEmissionRecords = async (reportId: string): Promise<EmissionCalculationRecord[]> => {
    if (!reportId) {
      console.error('Cannot load emission records: reportId is undefined');
      return [];
    }
    
    setIsLoading(true);
    
    try {
      console.log('Loading emission records for report:', reportId);
      
      const { data, error } = await supabase
        .from('emission_calculation_records')
        .select('*')
        .eq('report_id', reportId)
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error loading emission records:', error);
        throw error;
      }
      
      console.log('Loaded emission records:', data);
      return data as EmissionCalculationRecord[];
    } catch (error: any) {
      console.error('Unexpected error loading emission records:', error);
      toast({
        title: "Errore",
        description: `Impossibile caricare i dati delle emissioni: ${error.message}`,
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Save a new emission record
   */
  const saveEmissionRecord = async (record: Omit<EmissionCalculationRecord, 'id' | 'date'>) => {
    if (!record.report_id) {
      console.error('Cannot save emission record: report_id in record is undefined');
      return null;
    }
    
    setIsSaving(true);
    
    try {
      console.log('Saving emission record with report_id:', record.report_id);
      
      const newRecord = {
        ...record,
        date: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('emission_calculation_records')
        .insert(newRecord)
        .select()
        .single();
      
      if (error) {
        console.error('Error saving emission record:', error);
        throw error;
      }
      
      console.log('Saved emission record:', data);
      return data as EmissionCalculationRecord;
    } catch (error: any) {
      console.error('Unexpected error saving emission record:', error);
      toast({
        title: "Errore",
        description: `Impossibile salvare il calcolo: ${error.message}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Delete an emission record
   */
  const deleteEmissionRecord = async (recordId: string) => {
    if (!recordId) return false;
    
    setIsSaving(true);
    
    try {
      console.log('Deleting emission record:', recordId);
      
      const { error } = await supabase
        .from('emission_calculation_records')
        .delete()
        .eq('id', recordId);
      
      if (error) {
        console.error('Error deleting emission record:', error);
        throw error;
      }
      
      console.log('Deleted emission record successfully');
      return true;
    } catch (error: any) {
      console.error('Unexpected error deleting emission record:', error);
      toast({
        title: "Errore",
        description: `Impossibile eliminare il calcolo: ${error.message}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Calculate total emissions from records
   */
  const calculateTotals = (records: EmissionCalculationRecord[]): EmissionsResults => {
    // Group records by scope
    const scope1Records = records.filter(record => record.scope === 'scope1');
    const scope2Records = records.filter(record => record.scope === 'scope2');
    const scope3Records = records.filter(record => record.scope === 'scope3');
    
    // Calculate totals for each scope
    const scope1 = scope1Records.reduce((total, record) => total + Number(record.emissions), 0);
    const scope2 = scope2Records.reduce((total, record) => total + Number(record.emissions), 0);
    const scope3 = scope3Records.reduce((total, record) => total + Number(record.emissions), 0);
    
    // Calculate overall total
    const total = scope1 + scope2 + scope3;
    
    return { scope1, scope2, scope3, total };
  };

  /**
   * Create a new calculation record object
   */
  const createRecord = (
    scope: 'scope1' | 'scope2' | 'scope3',
    source: string,
    description: string,
    quantity: number,
    unit: string,
    emissions: number,
    details: any
  ): Omit<EmissionCalculationRecord, 'id' | 'date'> => {
    return {
      report_id: reportId || '',
      scope,
      source,
      description,
      quantity,
      unit,
      emissions,
      details
    };
  };

  return {
    isLoading,
    isSaving,
    loadEmissionRecords,
    saveEmissionRecord,
    deleteEmissionRecord,
    calculateTotals,
    createRecord
  };
};
