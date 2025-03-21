
import React from 'react';
import { PollutantType, PollutionMedium, PollutionRecord } from '../hooks/pollution/types';
import { usePollutionForm } from './hooks/usePollutionForm';
import PollutantFormFields from './components/PollutantFormFields';
import PollutantFormActions from './components/PollutantFormActions';

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
  pollutants: PollutantType[];
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
  isSubmitting,
  pollutants
}) => {
  const {
    pollutantTypeId,
    setPollutantTypeId,
    quantity,
    setQuantity,
    details,
    setDetails,
    resetForm
  } = usePollutionForm({ 
    editingRecord, 
    setSelectedMedium 
  });
  
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
  
  // Check if form is valid for submission
  const isFormValid = !!reportId && !!selectedMedium && !!pollutantTypeId && !!quantity;
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PollutantFormFields
        reportId={reportId}
        mediums={mediums}
        filteredPollutants={filteredPollutants}
        pollutants={pollutants}
        selectedMedium={selectedMedium}
        setSelectedMedium={setSelectedMedium}
        pollutantTypeId={pollutantTypeId}
        setPollutantTypeId={setPollutantTypeId}
        quantity={quantity}
        setQuantity={setQuantity}
        details={details}
        setDetails={setDetails}
        isSubmitting={isSubmitting}
        editingRecord={!!editingRecord}
      />
      
      <PollutantFormActions
        isEditing={!!editingRecord}
        isSubmitting={isSubmitting}
        onCancel={onCancelEdit}
        isValid={isFormValid}
      />
    </form>
  );
};

export default PollutionRecordForm;
