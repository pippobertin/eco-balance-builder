
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Info, Trash2, Edit } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calculation } from './tableUtils';

interface EmissionTableRowProps {
  calculation: Calculation;
  onRemoveCalculation: (id: string) => void;
  onEditCalculation: (calculation: Calculation) => void;
  getCategoryLabel: (calculation: Calculation) => string;
  formatDate: (dateString: string) => string;
  formatNumber: (num: number, precision?: number) => string;
  getPeriodLabel: (period?: string) => string;
  hasVehicleDetails: (calculation: Calculation) => boolean;
}

const EmissionTableRow: React.FC<EmissionTableRowProps> = ({
  calculation,
  onRemoveCalculation,
  onEditCalculation,
  getCategoryLabel,
  formatDate,
  formatNumber,
  getPeriodLabel,
  hasVehicleDetails
}) => {
  const getDetailsDisplay = () => {
    const details = calculation.details || {};
    
    // Format details based on scope type
    if (calculation.scope === 'scope1') {
      const scope1Source = details.scope1Source;
      
      if (scope1Source === 'fuel') {
        return `${details.fuelType || ''} - ${getPeriodLabel(details.periodType)}`;
      } else {
        return getPeriodLabel(details.periodType);
      }
    } else if (calculation.scope === 'scope2') {
      const energyProvider = details.energyProvider;
      const energyType = details.energyType?.replace(/_/g, ' ');
      
      return `${energyProvider ? ITALIAN_ENERGY_PROVIDERS.find(p => p.value === energyProvider)?.label || energyProvider : ''}
              ${energyType ? `- ${energyType}` : ''} - ${getPeriodLabel(details.periodType)}`;
    } else if (calculation.scope === 'scope3') {
      const scope3Category = details.scope3Category;
      
      if (scope3Category === 'transport') {
        if (hasVehicleDetails(calculation)) {
          const vehicleType = details.vehicleType;
          const fuelType = details.vehicleFuelType;
          const energyClass = details.vehicleEnergyClass;
          
          return `${details.transportType?.replace(/_/g, ' ') || ''} - 
                  ${vehicleType ? `Veicolo: ${vehicleType}` : ''} 
                  ${fuelType ? `Carburante: ${fuelType}` : ''} 
                  ${energyClass ? `Classe: ${energyClass}` : ''} - 
                  ${getPeriodLabel(details.periodType)}`;
        } else {
          return `${details.transportType?.replace(/_/g, ' ') || ''} - ${getPeriodLabel(details.periodType)}`;
        }
      } else if (scope3Category === 'waste') {
        return `${details.wasteType?.replace(/_/g, ' ') || ''} - ${getPeriodLabel(details.periodType)}`;
      } else if (scope3Category === 'purchases') {
        return `${details.purchaseType?.replace(/_/g, ' ') || ''} - ${getPeriodLabel(details.periodType)}`;
      } else {
        return `${details.activityType?.replace(/_/g, ' ') || ''} - ${getPeriodLabel(details.periodType)}`;
      }
    }
    
    return '';
  };
  
  return (
    <TableRow>
      <TableCell className="font-medium">{getCategoryLabel(calculation)}</TableCell>
      <TableCell>{getDetailsDisplay()}</TableCell>
      <TableCell className="text-right">{formatNumber(calculation.quantity)}</TableCell>
      <TableCell className="text-right">{calculation.unit}</TableCell>
      <TableCell className="text-right">{formatNumber(calculation.emissions, 3)}</TableCell>
      <TableCell>
        <div className="flex space-x-2 justify-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onEditCalculation(calculation)}
                  className="h-8 w-8 text-blue-500"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Modifica calcolo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onRemoveCalculation(calculation.id)}
                  className="h-8 w-8 text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Elimina calcolo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
    </TableRow>
  );
};

// Italian energy providers list
const ITALIAN_ENERGY_PROVIDERS = [
  { value: "enel", label: "Enel", renewablePercentage: 80 },
  { value: "eni", label: "Eni Plenitude", renewablePercentage: 40 },
  { value: "a2a", label: "A2A", renewablePercentage: 60 },
  { value: "edison", label: "Edison", renewablePercentage: 50 },
  { value: "hera", label: "Hera", renewablePercentage: 40 },
  { value: "iren", label: "Iren", renewablePercentage: 55 },
  { value: "acea", label: "Acea", renewablePercentage: 50 },
  { value: "sorgenia", label: "Sorgenia", renewablePercentage: 40 },
  { value: "axpo", label: "Axpo", renewablePercentage: 60 },
  { value: "engie", label: "Engie", renewablePercentage: 60 },
  { value: "illumia", label: "Illumia", renewablePercentage: 100 },
  { value: "dolomiti", label: "Dolomiti Energia", renewablePercentage: 90 },
  { value: "enegan", label: "Enegan", renewablePercentage: 100 },
  { value: "duferco", label: "Duferco", renewablePercentage: 40 },
  { value: "altro", label: "Altro", renewablePercentage: 0 }
];

export default EmissionTableRow;
