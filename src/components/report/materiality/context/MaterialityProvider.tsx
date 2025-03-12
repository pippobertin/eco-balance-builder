
import React, { useEffect } from 'react';
import { useReport } from '@/context/ReportContext';
import { MaterialityIssue, Stakeholder } from '../types';
import { useMaterialityIssues } from '../hooks/useMaterialityIssues';
import { useStakeholders } from '../hooks/useStakeholders';
import { useSurveyDialog } from '../hooks/useSurveyDialog';
import { useSurveyValidation } from '../hooks/useSurveyValidation';
import { useSurveyResponses } from '../hooks/useSurveyResponses';
import MaterialityContext from './MaterialityContext';
import { MaterialityProviderProps } from './types';
import { updateFormWithIssues, updateFormWithStakeholders } from './utils';

export const MaterialityProvider: React.FC<MaterialityProviderProps> = ({
  children,
  formValues,
  setFormValues,
  getStakeholderPriorityColor,
  getSurveyStatusColor,
  getSurveyStatusText
}) => {
  const { reportData, updateReportData, saveCurrentReport } = useReport();
  
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
      updateFormWithIssues(
        formValues,
        setFormValues,
        updatedIssues,
        updateReportData,
        reportData
      );
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
      updateFormWithStakeholders(
        formValues,
        setFormValues,
        updatedStakeholders,
        updateReportData,
        reportData
      );
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

  // Force an immediate save when issues or stakeholders change
  useEffect(() => {
    if (issues.length > 0 || stakeholders.length > 0) {
      console.log("Issues or stakeholders changed, triggering immediate save");
      const timeoutId = setTimeout(() => {
        saveCurrentReport()
          .then(() => console.log("Materiality data saved successfully after change"))
          .catch(err => console.error("Error saving materiality data:", err));
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [issues, stakeholders, saveCurrentReport]);

  // Add an additional useEffect specifically for impact and financial relevance changes
  useEffect(() => {
    if (issues.length > 0) {
      const relevanceChanged = issues.some(issue => 
        typeof issue.impactRelevance === 'number' && 
        typeof issue.financialRelevance === 'number'
      );
      
      if (relevanceChanged) {
        console.log("Relevance values changed, triggering immediate save", issues);
        saveCurrentReport()
          .then(() => console.log("Relevance values saved successfully"))
          .catch(err => console.error("Error saving relevance values:", err));
      }
    }
  }, [issues, saveCurrentReport]);

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

export default MaterialityProvider;
