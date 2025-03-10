
export interface MaterialityIssue {
  id: string;
  name: string;
  description: string;
  impactRelevance: number;
  financialRelevance: number;
  isMaterial: boolean;
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
}

export interface SurveyTemplate {
  title: string;
  description: string;
  issues: MaterialityIssue[];
  additionalComments: boolean;
}
