
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StrategyFormData } from '../types';
import { toast } from 'sonner';
import { useReport } from '@/context/ReportContext';

export const useStrategySave = (reportId: string, formData: StrategyFormData) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { setNeedsSaving } = useReport();

  const saveData = async () => {
    if (!reportId) return;
    
    setIsSaving(true);

    try {
      console.log('Saving strategy data for report:', reportId);
      
      // Use upsert operation to either update or insert
      const { error } = await supabase
        .from('narrative_strategy')
        .upsert({
          report_id: reportId,
          products_services: formData.productsServices,
          markets: formData.markets,
          business_relations: formData.businessRelations,
          sustainability_strategy: formData.sustainabilityStrategy,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'report_id'
        });
      
      if (error) {
        console.error('Error saving strategy data:', error);
        toast.error('Errore durante il salvataggio');
        return;
      }

      const newSavedTime = new Date();
      setLastSaved(newSavedTime);
      setNeedsSaving(false);
      toast.success('Dati salvati con successo');
    } catch (error) {
      console.error('Error in save operation:', error);
      toast.error('Errore durante il salvataggio');
    } finally {
      setIsSaving(false);
    }
  };

  return { saveData, isSaving, lastSaved };
};
