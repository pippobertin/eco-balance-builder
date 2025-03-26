
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const initialLoadComplete = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!reportId) return;
      
      console.log("Loading BP1 revenue sectors data for report:", reportId);
      setIsLoading(true);
      
      try {
        // BP1 - don't use .single() to avoid 406 errors
        const { data, error } = await supabase
          .from('bp1_revenue_sectors')
          .select('*')
          .eq('report_id', reportId);
          
        if (!error && data && data.length > 0) {
          console.log("BP1 revenue sectors data loaded:", data[0]);
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
          console.log("Setting lastSaved date to:", new Date(data[0].updated_at));
        } else {
          console.log("No BP1 data found or error occurred:", error);
        }
      } catch (error) {
        console.error("Error fetching BP1 data:", error);
        toast.error("Errore nel caricamento dei dati sui settori di ricavo");
      } finally {
        setNeedsSaving(false);
        setIsLoading(false);
        initialLoadComplete.current = true;
      }
    };

    fetchData();
  }, [reportId]);

  // Track changes and set needsSaving flag
  useEffect(() => {
    if (!isLoading && initialLoadComplete.current) {
      console.log("BP1 form data changed, setting needsSaving to true");
      setNeedsSaving(true);
    }
  }, [formData, isLoading]);

  const saveData = async (): Promise<boolean> => {
    if (!reportId) return false;
    
    console.log("Saving BP1 revenue sectors data for report:", reportId);
    setIsLoading(true);
    const now = new Date();
    
    try {
      // Check if record exists
      const { data: existingData, error: checkError } = await supabase
        .from('bp1_revenue_sectors')
        .select('id')
        .eq('report_id', reportId);
        
      if (checkError) {
        console.error("Error checking for existing BP1 data:", checkError);
        throw new Error(checkError.message);
      }
      
      if (existingData && existingData.length > 0) {
        console.log("Updating existing BP1 record");
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
          
        if (error) {
          console.error("Error updating BP1 data:", error);
          throw new Error(error.message);
        }
      } else {
        console.log("Creating new BP1 record");
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
          
        if (error) {
          console.error("Error inserting BP1 data:", error);
          throw new Error(error.message);
        }
      }
      
      console.log("BP1 data saved successfully, setting lastSaved to:", now);
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
