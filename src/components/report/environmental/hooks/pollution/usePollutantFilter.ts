
import { useState, useEffect } from 'react';
import { PollutantType } from './types';

export const usePollutantFilter = (pollutants: PollutantType[]) => {
  const [selectedMedium, setSelectedMedium] = useState<number | null>(null);
  const [filteredPollutants, setFilteredPollutants] = useState<PollutantType[]>([]);

  // Filter pollutants when the selected medium changes
  useEffect(() => {
    if (selectedMedium) {
      console.log("Filtering pollutants for medium:", selectedMedium);
      
      // Filter pollutants based on the selected medium
      const filtered = pollutants.filter(pollutant => {
        // Check the applicable_to property
        const isApplicableByProperty = pollutant.applicable_to && 
          pollutant.applicable_to.includes(selectedMedium);
          
        // Check the release_medium_ids property  
        const isApplicableByMediumIds = pollutant.release_medium_ids && 
          pollutant.release_medium_ids.includes(selectedMedium);
        
        return isApplicableByProperty || isApplicableByMediumIds;
      });
      
      console.log(`Found ${filtered.length} pollutants for medium ${selectedMedium}`, filtered);
      setFilteredPollutants(filtered);
    } else {
      console.log("No medium selected, clearing filtered pollutants");
      setFilteredPollutants([]);
    }
  }, [selectedMedium, pollutants]);

  return {
    selectedMedium,
    setSelectedMedium,
    filteredPollutants
  };
};
