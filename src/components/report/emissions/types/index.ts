
import { 
  EmissionFactorSource, 
  PeriodType, 
  FuelType, 
  EnergyType, 
  TransportType, 
  WasteType, 
  PurchaseType
} from '@/lib/emissions-types';

export interface GHGEmissionsCalculatorProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void);
  onResetClick?: () => void;
}

export interface CalculatorState {
  activeTab: string;
}

export interface FormValueUpdaterProps {
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void);
}

export interface EmissionsResultsProps {
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void);
}

export interface ExistingEmissionsProps {
  formValues: any;
  updateInput: (key: keyof EmissionsInput, value: any) => void;
  resetCalculation: () => void;
  setCalculatedEmissions?: (results: EmissionsResults) => void;
}

// Re-export types from emissions-calculator to avoid import issues
export interface EmissionsResults {
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
}

export interface EmissionsInput {
  // Scope 1 inputs
  scope1Source?: string;
  fuelType?: FuelType;
  fuelQuantity?: string;
  fuelUnit?: string;
  
  // Scope 2 inputs
  energyType?: EnergyType;
  energyQuantity?: string;
  renewablePercentage?: number;
  energyProvider?: string;
  
  // Scope 3 inputs
  scope3Category?: string;
  transportType?: TransportType;
  transportDistance?: string;
  wasteType?: WasteType;
  wasteQuantity?: string;
  purchaseType?: PurchaseType;
  purchaseQuantity?: string;
  
  // Vehicle details for Scope 3 transport
  vehicleType?: string;
  vehicleFuelType?: FuelType;
  vehicleEnergyClass?: string;
  
  // Common inputs
  periodType?: PeriodType;
  calculationMethod?: EmissionFactorSource;
}

// Calculation log types
export interface EmissionCalculationRecord {
  id: string;
  date: string;
  source: string;
  scope: 'scope1' | 'scope2' | 'scope3';
  description: string;
  quantity: number;
  unit: string;
  emissions: number; // tonnellate CO2e
  details: any;
}

export interface EmissionCalculationLogs {
  scope1Calculations: EmissionCalculationRecord[];
  scope2Calculations: EmissionCalculationRecord[];
  scope3Calculations: EmissionCalculationRecord[];
}
