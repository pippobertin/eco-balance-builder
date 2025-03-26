
// Import BP10FormData from its specific location
import { BP10HookResult } from './bp10/types';

// Base hook result interface that can be reused across all BP hooks
export interface BaseHookResult<T> {
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  isLoading: boolean;
  saveData: () => Promise<boolean>;
  lastSaved: Date | null;
  needsSaving: boolean;
}

// Form data interfaces for each BP component
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

export interface BP2FormData {
  maleGovernanceMembers?: number;
  femaleGovernanceMembers?: number;
  otherGenderGovernanceMembers?: number;
  genderDiversityIndex?: number;
}

export interface BP3FormData {
  hasGhgReductionTargets: boolean;
  ghgReductionTargetScope1?: number;
  ghgReductionTargetScope2?: number;
  ghgReductionTargetScope3?: number;
  ghgReductionTargetYear?: number;
  ghgReductionBaselineYear?: number;
}

export interface BP4FormData {
  hasTransitionPlan: boolean;
  transitionPlanDetails?: string;
}

export interface BP5FormData {
  hasPhysicalClimateRisks: boolean;
  assetsAtRiskAmount?: number;
  assetsAtRiskPercentage?: number;
  adaptationCoverage?: number;
  revenueAtRiskPercentage?: number;
  riskAssetsLocation?: string;
  realEstateEnergyEfficiency?: string;
}

export interface BP6FormData {
  hasHazardousWaste: boolean;
  hazardousWasteTotal?: number;
  radioactiveWasteTotal?: number;
}

export interface BP7FormData {
  hasPoliciesAligned: boolean;
  alignedInstruments?: string;
}

export interface BP8FormData {
  hasComplianceProcesses: boolean;
  complianceProcessesDetails?: string;
}

export interface BP9FormData {
  hasViolations: boolean;
  violationsDetails?: string;
}

export interface BP10FormData {
  maleParentalLeaveEligible?: number;
  femaleParentalLeaveEligible?: number;
  maleParentalLeaveUsed?: number;
  femaleParentalLeaveUsed?: number;
}

export interface BP11FormData {
  hasApprentices: boolean;
  apprenticesNumber?: number;
  apprenticesPercentage?: number;
}

export interface SaveButtonProps {
  onClick: () => Promise<boolean | void>;
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

// Re-export BP10HookResult
export type { BP10HookResult };

export interface BusinessPartnersFormData {
  bp1?: BP1FormData;
  bp2?: BP2FormData;
  bp3?: BP3FormData;
  bp4?: BP4FormData;
  bp5?: BP5FormData;
  bp6?: BP6FormData;
  bp7?: BP7FormData;
  bp8?: BP8FormData;
  bp9?: BP9FormData;
  bp10?: BP10FormData;
  bp11?: BP11FormData;
}

export interface BusinessPartnersHookResult {
  formData: BusinessPartnersFormData;
  setFormData: React.Dispatch<React.SetStateAction<BusinessPartnersFormData>>;
  isLoading: boolean;
  saveData: () => Promise<boolean>;
  lastSaved: Date | null;
  needsSaving: boolean;
}
