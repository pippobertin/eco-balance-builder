
import { MaterialityIssue, Stakeholder, SurveyTemplate, IROSelections } from '../types';

export interface MaterialityContextType {
  // Issues
  issues: MaterialityIssue[];
  handleIssueChange: (id: string, field: keyof MaterialityIssue, value: any) => void;
  addCustomIssue: (name: string, description: string) => void;
  removeIssue: (id: string) => void;
  materialIssues: MaterialityIssue[];
  
  // Stakeholders
  stakeholders: Stakeholder[];
  addStakeholder: (stakeholder: Omit<Stakeholder, 'id' | 'priority' | 'surveyStatus'>) => void;
  removeStakeholder: (id: string) => void;
  handleStakeholderChange: (id: string, field: keyof Stakeholder, value: any) => void;
  
  // Survey
  surveyTemplate: SurveyTemplate;
  setSurveyTemplate: React.Dispatch<React.SetStateAction<SurveyTemplate>>;
  surveyDialogOpen: boolean;
  setSurveyDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedStakeholders: string[];
  setSelectedStakeholders: React.Dispatch<React.SetStateAction<string[]>>;
  stakeholderGroups: {
    pending: Stakeholder[];
    sent: Stakeholder[];
    completed: Stakeholder[];
  };
  forceResend: boolean;
  toggleForceResend: () => void;
  surveyProgress: {
    sent: number;
    completed: number;
    total: number;
  };
  
  // Actions
  openSurveyDialog: () => void;
  handleSendSurveys: () => void;
  
  // Utility functions
  getStakeholderPriorityColor: (priority: string) => string;
  getSurveyStatusColor: (status?: string) => string;
  getSurveyStatusText: (status?: string) => string;
}

export interface MaterialityProviderProps {
  children: React.ReactNode;
  reportId: string | null;
}
