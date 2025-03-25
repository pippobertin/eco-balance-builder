
import React from 'react';
import { HandMetalIcon } from 'lucide-react';
import PollutionMetrics from './pollution/PollutionMetrics';
import SectionAutoSaveIndicator from './components/SectionAutoSaveIndicator';

type PollutionSectionProps = {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
};

const PollutionSection: React.FC<PollutionSectionProps> = ({ 
  formValues, 
  setFormValues 
}) => {
  return (
    <div>
      <div className="flex items-center mb-4">
        <HandMetalIcon className="mr-2 h-5 w-5 text-red-500" />
        <h3 className="text-xl font-semibold">B4 - Inquinamento</h3>
      </div>
      
      <SectionAutoSaveIndicator className="mb-4" />
      
      <div className="space-y-6 mt-6">
        <PollutionMetrics 
          formValues={formValues} 
          setFormValues={setFormValues} 
        />
      </div>
    </div>
  );
};

export default PollutionSection;
