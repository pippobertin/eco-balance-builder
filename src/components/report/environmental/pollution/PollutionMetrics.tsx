
import React from 'react';
import { usePollutionData } from '../hooks/pollution';
import { useReport } from '@/hooks/use-report-context';
import PollutionRecordForm from './PollutionRecordForm';
import PollutionRecordsList from './PollutionRecordsList';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface PollutionMetricsProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

const PollutionMetrics: React.FC<PollutionMetricsProps> = ({ 
  formValues, 
  setFormValues 
}) => {
  const { currentReport } = useReport();
  const reportId = currentReport?.id;
  
  const {
    mediums,
    pollutants,
    filteredPollutants,
    records,
    isLoading,
    isSubmitting,
    selectedMedium,
    setSelectedMedium,
    editingRecord,
    currentEditingPollutant,
    setEditingPollutant,
    addRecord,
    updateRecord,
    deleteRecord,
    editRecord,
    cancelEdit,
    refreshRecords
  } = usePollutionData({ reportId });
  
  // Update the global form values when our data changes
  React.useEffect(() => {
    setFormValues((prev: any) => ({
      ...prev,
      environmentalMetrics: {
        ...prev.environmentalMetrics,
        pollutionRecords: records
      }
    }));
  }, [records, setFormValues]);

  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertDescription>
          Inserisci le informazioni sugli inquinanti rilasciati nell'ambiente. Per ciascun inquinante, seleziona il mezzo di rilascio (aria, acqua, suolo) e la quantità.
        </AlertDescription>
      </Alert>

      {/* Form to add/edit pollution records */}
      <div className="border rounded-md p-4 bg-gray-50">
        <h3 className="text-lg font-medium mb-4">
          {editingRecord ? "Modifica inquinante" : "Aggiungi un nuovo inquinante"}
        </h3>
        
        <PollutionRecordForm
          reportId={reportId}
          mediums={mediums}
          filteredPollutants={filteredPollutants}
          selectedMedium={selectedMedium}
          setSelectedMedium={setSelectedMedium}
          onAddRecord={addRecord}
          onUpdateRecord={updateRecord}
          onCancelEdit={cancelEdit}
          editingRecord={editingRecord}
          isSubmitting={isSubmitting}
          pollutants={pollutants}
          currentEditingPollutant={currentEditingPollutant}
          setEditingPollutant={setEditingPollutant}
        />
      </div>

      {/* Table of existing pollution records */}
      <div>
        <h3 className="text-lg font-medium mb-4">Inquinanti registrati</h3>
        
        <PollutionRecordsList
          records={records}
          pollutants={pollutants}
          mediums={mediums}
          onDeleteRecord={deleteRecord}
          onEditRecord={editRecord}
          isLoading={isLoading}
          editingId={editingRecord?.id}
        />
      </div>
    </div>
  );
};

export default PollutionMetrics;
