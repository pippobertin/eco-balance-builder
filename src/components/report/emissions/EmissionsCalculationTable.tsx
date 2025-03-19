
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Calculator } from 'lucide-react';
import { EmissionCalculationRecord } from '@/hooks/emissions-calculator/types';

interface EmissionsCalculationTableProps {
  scope: 'scope1' | 'scope2' | 'scope3';
  scopeLabel: string;
  calculations: EmissionCalculationRecord[];
  onRemoveCalculation: (id: string) => void;
}

const formatCalculationDescription = (calculation: EmissionCalculationRecord): string => {
  if (calculation.scope === 'scope1') {
    return `${calculation.details.fuelType || ''} (${calculation.details.fuelQuantity || 0} ${calculation.details.fuelUnit || ''})`;
  } else if (calculation.scope === 'scope2') {
    return `${calculation.details.energyType || ''} (${calculation.details.energyQuantity || 0} kWh)`;
  } else if (calculation.scope === 'scope3') {
    if (calculation.details.scope3Category === 'transport') {
      return `${calculation.details.transportType || ''} (${calculation.details.transportDistance || 0} km)`;
    } else if (calculation.details.scope3Category === 'waste') {
      return `${calculation.details.wasteType || ''} (${calculation.details.wasteQuantity || 0} kg)`;
    } else {
      return `${calculation.details.purchaseType || ''} (${calculation.details.purchaseQuantity || 0})`;
    }
  }
  
  return '';
};

const EmissionsCalculationTable: React.FC<EmissionsCalculationTableProps> = ({ 
  scope, 
  scopeLabel, 
  calculations,
  onRemoveCalculation
}) => {
  useEffect(() => {
    console.log(`EmissionsCalculationTable for ${scope} rendered with ${calculations?.length || 0} calculations`);
    if (calculations?.length > 0) {
      console.log(`First calculation in ${scope}:`, calculations[0]);
    }
  }, [calculations, scope]);

  if (!calculations || calculations.length === 0) {
    return (
      <div className="border rounded-md p-4 mb-4">
        <h4 className="text-md font-medium mb-2">{scopeLabel}</h4>
        <p className="text-sm text-gray-500">Nessun calcolo effettuato per questo scope.</p>
      </div>
    );
  }
  
  return (
    <div className="border rounded-md p-4 mb-4">
      <h4 className="text-md font-medium mb-2">{scopeLabel}</h4>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Fonte emissioni</th>
              <th className="px-4 py-2 text-right">Emissioni (t CO2e)</th>
              <th className="px-4 py-2 text-center">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {calculations.map((calc) => (
              <tr key={calc.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">
                  <div className="flex items-center">
                    <Calculator className="mr-2 h-4 w-4 text-gray-400" />
                    <span>{formatCalculationDescription(calc)}</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-right font-medium">
                  {Number(calc.emissions).toFixed(2)}
                </td>
                <td className="px-4 py-2">
                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveCalculation(calc.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Rimuovi calcolo</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t bg-gray-50">
            <tr>
              <td className="px-4 py-2 font-medium">Totale {scopeLabel}</td>
              <td className="px-4 py-2 text-right font-medium">
                {calculations.reduce((sum, calc) => sum + Number(calc.emissions), 0).toFixed(2)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default EmissionsCalculationTable;
