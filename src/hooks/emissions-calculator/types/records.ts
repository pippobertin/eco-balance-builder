
/**
 * Record types for emission calculations
 */

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

// Type alias for backward compatibility
export type EmissionsRecord = EmissionCalculationLogs;
export type RecordEntry = EmissionCalculationRecord;
