
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
    // For scope1, show the scope1Source as the category label
    const scope1Source = calculation.details?.scope1Source || '';
    
    switch (scope1Source) {
      case 'fuel':
        return 'COMBUSTIBILI PER PRODUZIONE';
      case 'fleet':
        return 'FLOTTA AZIENDALE';
      case 'other':
        return 'ALTRE FONTI DIRETTE';
      default:
        return 'COMBUSTIBILI PER PRODUZIONE';
    }
  } else if (scope === 'scope2') {
    return calculation.details?.energyType ? `Energia: ${calculation.details?.energyType.replace(/_/g, ' ')}` : 'Energia';
  } else if (scope === 'scope3') {
    // For scope3, display the category based on scope3Category
    const scope3Category = calculation.details?.scope3Category || '';
    
    switch (scope3Category) {
      case 'transport':
        return 'TRASPORTO E LOGISTICA';
      case 'waste':
        return 'GESTIONE RIFIUTI';
      case 'purchases':
        return 'ACQUISTO DI BENI E SERVIZI';
      default:
        // Fallback to activityType if scope3Category is not available
        const activityType = calculation.details?.activityType || calculation.details?.wasteType || 
                            calculation.details?.purchaseType || calculation.details?.transportType || '';
        
        if (activityType.includes('FREIGHT') || activityType.includes('BUSINESS_TRAVEL')) {
          return 'TRASPORTO E LOGISTICA';
        } else if (activityType.includes('WASTE')) {
          return 'GESTIONE RIFIUTI';
        } else if (activityType.includes('PURCHASED')) {
          return 'ACQUISTO DI BENI E SERVIZI';
        }
        
        return activityType.replace(/_/g, ' ') || 'Non specificato';
    }
  }
  
  return 'Non specificato';
};

export const hasVehicleDetails = (calculation: Calculation, scope: string) => {
  return scope === 'scope3' && hasValidVehicleDetails(calculation);
};
