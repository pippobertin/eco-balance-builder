
import React from 'react';

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

// Props for save buttons
export interface SaveButtonProps {
  onClick: () => Promise<void | boolean>;
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

// Let's also define the interfaces for our hook results here since they all follow a similar pattern
export interface BaseHookResult<T> {
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  isLoading: boolean;
  saveData: () => Promise<boolean>;
  lastSaved: Date | null;
  needsSaving: boolean;
}
