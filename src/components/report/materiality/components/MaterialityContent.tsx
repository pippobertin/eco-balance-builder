
import React, { useState, useEffect } from 'react';
import MaterialityTabs from '../MaterialityTabs';
import MaterialityHeader from './MaterialityHeader';
import TabContent from './TabContent';
import SurveyDialogWrapper from './SurveyDialogWrapper';
import { useMaterialityContext } from '../context/MaterialityContext';
import IROSummary from './IROSummary';
import ThemesCategoryTabs from './ThemesCategoryTabs';
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

  // Create a set of material issue IDs for quick lookup
  const [materialIssueIds, setMaterialIssueIds] = useState(new Set<string>());
  
  useEffect(() => {
    // Log for debugging
    console.log("MaterialContent: materialIssues updated, count:", materialIssues.length);
    console.log("MaterialContent: materialIssues IDs:", materialIssues.map(issue => issue.id));
    
    const materialIds = new Set(materialIssues.map(issue => issue.id));
    setMaterialIssueIds(materialIds);
    console.log("MaterialityContent: Updated material issue IDs set with", materialIds.size, "items");
  }, [materialIssues]);

  // Handle issue selection from ThemesCategoryTabs
  const handleIssueSelect = (issue: MaterialityIssue) => {
    console.log("MaterialityContent handling issue select:", issue.id, "isMaterial:", issue.isMaterial);
    
    // Critical: Always set isMaterial based on where the issue is currently located
    // If it's in available issues, set to true; if in selected issues, set to false
    const newIsMaterial = !issue.isMaterial;
    
    console.log("MaterialityContent: Setting isMaterial to", newIsMaterial, "for issue", issue.id);
    originalHandleIssueChange(issue.id, 'isMaterial', newIsMaterial);
  };

  // Adapter function to match the expected signature for TabContent
  const handleIssueChange = (id: string, updatedIssue: Partial<MaterialityIssue>) => {
    console.log("MaterialityContent handleIssueChange for ID:", id, "with updates:", updatedIssue);
    
    Object.entries(updatedIssue).forEach(([field, value]) => {
      originalHandleIssueChange(id, field as keyof MaterialityIssue, value);
    });
  };

  return (
    <div className="space-y-6">
      <MaterialityHeader title="Analisi di Materialità" />
      
      <MaterialityTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Add ThemesCategoryTabs component for E, S, G theme selection */}
      {activeTab === 'issues' && (
        <ThemesCategoryTabs 
          onAddIssue={addCustomIssue} 
          onIssueSelect={handleIssueSelect}
          selectedIssueIds={materialIssueIds}
        />
      )}
      
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
