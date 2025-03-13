
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
  const { reportData, updateReportData } = useReport();
  
  // Verifica che ci siano effettivamente temi nel caricamento iniziale
  const initialIssues = formValues.materialityAnalysis?.issues || [];
  console.log("Initial issues in MaterialityProvider:", initialIssues);
  console.log("Initial material issues:", initialIssues.filter(i => i.isMaterial === true).map(i => i.name));
  
  // Use custom hooks for materiality issues
  const { 
    issues, 
    handleIssueChange, 
    addCustomIssue, 
    removeIssue,
    updateIssuesWithStakeholderRelevance
  } = useMaterialityIssues(
    initialIssues,
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
  
  // Use strict equality to ensure only true values are included
  const materialIssues = issues.filter(issue => issue.isMaterial === true);
  console.log("Material issues in MaterialityProvider:", materialIssues.length);
  console.log("Material issue names:", materialIssues.map(i => i.name));
  
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
    surveyProgress,
    openSurveyDialog: openSurveyDialogInternal
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
    if (materialIssues.length > 0 && stakeholders.length > 0) {
      openSurveyDialogInternal();
    }
  };
  
  // Handle survey sending
  const handleSendSurveys = () => {
    if (validateSurveySending(selectedStakeholders)) {
      sendSurveys(selectedStakeholders);
      setSurveyDialogOpen(false);
    }
  };

  // Debug log the status of material issues whenever they change
  useEffect(() => {
    const materialCount = issues.filter(issue => issue.isMaterial === true).length;
    console.log(`MaterialityProvider: Total issues: ${issues.length}, Material issues: ${materialCount}`);
    if (materialCount > 0) {
      console.log("Material issue names:", issues.filter(i => i.isMaterial === true).map(i => i.name));
    }
  }, [issues]);

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
