
// If this file doesn't exist, we'll create it with all necessary types

export interface MaterialIssuesFormData {
  materialIssuesDescription: string;
}

export interface StakeholdersFormData {
  keyStakeholders: string;
  stakeholderEngagement: string;
}

export interface GovernanceFormData {
  sustainabilityGovernance: string;
}

export interface IssuesManagementFormData {
  policiesActions: string;
  policiesDescription: string;
  actionsDescription: string;
  energyEfficiencyActions: string;
  stakeholdersImpacts: string;
  antiCorruptionMeasures: string;
}

export interface StrategyFormData {
  productsServices: string;
  markets: string;
  businessRelations: string;
  sustainabilityStrategy: string;
}

// Add the missing SaveButtonProps interface
export interface SaveButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

// Add the missing SectionHookResult interface
export interface SectionHookResult<T> {
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  initialFormData?: T;
  setInitialFormData?: React.Dispatch<React.SetStateAction<T>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  lastSaved: Date | null;
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>;
  needsSaving: boolean;
  setNeedsSaving: React.Dispatch<React.SetStateAction<boolean>>;
}
