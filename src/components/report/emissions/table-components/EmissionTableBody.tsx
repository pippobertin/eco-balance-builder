
import React from 'react';
import { TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Info, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
        <TableRow key={calculation.id}>
          <TableCell className="font-medium">
            {getCategoryLabel(calculation)}
          </TableCell>
          <TableCell>
            <div className="text-sm">
              {calculation.description && (
                <p className="mb-1">{calculation.description}</p>
              )}
              
              {calculation.source && (
                <p className="text-xs text-gray-500">Fonte: {calculation.source}</p>
              )}
              
              {calculation.details?.period && (
                <p className="text-xs text-gray-500">
                  Periodo: {getPeriodLabel(calculation.details.period)}
                </p>
              )}
              
              {calculation.date && (
                <p className="text-xs text-gray-500">
                  Data: {formatDate(calculation.date)}
                </p>
              )}
              
              {hasVehicleDetails(calculation) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0">
                        <Info className="h-4 w-4 text-blue-500" />
                        <span className="sr-only">Dettagli veicolo</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-80">
                      <div className="space-y-2">
                        <p className="font-medium">Dettagli veicolo</p>
                        <div className="grid grid-cols-2 gap-1 text-sm">
                          <span className="text-gray-500">Tipo:</span>
                          <span>{calculation.details?.vehicleType || "N/D"}</span>
                          
                          <span className="text-gray-500">Carburante:</span>
                          <span>{calculation.details?.vehicleFuelType || "N/D"}</span>
                          
                          <span className="text-gray-500">Classe energetica:</span>
                          <span>{calculation.details?.vehicleEnergyClass || "N/D"}</span>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </TableCell>
          <TableCell className="text-right">
            {formatNumber(calculation.quantity)}
          </TableCell>
          <TableCell className="text-right">
            {calculation.unit}
          </TableCell>
          <TableCell className="text-right font-medium">
            {formatNumber(calculation.emissions)}
          </TableCell>
          <TableCell>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveCalculation(calculation.id)}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
              <span className="sr-only">Rimuovi</span>
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default EmissionTableBody;
