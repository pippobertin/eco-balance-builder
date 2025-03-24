
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

  // Initialize filter hook first to avoid circular dependency
  const {
    selectedMedium,
    setSelectedMedium,
    filteredPollutants
  } = usePollutantFilter(pollutants);

  // Next, initialize the records hook with the setSelectedMedium function
  const {
    isSubmitting,
    editingRecord,
    addRecord,
    updateRecord,
    deleteRecord,
    editRecord,
    cancelEdit
  } = usePollutionRecords(records, setRecords, setSelectedMedium);

  // Update the filtered pollutants based on the editing record if present
  useEffect(() => {
    if (editingRecord && editingRecord.release_medium_id) {
      setSelectedMedium(editingRecord.release_medium_id);
    }
  }, [editingRecord, setSelectedMedium]);

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
