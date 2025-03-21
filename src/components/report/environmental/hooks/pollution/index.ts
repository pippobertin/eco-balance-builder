
import { useEffect } from 'react';
import { usePollutionFetch } from './usePollutionFetch';
import { usePollutionRecords } from './usePollutionRecords';
import { usePollutantFilter } from './usePollutantFilter';
import { usePollutionManagement } from './usePollutionManagement';
import { UsePollutionDataInput, UsePollutionDataOutput } from './types';

export * from './types';
export { usePollutionManagement };

export const usePollutionData = ({ reportId }: UsePollutionDataInput): UsePollutionDataOutput => {
  // Use the fetch hook to handle data loading
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

  // Use the filter hook to handle pollutant filtering
  const {
    selectedMedium,
    setSelectedMedium,
    filteredPollutants
  } = usePollutantFilter(pollutants);

  // Use the records hook to handle CRUD operations
  const {
    isSubmitting,
    editingRecord,
    addRecord,
    updateRecord,
    deleteRecord,
    editRecord,
    cancelEdit
  } = usePollutionRecords(records, setRecords, setSelectedMedium);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
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
