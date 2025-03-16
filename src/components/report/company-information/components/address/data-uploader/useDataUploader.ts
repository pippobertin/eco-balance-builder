
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { FileType, UploadStatus, ItalianMunicipality } from './types';
import { parseCSV, processJsonData, consolidateMunicipalities } from './utils';

export const useDataUploader = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [municipalitiesFile, setMunicipalitiesFile] = useState<File | null>(null);
  const [postalCodesFile, setPostalCodesFile] = useState<File | null>(null);
  const [clearExisting, setClearExisting] = useState(true);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [fileType, setFileType] = useState<FileType>('json');

  const handleMunicipalitiesFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMunicipalitiesFile(e.target.files[0]);
    }
  };

  const handlePostalCodesFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPostalCodesFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!municipalitiesFile) {
      toast.error('Seleziona il file dei comuni');
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');

    try {
      // Read municipalities file
      const municipalitiesText = await municipalitiesFile.text();
      let rawData: ItalianMunicipality[];
      
      if (fileType === 'csv') {
        try {
          // Parse CSV data
          rawData = parseCSV(municipalitiesText);
          if (rawData.length === 0) {
            throw new Error('Nessun dato valido trovato nel file CSV');
          }
        } catch (csvError) {
          console.error('Error parsing CSV:', csvError);
          throw new Error('Il file CSV non è nel formato corretto. Verifica la struttura del file.');
        }
      } else {
        // Process JSON data
        rawData = processJsonData(municipalitiesText);
      }
      
      if (!Array.isArray(rawData)) {
        throw new Error('I dati devono essere in formato array');
      }
      
      // Convert the raw data to our expected format for the 'municipalities_duplicate' table
      const municipalities = rawData.map(item => ({
        name: item.denominazione_ita,
        province_code: item.sigla_provincia,
        postal_codes: item.cap  // Should be an array for 'municipalities_duplicate' table
      }));

      // Group municipalities by name and province code to consolidate postal codes
      const uniqueMunicipalities = consolidateMunicipalities(municipalities);

      // Read postal codes file if provided
      let postalCodes = null;
      if (postalCodesFile) {
        const postalCodesText = await postalCodesFile.text();
        
        if (fileType === 'csv') {
          toast.warning('Il caricamento di codici postali separati in formato CSV non è ancora supportato');
        } else {
          postalCodes = JSON.parse(postalCodesText);
        }
      }

      // Prepare data for upload
      const customData = {
        municipalities: uniqueMunicipalities,
        postalCodes
      };

      // Call the Supabase Edge Function
      const toastId = toast.loading('Caricamento dei dati geografici in corso...');
      
      const { data, error } = await supabase.functions.invoke('populate-italian-locations', {
        body: { 
          customData,
          clearExisting,
          targetTable: 'municipalities_duplicate'  // Specify the target table
        }
      });

      if (error) {
        console.error('Error uploading location data:', error);
        toast.error('Errore nel caricamento dei dati geografici', { id: toastId });
        setUploadStatus('error');
      } else {
        console.log('Location data upload result:', data);
        toast.success(`Dati geografici caricati con successo: ${data.count} comuni`, { id: toastId });
        setUploadStatus('success');
      }
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error(`Errore nel processare i file: ${error.message}`);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
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
