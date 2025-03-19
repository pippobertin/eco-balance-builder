
import React from 'react';
import { format } from 'date-fns';
import { Table, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Info, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import EmissionTableBody from './table-components/EmissionTableBody';

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
  
  // Utility functions for formatting and labeling
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (e) {
      return 'Data non valida';
    }
  };
  
  const formatNumber = (num: number, precision: number = 2) => {
    if (typeof num !== 'number' || isNaN(num)) return '0';
    return num.toFixed(precision);
  };
  
  const getCategoryLabel = (calculation: Calculation) => {
    try {
      // Extract the category from the calculation details
      const { description, details } = calculation;
      
      if (details?.category) {
        return details.category;
      }
      
      if (description) {
        return description;
      }
      
      return 'N/D';
    } catch (e) {
      return 'N/D';
    }
  };
  
  const getPeriodLabel = (period?: string) => {
    if (!period) return '';
    
    switch (period) {
      case 'annual':
        return 'Annuale';
      case 'monthly':
        return 'Mensile';
      case 'quarterly':
        return 'Trimestrale';
      default:
        return period;
    }
  };
  
  const hasVehicleDetails = (calculation: Calculation) => {
    return calculation.details && (
      calculation.details.vehicleType || 
      calculation.details.vehicleFuelType || 
      calculation.details.vehicleEnergyClass
    );
  };

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
          getCategoryLabel={getCategoryLabel}
          formatDate={formatDate}
          formatNumber={formatNumber}
          getPeriodLabel={getPeriodLabel}
          hasVehicleDetails={hasVehicleDetails}
          scopeLabel={scopeLabel}
        />
      </Table>
    </div>
  );
};

export default EmissionsCalculationTable;
