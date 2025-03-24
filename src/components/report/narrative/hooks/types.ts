
export interface StrategyFormData {
  productsServices: string;
  markets: string;
  businessRelations: string;
  sustainabilityStrategy: string;
}

export interface MaterialIssuesFormData {
  materialIssuesDescription: string;
}

export interface IssuesManagementFormData {
  policiesActions: string;
  policiesDescription: string;
  actionsDescription: string;
  energyEfficiencyActions: string;
  stakeholdersImpacts: string;
  antiCorruptionMeasures: string;
}

export interface StakeholdersFormData {
  keyStakeholders: string;
  stakeholderEngagement: string;
}

export interface GovernanceFormData {
  sustainabilityGovernance: string;
}

export interface SaveButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export interface SectionHookResult {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  lastSaved: Date | null;
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>;
  needsSaving: boolean;
  setNeedsSaving: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface SaveHookResult {
  saveData: () => Promise<boolean>;
  isSaving: boolean;
}
