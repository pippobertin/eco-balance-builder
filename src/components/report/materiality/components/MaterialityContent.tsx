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
    // Print all issues with their isMaterial values for debugging
    console.log("All issues in MaterialityContent:", issues.map(i => ({
      id: i.id,
      name: i.name,
      isMaterial: i.isMaterial,
      typeOfIsMaterial: typeof i.isMaterial
    })));
    
    // Log for debugging
    console.log("MaterialContent: materialIssues updated, count:", materialIssues.length);
    console.log("MaterialContent: materialIssues IDs:", materialIssues.map(issue => issue.id));
    
    const materialIds = new Set(materialIssues.map(issue => issue.id));
    setMaterialIssueIds(materialIds);
    console.log("MaterialityContent: Updated material issue IDs set with", materialIds.size, "items");
  }, [materialIssues, issues]);

  // Handle issue selection from ThemesCategoryTabs - CRITICAL for selection to work
  const handleIssueSelect = (issue: MaterialityIssue) => {
    console.log("MaterialityContent handling issue select:", issue.id, "isMaterial:", issue.isMaterial, "type:", typeof issue.isMaterial);
    
    // CRITICAL FIX: Toggle isMaterial here, since this is the top-level handler
    // This ensures consistency in how issues are toggled
    const newIsMaterial = !issue.isMaterial;
    console.log("MaterialityContent: Setting isMaterial to:", newIsMaterial);
    
    // Pass to the original handler with new boolean value
    originalHandleIssueChange(issue.id, 'isMaterial', newIsMaterial);
    
    // For debugging - check all material issues after update
    setTimeout(() => {
      const materialCount = issues.filter(i => i.isMaterial === true).length;
      console.log(`After updating issue ${issue.id}, material issues count: ${materialCount}`);
      console.log("Material issues:", issues.filter(i => i.isMaterial === true).map(i => i.id));
    }, 800);
  };

  // Adapter function to match the expected signature for TabContent
  const handleIssueChange = (id: string, updatedIssue: Partial<MaterialityIssue>) => {
    console.log("MaterialityContent handleIssueChange for ID:", id, "with updates:", updatedIssue);
    
    Object.entries(updatedIssue).forEach(([field, value]) => {
      // Special handling for isMaterial to ensure it's boolean
      if (field === 'isMaterial') {
        const boolValue = value === true;
        console.log(`Setting ${id} isMaterial to boolean ${boolValue}`);
        originalHandleIssueChange(id, field as keyof MaterialityIssue, boolValue);
      } else {
        originalHandleIssueChange(id, field as keyof MaterialityIssue, value);
      }
    });
  };

  return (
    <div className="space-y-6">
      <MaterialityHeader title="Analisi di Materialità" />
      
      <MaterialityTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Use ThemesCategoryTabs for Environmental, Social and Governance theme selection */}
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

      {/* IRO Summary for displaying IRO selections in an aggregated view */}
      {materialIssues.length > 0 && activeTab === 'issues' && (
        <IROSummary materialIssues={materialIssues} />
      )}
    </div>
  );
};

export default MaterialityContent;
