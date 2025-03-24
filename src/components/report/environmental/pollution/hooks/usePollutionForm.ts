
import { useState, useEffect } from 'react';
import { PollutionRecord } from '../../hooks/pollution/types';

interface UsePollutionFormProps {
  editingRecord: PollutionRecord | null;
  setSelectedMedium: (id: number | null) => void;
}

export const usePollutionForm = ({ editingRecord, setSelectedMedium }: UsePollutionFormProps) => {
  const [pollutantTypeId, setPollutantTypeId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  
  // Aggiorna i campi del form quando cambia il record in modifica
  useEffect(() => {
    if (editingRecord) {
      console.log("Editing record:", editingRecord);
      
      // Imposta il mezzo (gestito nel componente genitore tramite setSelectedMedium)
      setSelectedMedium(editingRecord.release_medium_id);
      
      // Imposta il tipo di inquinante
      console.log("Setting pollutant type to:", editingRecord.pollutant_type_id);
      setPollutantTypeId(editingRecord.pollutant_type_id);
      
      // Imposta la quantità (convertita in stringa per il campo input)
      setQuantity(editingRecord.quantity.toString());
      
      // Imposta i dettagli (se disponibili)
      setDetails(editingRecord.details || "");
    } else {
      resetForm();
    }
  }, [editingRecord, setSelectedMedium]);

  const resetForm = () => {
    console.log("Resetting pollution form");
    setPollutantTypeId(null);
    setQuantity("");
    setDetails("");
  };
  
  return {
    pollutantTypeId,
    setPollutantTypeId,
    quantity,
    setQuantity,
    details,
    setDetails,
    resetForm
  };
};
