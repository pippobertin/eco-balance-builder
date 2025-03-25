
// Add SaveButtonProps type
export interface SaveButtonProps {
  onClick: () => Promise<void>;
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Common base hook result interface
export interface BPBaseHookResult {
  isLoading: boolean;
  saveData: () => Promise<boolean>;
  handleSave: () => Promise<void>;
  lastSaved: Date | null;
  needsSaving: boolean;
}

// BP1 specific interface
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

export interface BP1HookResult extends BPBaseHookResult {
  formData: BP1FormData;
  setFormData: React.Dispatch<React.SetStateAction<BP1FormData>>;
}

// BP2 specific interface
export interface BP2FormData {
  maleGovernanceMembers?: number;
  femaleGovernanceMembers?: number;
  otherGenderGovernanceMembers?: number;
  genderDiversityIndex?: number;
}

export interface BP2HookResult extends BPBaseHookResult {
  formData: BP2FormData;
  setFormData: React.Dispatch<React.SetStateAction<BP2FormData>>;
}

// Add other BP type interfaces as needed following the same pattern

export interface AntiCorruptionData {
  convictionsNumber: number | null;
  sanctionsAmount: number | null;
  additionalDetails: string | null;
}
