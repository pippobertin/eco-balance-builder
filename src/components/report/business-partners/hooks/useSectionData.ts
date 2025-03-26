
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { handleSupabaseError } from '@/integrations/supabase/utils/errorUtils';

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

// Define a type for tables that we know have updated_at
type TableWithTimestamps = {
  updated_at: string;
  [key: string]: any;
};

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
  const initialLoadComplete = useRef(false);
  const initialDataRef = useRef<T>(initialData);

  // Load data from database
  useEffect(() => {
    const fetchData = async () => {
      if (!reportId) return;
      
      setIsLoading(true);
      
      try {
        console.log(`Loading data from ${tableName} for report:`, reportId);
        // Use a type assertion to handle the dynamic table name
        const { data: fetchedData, error } = await supabase
          .from(tableName as any)
          .select('*')
          .eq('report_id', reportId)
          .maybeSingle();
          
        if (error) {
          if (error.code !== 'PGRST116') { // Not found error is expected for new reports
            console.error(`Error fetching data from ${tableName}:`, error);
          }
        } else if (fetchedData) {
          console.log(`Data loaded from ${tableName}:`, fetchedData);
          // Converte le chiavi da snake_case a camelCase
          const formattedData = Object.keys(fetchedData).reduce((acc, key) => {
            if (key === 'id' || key === 'report_id' || key === 'created_at') return acc;
            
            // Converti snake_case in camelCase
            const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
            acc[camelKey] = fetchedData[key];
            
            return acc;
          }, {} as Record<string, any>) as T;
          
          setData(formattedData);
          initialDataRef.current = {...formattedData};
          
          if (onDataLoaded) onDataLoaded(formattedData);
          
          // Check if fetchedData has updated_at before trying to use it
          if ('updated_at' in fetchedData) {
            const updatedAt = fetchedData.updated_at as string;
            setLastSaved(new Date(updatedAt));
            console.log(`Last saved date set to:`, new Date(updatedAt));
          }
        }
      } catch (error) {
        console.error(`Unexpected error fetching data from ${tableName}:`, error);
        toast.error(`Errore nel caricamento dei dati`);
      } finally {
        setIsLoading(false);
        initialLoadComplete.current = true;
        setNeedsSaving(false);
      }
    };

    fetchData();
  }, [reportId, tableName, onDataLoaded]);

  // Set needsSaving when data changes but only after initial loading is complete
  useEffect(() => {
    if (!isLoading && !isSaving && initialLoadComplete.current) {
      // Deep compare the current data with the initial data
      const isChanged = JSON.stringify(data) !== JSON.stringify(initialDataRef.current);
      setNeedsSaving(isChanged);
      console.log(`Data changed in ${tableName}, needsSaving:`, isChanged);
    }
  }, [data, isLoading, isSaving, tableName]);

  // Funzione per salvare i dati
  const saveData = async (dataToSave: T): Promise<boolean> => {
    if (!reportId) return false;
    
    setIsSaving(true);
    console.log(`Saving data to ${tableName} for report:`, reportId);
    
    try {
      const now = new Date();
      
      // Converti le chiavi da camelCase a snake_case
      const formattedData = Object.keys(dataToSave).reduce((acc, key) => {
        // Converti camelCase in snake_case
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        acc[snakeKey] = dataToSave[key];
        
        return acc;
      }, {} as Record<string, any>);
      
      // First check if a record exists for this report
      const { data: existingRecord, error: checkError } = await supabase
        .from(tableName as any)
        .select('id')
        .eq('report_id', reportId)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      let error;
      
      if (existingRecord) {
        // Update existing record if found
        console.log(`Updating existing record in ${tableName}`);
        const { error: updateError } = await supabase
          .from(tableName as any)
          .update({
            ...formattedData,
            updated_at: now.toISOString()
          })
          .eq('report_id', reportId);
          
        error = updateError;
      } else {
        // Insert new record if not found
        console.log(`Creating new record in ${tableName}`);
        const { error: insertError } = await supabase
          .from(tableName as any)
          .insert({
            report_id: reportId,
            ...formattedData,
            updated_at: now.toISOString()
          });
          
        error = insertError;
      }
      
      if (error) {
        console.error(`Error saving data to ${tableName}:`, error);
        toast.error(`Errore nel salvataggio dei dati`);
        return false;
      }
      
      // Update the initialData reference to the newly saved data
      initialDataRef.current = {...dataToSave};
      
      // Update save indicators
      setLastSaved(now);
      setNeedsSaving(false);
      console.log(`Data saved to ${tableName}, lastSaved:`, now);
      
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
