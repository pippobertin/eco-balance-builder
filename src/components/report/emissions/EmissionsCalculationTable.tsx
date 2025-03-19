
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { PeriodType } from '@/lib/emissions-types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { VehicleEmissionInfo } from './scope3-components';

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

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
};

const formatNumber = (num: number, precision = 2) => {
  if (typeof num !== 'number') return '0';
  return num.toLocaleString('it-IT', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
};

const getPeriodLabel = (period?: PeriodType) => {
  switch (period) {
    case PeriodType.ANNUAL:
      return 'Annuale';
    case PeriodType.QUARTERLY:
      return 'Trimestrale';
    case PeriodType.MONTHLY:
      return 'Mensile';
    case PeriodType.WEEKLY:
      return 'Settimanale';
    case PeriodType.DAILY:
      return 'Giornaliero';
    default:
      return 'Non specificato';
  }
};

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
  const getCategoryLabel = (calculation: Calculation) => {
    if (scope === 'scope1') {
      return calculation.details?.fuelType ? `Combustibile: ${calculation.details?.fuelType.replace(/_/g, ' ')}` : 'Combustibile';
    } else if (scope === 'scope2') {
      return calculation.details?.energyType ? `Energia: ${calculation.details?.energyType.replace(/_/g, ' ')}` : 'Energia';
    } else if (scope === 'scope3') {
      const detailType = calculation.details?.activityType || '';
      
      if (detailType.includes('FREIGHT') || detailType.includes('BUSINESS_TRAVEL')) {
        return `Trasporto: ${detailType.replace(/_/g, ' ')}`;
      } else if (detailType.includes('WASTE')) {
        return `Rifiuti: ${detailType.replace(/_/g, ' ')}`;
      } else if (detailType.includes('PURCHASED')) {
        return `Acquisti: ${detailType.replace(/_/g, ' ')}${calculation.details?.description ? ` - ${calculation.details.description}` : ''}`;
      }
      
      return detailType.replace(/_/g, ' ');
    }
    
    return 'Non specificato';
  };
  
  const hasVehicleDetails = (calculation: Calculation) => {
    return scope === 'scope3' && 
           calculation.details?.vehicleDetails && 
           calculation.details.vehicleDetails.vehicleType &&
           calculation.details.vehicleDetails.vehicleFuelType &&
           calculation.details.vehicleDetails.vehicleEnergyClass;
  };
  
  return (
    <div className="space-y-2">
      <h4 className="text-md font-semibold text-gray-700">{scopeLabel}</h4>
      
      <Table className="border">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-1/4">Categoria</TableHead>
            <TableHead className="w-1/6">Data</TableHead>
            <TableHead className="w-1/6">Periodo</TableHead>
            <TableHead className="w-1/6">Quantità</TableHead>
            <TableHead className="w-1/6 text-right">Emissioni (tCO₂e)</TableHead>
            <TableHead className="w-1/12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calculations.map((calculation) => (
            <React.Fragment key={calculation.id}>
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
          ))}
          
          {calculations.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                Nessun calcolo disponibile per {scopeLabel.toLowerCase()}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmissionsCalculationTable;
