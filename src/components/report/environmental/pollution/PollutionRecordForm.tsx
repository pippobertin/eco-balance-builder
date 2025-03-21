
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Loader2 } from 'lucide-react';
import { PollutionMedium, PollutantType, PollutionRecord } from '../hooks/usePollutionData';

interface PollutionRecordFormProps {
  reportId?: string;
  mediums: PollutionMedium[];
  filteredPollutants: PollutantType[];
  selectedMedium: number | null;
  setSelectedMedium: (id: number | null) => void;
  onAddRecord: (record: PollutionRecord) => Promise<any>;
  isSubmitting?: boolean;
}

const PollutionRecordForm: React.FC<PollutionRecordFormProps> = ({
  reportId,
  mediums,
  filteredPollutants,
  selectedMedium,
  setSelectedMedium,
  onAddRecord,
  isSubmitting = false
}) => {
  const [pollutantId, setPollutantId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [selectedPollutant, setSelectedPollutant] = useState<PollutantType | null>(null);

  useEffect(() => {
    // Reset pollutant when medium changes
    setPollutantId(null);
    setSelectedPollutant(null);
  }, [selectedMedium]);

  useEffect(() => {
    if (pollutantId) {
      const pollutant = filteredPollutants.find(p => p.id === pollutantId) || null;
      setSelectedPollutant(pollutant);
    } else {
      setSelectedPollutant(null);
    }
  }, [pollutantId, filteredPollutants]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reportId || !selectedMedium || !pollutantId) return;
    
    const newRecord: PollutionRecord = {
      report_id: reportId,
      pollutant_type_id: pollutantId,
      release_medium_id: selectedMedium,
      quantity: parseFloat(quantity),
      unit: 'kg',
      details: details.trim() || undefined
    };
    
    const result = await onAddRecord(newRecord);
    
    if (result) {
      // Reset form
      setQuantity('');
      setDetails('');
    }
  };

  const isFormValid = Boolean(
    reportId && 
    selectedMedium && 
    pollutantId && 
    quantity && 
    !isNaN(parseFloat(quantity)) && 
    parseFloat(quantity) > 0
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md bg-gray-50">
      <h4 className="font-medium text-lg">Aggiungi Nuovo Inquinante</h4>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="medium">Mezzo di Rilascio</Label>
          <Select 
            value={selectedMedium?.toString() || ""} 
            onValueChange={(value) => setSelectedMedium(value ? parseInt(value) : null)}
          >
            <SelectTrigger id="medium" className="w-full">
              <SelectValue placeholder="Seleziona mezzo di rilascio" />
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
        
        <div>
          <Label htmlFor="pollutant">Tipo Inquinante</Label>
          <Select 
            value={pollutantId?.toString() || ""} 
            onValueChange={(value) => setPollutantId(value ? parseInt(value) : null)}
            disabled={!selectedMedium || filteredPollutants.length === 0}
          >
            <SelectTrigger id="pollutant" className="w-full">
              <SelectValue placeholder={
                selectedMedium 
                  ? filteredPollutants.length === 0 
                    ? "Nessun inquinante disponibile" 
                    : "Seleziona tipo inquinante"
                  : "Prima seleziona il mezzo di rilascio"
              } />
            </SelectTrigger>
            <SelectContent>
              {filteredPollutants.map((pollutant) => (
                <SelectItem key={pollutant.id} value={pollutant.id.toString()}>
                  {pollutant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedPollutant && (
            <p className="mt-1 text-sm text-gray-500">{selectedPollutant.description}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="quantity">Quantità (kg)</Label>
          <Input
            id="quantity"
            type="number"
            min="0.001"
            step="0.001"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0.0"
          />
        </div>
        
        <div>
          <Label htmlFor="details">Note/Dettagli (opzionale)</Label>
          <Textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Inserisci dettagli o note su questo inquinante"
            rows={3}
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        disabled={!isFormValid || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Aggiunta in corso...
          </>
        ) : (
          <>
            <PlusCircle className="mr-2 h-4 w-4" />
            Aggiungi Inquinante
          </>
        )}
      </Button>
    </form>
  );
};

export default PollutionRecordForm;
