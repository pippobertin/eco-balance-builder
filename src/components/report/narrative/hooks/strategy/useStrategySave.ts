
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StrategyFormData } from '../types';
import { toast } from 'sonner';
import { useReport } from '@/context/ReportContext';

export const useStrategySave = (reportId: string, formData: StrategyFormData) => {
  const [isSaving, setIsSaving] = useState(false);
  const { setNeedsSaving } = useReport();

  const saveData = async () => {
    if (!reportId) return;
    
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('narrative_strategy')
        .upsert({
          report_id: reportId,
          products_services: formData.productsServices,
          markets: formData.markets,
          business_relations: formData.businessRelations,
          sustainability_strategy: formData.sustainabilityStrategy,
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error('Error saving strategy data:', error);
        toast.error('Errore durante il salvataggio');
        return;
      }

      setNeedsSaving(false);
      toast.success('Dati salvati con successo');
    } catch (error) {
      console.error('Error in save operation:', error);
      toast.error('Errore durante il salvataggio');
    } finally {
      setIsSaving(false);
    }
  };

  return { saveData, isSaving };
};
