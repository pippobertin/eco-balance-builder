// Common interfaces for Business Partners form data

// BP1 - Revenue from specific sectors
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

// BP2 - Gender diversity in governance
export interface BP2FormData {
  maleGovernanceMembers?: number;
  femaleGovernanceMembers?: number;
  otherGenderGovernanceMembers?: number;
  genderDiversityIndex?: number;
}

// BP3 - GHG reduction targets
export interface BP3FormData {
  hasGhgReductionTargets: boolean;
  ghgReductionTargetScope1?: number;
  ghgReductionTargetScope2?: number;
  ghgReductionTargetScope3?: number;
  ghgReductionTargetYear?: number;
  ghgReductionBaselineYear?: number;
}

// BP4 - Climate transition plan
export interface BP4FormData {
  hasTransitionPlan: boolean;
  transitionPlanDetails?: string;
}

// BP5 - Physical climate risks
export interface BP5FormData {
  hasPhysicalClimateRisks: boolean;
  assetsAtRiskAmount?: number;
  assetsAtRiskPercentage?: number;
  adaptationCoverage?: number;
  revenueAtRiskPercentage?: number;
  riskAssetsLocation?: string;
  realEstateEnergyEfficiency?: string;
}

// BP6 - Hazardous waste
export interface BP6FormData {
  hasHazardousWaste: boolean;
  hazardousWasteTotal?: number;
  radioactiveWasteTotal?: number;
}

// BP7 - Policy alignment
export interface BP7FormData {
  hasPoliciesAligned: boolean;
  alignedInstruments?: string;
}

// BP8 - Compliance processes
export interface BP8FormData {
  hasComplianceProcesses: boolean;
  complianceProcessesDetails?: string;
}

// BP9 - Violations
export interface BP9FormData {
  hasViolations: boolean;
  violationsDetails?: string;
}

// BP10 - Work-life balance
export interface BP10FormData {
  maleFamilyLeaveEligible?: number;
  femaleFamilyLeaveEligible?: number;
  maleFamilyLeaveUsed?: number;
  femaleFamilyLeaveUsed?: number;
}

// BP11 - Apprentices
export interface BP11FormData {
  hasApprentices: boolean;
  apprenticesNumber?: number;
  apprenticesPercentage?: number;
}

// Aggiorniamo SaveButtonProps per accettare una funzione che ritorna Promise<void>
export interface SaveButtonProps {
  onClick: () => Promise<void>;
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
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

export interface BusinessPartnersHookResult {
  formData: BusinessPartnersFormData;
  setFormData: React.Dispatch<React.SetStateAction<BusinessPartnersFormData>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  saveData: () => Promise<boolean>;
  lastSaved: Record<string, Date | null>;
  setLastSaved: React.Dispatch<React.SetStateAction<Record<string, Date | null>>>;
  needsSaving: Record<string, boolean>;
  setNeedsSaving: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export interface LegacyFormData {
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

export interface LegacyNeedsSaving {
  bp1?: boolean;
  bp2?: boolean;
  bp3?: boolean;
  bp4?: boolean;
  bp5?: boolean;
  bp6?: boolean;
  bp7?: boolean;
  bp8?: boolean;
  bp9?: boolean;
  bp10?: boolean;
  bp11?: boolean;
}

export interface LegacyLastSaved {
  bp1?: Date | null;
  bp2?: Date | null;
  bp3?: Date | null;
  bp4?: Date | null;
  bp5?: Date | null;
  bp6?: Date | null;
  bp7?: Date | null;
  bp8?: Date | null;
  bp9?: Date | null;
  bp10?: Date | null;
  bp11?: Date | null;
}
