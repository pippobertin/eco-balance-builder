
import React from 'react';
import { Table } from "@/components/ui/table";
import { 
  EmissionTableHeader, 
  EmissionTableBody,
  formatDate,
  formatNumber,
  getPeriodLabel,
  getCategoryLabel,
  hasVehicleDetails,
  Calculation
} from './table-components';

interface EmissionsCalculationTableProps {
  scope: 'scope1' | 'scope2' | 'scope3';
  scopeLabel: string;
  calculations: Calculation[];
  onRemoveCalculation: (id: string) => void;
}

const EmissionsCalculationTable: React.FC<EmissionsCalculationTableProps> = ({
  scope,
  scopeLabel,
  calculations,
  onRemoveCalculation
}) => {
  // Partially apply scope to the category label and vehicle details functions
  const getCategoryLabelWithScope = (calculation: Calculation) => 
    getCategoryLabel(calculation, scope);
  
  const hasVehicleDetailsWithScope = (calculation: Calculation) => 
    hasVehicleDetails(calculation, scope);
  
  return (
    <div className="space-y-2">
      <h4 className="text-md font-semibold text-gray-700">{scopeLabel}</h4>
      
      <Table className="border">
        <EmissionTableHeader />
        <EmissionTableBody 
          calculations={calculations}
          onRemoveCalculation={onRemoveCalculation}
          getCategoryLabel={getCategoryLabelWithScope}
          formatDate={formatDate}
          formatNumber={formatNumber}
          getPeriodLabel={getPeriodLabel}
          hasVehicleDetails={hasVehicleDetailsWithScope}
          scopeLabel={scopeLabel}
        />
      </Table>
    </div>
  );
};

export default EmissionsCalculationTable;
