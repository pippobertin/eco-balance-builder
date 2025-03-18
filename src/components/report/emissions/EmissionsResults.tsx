
import React from 'react';

interface EmissionsResultsProps {
  calculatedEmissions: {
    scope1: number;
    scope2: number;
    scope3: number;
    total: number;
  };
}

const EmissionsResults: React.FC<EmissionsResultsProps> = ({ 
  calculatedEmissions
}) => {
  return (
    <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
      <h3 className="text-sm font-semibold mb-2">Risultati del calcolo (tonnellate CO2e):</h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <div className="text-sm text-gray-600">Scope 1:</div>
        <div className="text-sm font-medium">{calculatedEmissions.scope1.toFixed(2)}</div>
        
        <div className="text-sm text-gray-600">Scope 2:</div>
        <div className="text-sm font-medium">{calculatedEmissions.scope2.toFixed(2)}</div>
        
        <div className="text-sm text-gray-600">Scope 3:</div>
        <div className="text-sm font-medium">{calculatedEmissions.scope3.toFixed(2)}</div>
        
        <div className="text-sm text-gray-600 font-semibold">Totale:</div>
        <div className="text-sm font-semibold">{calculatedEmissions.total.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default EmissionsResults;
