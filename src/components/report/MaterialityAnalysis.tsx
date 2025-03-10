
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Target, Users } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import MaterialityIssuesTab from './materiality/MaterialityIssuesTab';
import StakeholdersTab from './materiality/StakeholdersTab';
import SurveyDialog from './materiality/SurveyDialog';
import { useMaterialityIssues } from './materiality/hooks/useMaterialityIssues';
import { useStakeholders } from './materiality/hooks/useStakeholders';
import { useSurveyDialog } from './materiality/hooks/useSurveyDialog';
import { getStakeholderPriorityColor, getSurveyStatusColor, getSurveyStatusText } from './materiality/utils/materialityUtils';
import { SurveyResponse } from './materiality/types';

interface MaterialityAnalysisProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

const MaterialityAnalysis: React.FC<MaterialityAnalysisProps> = ({ 
  formValues, 
  setFormValues 
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('issues');
  
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
      setFormValues(prev => ({
        ...prev,
        materialityAnalysis: {
          ...prev.materialityAnalysis,
          issues: updatedIssues
        }
      }));
    }
  );
  
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
      setFormValues(prev => ({
        ...prev,
        materialityAnalysis: {
          ...prev.materialityAnalysis,
          stakeholders: updatedStakeholders
        }
      }));
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
      
      <div className="flex space-x-2 mb-6">
        <Button 
          variant={activeTab === 'issues' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('issues')}
        >
          <Target className="mr-2 h-5 w-5" />
          Questioni di Materialità
        </Button>
        <Button 
          variant={activeTab === 'stakeholders' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('stakeholders')}
        >
          <Users className="mr-2 h-5 w-5" />
          Mappatura Stakeholder
        </Button>
      </div>
      
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

export default MaterialityAnalysis;
