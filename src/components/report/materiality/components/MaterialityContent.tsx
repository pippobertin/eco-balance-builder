
import React, { useState } from 'react';
import MaterialityTabs from '../MaterialityTabs';
import MaterialityIssuesTab from '../MaterialityIssuesTab';
import StakeholdersTab from '../StakeholdersTab';
import SurveyDialog from '../SurveyDialog';
import { useMaterialityContext } from '../context/MaterialityContext';

const MaterialityContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('issues');
  const { 
    issues, 
    handleIssueChange, 
    addCustomIssue, 
    removeIssue,
    materialIssues,
    stakeholders,
    addStakeholder,
    removeStakeholder,
    handleStakeholderChange,
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
    openSurveyDialog,
    handleSendSurveys,
    getStakeholderPriorityColor,
    getSurveyStatusColor,
    getSurveyStatusText
  } = useMaterialityContext();

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

export default MaterialityContent;
