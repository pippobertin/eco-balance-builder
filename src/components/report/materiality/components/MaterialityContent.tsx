
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import MaterialityTabs from '../MaterialityTabs';
import MaterialityHeader from './MaterialityHeader';
import TabContent from './TabContent';
import SurveyDialogWrapper from './SurveyDialogWrapper';
import { useMaterialityContext } from '../context/MaterialityContext';
import IROSummary from './IROSummary';
import ThemesCategoryTabs from './ThemesCategoryTabs';
import { MaterialityIssue } from '../types';
import { useReport } from '@/hooks/use-report-context';
import { AlertCircle } from 'lucide-react';

const MaterialityContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('issues');
  const { toast } = useToast();
  const { needsSaving } = useReport();
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
    try {
      // Print all issues with their isMaterial values for debugging
      console.log("All issues in MaterialityContent:", issues.map(i => ({
        id: i.id,
        name: i.name,
        isMaterial: i.isMaterial,
        typeOfIsMaterial: typeof i.isMaterial
      })));
      
      // Log for debugging
      console.log("MaterialContent: materialIssues updated, count:", materialIssues.length);
      
      if (materialIssues.length > 0) {
        console.log("MaterialContent: materialIssues IDs:", materialIssues.map(issue => issue.id));
      }
      
      const materialIds = new Set(materialIssues.map(issue => issue.id));
      setMaterialIssueIds(materialIds);
      console.log("MaterialityContent: Updated material issue IDs set with", materialIds.size, "items");
    } catch (error) {
      console.error("Error updating material issue IDs:", error);
      toast({
        title: "Errore di aggiornamento",
        description: "Si è verificato un errore durante l'aggiornamento dei temi di materialità. Ricarica la pagina.",
        variant: "destructive"
      });
    }
  }, [materialIssues, issues, toast]);

  // Handle issue selection from ThemesCategoryTabs
  const handleIssueSelect = (issue: MaterialityIssue) => {
    try {
      console.log("MaterialityContent handling issue select:", issue.id, "isMaterial:", issue.isMaterial);
      
      // This is the top-level handler that receives an issue object with toggled isMaterial
      // The issue object's isMaterial has already been toggled by DragDropContainer
      const newIsMaterial = issue.isMaterial;
      console.log("MaterialityContent: Using toggled isMaterial:", newIsMaterial);
      
      // Pass to the original handler with the already toggled boolean value
      originalHandleIssueChange(issue.id, 'isMaterial', newIsMaterial);
      
      // For debugging - check all material issues after update
      setTimeout(() => {
        try {
          const materialCount = issues.filter(i => i.isMaterial === true).length;
          console.log(`After updating issue ${issue.id}, material issues count: ${materialCount}`);
          
          if (materialCount > 0) {
            console.log("Material issues:", issues.filter(i => i.isMaterial === true).map(i => i.id));
          }
        } catch (error) {
          console.error("Error in post-selection debugging:", error);
        }
      }, 1200);
    } catch (error) {
      console.error("Error handling issue selection:", error);
      toast({
        title: "Errore nella selezione",
        description: "Si è verificato un errore durante la selezione del tema. Riprova.",
        variant: "destructive"
      });
    }
  };

  // Adapter function to match the expected signature for TabContent
  const handleIssueChange = (id: string, updatedIssue: Partial<MaterialityIssue>) => {
    try {
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
    } catch (error) {
      console.error("Error in handleIssueChange:", error);
      toast({
        title: "Errore nell'aggiornamento",
        description: "Si è verificato un errore durante l'aggiornamento del tema. Riprova.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 relative">
      {needsSaving && (
        <div className="absolute right-0 top-0 flex items-center text-amber-500 text-sm">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>Salvataggio in corso...</span>
        </div>
      )}
      
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
