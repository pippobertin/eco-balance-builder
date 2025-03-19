
import { PeriodType } from '@/lib/emissions-types';

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
  if (typeof num !== 'number') return '0';
  return num.toLocaleString('it-IT', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
};

export const getPeriodLabel = (period?: PeriodType) => {
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

export const hasVehicleDetails = (calculation: Calculation, scope: string) => {
  return scope === 'scope3' && 
         calculation.details?.vehicleDetails && 
         calculation.details.vehicleDetails.vehicleType &&
         calculation.details.vehicleDetails.vehicleFuelType &&
         calculation.details.vehicleDetails.vehicleEnergyClass;
};
