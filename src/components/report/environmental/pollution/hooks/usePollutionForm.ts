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
