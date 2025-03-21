
import React from 'react';
import { format } from 'date-fns';
import { Table, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Info, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import EmissionTableBody from './table-components/EmissionTableBody';
import { getCategoryLabel, formatDate, formatNumber, getPeriodLabel, hasVehicleDetails } from './table-components/tableUtils';

interface Calculation {
  id: string;
  description: string;
  source: string;
  scope: string;
  date: string;
  quantity: number;
  unit: string;
  emissions: number;
  details?: any;
}

interface EmissionsCalculationTableProps {
  scope: string;
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
  // If calculations are not an array or empty, display a message
  if (!Array.isArray(calculations) || calculations.length === 0) {
    return (
      <div className="border rounded-md p-4 bg-gray-50">
        <h4 className="font-medium text-gray-700 mb-2">{scopeLabel}</h4>
        <p className="text-gray-500 text-sm">Nessun calcolo disponibile per questo ambito.</p>
      </div>
    );
  }
  
  return (
    <div className="border rounded-md p-4">
      <h4 className="font-medium text-gray-700 mb-4">{scopeLabel}</h4>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Categoria</TableHead>
            <TableHead>Dettagli</TableHead>
            <TableHead className="w-[100px] text-right">Quantità</TableHead>
            <TableHead className="w-[80px] text-right">Unità</TableHead>
            <TableHead className="w-[120px] text-right">Emissioni tCO2e</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        
        <EmissionTableBody
          calculations={calculations}
          onRemoveCalculation={onRemoveCalculation}
          getCategoryLabel={(calculation) => getCategoryLabel(calculation, scope)}
          formatDate={formatDate}
          formatNumber={formatNumber}
          getPeriodLabel={getPeriodLabel}
          hasVehicleDetails={(calculation) => hasVehicleDetails(calculation, scope)}
          scopeLabel={scopeLabel}
        />
      </Table>
    </div>
  );
};

export default EmissionsCalculationTable;
