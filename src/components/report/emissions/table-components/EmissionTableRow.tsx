
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
      const { 
        period, 
        fuelType, 
        energyProvider, 
        renewablePercentage, 
        wasteType, 
        transportType,
        purchaseDescription
      } = calculation.details;
      
      const detailParts = [];
      
      if (period) {
        detailParts.push(`Periodo: ${getPeriodLabel(period)}`);
      }
      
      if (formattedDate) {
        detailParts.push(`Data: ${formattedDate}`);
      }
      
      // Scope 2 specific: show energy provider
      if (calculation.scope === 'scope2' && energyProvider) {
        detailParts.push(`Fornitore: ${energyProvider}`);
      }
      
      // For scope 1, show fuel type
      if (calculation.scope === 'scope1' && fuelType) {
        detailParts.push(`Combustibile: ${fuelType}`);
      }
      
      if (typeof renewablePercentage === 'number') {
        detailParts.push(`% Rinnovabile: ${renewablePercentage}%`);
      }
      
      // For waste in scope 3
      if (calculation.scope === 'scope3' && wasteType) {
        detailParts.push(`Tipo rifiuto: ${wasteType.replace(/_/g, ' ')}`);
      }
      
      // For purchase in scope 3
      if (calculation.scope === 'scope3' && calculation.details.purchaseType) {
        detailParts.push(`Tipo acquisto: ${calculation.details.purchaseType.replace(/_/g, ' ')}`);
        
        // Truncate description if needed
        if (purchaseDescription) {
          const maxLength = 50;
          const truncatedDescription = purchaseDescription.length > maxLength 
            ? purchaseDescription.substring(0, maxLength) + '...' 
            : purchaseDescription;
          
          detailParts.push(`Descrizione: ${truncatedDescription}`);
        }
      }
      
      // For vehicle-based transport (Business travel, freight)
      if (calculation.scope === 'scope3' && hasVehicleDetails(calculation)) {
        // Vehicle details are handled separately through the tooltip
        detailParts.push('Veicolo: Vedi dettagli →');
      } else if (calculation.scope === 'scope3' && transportType) {
        detailParts.push(`Trasporto: ${transportType.replace(/_/g, ' ')}`);
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
        <div className="flex items-center space-x-1">
          {hasVehicleDetails(calculation) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-blue-600"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-2 p-1">
                    <p className="font-medium">Dettagli Veicolo</p>
                    <div className="grid grid-cols-2 gap-1 text-sm">
                      <span className="text-gray-500">Tipo:</span>
                      <span>
                        {calculation.details?.vehicleType === 'car_small' && 'Auto piccola'}
                        {calculation.details?.vehicleType === 'car_medium' && 'Auto media'}
                        {calculation.details?.vehicleType === 'car_large' && 'Auto grande'}
                        {calculation.details?.vehicleType === 'van_small' && 'Furgone piccolo'}
                        {calculation.details?.vehicleType === 'van_medium' && 'Furgone medio'}
                        {calculation.details?.vehicleType === 'truck_small' && 'Camion piccolo'}
                        {calculation.details?.vehicleType === 'truck_medium' && 'Camion medio'}
                        {calculation.details?.vehicleType === 'truck_large' && 'Camion pesante'}
                        {calculation.details?.vehicleType === 'truck_articulated' && 'Autoarticolato'}
                        {!['car_small', 'car_medium', 'car_large', 'van_small', 'van_medium', 'truck_small', 'truck_medium', 'truck_large', 'truck_articulated'].includes(calculation.details?.vehicleType) && (calculation.details?.vehicleType || 'N/D')}
                      </span>
                      
                      <span className="text-gray-500">Carburante:</span>
                      <span>
                        {calculation.details?.vehicleFuelType === 'DIESEL' && 'Diesel'}
                        {calculation.details?.vehicleFuelType === 'GASOLINE' && 'Benzina'}
                        {calculation.details?.vehicleFuelType === 'LPG' && 'GPL'}
                        {calculation.details?.vehicleFuelType === 'NATURAL_GAS' && 'Metano'}
                        {calculation.details?.vehicleFuelType === 'ELECTRIC' && 'Elettrico'}
                        {calculation.details?.vehicleFuelType === 'HYBRID' && 'Ibrido'}
                        {!['DIESEL', 'GASOLINE', 'LPG', 'NATURAL_GAS', 'ELECTRIC', 'HYBRID'].includes(calculation.details?.vehicleFuelType) && (calculation.details?.vehicleFuelType || 'N/D')}
                      </span>
                      
                      <span className="text-gray-500">Classe Euro:</span>
                      <span>
                        {calculation.details?.vehicleEnergyClass === 'euro6' && 'Euro 6'}
                        {calculation.details?.vehicleEnergyClass === 'euro5' && 'Euro 5'}
                        {calculation.details?.vehicleEnergyClass === 'euro4' && 'Euro 4'}
                        {calculation.details?.vehicleEnergyClass === 'euro3' && 'Euro 3'}
                        {calculation.details?.vehicleEnergyClass === 'euro2' && 'Euro 2'}
                        {calculation.details?.vehicleEnergyClass === 'euro1' && 'Euro 1'}
                        {calculation.details?.vehicleEnergyClass === 'euro0' && 'Euro 0'}
                        {!['euro6', 'euro5', 'euro4', 'euro3', 'euro2', 'euro1', 'euro0'].includes(calculation.details?.vehicleEnergyClass) && (calculation.details?.vehicleEnergyClass || 'N/D')}
                      </span>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
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
        </div>
      </TableCell>
    </TableRow>
  );
};

export default EmissionTableRow;
