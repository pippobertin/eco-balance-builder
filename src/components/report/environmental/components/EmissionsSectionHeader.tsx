
import React from 'react';
import { Factory, Info } from 'lucide-react';

const EmissionsSectionHeader: React.FC = () => {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Factory className="mr-2 h-5 w-5 text-red-500" />
          <h3 className="text-xl font-semibold">B3 - Emissioni di gas a effetto serra (GHG) e Energia</h3>
        </div>
      </div>
      
      <div className="p-4 rounded-md mb-4 bg-red-200">
        <div className="flex items-start">
          <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
          <p className="text-sm text-slate-600">
            Le emissioni di gas serra (GHG) sono espresse in tonnellate di CO2 equivalente (CO2e).
            L'energia è espressa in megawattora (MWh).
          </p>
        </div>
      </div>
    </>
  );
};

export default EmissionsSectionHeader;
