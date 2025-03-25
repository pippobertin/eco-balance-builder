
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PollutionRecord } from './types';

export const usePollutionManagement = (
  reportId?: string,
  onRecordAdded?: () => void,
  onRecordUpdated?: () => void,
  onRecordDeleted?: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Add a new pollution record
  const addRecord = async (record: PollutionRecord): Promise<PollutionRecord | null> => {
    if (!reportId) {
      toast({
        title: 'Errore',
        description: 'ID report mancante. Impossibile salvare.',
        variant: 'destructive',
      });
      return null;
    }
    
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('pollution_records')
        .insert([{
          ...record,
          report_id: reportId
        }])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        toast({
          title: 'Successo',
          description: 'Inquinante aggiunto con successo',
        });
        
        if (onRecordAdded) onRecordAdded();
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

  // Update an existing pollution record
  const updateRecord = async (record: PollutionRecord): Promise<PollutionRecord | null> => {
    if (!record.id) {
      toast({
        title: 'Errore',
        description: 'ID record mancante. Impossibile aggiornare.',
        variant: 'destructive',
      });
      return null;
    }
    
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('pollution_records')
        .update({
          pollutant_type_id: record.pollutant_type_id,
          release_medium_id: record.release_medium_id,
          quantity: record.quantity,
          details: record.details
        })
        .eq('id', record.id)
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        toast({
          title: 'Successo',
          description: 'Inquinante aggiornato con successo',
        });
        
        if (onRecordUpdated) onRecordUpdated();
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
  const deleteRecord = async (recordId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('pollution_records')
        .delete()
        .eq('id', recordId);
      
      if (error) throw error;
      
      toast({
        title: 'Successo',
        description: 'Inquinante rimosso con successo',
      });
      
      if (onRecordDeleted) onRecordDeleted();
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

  return {
    isSubmitting,
    addRecord,
    updateRecord,
    deleteRecord
  };
};
