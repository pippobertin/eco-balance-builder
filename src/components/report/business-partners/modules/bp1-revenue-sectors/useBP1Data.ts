
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
          .eq('report_id', reportId);
          
        if (!error && data && data.length > 0) {
          setFormData({
            controversialWeapons: data[0].controversial_weapons || false,
            tobacco: data[0].tobacco || false,
            fossilFuels: data[0].fossil_fuels || false,
            chemicals: data[0].chemicals || false,
            controversialWeaponsRevenue: data[0].controversial_weapons_revenue,
            tobaccoRevenue: data[0].tobacco_revenue,
            coalRevenue: data[0].coal_revenue,
            oilRevenue: data[0].oil_revenue,
            gasRevenue: data[0].gas_revenue,
            chemicalsRevenue: data[0].chemicals_revenue
          });
          
          setLastSaved(new Date(data[0].updated_at));
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

  const saveData = async (): Promise<void> => {
    if (!reportId) return;
    
    setIsLoading(true);
    
    try {
      // Check if record exists
      const { data: existingData, error: checkError } = await supabase
        .from('bp1_revenue_sectors')
        .select('id')
        .eq('report_id', reportId);
        
      if (checkError) throw new Error(checkError.message);
      
      const now = new Date();
      
      if (existingData && existingData.length > 0) {
        // Update existing record
        const { error } = await supabase
          .from('bp1_revenue_sectors')
          .update({
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
          })
          .eq('report_id', reportId);
          
        if (error) throw new Error(error.message);
      } else {
        // Insert new record
        const { error } = await supabase
          .from('bp1_revenue_sectors')
          .insert({
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
          });
          
        if (error) throw new Error(error.message);
      }
      
      setLastSaved(now);
      setNeedsSaving(false);
      toast.success("Dati sui settori di ricavo salvati con successo");
    } catch (error: any) {
      console.error("Error saving BP1 data:", error);
      toast.error("Errore nel salvataggio dei dati sui settori di ricavo");
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
