
export interface ComplianceFormData {
  complianceStandards: string;
  complianceMonitoring: string;
}

export interface ComplianceAPIData {
  compliance_standards: string | null;
  compliance_monitoring: string | null;
  updated_at: string;
}
