
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
  // Ensure we have numeric values, defaulting to 0 for any non-numeric values
  const scope1 = typeof calculatedEmissions.scope1 === 'number' ? calculatedEmissions.scope1 : 0;
  const scope2 = typeof calculatedEmissions.scope2 === 'number' ? calculatedEmissions.scope2 : 0;
  const scope3 = typeof calculatedEmissions.scope3 === 'number' ? calculatedEmissions.scope3 : 0;
  const total = typeof calculatedEmissions.total === 'number' ? calculatedEmissions.total : 0;

  // Log the values to help with debugging
  console.log('EmissionsResults rendering with values:', { 
    scope1, scope2, scope3, total,
    rawValues: calculatedEmissions
  });

  return (
    <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
      <h3 className="text-sm font-semibold mb-2">Risultati del calcolo (tonnellate CO2e):</h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <div className="text-sm text-gray-600">Scope 1:</div>
        <div className="text-sm font-medium">{scope1.toFixed(2)}</div>
        
        <div className="text-sm text-gray-600">Scope 2:</div>
        <div className="text-sm font-medium">{scope2.toFixed(2)}</div>
        
        <div className="text-sm text-gray-600">Scope 3:</div>
        <div className="text-sm font-medium">{scope3.toFixed(2)}</div>
        
        <div className="text-sm text-gray-600 font-semibold">Totale:</div>
        <div className="text-sm font-semibold">{total.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default EmissionsResults;
