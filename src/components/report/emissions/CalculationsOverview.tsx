
import React from 'react';
import EmissionsCalculationTable from './EmissionsCalculationTable';

interface CalculationsOverviewProps {
  calculationLogs: {
    scope1Calculations?: any[];
    scope2Calculations?: any[];
    scope3Calculations?: any[];
  };
  handleRemoveCalculation: (id: string) => void;
  onEditCalculation: (calculation: any) => void;
}

const CalculationsOverview: React.FC<CalculationsOverviewProps> = ({
  calculationLogs,
  handleRemoveCalculation,
  onEditCalculation
}) => {
  const hasCalculations = calculationLogs && (
    (Array.isArray(calculationLogs.scope1Calculations) && calculationLogs.scope1Calculations.length > 0) || 
    (Array.isArray(calculationLogs.scope2Calculations) && calculationLogs.scope2Calculations.length > 0) || 
    (Array.isArray(calculationLogs.scope3Calculations) && calculationLogs.scope3Calculations.length > 0)
  );
  
  if (!hasCalculations) {
    return (
      <div className="mt-8 space-y-6">
        <h3 className="text-lg font-semibold mb-4">Riepilogo calcoli emissioni</h3>
        <p className="text-gray-500 text-sm">Nessun calcolo effettuato. Utilizzare il calcolatore per aggiungere emissioni.</p>
      </div>
    );
  }
  
  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-lg font-semibold mb-4">Riepilogo calcoli emissioni</h3>
      
      {calculationLogs?.scope1Calculations && calculationLogs.scope1Calculations.length > 0 && (
        <EmissionsCalculationTable 
          scope="scope1" 
          scopeLabel="Scope 1 - Emissioni Dirette" 
          calculations={calculationLogs.scope1Calculations} 
          onRemoveCalculation={handleRemoveCalculation} 
          onEditCalculation={onEditCalculation} 
        />
      )}
      
      {calculationLogs?.scope2Calculations && calculationLogs.scope2Calculations.length > 0 && (
        <EmissionsCalculationTable 
          scope="scope2" 
          scopeLabel="Scope 2 - Energia" 
          calculations={calculationLogs.scope2Calculations} 
          onRemoveCalculation={handleRemoveCalculation} 
          onEditCalculation={onEditCalculation} 
        />
      )}
      
      {calculationLogs?.scope3Calculations && calculationLogs.scope3Calculations.length > 0 && (
        <EmissionsCalculationTable 
          scope="scope3" 
          scopeLabel="Scope 3 - Altre Emissioni" 
          calculations={calculationLogs.scope3Calculations} 
          onRemoveCalculation={handleRemoveCalculation} 
          onEditCalculation={onEditCalculation} 
        />
      )}
    </div>
  );
};

export default CalculationsOverview;
