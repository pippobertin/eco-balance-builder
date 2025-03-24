
import React, { useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PollutantType, PollutionMedium } from '../../hooks/pollution/types';

interface PollutantFormFieldsProps {
  reportId?: string;
  mediums: PollutionMedium[];
  filteredPollutants: PollutantType[];
  pollutants: PollutantType[];
  selectedMedium: number | null;
  setSelectedMedium: (id: number | null) => void;
  pollutantTypeId: number | null;
  setPollutantTypeId: (id: number | null) => void;
  quantity: string;
  setQuantity: (value: string) => void;
  details: string;
  setDetails: (value: string) => void;
  isSubmitting: boolean;
  editingRecord: boolean;
  currentEditingPollutant: PollutantType | null;
}

const PollutantFormFields: React.FC<PollutantFormFieldsProps> = ({
  reportId,
  mediums,
  filteredPollutants,
  pollutants,
  selectedMedium,
  setSelectedMedium,
  pollutantTypeId,
  setPollutantTypeId,
  quantity,
  setQuantity,
  details,
  setDetails,
  isSubmitting,
  editingRecord,
  currentEditingPollutant
}) => {
  // Debug editing mode
  useEffect(() => {
    if (editingRecord && pollutantTypeId) {
      console.log("Form in edit mode with pollutantTypeId:", pollutantTypeId);
      console.log("Current pollutants list count:", pollutants.length);
      console.log("Current filtered pollutants count:", filteredPollutants.length);
      console.log("Current editing pollutant:", currentEditingPollutant?.name);
      
      // Check if the current pollutant can be found in the dropdown
      const matchingPollutant = pollutants.find(p => p.id === pollutantTypeId);
      if (matchingPollutant) {
        console.log("Found matching pollutant in full list:", matchingPollutant.name);
      } else {
        console.warn("Could not find pollutant with ID:", pollutantTypeId);
      }
    }
  }, [editingRecord, pollutantTypeId, pollutants, filteredPollutants, currentEditingPollutant]);

  // Get the description of the currently selected pollutant
  const getCurrentPollutantDescription = () => {
    if (!pollutantTypeId) return null;
    
    if (currentEditingPollutant && currentEditingPollutant.id === pollutantTypeId) {
      return currentEditingPollutant.description;
    }
    
    // Look first in the filtered pollutants
    const filteredPollutant = filteredPollutants.find(p => p.id === pollutantTypeId);
    if (filteredPollutant) return filteredPollutant.description;
    
    // If not found, look in all pollutants
    const allPollutant = pollutants.find(p => p.id === pollutantTypeId);
    return allPollutant?.description;
  };

  // Function to check if quantity and details fields should be enabled
  const areDetailFieldsEnabled = () => {
    return !!selectedMedium && !!pollutantTypeId && !!reportId && !isSubmitting;
  };

  // Build the list of pollutants to display in the dropdown
  const getDisplayablePollutants = () => {
    // Start with filtered pollutants
    let displayablePollutants = [...filteredPollutants];
    
    // Add the current editing pollutant if it exists and not already in the list
    if (currentEditingPollutant && 
        !displayablePollutants.some(p => p.id === currentEditingPollutant.id)) {
      console.log("Adding current editing pollutant to displayable list:", currentEditingPollutant.name);
      displayablePollutants = [currentEditingPollutant, ...displayablePollutants];
    }
    
    return displayablePollutants;
  };

  const displayablePollutants = getDisplayablePollutants();

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="releaseType">Mezzo di Rilascio</Label>
        <Select
          value={selectedMedium?.toString() || ""}
          onValueChange={(value) => {
            const mediumId = parseInt(value);
            setSelectedMedium(mediumId);
            
            // Reset pollutant only if we're not in edit mode
            if (!editingRecord) {
              setPollutantTypeId(null);
            } else {
              // In edit mode, check if the current pollutant is valid for this medium
              const isPollutantValidForMedium = pollutants
                .filter(p => p.id === pollutantTypeId)
                .some(p => {
                  const applicableToMedium = p.applicable_to?.includes(mediumId) || false;
                  const inMediumIds = p.release_medium_ids?.includes(mediumId) || false;
                  return applicableToMedium || inMediumIds;
                });
              
              if (!isPollutantValidForMedium) {
                console.log("Pollutant not valid for new medium, resetting");
                setPollutantTypeId(null);
              }
            }
          }}
          disabled={!reportId || isSubmitting}
        >
          <SelectTrigger id="releaseType">
            <SelectValue placeholder="Seleziona il mezzo di rilascio" />
          </SelectTrigger>
          <SelectContent>
            {mediums.map((medium) => (
              <SelectItem key={medium.id} value={medium.id.toString()}>
                {medium.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="pollutantType">Tipo di Inquinante</Label>
        <Select
          value={pollutantTypeId?.toString() || ""}
          onValueChange={(value) => setPollutantTypeId(parseInt(value))}
          disabled={!selectedMedium || !reportId || isSubmitting}
        >
          <SelectTrigger id="pollutantType">
            <SelectValue placeholder={selectedMedium ? "Seleziona l'inquinante" : "Prima seleziona il mezzo di rilascio"} />
          </SelectTrigger>
          <SelectContent>
            {displayablePollutants.length > 0 ? (
              displayablePollutants.map((pollutant) => (
                <SelectItem 
                  key={pollutant.id} 
                  value={pollutant.id.toString()}
                  title={pollutant.description}
                >
                  {pollutant.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                {selectedMedium ? "Nessun inquinante disponibile per questo mezzo" : "Prima seleziona il mezzo di rilascio"}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        
        {pollutantTypeId && (
          <p className="text-xs text-gray-500 mt-1">
            {getCurrentPollutantDescription() || ""}
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantità (kg)</Label>
        <Input
          id="quantity"
          type="number"
          step="0.01"
          min="0"
          placeholder="Inserisci la quantità"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          disabled={!areDetailFieldsEnabled()}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="details">Note (opzionale)</Label>
        <Textarea
          id="details"
          placeholder="Dettagli opzionali sull'inquinante"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          disabled={!areDetailFieldsEnabled()}
        />
      </div>
    </>
  );
};

export default PollutantFormFields;
