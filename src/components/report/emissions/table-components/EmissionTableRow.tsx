
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
      const detailParts = [];
      
      // Include date in all scopes
      if (formattedDate) {
        detailParts.push(`Data: ${formattedDate}`);
      }
      
      // Scope 1 specific details
      if (calculation.scope === 'scope1') {
        const scope1Source = calculation.details.scope1Source;
        if (scope1Source === 'fuel' && calculation.details.fuelType) {
          const fuelTypes: Record<string, string> = {
            'DIESEL': 'Diesel',
            'GASOLINE': 'Benzina',
            'NATURAL_GAS': 'Gas Naturale',
            'LPG': 'GPL',
            'BIOMASS_PELLET': 'Pellet di Biomassa',
            'BIOMASS_WOOD': 'Legna',
            'BIOFUEL': 'Biocombustibile',
            'COAL': 'Carbone',
            'FUEL_OIL': 'Olio Combustibile'
          };
          
          const fuelType = fuelTypes[calculation.details.fuelType] || calculation.details.fuelType;
          detailParts.push(`Combustibile: ${fuelType}`);
        }
        // For other scope1 categories, we leave details empty as requested
      }
      
      // Scope 2 specific details
      else if (calculation.scope === 'scope2') {
        // Show energy provider if available
        if (calculation.details.energyProvider) {
          const providers: Record<string, string> = {
            'enel': 'Enel',
            'eni': 'Eni Plenitude',
            'a2a': 'A2A',
            'edison': 'Edison',
            'hera': 'Hera',
            'iren': 'Iren',
            'acea': 'Acea',
            'sorgenia': 'Sorgenia',
            'axpo': 'Axpo',
            'engie': 'Engie',
            'illumia': 'Illumia',
            'dolomiti': 'Dolomiti Energia',
            'altro': 'Altro'
          };
          
          const provider = providers[calculation.details.energyProvider] || calculation.details.energyProvider;
          detailParts.push(`Fornitore: ${provider}`);
        }
      }
      
      // Scope 3 specific details
      else if (calculation.scope === 'scope3') {
        const scope3Category = calculation.details.scope3Category;
        
        // For transport
        if (scope3Category === 'transport' || 
            calculation.details.transportType === 'BUSINESS_TRAVEL_CAR' || 
            calculation.details.transportType === 'FREIGHT_ROAD') {
          
          if (hasVehicleDetails(calculation)) {
            // Vehicle type mapping
            const vehicleTypeMap: Record<string, string> = {
              'car_small': "Auto piccola",
              'car_medium': "Auto media",
              'car_large': "Auto grande",
              'van_small': "Furgone piccolo",
              'van_medium': "Furgone medio",
              'truck_small': "Camion piccolo",
              'truck_medium': "Camion medio",
              'truck_large': "Camion pesante",
              'truck_articulated': "Autoarticolato"
            };
            
            // Fuel type mapping
            const fuelTypeMap: Record<string, string> = {
              'DIESEL': "Diesel",
              'GASOLINE': "Benzina",
              'LPG': "GPL",
              'NATURAL_GAS': "Metano",
              'BIOFUEL': "Biocarburante",
              'HYBRID': "Ibrido",
              'ELECTRIC': "Elettrico"
            };
            
            // Energy class mapping
            const energyClassMap: Record<string, string> = {
              'euro6': "Euro 6",
              'euro5': "Euro 5",
              'euro4': "Euro 4",
              'euro3': "Euro 3", 
              'euro2': "Euro 2",
              'euro1': "Euro 1",
              'euro0': "Euro 0"
            };
            
            const vehicleType = vehicleTypeMap[calculation.details.vehicleType] || calculation.details.vehicleType;
            const fuelType = fuelTypeMap[calculation.details.vehicleFuelType] || calculation.details.vehicleFuelType;
            const energyClass = energyClassMap[calculation.details.vehicleEnergyClass] || calculation.details.vehicleEnergyClass;
            
            detailParts.push(`Veicolo: ${vehicleType}`);
            detailParts.push(`Carburante: ${fuelType}`);
            detailParts.push(`Classe: ${energyClass}`);
          }
        }
        // For waste
        else if (scope3Category === 'waste' || calculation.details.wasteType) {
          const wasteTypes: Record<string, string> = {
            'WASTE_LANDFILL': 'Rifiuti in discarica',
            'WASTE_RECYCLING': 'Rifiuti riciclati',
            'WASTE_INCINERATION': 'Rifiuti inceneriti',
            'WASTE_COMPOSTING': 'Rifiuti compostati',
            'WASTE_ELECTRONIC': 'Rifiuti elettronici',
            'WASTE_HAZARDOUS': 'Rifiuti pericolosi'
          };
          
          const wasteType = wasteTypes[calculation.details.wasteType] || calculation.details.wasteType;
          detailParts.push(`Tipo rifiuto: ${wasteType.replace(/_/g, ' ')}`);
        }
        // For purchases
        else if (scope3Category === 'purchases' || calculation.details.purchaseType) {
          const purchaseTypes: Record<string, string> = {
            'PURCHASED_GOODS': 'Beni acquistati',
            'PURCHASED_SERVICES': 'Servizi acquistati',
            'PURCHASED_CAPITAL_GOODS': 'Beni strumentali',
            'PURCHASED_IT_EQUIPMENT': 'Attrezzature IT'
          };
          
          const purchaseType = purchaseTypes[calculation.details.purchaseType] || calculation.details.purchaseType;
          detailParts.push(`Tipo acquisto: ${purchaseType.replace(/_/g, ' ')}`);
          
          // Add description if available, truncate if too long
          if (calculation.details.purchaseDescription) {
            const maxLength = 30;
            const truncatedDescription = calculation.details.purchaseDescription.length > maxLength 
              ? calculation.details.purchaseDescription.substring(0, maxLength) + '...' 
              : calculation.details.purchaseDescription;
            
            detailParts.push(`Desc: ${truncatedDescription}`);
          }
        }
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
