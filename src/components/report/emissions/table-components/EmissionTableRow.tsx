
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Info } from 'lucide-react';
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
  // Get the category label
  const categoryLabel = getCategoryLabel(calculation);
  
  // Format the date
  const formattedDate = formatDate(calculation.date);
  
  // Prepare details text
  let detailsText = '';
  
  try {
    if (calculation.details) {
      const { period, fuelType, energyProvider, renewablePercentage, wasteType, transportType } = calculation.details;
      
      const detailParts = [];
      
      if (period) {
        detailParts.push(`Periodo: ${getPeriodLabel(period)}`);
      }
      
      if (formattedDate) {
        detailParts.push(`Data: ${formattedDate}`);
      }
      
      if (fuelType) {
        detailParts.push(`Combustibile: ${fuelType}`);
      }
      
      if (energyProvider) {
        detailParts.push(`Fornitore: ${energyProvider}`);
      }
      
      if (typeof renewablePercentage === 'number') {
        detailParts.push(`% Rinnovabile: ${renewablePercentage}%`);
      }
      
      if (wasteType) {
        detailParts.push(`Tipo rifiuto: ${wasteType}`);
      }
      
      if (transportType) {
        detailParts.push(`Trasporto: ${transportType}`);
      }
      
      if (hasVehicleDetails(calculation)) {
        const { vehicleType, vehicleFuelType, vehicleEnergyClass } = calculation.details;
        if (vehicleType) detailParts.push(`Veicolo: ${vehicleType}`);
        if (vehicleFuelType) detailParts.push(`Carburante: ${vehicleFuelType}`);
        if (vehicleEnergyClass) detailParts.push(`Classe: ${vehicleEnergyClass}`);
      }
      
      detailsText = detailParts.join(' | ');
    }
  } catch (e) {
    console.error('Error formatting details:', e);
    detailsText = 'Errore nei dettagli';
  }
  
  return (
    <TableRow>
      <TableCell className="font-medium">{categoryLabel}</TableCell>
      <TableCell className="text-sm text-gray-600">{detailsText}</TableCell>
      <TableCell className="text-right">{formatNumber(calculation.quantity)}</TableCell>
      <TableCell className="text-right">{calculation.unit}</TableCell>
      <TableCell className="text-right font-medium">{formatNumber(calculation.emissions)}</TableCell>
      <TableCell>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-red-600"
                onClick={() => onRemoveCalculation(calculation.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Rimuovi calcolo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
    </TableRow>
  );
};

export default EmissionTableRow;
