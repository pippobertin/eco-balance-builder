
// Definizione dei tipi per BP1
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

// Definizione dei tipi per BP2
export interface BP2FormData {
  maleGovernanceMembers?: number;
  femaleGovernanceMembers?: number;
  otherGenderGovernanceMembers?: number;
  genderDiversityIndex?: number;
}

// Definizione dei tipi per BP3
export interface BP3FormData {
  hasGhgReductionTargets?: boolean;
  ghgReductionTargetScope1?: number;
  ghgReductionTargetScope2?: number;
  ghgReductionTargetScope3?: number;
  ghgReductionTargetYear?: number;
  ghgReductionBaselineYear?: number;
}

// Definizione dei tipi per BP4
export interface BP4FormData {
  hasTransitionPlan?: boolean;
  transitionPlanDetails?: string;
}

// Definizione dei tipi per BP5
export interface BP5FormData {
  hasPhysicalClimateRisks?: boolean;
  assetsAtRiskAmount?: number;
  assetsAtRiskPercentage?: number;
  adaptationCoverage?: number;
  revenueAtRiskPercentage?: number;
  riskAssetsLocation?: string;
  realEstateEnergyEfficiency?: string; // Changed from number to string to match the database
}

// Definizione dei tipi per BP6
export interface BP6FormData {
  hasHazardousWaste?: boolean;
  hazardousWasteTotal?: number;
  radioactiveWasteTotal?: number;
}

// Definizione dei tipi per BP7
export interface BP7FormData {
  hasPoliciesAligned?: boolean;
  alignedInstruments?: string;
}

// Definizione dei tipi per BP8
export interface BP8FormData {
  hasComplianceProcesses?: boolean;
  complianceProcessesDetails?: string;
}

// Definizione dei tipi per BP9
export interface BP9FormData {
  hasViolations?: boolean;
  violationsDetails?: string;
}

// Definizione dei tipi per BP10
export interface BP10FormData {
  maleFamilyLeaveEligible?: number;
  femaleFamilyLeaveEligible?: number;
  maleFamilyLeaveUsed?: number;
  femaleFamilyLeaveUsed?: number;
}

// Definizione dei tipi per BP11
export interface BP11FormData {
  hasApprentices?: boolean;
  apprenticesNumber?: number;
  apprenticesPercentage?: number;
}

// Dati complessivi dei business partners
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

// Risultato dell'hook useBusinessPartnersData
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
