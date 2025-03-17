
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
  updateInput: (key: string, value: any) => void;
  resetCalculation: () => void;
}
