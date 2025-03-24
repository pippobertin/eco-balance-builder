
import { useState, useEffect } from 'react';
import { PollutantType } from './types';

export const usePollutantFilter = (pollutants: PollutantType[]) => {
  const [selectedMedium, setSelectedMedium] = useState<number | null>(null);
  const [filteredPollutants, setFilteredPollutants] = useState<PollutantType[]>([]);
  const [currentEditingPollutant, setCurrentEditingPollutant] = useState<PollutantType | null>(null);

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

  // Method to set current editing pollutant
  const setEditingPollutant = (pollutantId: number | null) => {
    if (pollutantId) {
      const pollutant = pollutants.find(p => p.id === pollutantId);
      console.log("Setting current editing pollutant:", pollutant?.name);
      setCurrentEditingPollutant(pollutant || null);
    } else {
      setCurrentEditingPollutant(null);
    }
  };

  return {
    selectedMedium,
    setSelectedMedium,
    filteredPollutants,
    currentEditingPollutant,
    setEditingPollutant
  };
};
