
import React from 'react';
import GHGEmissionsCalculator from '../emissions/calculator/GHGEmissionsCalculator';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import EmissionsSectionHeader from './components/EmissionsSectionHeader';
import SectionAutoSaveIndicator from './components/SectionAutoSaveIndicator';

interface EmissionsEnergySectionProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void);
}

const EmissionsEnergySection: React.FC<EmissionsEnergySectionProps> = ({
  formValues,
  setFormValues
}) => {
  return (
    <div className="space-y-6">
      {/* Gas a effetto serra */}
      <GlassmorphicCard>
        <EmissionsSectionHeader />
        
        <SectionAutoSaveIndicator />
        
        <div className="space-y-4">
          <GHGEmissionsCalculator 
            formValues={formValues} 
            setFormValues={setFormValues} 
          />
        </div>
      </GlassmorphicCard>
    </div>
  );
};

export default EmissionsEnergySection;
