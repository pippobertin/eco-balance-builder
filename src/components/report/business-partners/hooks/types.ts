
export interface SaveButtonProps {
  onClick: () => Promise<boolean | void>;
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Define the individual BP form data types for each module
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
  maleFamilyLeaveEligible?: number;
  femaleFamilyLeaveEligible?: number;
  maleFamilyLeaveUsed?: number;
  femaleFamilyLeaveUsed?: number;
}

export interface BP11FormData {
  hasApprentices: boolean;
  apprenticesNumber?: number;
  apprenticesPercentage?: number;
}

export interface BusinessPartnersFormData {
  bp1: BP1FormData;
  bp2: BP2FormData;
  bp3: BP3FormData;
  bp4: BP4FormData;
  bp5: BP5FormData;
  bp6: BP6FormData;
  bp7: BP7FormData;
  bp8: BP8FormData;
  bp9: BP9FormData;
  bp10: BP10FormData;
  bp11: BP11FormData;
}

export interface BusinessPartnersFieldData {
  formData: BusinessPartnersFormData;
  setFormData: (data: React.SetStateAction<BusinessPartnersFormData>) => void;
  saveData: () => Promise<boolean>;
  isLoading: boolean;
  lastSaved: Date | null;
  needsSaving: boolean;
  bpKey: string;
}

export interface BusinessPartnersHookResult {
  formData: BusinessPartnersFormData;
  setFormData: (data: React.SetStateAction<BusinessPartnersFormData>) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  saveData: () => Promise<boolean>;
  lastSaved: Record<string, Date | null>;
  setLastSaved: (lastSaved: Record<string, Date | null>) => void;
  needsSaving: Record<string, boolean>;
  setNeedsSaving: (needsSaving: Record<string, boolean>) => void;
}
