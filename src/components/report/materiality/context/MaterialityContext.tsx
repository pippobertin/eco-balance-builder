
import React, { createContext, useContext, ReactNode } from 'react';
import { MaterialityIssue, Stakeholder, SurveyTemplate } from '../types';
import { useMaterialityIssues } from '../hooks/useMaterialityIssues';
import { useStakeholders } from '../hooks/useStakeholders';
import { useSurveyDialog } from '../hooks/useSurveyDialog';
import { useSurveyValidation } from '../hooks/useSurveyValidation';
import { useSurveyResponses } from '../hooks/useSurveyResponses';
import { calculateEsgScore } from '../utils/calculateEsgScore';
import { useReport } from '@/context/ReportContext';

interface MaterialityContextType {
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

const MaterialityContext = createContext<MaterialityContextType | null>(null);

export const useMaterialityContext = () => {
  const context = useContext(MaterialityContext);
  if (!context) {
    throw new Error('useMaterialityContext must be used within a MaterialityProvider');
  }
  return context;
};

interface MaterialityProviderProps {
  children: ReactNode;
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
  getStakeholderPriorityColor: (priority: string) => string;
  getSurveyStatusColor: (status?: string) => string;
  getSurveyStatusText: (status?: string) => string;
}

export const MaterialityProvider: React.FC<MaterialityProviderProps> = ({
  children,
  formValues,
  setFormValues,
  getStakeholderPriorityColor,
  getSurveyStatusColor,
  getSurveyStatusText
}) => {
  const { reportData, updateReportData } = useReport();
  
  // Use custom hooks for materiality issues
  const { 
    issues, 
    handleIssueChange, 
    addCustomIssue, 
    removeIssue,
    updateIssuesWithStakeholderRelevance
  } = useMaterialityIssues(
    formValues.materialityAnalysis?.issues,
    (updatedIssues) => {
      console.log("Updating materiality issues:", updatedIssues);
      
      const updatedFormValues = {
        ...formValues,
        materialityAnalysis: {
          ...formValues.materialityAnalysis,
          issues: updatedIssues
        }
      };
      
      setFormValues(updatedFormValues);
      
      // Also update the report context
      updateReportData({
        materialityAnalysis: {
          ...reportData.materialityAnalysis,
          issues: updatedIssues,
          // Calculate a simple ESG score based on material issues
          esgScore: calculateEsgScore(updatedIssues)
        }
      });
    }
  );
  
  // Use stakeholders hook
  const { 
    stakeholders, 
    addStakeholder, 
    removeStakeholder, 
    handleStakeholderChange, 
    updateStakeholderSurveyStatus,
    processSurveyResponse
  } = useStakeholders(
    formValues.materialityAnalysis?.stakeholders,
    (updatedStakeholders) => {
      const updatedFormValues = {
        ...formValues,
        materialityAnalysis: {
          ...formValues.materialityAnalysis,
          stakeholders: updatedStakeholders
        }
      };
      
      setFormValues(updatedFormValues);
      
      // Also update the report context
      updateReportData({
        materialityAnalysis: {
          ...reportData.materialityAnalysis,
          stakeholders: updatedStakeholders
        }
      });
    }
  );
  
  const materialIssues = issues.filter(issue => issue.isMaterial);
  
  // Use survey dialog hook
  const { 
    surveyTemplate, 
    setSurveyTemplate, 
    surveyDialogOpen, 
    setSurveyDialogOpen, 
    selectedStakeholders, 
    setSelectedStakeholders, 
    stakeholderGroups,
    forceResend,
    toggleForceResend,
    surveyProgress
  } = useSurveyDialog(materialIssues, stakeholders);

  // Use survey validation hook
  const {
    validateSurveySending,
    openSurveyDialog: validateAndOpenSurvey
  } = useSurveyValidation();

  // Use survey responses hook
  const {
    sendSurveys,
    handleSurveyResponse
  } = useSurveyResponses(
    stakeholders,
    updateStakeholderSurveyStatus,
    updateIssuesWithStakeholderRelevance
  );

  // Open survey dialog with validation
  const openSurveyDialog = () => {
    validateAndOpenSurvey(materialIssues, stakeholders);
  };
  
  // Handle survey sending
  const handleSendSurveys = () => {
    if (validateSurveySending(selectedStakeholders)) {
      sendSurveys(selectedStakeholders);
      setSurveyDialogOpen(false);
    }
  };

  const value = {
    // Issues
    issues,
    handleIssueChange,
    addCustomIssue,
    removeIssue,
    materialIssues,
    
    // Stakeholders
    stakeholders,
    addStakeholder,
    removeStakeholder,
    handleStakeholderChange,
    
    // Survey
    surveyTemplate,
    setSurveyTemplate,
    surveyDialogOpen,
    setSurveyDialogOpen,
    selectedStakeholders,
    setSelectedStakeholders,
    stakeholderGroups,
    forceResend,
    toggleForceResend,
    surveyProgress,
    
    // Actions
    openSurveyDialog,
    handleSendSurveys,
    
    // Utility functions
    getStakeholderPriorityColor,
    getSurveyStatusColor,
    getSurveyStatusText
  };

  return (
    <MaterialityContext.Provider value={value}>
      {children}
    </MaterialityContext.Provider>
  );
};
