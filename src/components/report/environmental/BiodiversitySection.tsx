
import React from 'react';
import { TreePine } from 'lucide-react';
import BiodiversityLandUse from './biodiversity/BiodiversityLandUse';

type BiodiversitySectionProps = {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
};

const BiodiversitySection: React.FC<BiodiversitySectionProps> = ({ 
  formValues, 
  setFormValues 
}) => {
  return (
    <div>
      <div className="flex items-center mb-4">
        <TreePine className="mr-2 h-5 w-5 text-green-500" />
        <h3 className="text-xl font-semibold">B5 - Biodiversità</h3>
      </div>
      
      <div className="space-y-6 mt-6">
        <BiodiversityLandUse />
      </div>
    </div>
  );
};

export default BiodiversitySection;
