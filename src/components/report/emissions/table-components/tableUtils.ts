
import { PeriodType } from '@/lib/emissions-types';
import { hasValidVehicleDetails } from '@/lib/vehicle-emissions';

export const formatDate = (dateString: string) => {
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

export const formatNumber = (num: number, precision = 2) => {
  if (typeof num !== 'number' || isNaN(num)) return '0,00';
  return num.toLocaleString('it-IT', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
};

export const getPeriodLabel = (period?: PeriodType | string) => {
  if (!period) return 'Non specificato';
  
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

export interface Calculation {
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

export const getCategoryLabel = (calculation: Calculation, scope: string) => {
  console.log('Getting category label for calculation:', {
    scope,
    calculationDetails: calculation.details
  });
  
  if (scope === 'scope1') {
    return calculation.details?.fuelType ? `Combustibile: ${calculation.details?.fuelType.replace(/_/g, ' ')}` : 'Combustibile';
  } else if (scope === 'scope2') {
    return calculation.details?.energyType ? `Energia: ${calculation.details?.energyType.replace(/_/g, ' ')}` : 'Energia';
  } else if (scope === 'scope3') {
    // Try to get the activity type from details
    const activityType = calculation.details?.activityType || calculation.details?.wasteType || 
                          calculation.details?.purchaseType || calculation.details?.transportType || '';
    
    console.log('Scope 3 activity type:', activityType);
    
    // Se ci sono dettagli del veicolo, mostra informazioni più specifiche
    if (hasValidVehicleDetails(calculation)) {
      const vehicleDetails = calculation.details?.vehicleDetails || calculation.details;
      const vehicleType = vehicleDetails?.vehicleType || '';
      const fuelType = vehicleDetails?.vehicleFuelType || '';
      
      // Mappa dei tipi di veicolo per una visualizzazione più leggibile
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
      
      // Mappa dei tipi di carburante per una visualizzazione più leggibile
      const fuelTypeMap: Record<string, string> = {
        'DIESEL': "Diesel",
        'GASOLINE': "Benzina",
        'LPG': "GPL",
        'NATURAL_GAS': "Metano",
        'BIOFUEL': "Biocarburante",
        'HYBRID': "Ibrido",
        'ELECTRIC': "Elettrico"
      };
      
      const readableVehicleType = vehicleTypeMap[vehicleType] || vehicleType;
      const readableFuelType = fuelTypeMap[fuelType] || fuelType;
      
      return `Trasporto: ${readableVehicleType} (${readableFuelType})`;
    }
    
    if (activityType.includes('FREIGHT') || activityType.includes('BUSINESS_TRAVEL')) {
      return `Trasporto: ${activityType.replace(/_/g, ' ')}`;
    } else if (activityType.includes('WASTE')) {
      return `Rifiuti: ${activityType.replace(/_/g, ' ')}`;
    } else if (activityType.includes('PURCHASED')) {
      return `Acquisti: ${activityType.replace(/_/g, ' ')}${calculation.details?.description ? ` - ${calculation.details.description}` : ''}`;
    }
    
    return activityType.replace(/_/g, ' ') || 'Non specificato';
  }
  
  return 'Non specificato';
};

export const hasVehicleDetails = (calculation: Calculation, scope: string) => {
  return scope === 'scope3' && hasValidVehicleDetails(calculation);
};
