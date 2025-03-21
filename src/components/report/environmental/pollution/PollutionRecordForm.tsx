
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PollutantType, PollutionMedium, PollutionRecord } from '../hooks/usePollutionData';
import { Loader2, PenLine } from 'lucide-react';

interface PollutionRecordFormProps {
  reportId?: string;
  mediums: PollutionMedium[];
  filteredPollutants: PollutantType[];
  selectedMedium: number | null;
  setSelectedMedium: (id: number | null) => void;
  onAddRecord: (record: PollutionRecord) => Promise<any>;
  onUpdateRecord?: (record: PollutionRecord) => Promise<any>;
  onCancelEdit?: () => void;
  editingRecord: PollutionRecord | null;
  isSubmitting: boolean;
}

const PollutionRecordForm: React.FC<PollutionRecordFormProps> = ({
  reportId,
  mediums,
  filteredPollutants,
  selectedMedium,
  setSelectedMedium,
  onAddRecord,
  onUpdateRecord,
  onCancelEdit,
  editingRecord,
  isSubmitting
}) => {
  const [pollutantTypeId, setPollutantTypeId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  
  // Set form values when editing record changes
  useEffect(() => {
    if (editingRecord) {
      setSelectedMedium(editingRecord.release_medium_id);
      setPollutantTypeId(editingRecord.pollutant_type_id);
      setQuantity(editingRecord.quantity.toString());
      setDetails(editingRecord.details || "");
    } else {
      resetForm();
    }
  }, [editingRecord, setSelectedMedium]);

  const resetForm = () => {
    setPollutantTypeId(null);
    setQuantity("");
    setDetails("");
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reportId || !selectedMedium || !pollutantTypeId || !quantity) {
      return;
    }
    
    const recordData: PollutionRecord = {
      report_id: reportId,
      pollutant_type_id: pollutantTypeId,
      release_medium_id: selectedMedium,
      quantity: parseFloat(quantity),
      unit: 'kg',
      details: details || undefined
    };
    
    let result;
    
    if (editingRecord && onUpdateRecord) {
      result = await onUpdateRecord({
        ...recordData,
        id: editingRecord.id
      });
    } else {
      result = await onAddRecord(recordData);
    }
    
    if (result) {
      // Reset the form
      resetForm();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="releaseType">Mezzo di Rilascio</Label>
        <Select
          value={selectedMedium?.toString() || ""}
          onValueChange={(value) => {
            setSelectedMedium(parseInt(value));
            // Reset pollutant when changing medium (unless in edit mode)
            if (!editingRecord) {
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
            {filteredPollutants.find(p => p.id === pollutantTypeId)?.description}
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
      
      <div className="flex gap-2">
        <Button 
          type="submit" 
          disabled={!reportId || !selectedMedium || !pollutantTypeId || !quantity || isSubmitting} 
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editingRecord ? 'Aggiornamento...' : 'Salvataggio...'}
            </>
          ) : (
            <>
              {editingRecord ? (
                <>
                  <PenLine className="mr-2 h-4 w-4" />
                  Aggiorna Inquinante
                </>
              ) : (
                'Aggiungi Inquinante'
              )}
            </>
          )}
        </Button>
        
        {editingRecord && onCancelEdit && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancelEdit}
            disabled={isSubmitting}
          >
            Annulla
          </Button>
        )}
      </div>
    </form>
  );
};

export default PollutionRecordForm;
