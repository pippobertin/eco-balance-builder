
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { useReport } from '@/hooks/use-report-context';
import { useBiodiversityLandUse } from './hooks/biodiversity';
import BiodiversityHeader from './biodiversity/BiodiversityHeader';
import BiodiversityTable from './biodiversity/BiodiversityTable';
import SensitiveSitesDetails from './biodiversity/SensitiveSitesDetails';

interface BiodiversitySectionProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void);
}

const BiodiversitySection: React.FC<BiodiversitySectionProps> = ({
  formValues,
  setFormValues
}) => {
  const { currentReport } = useReport();
  const reportId = currentReport?.id;
  
  const { 
    data, 
    isLoading, 
    isSaving, 
    saveData, 
    updateField,
    percentageChanges,
    lastSaved
  } = useBiodiversityLandUse({ reportId });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Standard input handler for global state
    if (typeof setFormValues === 'function' && setFormValues.length === 1) {
      setFormValues(e);
    } else {
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

  // Handler for local state (biodiversity specific fields)
  const handleBiodiversityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numValue = name !== 'sensitiveSitesDetails' && name !== 'areaUnit' 
      ? value === '' ? null : parseFloat(value)
      : value;
    
    updateField(name as keyof typeof data, numValue);
  };

  const handleSaveData = async () => {
    if (await saveData(data)) {
      // Also update the global form state with the biodiversity data
      if (typeof setFormValues !== 'function' || setFormValues.length !== 1) {
        (setFormValues as React.Dispatch<React.SetStateAction<any>>)((prev: any) => ({
          ...prev,
          environmentalMetrics: {
            ...prev.environmentalMetrics,
            biodiversityDetails: data.sensitiveSitesDetails
          }
        }));
      }
    }
  };

  return (
    <GlassmorphicCard>
      <BiodiversityHeader 
        reportId={reportId} 
        isSaving={isSaving} 
        lastSaved={lastSaved} 
      />
      
      <div className="space-y-6">
        <BiodiversityTable 
          data={data} 
          handleChange={handleBiodiversityChange} 
          percentageChanges={percentageChanges} 
        />

        <SensitiveSitesDetails 
          value={data.sensitiveSitesDetails} 
          onChange={handleBiodiversityChange} 
        />

        <Button 
          onClick={handleSaveData} 
          disabled={isSaving}
          className="flex items-center"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Salvataggio in corso..." : "Salva dati biodiversità"}
        </Button>
      </div>
    </GlassmorphicCard>
  );
};

export default BiodiversitySection;
