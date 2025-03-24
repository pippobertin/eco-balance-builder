
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
  
  // Update form fields when the editing record changes
  useEffect(() => {
    if (editingRecord) {
      console.log("Editing record:", editingRecord);
      
      // Set the medium (handled by the parent component via setSelectedMedium)
      setSelectedMedium(editingRecord.release_medium_id);
      
      // Set the pollutant type
      console.log("Setting pollutant type to:", editingRecord.pollutant_type_id);
      setPollutantTypeId(editingRecord.pollutant_type_id);
      
      // Set the quantity (converted to string for the input field)
      setQuantity(editingRecord.quantity.toString());
      
      // Set the details (if available)
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
