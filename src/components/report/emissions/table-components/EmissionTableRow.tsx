
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { VehicleEmissionInfo } from '../scope3-components';

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

interface EmissionTableRowProps {
  calculation: Calculation;
  onRemoveCalculation: (id: string) => void;
  getCategoryLabel: (calculation: Calculation) => string;
  formatDate: (dateString: string) => string;
  formatNumber: (num: number, precision?: number) => string;
  getPeriodLabel: (period?: string) => string;
  hasVehicleDetails: (calculation: Calculation) => boolean;
}

const EmissionTableRow: React.FC<EmissionTableRowProps> = ({
  calculation,
  onRemoveCalculation,
  getCategoryLabel,
  formatDate,
  formatNumber,
  getPeriodLabel,
  hasVehicleDetails
}) => {
  return (
    <React.Fragment>
      <TableRow>
        <TableCell className="font-medium">{getCategoryLabel(calculation)}</TableCell>
        <TableCell>{formatDate(calculation.date)}</TableCell>
        <TableCell>{getPeriodLabel(calculation.details?.periodType)}</TableCell>
        <TableCell>
          {formatNumber(calculation.quantity)} {calculation.unit}
        </TableCell>
        <TableCell className="text-right font-semibold">
          {formatNumber(calculation.emissions)}
        </TableCell>
        <TableCell>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onRemoveCalculation(calculation.id)} 
            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
      
      {hasVehicleDetails(calculation) && (
        <TableRow>
          <TableCell colSpan={6} className="bg-gray-50 p-0 border-t-0">
            <Accordion type="single" collapsible>
              <AccordionItem value="vehicle-details" className="border-0">
                <AccordionTrigger className="py-2 px-4 text-sm text-blue-600 hover:text-blue-800 hover:no-underline">
                  Dettagli veicolo
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-2">
                  <VehicleEmissionInfo 
                    vehicleType={calculation.details.vehicleDetails.vehicleType}
                    vehicleFuelType={calculation.details.vehicleDetails.vehicleFuelType}
                    vehicleEnergyClass={calculation.details.vehicleDetails.vehicleEnergyClass}
                    showCard={false}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
};

export default EmissionTableRow;
