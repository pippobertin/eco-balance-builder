
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UploadDataProps, UploadStatus, FileType } from './types';
import { parseCSV, processJsonData } from './utils';

export const useDataUploader = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [municipalitiesFile, setMunicipalitiesFile] = useState<File | null>(null);
  const [postalCodesFile, setPostalCodesFile] = useState<File | null>(null);
  const [clearExisting, setClearExisting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [fileType, setFileType] = useState<FileType>('json');
  
  const resetStatus = () => {
    setSuccess(null);
    setError(null);
    setUploadStatus('idle');
  };
  
  const handleMunicipalitiesFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setMunicipalitiesFile(e.target.files[0]);
    }
  };

  const handlePostalCodesFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPostalCodesFile(e.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!municipalitiesFile) {
      toast({
        title: 'File mancante',
        description: 'Seleziona un file dei comuni da caricare',
        variant: 'destructive',
      });
      return;
    }
    
    resetStatus();
    setIsUploading(true);
    setUploadStatus('uploading');
    
    try {
      const fileReader = new FileReader();
      
      fileReader.onload = async (event) => {
        const fileContent = event.target?.result as string;
        
        let data;
        if (fileType === 'json') {
          data = processJsonData(fileContent);
        } else {
          data = parseCSV(fileContent);
        }
        
        // Transform the data to match our municipality format
        const transformedData = data.map((item: any) => ({
          name: item.denominazione_ita,
          province_code: item.sigla_provincia,
          postal_codes: [item.cap]
        }));
        
        // Call the uploadData function with the transformed data
        await uploadData({
          data: transformedData,
          clearExisting,
        });
      };
      
      fileReader.readAsText(municipalitiesFile);
    } catch (err: any) {
      console.error('Error processing file:', err);
      setError(err.message || 'Si è verificato un errore durante il caricamento dei dati.');
      setUploadStatus('error');
      
      toast({
        title: 'Errore',
        description: err.message || 'Si è verificato un errore durante il caricamento dei dati.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const uploadData = async ({ 
    data, 
    targetTable = 'municipalities',
    province,
    clearExisting = false 
  }: UploadDataProps) => {
    resetStatus();
    setIsUploading(true);
    setUploadStatus('uploading');
    
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
      setUploadStatus('success');
      
      toast({
        title: 'Operazione completata',
        description: `Dati geografici caricati con successo!`,
      });
      
      return result;
    } catch (err: any) {
      console.error('Error uploading data:', err);
      
      const errorMessage = err.message || 'Si è verificato un errore durante il caricamento dei dati.';
      setError(errorMessage);
      setUploadStatus('error');
      
      toast({
        title: 'Errore',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  return {
    isUploading,
    success,
    error,
    resetStatus,
    uploadData,
    selectedProvince,
    setSelectedProvince,
    municipalitiesFile,
    postalCodesFile,
    clearExisting,
    uploadStatus,
    fileType,
    setFileType,
    setClearExisting,
    handleMunicipalitiesFileChange,
    handlePostalCodesFileChange,
    handleUpload
  };
};
