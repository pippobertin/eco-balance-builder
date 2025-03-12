
import React, { useState } from 'react';
import MaterialityTabs from '../MaterialityTabs';
import MaterialityHeader from './MaterialityHeader';
import TabContent from './TabContent';
import SurveyDialogWrapper from './SurveyDialogWrapper';
import { useMaterialityContext } from '../context/MaterialityContext';
import IROSummary from './IROSummary';
import { MaterialityIssue } from '../types';

const MaterialityContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('issues');
  const { 
    issues, 
    handleIssueChange: originalHandleIssueChange, 
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

  // Adapter function to match the expected signature
  const handleIssueChange = (id: string, updatedIssue: Partial<MaterialityIssue>) => {
    Object.entries(updatedIssue).forEach(([field, value]) => {
      originalHandleIssueChange(id, field as keyof MaterialityIssue, value);
    });
  };

  return (
    <div className="space-y-6">
      <MaterialityHeader title="Analisi di Materialità" />
      
      <MaterialityTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <TabContent 
        activeTab={activeTab}
        issues={issues}
        handleIssueChange={handleIssueChange}
        addCustomIssue={addCustomIssue}
        removeIssue={removeIssue}
        materialIssues={materialIssues}
        stakeholders={stakeholders}
        handleStakeholderChange={handleStakeholderChange}
        addStakeholder={addStakeholder}
        removeStakeholder={removeStakeholder}
        openSurveyDialog={openSurveyDialog}
        getStakeholderPriorityColor={getStakeholderPriorityColor}
        getSurveyStatusColor={getSurveyStatusColor}
        getSurveyStatusText={getSurveyStatusText}
        surveyProgress={surveyProgress}
        handleUpdateIssue={handleIssueChange}
      />

      <SurveyDialogWrapper 
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

      {/* IRO Summary per visualizzare le selezioni IRO in una vista aggregata */}
      {materialIssues.length > 0 && activeTab === 'issues' && (
        <IROSummary materialIssues={materialIssues} />
      )}
    </div>
  );
};

export default MaterialityContent;
