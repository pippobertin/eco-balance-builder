
import React, { useState, useEffect } from 'react';
import GHGEmissionsCalculator from '../emissions/calculator/GHGEmissionsCalculator';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import EmissionsSectionHeader from './components/EmissionsSectionHeader';
import AutoSaveIndicator from '@/components/report/AutoSaveIndicator';
import { useReport } from '@/hooks/use-report-context';

interface EmissionsEnergySectionProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void);
}

const EmissionsEnergySection: React.FC<EmissionsEnergySectionProps> = ({
  formValues,
  setFormValues
}) => {
  const { needsSaving, lastSaved } = useReport();
  const [localLastSaved, setLocalLastSaved] = useState<Date | null>(lastSaved);

  // Update local last saved when global state changes
  useEffect(() => {
    if (lastSaved) {
      setLocalLastSaved(lastSaved);
    }
  }, [lastSaved]);

  return (
    <div className="space-y-6">
      {/* Gas a effetto serra */}
      <GlassmorphicCard>
        <EmissionsSectionHeader />
        
        <div className="flex justify-end mb-4">
          <AutoSaveIndicator 
            needsSaving={needsSaving} 
            lastSaved={localLastSaved}
            className="w-full" 
          />
        </div>
        
        <div className="space-y-4">
          <GHGEmissionsCalculator 
            formValues={formValues} 
            setFormValues={setFormValues} 
            onResetClick={() => {}}
          />
        </div>
      </GlassmorphicCard>
    </div>
  );
};

export default EmissionsEnergySection;
