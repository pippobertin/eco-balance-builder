
import React from 'react';
import { DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Stakeholder, SurveyTemplate } from '../../types';
import SurveyConfigMode from './SurveyConfigMode';
import SurveyPreviewMode from './SurveyPreviewMode';
import SuccessMessage from '../SuccessMessage';

interface SurveyDialogContentProps {
  surveyTemplate: SurveyTemplate;
  setSurveyTemplate: React.Dispatch<React.SetStateAction<SurveyTemplate>>;
  stakeholders: Stakeholder[];
  stakeholderGroups: {
    pending: Stakeholder[];
    sent: Stakeholder[];
    completed: Stakeholder[];
  };
  selectedStakeholders: string[];
  setSelectedStakeholders: React.Dispatch<React.SetStateAction<string[]>>;
  forceResend: boolean;
  toggleForceResend: () => void;
  getStakeholderPriorityColor: (priority: string) => string;
  onSendSurveys: () => void;
  onOpenChange: (open: boolean) => void;
  surveyPreviewMode: boolean;
  setSurveyPreviewMode: React.Dispatch<React.SetStateAction<boolean>>;
  showSurveySuccess: boolean;
  setShowSurveySuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const SurveyDialogContent: React.FC<SurveyDialogContentProps> = ({
  surveyTemplate,
  setSurveyTemplate,
  stakeholderGroups,
  selectedStakeholders,
  setSelectedStakeholders,
  forceResend,
  toggleForceResend,
  getStakeholderPriorityColor,
  onSendSurveys,
  onOpenChange,
  surveyPreviewMode,
  setSurveyPreviewMode,
  showSurveySuccess
}) => {
  const toggleSelectAllStakeholders = () => {
    const allStakeholdersIds = [
      ...stakeholderGroups.pending,
      ...(forceResend ? [...stakeholderGroups.sent, ...stakeholderGroups.completed] : [])
    ].map(s => s.id);
    
    if (selectedStakeholders.length === allStakeholdersIds.length) {
      setSelectedStakeholders([]);
    } else {
      setSelectedStakeholders(allStakeholdersIds);
    }
  };

  const handleStakeholderSelection = (id: string) => {
    setSelectedStakeholders(prev => 
      prev.includes(id) 
        ? prev.filter(s => s !== id) 
        : [...prev, id]
    );
  };

  const toggleSurveyPreviewMode = () => {
    setSurveyPreviewMode(!surveyPreviewMode);
  };

  const handleSendSurveys = () => {
    onSendSurveys();
    
    // Close dialog after a delay
    setTimeout(() => {
      onOpenChange(false);
    }, 3000);
  };

  const handleSurveyTemplateChange = (updatedTemplate: SurveyTemplate) => {
    setSurveyTemplate(updatedTemplate);
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      {showSurveySuccess ? (
        <SuccessMessage selectedStakeholdersCount={selectedStakeholders.length} />
      ) : surveyPreviewMode ? (
        <SurveyPreviewMode 
          surveyTemplate={surveyTemplate}
          selectedStakeholdersCount={selectedStakeholders.length}
          onTogglePreviewMode={toggleSurveyPreviewMode}
          onSendSurveys={handleSendSurveys}
        />
      ) : (
        <SurveyConfigMode 
          surveyTemplate={surveyTemplate}
          onSurveyTemplateChange={handleSurveyTemplateChange}
          stakeholderGroups={stakeholderGroups}
          selectedStakeholders={selectedStakeholders}
          onStakeholderSelection={handleStakeholderSelection}
          toggleSelectAllStakeholders={toggleSelectAllStakeholders}
          getStakeholderPriorityColor={getStakeholderPriorityColor}
          forceResend={forceResend}
          onToggleForceResend={toggleForceResend}
          onTogglePreviewMode={toggleSurveyPreviewMode}
          onSendSurveys={handleSendSurveys}
          onClose={() => onOpenChange(false)}
        />
      )}
    </DialogContent>
  );
};

export default SurveyDialogContent;
