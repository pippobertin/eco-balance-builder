
import { useEffect } from 'react';
import { usePollutionFetch } from './usePollutionFetch';
import { usePollutionRecords } from './usePollutionRecords';
import { usePollutantFilter } from './usePollutantFilter';
import { usePollutionManagement } from './usePollutionManagement';
import { UsePollutionDataInput, UsePollutionDataOutput } from './types';

export * from './types';
export { usePollutionManagement };

export const usePollutionData = ({ reportId }: UsePollutionDataInput): UsePollutionDataOutput => {
  // Usa l'hook di fetch per gestire il caricamento dei dati
  const {
    mediums,
    pollutants,
    records,
    setRecords,
    isLoading,
    fetchMediums,
    fetchPollutants,
    fetchRecords
  } = usePollutionFetch(reportId);

  // Inizializza prima l'hook del filtro per evitare dipendenze circolari
  const {
    selectedMedium,
    setSelectedMedium,
    filteredPollutants
  } = usePollutantFilter(pollutants);

  // Inizializza l'hook dei record con la funzione setSelectedMedium
  const {
    isSubmitting,
    editingRecord,
    addRecord,
    updateRecord,
    deleteRecord,
    editRecord,
    cancelEdit
  } = usePollutionRecords(records, setRecords, setSelectedMedium);

  // Aggiorna il mezzo selezionato in base al record in modifica, se presente
  useEffect(() => {
    if (editingRecord && editingRecord.release_medium_id) {
      console.log("Setting selected medium from editing record:", editingRecord.release_medium_id);
      setSelectedMedium(editingRecord.release_medium_id);
    }
  }, [editingRecord, setSelectedMedium]);

  // Carica i dati iniziali
  useEffect(() => {
    const loadData = async () => {
      console.log("Loading pollution data for report:", reportId);
      await Promise.all([fetchMediums(), fetchPollutants()]);
      if (reportId) {
        await fetchRecords();
      }
    };
    
    loadData();
  }, [reportId]);

  return {
    mediums,
    pollutants,
    filteredPollutants,
    records,
    isLoading,
    isSubmitting,
    selectedMedium,
    setSelectedMedium,
    editingRecord,
    addRecord,
    updateRecord,
    deleteRecord,
    editRecord,
    cancelEdit,
    refreshRecords: fetchRecords
  };
};
