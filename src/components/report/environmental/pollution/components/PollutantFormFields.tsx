
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
  editingRecord
}) => {
  // This effect ensures that if a pollutant type is selected but not in the filtered list
  // (which can happen when editing a record), we still enable the quantity and details fields
  useEffect(() => {
    if (editingRecord && pollutantTypeId && selectedMedium) {
      // The record is already validated, so we should enable the form fields
      // even if the pollutant type is not in the filtered list
      console.log("Editing record with pollutantTypeId:", pollutantTypeId);
    }
  }, [editingRecord, pollutantTypeId, selectedMedium]);

  // Get the current pollutant description
  const getCurrentPollutantDescription = () => {
    if (!pollutantTypeId) return null;
    
    // First check in filtered pollutants
    const filteredPollutant = filteredPollutants.find(p => p.id === pollutantTypeId);
    if (filteredPollutant) return filteredPollutant.description;
    
    // If not found, check in all pollutants (for edit mode)
    const allPollutant = pollutants.find(p => p.id === pollutantTypeId);
    return allPollutant?.description;
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="releaseType">Mezzo di Rilascio</Label>
        <Select
          value={selectedMedium?.toString() || ""}
          onValueChange={(value) => {
            setSelectedMedium(parseInt(value));
            // Don't reset pollutant when changing medium during edit mode
            if (!editingRecord && pollutantTypeId) {
              setPollutantTypeId(null);
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
            {/* When editing, we should include the current pollutant even if it's not in the filtered list */}
            {editingRecord && pollutantTypeId && !filteredPollutants.some(p => p.id === pollutantTypeId) && (
              <SelectItem 
                key={`current-${pollutantTypeId}`} 
                value={pollutantTypeId.toString()}
                title={pollutants.find(p => p.id === pollutantTypeId)?.description || ""}
              >
                {pollutants.find(p => p.id === pollutantTypeId)?.name || "Inquinante selezionato"}
              </SelectItem>
            )}
            
            {filteredPollutants.length > 0 ? (
              filteredPollutants.map((pollutant) => (
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
                Nessun inquinante disponibile per questo mezzo
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
          disabled={!selectedMedium || !pollutantTypeId || !reportId || isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="details">Note (opzionale)</Label>
        <Textarea
          id="details"
          placeholder="Dettagli opzionali sull'inquinante"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          disabled={!selectedMedium || !pollutantTypeId || !reportId || isSubmitting}
        />
      </div>
    </>
  );
};

export default PollutantFormFields;
