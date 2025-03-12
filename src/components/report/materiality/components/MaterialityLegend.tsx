
import React from 'react';
import { categoryColors } from '../utils/esgCategoryUtils';

const MaterialityLegend: React.FC = () => {
  return (
    <div className="flex justify-center mt-4 space-x-6">
      <div className="flex items-center">
        <span className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: categoryColors.environmental }}></span>
        <span className="text-sm">Ambientale</span>
      </div>
      <div className="flex items-center">
        <span className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: categoryColors.social }}></span>
        <span className="text-sm">Sociale</span>
      </div>
      <div className="flex items-center">
        <span className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: categoryColors.governance }}></span>
        <span className="text-sm">Gestione</span>
      </div>
    </div>
  );
};

export default MaterialityLegend;
