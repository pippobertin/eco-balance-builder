
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BP1FormData, BP1HookResult } from './types';

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
        // Use .eq and don't use .single() to avoid 406 errors
        const { data, error } = await supabase
          .from('bp1_revenue_sectors')
          .select('*')
          .eq('report_id', reportId);
          
        if (error) {
          console.error("Error fetching BP1 data:", error);
          toast.error("Errore nel caricamento dei dati sui ricavi per settore");
        } else if (data && data.length > 0) {
          // Get the first record if there are multiple (should be only one)
          const record = data[0];
          setFormData({
            controversialWeapons: record.controversial_weapons || false,
            tobacco: record.tobacco || false,
            fossilFuels: record.fossil_fuels || false,
            chemicals: record.chemicals || false,
            controversialWeaponsRevenue: record.controversial_weapons_revenue,
            tobaccoRevenue: record.tobacco_revenue,
            coalRevenue: record.coal_revenue,
            oilRevenue: record.oil_revenue,
            gasRevenue: record.gas_revenue,
            chemicalsRevenue: record.chemicals_revenue
          });
          setLastSaved(new Date(record.updated_at));
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
  const saveData = useCallback(async (): Promise<void> => {
    if (!reportId) return;
    
    setIsLoading(true);
    
    try {
      const now = new Date();
      
      // First check if the record exists
      const { data: existingData, error: checkError } = await supabase
        .from('bp1_revenue_sectors')
        .select('id')
        .eq('report_id', reportId);
      
      if (checkError) {
        console.error("Error checking BP1 data:", checkError);
        throw new Error(checkError.message);
      }

      let result;
      
      if (existingData && existingData.length > 0) {
        // Update existing record
        const { data, error } = await supabase
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
        
        if (error) {
          console.error("Error updating BP1 data:", error);
          throw new Error(error.message);
        }
        result = data;
      } else {
        // Insert new record
        const { data, error } = await supabase
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
        
        if (error) {
          console.error("Error inserting BP1 data:", error);
          throw new Error(error.message);
        }
        result = data;
      }
      
      setLastSaved(now);
      setNeedsSaving(false);
      toast.success("Dati sui ricavi per settore salvati con successo");
    } catch (error: any) {
      console.error("Unexpected error saving BP1 data:", error);
      toast.error(`Errore nel salvataggio dei dati sui ricavi per settore: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [reportId, formData]);

  return {
    formData,
    setFormData,
    isLoading,
    saveData,
    lastSaved,
    needsSaving
  };
};
