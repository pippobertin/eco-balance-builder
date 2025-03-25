
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BP1FormData } from '../types';
import { BP1HookResult } from './types';

export const useBP1Data = (reportId: string): BP1HookResult => {
  const [formData, setFormData] = useState<BP1FormData>({
    controversialWeapons: false,
    tobacco: false,
    fossilFuels: false,
    chemicals: false
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [needsSaving, setNeedsSaving] = useState(false);

  // Load data from database
  useEffect(() => {
    const fetchData = async () => {
      if (!reportId) return;
      
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('bp1_revenue_sectors')
          .select('*')
          .eq('report_id', reportId)
          .single();
          
        if (error) {
          if (error.code !== 'PGRST116') { // Not found error is expected for new reports
            console.error("Error fetching BP1 data:", error);
          }
        } else if (data) {
          setFormData({
            controversialWeapons: data.controversial_weapons,
            tobacco: data.tobacco,
            fossilFuels: data.fossil_fuels,
            chemicals: data.chemicals,
            controversialWeaponsRevenue: data.controversial_weapons_revenue,
            tobaccoRevenue: data.tobacco_revenue,
            coalRevenue: data.coal_revenue,
            oilRevenue: data.oil_revenue,
            gasRevenue: data.gas_revenue,
            chemicalsRevenue: data.chemicals_revenue
          });
          setLastSaved(new Date(data.updated_at));
        }
      } catch (error) {
        console.error("Unexpected error fetching BP1 data:", error);
        toast.error("Errore nel caricamento dei dati sui ricavi per settore");
      } finally {
        setIsLoading(false);
        setNeedsSaving(false);
      }
    };

    fetchData();
  }, [reportId]);

  // Update needsSaving state when form data changes
  useEffect(() => {
    if (!isLoading) {
      setNeedsSaving(true);
    }
  }, [formData, isLoading]);

  // Save data to the database
  const saveData = async (): Promise<boolean> => {
    if (!reportId) return false;
    
    setIsLoading(true);
    
    try {
      const now = new Date();
      
      const { error } = await supabase
        .from('bp1_revenue_sectors')
        .upsert({
          report_id: reportId,
          controversial_weapons: formData.controversialWeapons,
          tobacco: formData.tobacco,
          fossil_fuels: formData.fossilFuels,
          chemicals: formData.chemicals,
          controversial_weapons_revenue: formData.controversialWeaponsRevenue,
          tobacco_revenue: formData.tobaccoRevenue,
          coal_revenue: formData.coalRevenue,
          oil_revenue: formData.oilRevenue,
          gas_revenue: formData.gasRevenue,
          chemicals_revenue: formData.chemicalsRevenue,
          updated_at: now.toISOString()
        }, { onConflict: 'report_id' });
        
      if (error) {
        console.error("Error saving BP1 data:", error);
        toast.error("Errore nel salvataggio dei dati sui ricavi per settore");
        return false;
      }
      
      setLastSaved(now);
      setNeedsSaving(false);
      toast.success("Dati sui ricavi per settore salvati con successo");
      return true;
    } catch (error) {
      console.error("Unexpected error saving BP1 data:", error);
      toast.error("Errore nel salvataggio dei dati sui ricavi per settore");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    isLoading,
    saveData,
    lastSaved,
    needsSaving
  };
};
