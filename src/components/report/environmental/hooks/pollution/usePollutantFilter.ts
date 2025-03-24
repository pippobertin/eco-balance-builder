
import { useState, useEffect } from 'react';
import { PollutantType } from './types';

export const usePollutantFilter = (pollutants: PollutantType[]) => {
  const [selectedMedium, setSelectedMedium] = useState<number | null>(null);
  const [filteredPollutants, setFilteredPollutants] = useState<PollutantType[]>([]);

  // Filtra gli inquinanti quando cambia il mezzo selezionato
  useEffect(() => {
    if (selectedMedium) {
      console.log("Filtering pollutants for medium:", selectedMedium);
      
      // Filtra gli inquinanti in base al mezzo selezionato
      const filtered = pollutants.filter(pollutant => {
        const isApplicable = 
          // Verifica la proprietà applicable_to
          (pollutant.applicable_to && pollutant.applicable_to.includes(selectedMedium)) || 
          // Verifica la proprietà release_medium_ids
          (pollutant.release_medium_ids && pollutant.release_medium_ids.includes(selectedMedium));
        
        return isApplicable;
      });
      
      console.log(`Found ${filtered.length} pollutants for medium ${selectedMedium}`);
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
