// Common types for all narrative sections
export interface SaveButtonProps {
  onClick: () => Promise<void>;
  isLoading: boolean;
}

// N1 - Strategy
export interface StrategyData {
  productsServices: string | null;
  markets: string | null;
  businessRelations: string | null;
  sustainabilityStrategy: string | null;
}

export interface StrategyFormData {
  productsServices: string;
  markets: string;
  businessRelations: string;
  sustainabilityStrategy: string;
}

export interface StrategyAPIData {
  products_services: string | null;
  markets: string | null;
  business_relations: string | null;
  sustainability_strategy: string | null;
  updated_at?: string | null;
}

// N2 - Material Issues
export interface MaterialIssuesData {
  materialIssuesDescription: string | null;
}

export interface MaterialIssuesFormData {
  materialIssuesDescription: string;
}

export interface MaterialIssuesAPIData {
  material_issues_description: string | null;
  updated_at?: string | null;
}

// N3 - Issues Management
export interface IssuesManagementData {
  policiesActions: string | null;
  policiesDescription: string | null;
  actionsDescription: string | null;
  energyEfficiencyActions: string | null;
  stakeholdersImpacts: string | null;
  antiCorruptionMeasures: string | null;
}

export interface IssuesManagementFormData {
  policiesActions: string;
  policiesDescription: string;
  actionsDescription: string;
  energyEfficiencyActions: string;
  stakeholdersImpacts: string;
  antiCorruptionMeasures: string;
}

export interface IssuesManagementAPIData {
  policies_actions: string | null;
  policies_description: string | null;
  actions_description: string | null;
  energy_efficiency_actions: string | null;
  stakeholders_impacts: string | null;
  anti_corruption_measures: string | null;
}

// N4 - Stakeholders
export interface StakeholdersData {
  keyStakeholders: string | null;
  stakeholderEngagement: string | null;
}

export interface StakeholdersFormData {
  keyStakeholders: string;
  stakeholderEngagement: string;
}

export interface StakeholdersAPIData {
  stakeholder_categories: string | null;
  engagement_methods: string | null;
}

// N5 - Governance
export interface GovernanceData {
  sustainabilityGovernance: string | null;
}

export interface GovernanceFormData {
  sustainabilityGovernance: string;
}

export interface GovernanceAPIData {
  sustainability_governance: string | null;
}
