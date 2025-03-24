
import { useState, useEffect } from 'react';
import { PollutantType } from './types';

export const usePollutantFilter = (pollutants: PollutantType[]) => {
  const [selectedMedium, setSelectedMedium] = useState<number | null>(null);
  const [filteredPollutants, setFilteredPollutants] = useState<PollutantType[]>([]);

  // Filter pollutants when selected medium changes
  useEffect(() => {
    if (selectedMedium) {
      // First, filter pollutants by the selected medium
      const filtered = pollutants.filter(pollutant => {
        // Check both applicable_to and release_medium_ids properties
        return (pollutant.applicable_to && pollutant.applicable_to.includes(selectedMedium)) || 
               (pollutant.release_medium_ids && pollutant.release_medium_ids.includes(selectedMedium));
      });
      
      setFilteredPollutants(filtered);
    } else {
      setFilteredPollutants([]);
    }
  }, [selectedMedium, pollutants]);

  return {
    selectedMedium,
    setSelectedMedium,
    filteredPollutants
  };
};
