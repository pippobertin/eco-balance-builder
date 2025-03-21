
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { useReport } from '@/hooks/use-report-context';
import { useWaterMetrics } from './hooks/water';
import WaterHeader from './water/WaterHeader';
import WaterTable from './water/WaterTable';
import WaterDetails from './water/WaterDetails';

interface WaterSectionProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void);
}

const WaterSection: React.FC<WaterSectionProps> = ({
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
  } = useWaterMetrics({ reportId });

  // Handler for local state (water specific fields)
  const handleWaterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numValue = name !== 'waterDetails' && name !== 'areaUnit' 
      ? value === '' ? null : parseFloat(value)
      : value;
    
    updateField(name as keyof typeof data, numValue);
  };

  const handleSaveData = async () => {
    if (await saveData(data)) {
      // Also update the global form state with the water data
      if (typeof setFormValues !== 'function' || setFormValues.length !== 1) {
        (setFormValues as React.Dispatch<React.SetStateAction<any>>)((prev: any) => ({
          ...prev,
          environmentalMetrics: {
            ...prev.environmentalMetrics,
            waterDetails: data.waterDetails
          }
        }));
      }
    }
  };

  // Map the percentage changes to the format required by WaterTable
  const mappedPercentageChanges = {
    waterWithdrawalChange: percentageChanges.withdrawal,
    waterConsumptionChange: percentageChanges.consumption,
    waterStressAreasChange: percentageChanges.stressAreas
  };

  return (
    <GlassmorphicCard>
      <WaterHeader 
        reportId={reportId} 
        isSaving={isSaving} 
        lastSaved={lastSaved} 
      />
      
      <div className="space-y-6">
        <WaterTable 
          data={data} 
          handleChange={handleWaterChange} 
          percentageChanges={mappedPercentageChanges} 
        />

        <WaterDetails 
          value={data.waterDetails} 
          onChange={handleWaterChange} 
        />

        <Button 
          onClick={handleSaveData} 
          disabled={isSaving}
          className="flex items-center"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Salvataggio in corso..." : "Salva dati acqua"}
        </Button>
      </div>
    </GlassmorphicCard>
  );
};

export default WaterSection;
