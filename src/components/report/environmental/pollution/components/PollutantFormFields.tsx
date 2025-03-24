
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
  // Quando si è in modalità modifica, verifichiamo che tutto funzioni correttamente
  useEffect(() => {
    if (editingRecord && pollutantTypeId) {
      console.log("Form in edit mode with pollutantTypeId:", pollutantTypeId);
      console.log("Current pollutants list:", pollutants);
      console.log("Current filtered pollutants:", filteredPollutants);
      
      // Troviamo l'inquinante corrente
      const currentPollutant = pollutants.find(p => p.id === pollutantTypeId);
      if (currentPollutant) {
        console.log("Found current pollutant:", currentPollutant.name);
      } else {
        console.warn("Could not find pollutant with ID:", pollutantTypeId);
      }
    }
  }, [editingRecord, pollutantTypeId, pollutants, filteredPollutants]);

  // Ottieni la descrizione dell'inquinante attualmente selezionato
  const getCurrentPollutantDescription = () => {
    if (!pollutantTypeId) return null;
    
    // Cerca prima negli inquinanti filtrati
    const filteredPollutant = filteredPollutants.find(p => p.id === pollutantTypeId);
    if (filteredPollutant) return filteredPollutant.description;
    
    // Se non trovato, cerca in tutti gli inquinanti (per la modalità di modifica)
    const allPollutant = pollutants.find(p => p.id === pollutantTypeId);
    return allPollutant?.description;
  };

  // Trova l'inquinante attualmente in modifica tra tutti gli inquinanti se in modalità modifica
  const currentEditingPollutant = editingRecord && pollutantTypeId ? 
    pollutants.find(p => p.id === pollutantTypeId) : null;

  // Funzione per verificare se i campi di quantità e dettagli devono essere abilitati
  const areDetailFieldsEnabled = () => {
    return !!selectedMedium && !!pollutantTypeId && !!reportId && !isSubmitting;
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="releaseType">Mezzo di Rilascio</Label>
        <Select
          value={selectedMedium?.toString() || ""}
          onValueChange={(value) => {
            setSelectedMedium(parseInt(value));
            // Non resettare l'inquinante quando si cambia il mezzo durante la modifica
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
            {/* Mostra sempre l'inquinante corrente quando in modalità modifica */}
            {editingRecord && currentEditingPollutant && (
              <SelectItem 
                key={`current-${currentEditingPollutant.id}`} 
                value={currentEditingPollutant.id.toString()}
              >
                {currentEditingPollutant.name}
              </SelectItem>
            )}
            
            {/* Mostra gli inquinanti filtrati per il mezzo selezionato */}
            {filteredPollutants.length > 0 ? (
              filteredPollutants
                .filter(p => !editingRecord || p.id !== pollutantTypeId) // Evita duplicati con l'inquinante corrente
                .map((pollutant) => (
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
                {editingRecord ? "Seleziona un inquinante" : "Nessun inquinante disponibile per questo mezzo"}
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
