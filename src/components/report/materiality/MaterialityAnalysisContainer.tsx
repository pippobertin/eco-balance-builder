
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useReport } from '@/context/ReportContext';
import MaterialityTabs from './MaterialityTabs';
import MaterialityIssuesTab from './MaterialityIssuesTab';
import StakeholdersTab from './StakeholdersTab';
import SurveyDialog from './SurveyDialog';
import { useMaterialityIssues } from './hooks/useMaterialityIssues';
import { useStakeholders } from './hooks/useStakeholders';
import { useSurveyDialog } from './hooks/useSurveyDialog';
import { getStakeholderPriorityColor, getSurveyStatusColor, getSurveyStatusText } from './utils/materialityUtils';
import { SurveyResponse } from './types';

interface MaterialityAnalysisContainerProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

const MaterialityAnalysisContainer: React.FC<MaterialityAnalysisContainerProps> = ({ 
  formValues, 
  setFormValues 
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('issues');
  const { reportData, updateReportData } = useReport();
  
  // Use custom hooks
  const { 
    issues, 
    handleIssueChange, 
    addCustomIssue, 
    removeIssue,
    updateIssuesWithStakeholderRelevance
  } = useMaterialityIssues(
    formValues.materialityAnalysis?.issues,
    (updatedIssues) => {
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
  
  // Calculate ESG score based on material issues
  const calculateEsgScore = (issues: any[]) => {
    const materialIssues = issues.filter(issue => issue.isMaterial);
    if (materialIssues.length === 0) return 50;
    
    const totalScore = materialIssues.reduce((score, issue) => {
      const impactScore = issue.impactRelevance || 0;
      const financialScore = issue.financialRelevance || 0;
      const stakeholderScore = issue.stakeholderRelevance || 0;
      
      // Weight the scores (stakeholder feedback has a higher weight)
      return score + (impactScore * 0.4) + (financialScore * 0.3) + (stakeholderScore * 0.3);
    }, 0);
    
    return Math.round(totalScore / materialIssues.length);
  };
  
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
    openSurveyDialog,
    surveyProgress
  } = useSurveyDialog(materialIssues, stakeholders);

  const openSurveyDialogWithValidation = () => {
    if (materialIssues.length === 0) {
      toast({
        title: "Nessuna questione materiale",
        description: "Devi identificare almeno una questione materiale prima di creare un sondaggio.",
        variant: "destructive"
      });
      return;
    }
    
    if (stakeholders.length === 0) {
      toast({
        title: "Nessuno stakeholder",
        description: "Devi aggiungere almeno uno stakeholder prima di creare un sondaggio.",
        variant: "destructive"
      });
      return;
    }
    
    openSurveyDialog();
  };
  
  const sendSurveys = () => {
    if (selectedStakeholders.length === 0) {
      toast({
        title: "Nessuno stakeholder selezionato",
        description: "Seleziona almeno uno stakeholder a cui inviare il sondaggio.",
        variant: "destructive"
      });
      return;
    }
    
    // Update stakeholder survey status
    updateStakeholderSurveyStatus(selectedStakeholders, 'sent');
    
    // In a real application, here you would make an API call to send emails
    console.log("Sending survey to stakeholders:", selectedStakeholders);
    console.log("Survey template:", surveyTemplate);
  };

  // Handler for receiving survey responses from stakeholders
  const handleSurveyResponse = (response: SurveyResponse) => {
    // Process the response and update stakeholder status
    const updatedIssues = processSurveyResponse(response, materialIssues);
    
    // Update issues with new stakeholder relevance data
    updateIssuesWithStakeholderRelevance(updatedIssues);
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
          onOpenSurveyDialog={openSurveyDialogWithValidation}
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
        onSendSurveys={sendSurveys}
      />
    </div>
  );
};

export default MaterialityAnalysisContainer;
