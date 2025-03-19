
import { EmissionsInput, EmissionCalculationLogs, EmissionsDetails, EmissionCalculationRecord } from '@/hooks/emissions-calculator';

export interface CalculatorState {
  activeTab: string;
  calculatedEmissions: {
    scope1: number;
    scope2: number;
    scope3: number;
    total: number;
  };
  calculationLogs: EmissionCalculationLogs;
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
}

export interface CalculatorActions {
  setActiveTab: (tab: string) => void;
  updateInput: <K extends keyof EmissionsInput>(key: K, value: EmissionsInput[K]) => void;
  calculateEmissions: (scope: 'scope1' | 'scope2' | 'scope3') => void;
  handleRemoveCalculation: (calculationId: string) => void;
  resetCalculation: () => void;
  handleSubmitCalculation: () => void;
}

export interface UseCalculatorResult extends CalculatorState, CalculatorActions {}
