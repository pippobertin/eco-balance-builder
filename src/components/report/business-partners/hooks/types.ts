
// Base hook result shared by all BP hooks
export interface BaseHookResult<T> {
  formData: T;
  setFormData: (data: React.SetStateAction<T>) => void;
  isLoading: boolean;
  isSaving?: boolean;
  saveData: () => Promise<boolean>;
  lastSaved: Date | null;
  needsSaving: boolean;
}

// Save button props type
export interface SaveButtonProps {
  onClick: () => Promise<any>;
  isLoading?: boolean;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  [key: string]: any;
}

// Generic business partners form data
export interface BusinessPartnersFormData {
  [key: string]: any;
}

// Generic business partners hook result
export interface BusinessPartnersHookResult {
  formData: BusinessPartnersFormData;
  setFormData: React.Dispatch<React.SetStateAction<BusinessPartnersFormData>>;
  isLoading: boolean;
  saveData: () => Promise<boolean>;
  lastSaved: Date | null;
  needsSaving: boolean;
}

// BP1 types
export interface BP1FormData {
  controversialWeapons: boolean;
  tobacco: boolean;
  fossilFuels: boolean;
  chemicals: boolean;
  controversialWeaponsRevenue?: number;
  tobaccoRevenue?: number;
  coalRevenue?: number;
  oilRevenue?: number;
  gasRevenue?: number;
  chemicalsRevenue?: number;
}

// BP2 types
export interface BP2FormData {
  maleGovernanceMembers?: number;
  femaleGovernanceMembers?: number;
  otherGenderGovernanceMembers?: number;
  genderDiversityIndex?: number;
}

// BP3 types
export interface BP3FormData {
  hasGhgReductionTargets: boolean;
  ghgReductionTargetScope1?: number;
  ghgReductionTargetScope2?: number;
  ghgReductionTargetScope3?: number;
  ghgReductionBaselineYear?: number;
  ghgReductionTargetYear?: number;
}

// BP4 types
export interface BP4FormData {
  hasTransitionPlan: boolean;
  transitionPlanDetails?: string;
}

// BP5 types
export interface BP5FormData {
  hasPhysicalClimateRisks: boolean;
  assetsAtRiskAmount?: number;
  assetsAtRiskPercentage?: number;
  adaptationCoverage?: number;
  revenueAtRiskPercentage?: number;
  riskAssetsLocation?: string;
  realEstateEnergyEfficiency?: string;
}

// BP6 types
export interface BP6FormData {
  hasHazardousWaste: boolean;
  hazardousWasteTotal?: number;
  radioactiveWasteTotal?: number;
}

// BP7 types
export interface BP7FormData {
  hasPoliciesAligned: boolean;
  alignedInstruments?: string;
}

// BP8 types
export interface BP8FormData {
  hasComplianceProcesses: boolean;
  complianceProcessesDetails?: string;
}

// BP9 types
export interface BP9FormData {
  hasViolations: boolean;
  violationsDetails?: string;
}

// BP10 types
export interface BP10FormData {
  maleFamilyLeaveEligible?: number;
  femaleFamilyLeaveEligible?: number;
  maleFamilyLeaveUsed?: number;
  femaleFamilyLeaveUsed?: number;
}

// BP11 types
export interface BP11FormData {
  hasApprentices: boolean;
  apprenticesNumber?: number;
  apprenticesPercentage?: number;
}
