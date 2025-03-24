
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

  // Initialize the filter hook for managing selectedMedium and filteredPollutants
  const {
    selectedMedium,
    setSelectedMedium,
    filteredPollutants,
    currentEditingPollutant,
    setEditingPollutant
  } = usePollutantFilter(pollutants);

  // Initialize the records hook with the setSelectedMedium function
  const {
    isSubmitting,
    editingRecord,
    addRecord,
    updateRecord,
    deleteRecord,
    editRecord,
    cancelEdit
  } = usePollutionRecords(records, setRecords, setSelectedMedium);

  // Update the selected medium based on the editing record, if present
  useEffect(() => {
    if (editingRecord) {
      console.log("Setting selected medium from editing record:", editingRecord.release_medium_id);
      setSelectedMedium(editingRecord.release_medium_id);
      
      if (editingRecord.pollutant_type_id) {
        console.log("Setting editing pollutant from editing record:", editingRecord.pollutant_type_id);
        setEditingPollutant(editingRecord.pollutant_type_id);
      }
    }
  }, [editingRecord, setSelectedMedium, setEditingPollutant]);

  // Load initial data
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
    currentEditingPollutant,
    addRecord,
    updateRecord,
    deleteRecord,
    editRecord,
    cancelEdit,
    refreshRecords: fetchRecords
  };
};
