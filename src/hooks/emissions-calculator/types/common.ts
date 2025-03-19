
import { 
  EmissionFactorSource, 
  PeriodType 
} from '@/lib/emissions-types';

/**
 * Common types used across the emissions calculator
 */

export interface EmissionsResults {
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
}

export interface EmissionsDetails {
  scope1Details: string;
  scope2Details: string;
  scope3Details: string;
}
