
// Modelli dati per i form dei business partner
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
  ghgReductionBaselineYear?: number;
  ghgReductionTargetYear?: number;
  ghgReductionTargetScope1?: number;
  ghgReductionTargetScope2?: number;
  ghgReductionTargetScope3?: number;
}

export interface BP4FormData {
  hasTransitionPlan: boolean;
  transitionPlanDetails?: string;
}

export interface BP5FormData {
  hasPhysicalClimateRisks: boolean;
  assetsAtRiskAmount?: number;
  assetsAtRiskPercentage?: number;
  revenueAtRiskPercentage?: number;
  adaptationCoverage?: number;
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
  maleFamilyLeaveUsed?: number;
  femaleFamilyLeaveEligible?: number;
  femaleFamilyLeaveUsed?: number;
}

export interface BP11FormData {
  hasApprentices: boolean;
  apprenticesNumber?: number;
  apprenticesPercentage?: number;
}

// Modello per i risultati degli hook dei business partner
export interface BaseHookResult<T> {
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  isLoading: boolean;
  saveData: () => Promise<boolean>;
  lastSaved: Date | null;
  needsSaving: boolean;
}

export interface SaveButtonProps {
  onClick: () => Promise<void | boolean>;
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
}

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
  data: BusinessPartnersFormData;
  updateData: (newData: Partial<BusinessPartnersFormData>) => void;
  saveAll: () => Promise<boolean>;
  isLoading: boolean;
  lastSaved: Date | null;
  needsSaving: boolean;
}
