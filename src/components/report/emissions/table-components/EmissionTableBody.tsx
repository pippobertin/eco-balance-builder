
import React from 'react';
import { TableBody, TableRow, TableCell } from "@/components/ui/table";
import EmissionTableRow from './EmissionTableRow';
import { Calculation } from './tableUtils';

interface EmissionTableBodyProps {
  calculations: Calculation[];
  onRemoveCalculation: (id: string) => void;
  getCategoryLabel: (calculation: Calculation) => string;
  formatDate: (dateString: string) => string;
  formatNumber: (num: number, precision?: number) => string;
  getPeriodLabel: (period?: string) => string;
  hasVehicleDetails: (calculation: Calculation) => boolean;
  scopeLabel: string;
}

const EmissionTableBody: React.FC<EmissionTableBodyProps> = ({
  calculations,
  onRemoveCalculation,
  getCategoryLabel,
  formatDate,
  formatNumber,
  getPeriodLabel,
  hasVehicleDetails,
  scopeLabel
}) => {
  if (!calculations || calculations.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center">
            Nessun calcolo disponibile per {scopeLabel}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {calculations.map((calculation) => (
        <EmissionTableRow 
          key={calculation.id}
          calculation={calculation}
          onRemoveCalculation={onRemoveCalculation}
          getCategoryLabel={getCategoryLabel}
          formatDate={formatDate}
          formatNumber={formatNumber}
          getPeriodLabel={getPeriodLabel}
          hasVehicleDetails={hasVehicleDetails}
        />
      ))}
    </TableBody>
  );
};

export default EmissionTableBody;
