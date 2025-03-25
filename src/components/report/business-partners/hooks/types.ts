
export interface SaveButtonProps {
  onClick: () => Promise<void>;
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export interface BusinessPartnersFormData {
  bp1: {
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
  };
  bp2: {
    maleGovernanceMembers?: number;
    femaleGovernanceMembers?: number;
    otherGenderGovernanceMembers?: number;
    genderDiversityIndex?: number;
  };
  bp3: {
    hasGhgReductionTargets: boolean;
    ghgReductionTargetScope1?: number;
    ghgReductionTargetScope2?: number;
    ghgReductionTargetScope3?: number;
    ghgReductionTargetYear?: number;
    ghgReductionBaselineYear?: number;
  };
  bp4: {
    hasTransitionPlan: boolean;
    transitionPlanDetails?: string;
  };
  bp5: {
    hasPhysicalClimateRisks: boolean;
    assetsAtRiskAmount?: number;
    assetsAtRiskPercentage?: number;
    adaptationCoverage?: number;
    revenueAtRiskPercentage?: number;
    riskAssetsLocation?: string;
    realEstateEnergyEfficiency?: string;
  };
  bp6: {
    hasHazardousWaste: boolean;
    hazardousWasteTotal?: number;
    radioactiveWasteTotal?: number;
  };
  bp7: {
    hasPoliciesAligned: boolean;
    alignedInstruments?: string;
  };
  bp8: {
    hasComplianceProcesses: boolean;
    complianceProcessesDetails?: string;
  };
  bp9: {
    hasViolations: boolean;
    violationsDetails?: string;
  };
  bp10: {
    maleFamilyLeaveEligible?: number;
    femaleFamilyLeaveEligible?: number;
    maleFamilyLeaveUsed?: number;
    femaleFamilyLeaveUsed?: number;
  };
  bp11: {
    hasApprentices: boolean;
    apprenticesNumber?: number;
    apprenticesPercentage?: number;
  };
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
