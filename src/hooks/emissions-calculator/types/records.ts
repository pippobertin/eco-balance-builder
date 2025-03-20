
/**
 * Record of a single emission calculation
 */
export interface EmissionCalculationRecord {
  id: string;
  report_id: string;
  date: string;
  scope: 'scope1' | 'scope2' | 'scope3';
  source: string;
  description: string;
  quantity: number;
  unit: string;
  emissions: number;
  details: any;
}

/**
 * Collection of emission calculation records by scope
 */
export interface EmissionCalculationLogs {
  scope1Calculations: EmissionCalculationRecord[];
  scope2Calculations: EmissionCalculationRecord[];
  scope3Calculations: EmissionCalculationRecord[];
}
