
import { EmissionsInput, EmissionCalculationLogs, EmissionsDetails, EmissionCalculationRecord } from '@/hooks/emissions-calculator/types';

export interface CalculatorState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  calculatedEmissions: {
    scope1: number;
    scope2: number;
    scope3: number;
    total: number;
  };
  setCalculatedEmissions: React.Dispatch<React.SetStateAction<{
    scope1: number;
    scope2: number;
    scope3: number;
    total: number;
  }>>;
  calculationLogs: EmissionCalculationLogs;
  setCalculationLogs: React.Dispatch<React.SetStateAction<EmissionCalculationLogs>>;
  isLoading: boolean;
  isLoadingExisting?: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
}

export interface CalculatorActions {
  calculateEmissions: (scope: 'scope1' | 'scope2' | 'scope3') => void;
  handleRemoveCalculation: (calculationId: string) => void;
  resetCalculation: () => void;
  handleSubmitCalculation: () => void;
}

export interface UseCalculatorResult extends CalculatorState, CalculatorActions {
  inputs: EmissionsInput;
  updateInput: <K extends keyof EmissionsInput>(key: K, value: EmissionsInput[K]) => void;
}
