
import { useState, useEffect } from 'react';
import { PollutantType } from './types';

export const usePollutantFilter = (pollutants: PollutantType[]) => {
  const [selectedMedium, setSelectedMedium] = useState<number | null>(null);
  const [filteredPollutants, setFilteredPollutants] = useState<PollutantType[]>([]);

  // Filter pollutants based on selected medium
  useEffect(() => {
    if (selectedMedium && pollutants.length > 0) {
      // Filter pollutants that can be released in the selected medium
      const filtered = pollutants.filter(pollutant => 
        pollutant.release_medium_ids && 
        pollutant.release_medium_ids.includes(selectedMedium)
      );
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
