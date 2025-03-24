
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
  
  // Update form fields when editing record changes
  useEffect(() => {
    if (editingRecord) {
      console.log("Editing record:", editingRecord);
      
      // Set medium (handled in parent component via setSelectedMedium)
      setSelectedMedium(editingRecord.release_medium_id);
      
      // Set pollutant type
      setPollutantTypeId(editingRecord.pollutant_type_id);
      console.log("Setting pollutant type to:", editingRecord.pollutant_type_id);
      
      // Set quantity (convert to string for the input field)
      setQuantity(editingRecord.quantity.toString());
      
      // Set details (if available)
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
