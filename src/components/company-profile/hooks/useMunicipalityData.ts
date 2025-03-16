
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ensureLocationDataLoaded, countMunicipalities } from '@/components/report/company-information/utils/locationUtils';

export const useMunicipalityData = () => {
  const { toast } = useToast();
  const [municipalityCount, setMunicipalityCount] = useState<number | null>(null);
  const [showDataUploader, setShowDataUploader] = useState(false);

  // Load municipality data
  useEffect(() => {
    const loadLocationData = async () => {
      await ensureLocationDataLoaded(false);
      const count = await countMunicipalities();
      setMunicipalityCount(count);
    };
    
    loadLocationData();
  }, []);

  // Update municipality count when data uploader dialog is closed
  useEffect(() => {
    if (!showDataUploader) {
      countMunicipalities().then(count => setMunicipalityCount(count));
    }
  }, [showDataUploader]);

  // Force reload municipality data
  const handleForceLoadData = async () => {
    // Create a toast notification that will be updated with results
    const toastInstance = toast({
      title: 'Loading',
      description: 'Caricamento forzato dei dati geografici...',
    });
    
    try {
      await ensureLocationDataLoaded(true);
      const count = await countMunicipalities();
      setMunicipalityCount(count);
      
      // Update the toast with success message
      toastInstance.update({
        title: 'Success',
        description: `Dati geografici ricaricati. ${count} comuni disponibili.`,
      });
    } catch (error) {
      console.error('Error forcing data load:', error);
      
      // Update the toast with error message
      toastInstance.update({
        title: 'Error',
        description: 'Errore durante il ricaricamento dei dati',
        variant: 'destructive',
      });
    }
  };

  return {
    municipalityCount,
    showDataUploader,
    setShowDataUploader,
    handleForceLoadData
  };
};
