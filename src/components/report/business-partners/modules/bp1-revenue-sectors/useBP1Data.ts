
import { useState, useEffect } from 'react';
import { BP1FormData, BP1HookResult } from './types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBP1Data = (reportId: string): BP1HookResult => {
  const [formData, setFormData] = useState<BP1FormData>({
    controversialWeapons: false,
    tobacco: false,
    fossilFuels: false,
    chemicals: false
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [needsSaving, setNeedsSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!reportId) return;
      
      setIsLoading(true);
      
      try {
        // BP1 - don't use .single() to avoid 406 errors
        const { data, error } = await supabase
          .from('bp1_revenue_sectors')
          .select('*')
          .eq('report_id', reportId)
          .maybeSingle();
          
        if (!error && data) {
          setFormData({
            controversialWeapons: data.controversial_weapons || false,
            tobacco: data.tobacco || false,
            fossilFuels: data.fossil_fuels || false,
            chemicals: data.chemicals || false,
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
        console.error("Error fetching BP1 data:", error);
        toast.error("Errore nel caricamento dei dati sui settori di ricavo");
      } finally {
        setNeedsSaving(false);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [reportId]);

  // Track changes and set needsSaving flag
  useEffect(() => {
    if (!isLoading) {
      setNeedsSaving(true);
    }
  }, [formData, isLoading]);

  const saveData = async (): Promise<boolean> => {
    if (!reportId) return false;
    
    setIsLoading(true);
    
    try {
      const now = new Date();
      
      // Using .upsert() like BP8 does to handle both insert and update cases
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
        toast.error("Errore nel salvataggio dei dati sui settori di ricavo");
        return false;
      }
      
      setLastSaved(now);
      setNeedsSaving(false);
      toast.success("Dati sui settori di ricavo salvati con successo");
      return true;
    } catch (error: any) {
      console.error("Error saving BP1 data:", error);
      toast.error("Errore nel salvataggio dei dati sui settori di ricavo");
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
