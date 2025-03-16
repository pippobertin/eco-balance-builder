
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UploadDataProps } from './types';

export const useDataUploader = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  
  const resetStatus = () => {
    setSuccess(null);
    setError(null);
  };
  
  const uploadData = async ({ 
    data, 
    targetTable = 'municipalities',
    province,
    clearExisting = false 
  }: UploadDataProps) => {
    resetStatus();
    setUploading(true);
    
    try {
      console.log(`Uploading data to ${targetTable}`, {
        data,
        province,
        clearExisting
      });
      
      const requestUrl = import.meta.env.VITE_SUPABASE_URL + '/functions/v1/populate-italian-locations';
      
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        },
        body: JSON.stringify({
          customData: data ? { municipalities: data } : undefined,
          province: province,
          targetTable,
          clearExisting
        })
      });
      
      const result = await response.json();
      
      console.log('Upload result:', result);
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload data');
      }
      
      setSuccess(`Dati caricati con successo! ${result.count || 0} record elaborati.`);
      
      toast({
        title: 'Operazione completata',
        description: `Dati geografici caricati con successo!`,
      });
      
      return result;
    } catch (err: any) {
      console.error('Error uploading data:', err);
      
      const errorMessage = err.message || 'Si è verificato un errore durante il caricamento dei dati.';
      setError(errorMessage);
      
      toast({
        title: 'Errore',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setUploading(false);
    }
  };
  
  return {
    uploading,
    success,
    error,
    resetStatus,
    uploadData,
    selectedProvince,
    setSelectedProvince
  };
};
