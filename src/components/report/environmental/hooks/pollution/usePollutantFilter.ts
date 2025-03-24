
import { useState, useEffect } from 'react';
import { PollutantType } from './types';

export const usePollutantFilter = (pollutants: PollutantType[], editingPollutantTypeId?: number | null) => {
  const [selectedMedium, setSelectedMedium] = useState<number | null>(null);
  const [filteredPollutants, setFilteredPollutants] = useState<PollutantType[]>([]);

  // Filter pollutants when selected medium changes
  useEffect(() => {
    if (selectedMedium) {
      const filtered = pollutants.filter(pollutant => 
        pollutant.applicable_to?.includes(selectedMedium)
      );
      
      // If editing a record, ensure the current pollutant is in the filtered list
      if (editingPollutantTypeId) {
        const editingPollutant = pollutants.find(p => p.id === editingPollutantTypeId);
        const isEditingPollutantInFiltered = filtered.some(p => p.id === editingPollutantTypeId);
        
        if (editingPollutant && !isEditingPollutantInFiltered) {
          // If the editing pollutant exists but isn't in the filtered list, add it
          console.log("Adding editing pollutant to filtered list:", editingPollutant);
          setFilteredPollutants([...filtered, editingPollutant]);
          return;
        }
      }
      
      setFilteredPollutants(filtered);
    } else {
      setFilteredPollutants([]);
    }
  }, [selectedMedium, pollutants, editingPollutantTypeId]);

  return {
    selectedMedium,
    setSelectedMedium,
    filteredPollutants
  };
};
