
import React, { useState, useEffect } from 'react';
import { useReport } from '@/context/ReportContext';
import MaterialityTabs from './MaterialityTabs';
import MaterialityIssuesTab from './MaterialityIssuesTab';
import StakeholdersTab from './StakeholdersTab';
import SurveyDialog from './SurveyDialog';
import { useMaterialityIssues } from './hooks/useMaterialityIssues';
import { useStakeholders } from './hooks/useStakeholders';
import { useSurveyDialog } from './hooks/useSurveyDialog';
import { useSurveyValidation } from './hooks/useSurveyValidation';
import { useSurveyResponses } from './hooks/useSurveyResponses';
import { getStakeholderPriorityColor, getSurveyStatusColor, getSurveyStatusText } from './utils/materialityUtils';
import { calculateEsgScore } from './utils/calculateEsgScore';

interface MaterialityAnalysisContainerProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

const MaterialityAnalysisContainer: React.FC<MaterialityAnalysisContainerProps> = ({ 
  formValues, 
  setFormValues 
}) => {
  const [activeTab, setActiveTab] = useState('issues');
  const { reportData, updateReportData } = useReport();
  
  // Initialize materialityAnalysis if it doesn't exist in formValues
  useEffect(() => {
    if (!formValues.materialityAnalysis) {
      setFormValues(prev => ({
        ...prev,
        materialityAnalysis: {
          issues: [],
          stakeholders: []
        }
      }));
    }
  }, [formValues, setFormValues]);
  
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Analisi di Materialità</h2>
      
      <MaterialityTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === 'issues' && (
        <MaterialityIssuesTab 
          issues={issues}
          onIssueChange={handleIssueChange}
          onAddCustomIssue={addCustomIssue}
          onRemoveIssue={removeIssue}
          surveyProgress={surveyProgress}
        />
      )}
      
      {activeTab === 'stakeholders' && (
        <StakeholdersTab 
          stakeholders={stakeholders}
          materialIssues={materialIssues}
          onStakeholderChange={handleStakeholderChange}
          onAddStakeholder={addStakeholder}
          onRemoveStakeholder={removeStakeholder}
          onOpenSurveyDialog={openSurveyDialog}
          getStakeholderPriorityColor={getStakeholderPriorityColor}
          getSurveyStatusColor={getSurveyStatusColor}
          getSurveyStatusText={getSurveyStatusText}
          surveyProgress={surveyProgress}
        />
      )}

      <SurveyDialog 
        open={surveyDialogOpen}
        onOpenChange={setSurveyDialogOpen}
        stakeholders={stakeholders}
        stakeholderGroups={stakeholderGroups}
        surveyTemplate={surveyTemplate}
        setSurveyTemplate={setSurveyTemplate}
        selectedStakeholders={selectedStakeholders}
        setSelectedStakeholders={setSelectedStakeholders}
        forceResend={forceResend}
        toggleForceResend={toggleForceResend}
        getStakeholderPriorityColor={getStakeholderPriorityColor}
        onSendSurveys={handleSendSurveys}
      />
    </div>
  );
};

export default MaterialityAnalysisContainer;
