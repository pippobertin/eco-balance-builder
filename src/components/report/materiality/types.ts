
export interface MaterialityIssue {
  id: string;
  name: string;
  description: string;
  impactRelevance: number;
  financialRelevance: number;
  isMaterial: boolean;
  stakeholderRelevance?: number; // Media delle valutazioni degli stakeholder
  iroSelections?: IROSelections; // Aggiungiamo le selezioni IRO
}

export interface IROData {
  impacts: string[];
  risks: string[];
  opportunities: string[];
  actions: string[];
}

export interface IROSelections {
  selectedImpacts: string[];
  selectedRisks: string[];
  selectedOpportunities: string[];
  selectedActions: string[];
}

export interface Stakeholder {
  id: string;
  name: string;
  category: string;
  influence: number;
  interest: number;
  contactInfo: string;
  email: string;
  notes: string;
  priority: string;
  surveyStatus?: 'pending' | 'sent' | 'completed';
  surveyToken?: string; // Token univoco per identificare il sondaggio
  surveyResponse?: SurveyResponse;
}

export interface SurveyTemplate {
  title: string;
  description: string;
  issues: MaterialityIssue[];
  additionalComments: boolean;
}

export interface SurveyResponse {
  stakeholderId: string;
  companyName?: string;
  responseDate: string;
  issueRatings: {
    issueId: string;
    relevance: number;
  }[];
  additionalComments?: string;
}

export interface MaterialityMatrix {
  companyAssessment: MaterialityIssue[];
  stakeholderAssessment: {
    issueId: string;
    relevance: number;
  }[];
  combinedAssessment?: MaterialityIssue[];
}
