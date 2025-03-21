
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PollutionRecord } from './types';

export const usePollutionRecords = (
  records: PollutionRecord[],
  setRecords: React.Dispatch<React.SetStateAction<PollutionRecord[]>>,
  setSelectedMedium: (id: number | null) => void,
  setPollutantTypeId?: (id: number | null) => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PollutionRecord | null>(null);
  const { toast } = useToast();

  // Add a new pollution record
  const addRecord = async (record: PollutionRecord): Promise<PollutionRecord | null> => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('pollution_records')
        .insert([record])
        .select(`
          *,
          pollutant_types (name, description),
          pollution_release_mediums (name)
        `);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setRecords(prev => [...prev, data[0] as PollutionRecord]);
        toast({
          title: 'Successo',
          description: 'Inquinante aggiunto con successo',
        });
        return data[0] as PollutionRecord;
      }
      return null;
    } catch (error) {
      console.error('Error adding pollution record:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile aggiungere l\'inquinante',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update a pollution record
  const updateRecord = async (record: PollutionRecord): Promise<PollutionRecord | null> => {
    if (!record.id) return null;
    
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('pollution_records')
        .update({
          pollutant_type_id: record.pollutant_type_id,
          release_medium_id: record.release_medium_id,
          quantity: record.quantity,
          details: record.details,
          updated_at: new Date().toISOString()
        })
        .eq('id', record.id)
        .select(`
          *,
          pollutant_types (name, description),
          pollution_release_mediums (name)
        `);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setRecords(prev => prev.map(r => r.id === record.id ? data[0] as PollutionRecord : r));
        setEditingRecord(null);
        toast({
          title: 'Successo',
          description: 'Inquinante aggiornato con successo',
        });
        return data[0] as PollutionRecord;
      }
      return null;
    } catch (error) {
      console.error('Error updating pollution record:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile aggiornare l\'inquinante',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a pollution record
  const deleteRecord = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('pollution_records')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setRecords(prev => prev.filter(record => record.id !== id));
      
      // If currently editing this record, clear the edit state
      if (editingRecord && editingRecord.id === id) {
        setEditingRecord(null);
      }
      
      toast({
        title: 'Successo',
        description: 'Inquinante rimosso con successo',
      });
      return true;
    } catch (error) {
      console.error('Error deleting pollution record:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile rimuovere l\'inquinante',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Set a record for editing
  const editRecord = (record: PollutionRecord) => {
    setEditingRecord(record);
    setSelectedMedium(record.release_medium_id);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingRecord(null);
    setSelectedMedium(null);
  };

  return {
    isSubmitting,
    editingRecord,
    addRecord,
    updateRecord,
    deleteRecord,
    editRecord,
    cancelEdit
  };
};
