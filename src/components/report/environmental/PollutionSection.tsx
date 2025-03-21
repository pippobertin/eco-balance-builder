
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Wind, Info, AlertCircle } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePollutionData } from './hooks/usePollutionData';
import PollutionRecordForm from './pollution/PollutionRecordForm';
import PollutionRecordsList from './pollution/PollutionRecordsList';
import { useReport } from '@/hooks/use-report-context';

interface PollutionSectionProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void);
}

const PollutionSection: React.FC<PollutionSectionProps> = ({
  formValues,
  setFormValues
}) => {
  const { currentReport } = useReport();
  const reportId = currentReport?.id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    mediums,
    pollutants,
    filteredPollutants,
    records,
    isLoading,
    selectedMedium,
    setSelectedMedium,
    addRecord,
    deleteRecord
  } = usePollutionData(reportId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Check if setFormValues is a function that accepts an event directly (for location-specific metrics)
    if (typeof setFormValues === 'function' && setFormValues.length === 1) {
      setFormValues(e);
    } else {
      // This is the standard approach for global metrics
      const { name, value } = e.target;
      (setFormValues as React.Dispatch<React.SetStateAction<any>>)((prev: any) => ({
        ...prev,
        environmentalMetrics: {
          ...prev.environmentalMetrics,
          [name]: value
        }
      }));
    }
  };

  const handleAddRecord = async (record: any) => {
    setIsSubmitting(true);
    try {
      const result = await addRecord(record);
      return result;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassmorphicCard>
      <div className="flex items-center mb-4">
        <Wind className="mr-2 h-5 w-5 text-blue-500" />
        <h3 className="text-xl font-semibold">B4 - Inquinamento</h3>
      </div>
      
      <div className="space-y-6">
        <div className="p-4 rounded-md mb-4 bg-blue-100">
          <div className="flex items-start">
            <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
            <p className="text-sm text-slate-600">
              Indica le sostanze inquinanti emesse nell'aria, nell'acqua e nel suolo nel corso delle attività, 
              che sei tenuto per legge a comunicare alle autorità competenti o che già comunichi in base a un 
              sistema di gestione ambientale.
            </p>
          </div>
        </div>
        
        {!reportId && (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Per registrare gli inquinanti è necessario prima salvare il report.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium">Registro Inquinanti</h4>
            <PollutionRecordForm
              reportId={reportId}
              mediums={mediums}
              filteredPollutants={filteredPollutants}
              selectedMedium={selectedMedium}
              setSelectedMedium={setSelectedMedium}
              onAddRecord={handleAddRecord}
              isSubmitting={isSubmitting}
            />
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Inquinanti Registrati</h4>
            <PollutionRecordsList
              records={records}
              pollutants={pollutants}
              mediums={mediums}
              onDeleteRecord={deleteRecord}
              isLoading={isLoading}
            />
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium mb-2">Note aggiuntive sull'inquinamento</h4>
          <div>
            <Label htmlFor="pollutionDetails">Dettagli sul sistema di gestione degli inquinanti (opzionale)</Label>
            <Textarea 
              id="pollutionDetails" 
              name="pollutionDetails" 
              placeholder="Fornisci dettagli sui sistemi di gestione ambientale adottati e ulteriori informazioni sugli inquinanti." 
              value={formValues.environmentalMetrics?.pollutionDetails || ""} 
              onChange={handleChange} 
              className="min-h-[120px]" 
            />
          </div>
        </div>
      </div>
    </GlassmorphicCard>
  );
};

export default PollutionSection;
