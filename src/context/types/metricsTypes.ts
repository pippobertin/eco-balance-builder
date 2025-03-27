// Define metrics-related interfaces
export interface MetricsBase {
  id?: string;
  report_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface EnvironmentalMetrics extends MetricsBase {
  // Environmental metrics properties
  emissions_total?: number;
  energy_consumption?: number;
  renewable_percentage?: number;
  water_usage?: number;
  waste_total?: number;
  recycled_percentage?: number;
}

export interface SocialMetrics extends MetricsBase {
  // Social metrics properties
  total_employees?: number;
  female_employees?: number;
  male_employees?: number;
  other_gender_employees?: number;
  gender_pay_gap?: number;
  work_accidents_number?: number;
}

export interface ConductMetrics extends MetricsBase {
  // Conduct metrics properties
  convictions_number?: number;
  sanctions_amount?: number;
  compliance_processes?: boolean;
  has_violations?: boolean;
}
