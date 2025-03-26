
// BP2 specific types
export interface BP2FormData {
  maleGovernanceMembers?: number;
  femaleGovernanceMembers?: number;
  otherGenderGovernanceMembers?: number;
  genderDiversityIndex?: number;
}

export interface BP2HookResult {
  formData: BP2FormData;
  setFormData: React.Dispatch<React.SetStateAction<BP2FormData>>;
  isLoading: boolean;
  saveData: () => Promise<void>;
  lastSaved: Date | null;
  needsSaving: boolean;
}
