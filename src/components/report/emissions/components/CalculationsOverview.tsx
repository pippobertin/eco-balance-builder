
import React from 'react';
import { EmissionCalculationLogs } from '@/hooks/emissions-calculator/types';
import EmissionsCalculationTable from '../EmissionsCalculationTable';

interface CalculationsOverviewProps {
  calculationLogs: EmissionCalculationLogs;
  handleRemoveCalculation: (id: string) => void;
  handleEditCalculation: (calculation: any) => void;
}

const CalculationsOverview: React.FC<CalculationsOverviewProps> = ({
  calculationLogs,
  handleRemoveCalculation,
  handleEditCalculation
}) => {
  const hasCalculations = calculationLogs && (
    (calculationLogs.scope1Calculations?.length > 0) ||
    (calculationLogs.scope2Calculations?.length > 0) ||
    (calculationLogs.scope3Calculations?.length > 0)
  );

  if (!hasCalculations) {
    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Riepilogo calcoli emissioni</h3>
        <p className="text-gray-500 text-sm">Nessun calcolo effettuato. Utilizzare il calcolatore per aggiungere emissioni.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-lg font-semibold mb-4">Riepilogo calcoli emissioni</h3>
      
      {calculationLogs?.scope1Calculations && calculationLogs.scope1Calculations.length > 0 && 
        <EmissionsCalculationTable 
          scope="scope1" 
          scopeLabel="Scope 1 - Emissioni Dirette" 
          calculations={calculationLogs.scope1Calculations} 
          onRemoveCalculation={handleRemoveCalculation} 
          onEditCalculation={handleEditCalculation} 
        />
      }
      
      {calculationLogs?.scope2Calculations && calculationLogs.scope2Calculations.length > 0 && 
        <EmissionsCalculationTable 
          scope="scope2" 
          scopeLabel="Scope 2 - Energia" 
          calculations={calculationLogs.scope2Calculations} 
          onRemoveCalculation={handleRemoveCalculation} 
          onEditCalculation={handleEditCalculation} 
        />
      }
      
      {calculationLogs?.scope3Calculations && calculationLogs.scope3Calculations.length > 0 && 
        <EmissionsCalculationTable 
          scope="scope3" 
          scopeLabel="Scope 3 - Altre Emissioni" 
          calculations={calculationLogs.scope3Calculations} 
          onRemoveCalculation={handleRemoveCalculation} 
          onEditCalculation={handleEditCalculation} 
        />
      }
    </div>
  );
};

export default CalculationsOverview;
