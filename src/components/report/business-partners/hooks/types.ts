
import { Dispatch, SetStateAction } from 'react';

// Generic types for BP forms
export interface SaveButtonProps {
  onClick: () => Promise<void>;
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export interface BusinessPartnersSectionProps {
  formData: BusinessPartnersFormData;
  setFormData: React.Dispatch<React.SetStateAction<BusinessPartnersFormData>>;
  saveData: () => Promise<boolean>;
  isLoading?: boolean;
  lastSaved: Date | null;
  needsSaving: boolean;
}

// Main form data types
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

// BP1 Form Data
export interface BP1FormData {
  controversialWeapons?: boolean;
  tobacco?: boolean;
  fossilFuels?: boolean;
  chemicals?: boolean;
  controversialWeaponsRevenue?: number;
  tobaccoRevenue?: number;
  coalRevenue?: number;
  oilRevenue?: number;
  gasRevenue?: number;
  chemicalsRevenue?: number;
}

// BP2 Form Data
export interface BP2FormData {
  maleGovernanceMembers?: number;
  femaleGovernanceMembers?: number;
  otherGenderGovernanceMembers?: number;
  genderDiversityIndex?: number;
}

// BP3 Form Data
export interface BP3FormData {
  hasGhgReductionTargets?: boolean;
  ghgReductionTargetScope1?: number;
  ghgReductionTargetScope2?: number;
  ghgReductionTargetScope3?: number;
  ghgReductionTargetYear?: number;
  ghgReductionBaselineYear?: number;
}

// BP4 Form Data
export interface BP4FormData {
  hasTransitionPlan?: boolean;
  transitionPlanDetails?: string;
}

// BP5 Form Data
export interface BP5FormData {
  hasPhysicalClimateRisks?: boolean;
  assetsAtRiskAmount?: number;
  assetsAtRiskPercentage?: number;
  adaptationCoverage?: number;
  revenueAtRiskPercentage?: number;
  riskAssetsLocation?: string;
  realEstateEnergyEfficiency?: string;
}

// BP6 Form Data
export interface BP6FormData {
  hasHazardousWaste?: boolean;
  hazardousWasteTotal?: number;
  radioactiveWasteTotal?: number;
}

// BP7 Form Data
export interface BP7FormData {
  hasPoliciesAligned?: boolean;
  alignedInstruments?: string;
}

// BP8 Form Data
export interface BP8FormData {
  hasComplianceProcesses?: boolean;
  complianceProcessesDetails?: string;
}

// BP9 Form Data
export interface BP9FormData {
  hasViolations?: boolean;
  violationsDetails?: string;
}

// BP10 Form Data
export interface BP10FormData {
  maleFamilyLeaveEligible?: number;
  femaleFamilyLeaveEligible?: number;
  maleFamilyLeaveUsed?: number;
  femaleFamilyLeaveUsed?: number;
}

// BP11 Form Data
export interface BP11FormData {
  hasApprentices?: boolean;
  apprenticesNumber?: number;
  apprenticesPercentage?: number;
}

// Hook result type
export interface BusinessPartnersHookResult {
  formData: BusinessPartnersFormData;
  setFormData: Dispatch<SetStateAction<BusinessPartnersFormData>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  saveData: () => Promise<boolean>;
  lastSaved: Record<string, Date | null>;
  setLastSaved: Dispatch<SetStateAction<Record<string, Date | null>>>;
  needsSaving: Record<string, boolean>;
  setNeedsSaving: Dispatch<SetStateAction<Record<string, boolean>>>;
}
