
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BaseSectionData {
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  needsSaving: boolean;
}

export interface UseSectionDataOptions<T> {
  reportId: string;
  tableName: string;
  initialData: T;
  onDataLoaded?: (data: T) => void;
}

export function useSectionData<T>({ 
  reportId, 
  tableName, 
  initialData,
  onDataLoaded
}: UseSectionDataOptions<T>) {
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [needsSaving, setNeedsSaving] = useState(false);

  // Caricamento dei dati
  useEffect(() => {
    const fetchData = async () => {
      if (!reportId) return;
      
      setIsLoading(true);
      
      try {
        const { data: fetchedData, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('report_id', reportId)
          .maybeSingle();
          
        if (error) {
          if (error.code !== 'PGRST116') { // Not found error is expected for new reports
            console.error(`Error fetching data from ${tableName}:`, error);
          }
        } else if (fetchedData) {
          // Converte le chiavi da snake_case a camelCase
          const formattedData = Object.keys(fetchedData).reduce((acc, key) => {
            if (key === 'id' || key === 'report_id' || key === 'created_at') return acc;
            
            // Converti snake_case in camelCase
            const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
            acc[camelKey] = fetchedData[key];
            
            return acc;
          }, {} as Record<string, any>) as T;
          
          setData(formattedData);
          if (onDataLoaded) onDataLoaded(formattedData);
          
          if (fetchedData.updated_at) {
            setLastSaved(new Date(fetchedData.updated_at));
          }
        }
      } catch (error) {
        console.error(`Unexpected error fetching data from ${tableName}:`, error);
        toast.error(`Errore nel caricamento dei dati`);
      } finally {
        setIsLoading(false);
        setNeedsSaving(false);
      }
    };

    fetchData();
  }, [reportId, tableName, onDataLoaded]);

  // Imposta needsSaving quando i dati cambiano
  useEffect(() => {
    if (!isLoading && !isSaving) {
      setNeedsSaving(true);
    }
  }, [data, isLoading, isSaving]);

  // Funzione per salvare i dati
  const saveData = async (dataToSave: T): Promise<boolean> => {
    if (!reportId) return false;
    
    setIsSaving(true);
    
    try {
      const now = new Date();
      
      // Converti le chiavi da camelCase a snake_case
      const formattedData = Object.keys(dataToSave).reduce((acc, key) => {
        // Converti camelCase in snake_case
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        acc[snakeKey] = dataToSave[key];
        
        return acc;
      }, {} as Record<string, any>);
      
      const { error } = await supabase
        .from(tableName)
        .upsert({
          report_id: reportId,
          ...formattedData,
          updated_at: now.toISOString()
        }, {
          onConflict: 'report_id'
        });
        
      if (error) {
        console.error(`Error saving data to ${tableName}:`, error);
        toast.error(`Errore nel salvataggio dei dati`);
        return false;
      }
      
      setLastSaved(now);
      setNeedsSaving(false);
      toast.success(`Dati salvati con successo`);
      return true;
    } catch (error) {
      console.error(`Unexpected error saving data to ${tableName}:`, error);
      toast.error(`Errore nel salvataggio dei dati`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    data,
    setData,
    isLoading,
    isSaving,
    lastSaved,
    needsSaving,
    saveData
  };
}
