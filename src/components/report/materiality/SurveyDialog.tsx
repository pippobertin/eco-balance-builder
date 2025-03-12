
import React from 'react';
import { Dialog } from "@/components/ui/dialog";
import { Stakeholder, SurveyTemplate } from './types';
import SurveyDialogContent from './survey/dialog/SurveyDialogContent';
import { useSurveyDialogState } from './survey/dialog/useSurveyDialogState';

interface SurveyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stakeholders: Stakeholder[];
  stakeholderGroups: {
    pending: Stakeholder[];
    sent: Stakeholder[];
    completed: Stakeholder[];
  };
  surveyTemplate: SurveyTemplate;
  setSurveyTemplate: React.Dispatch<React.SetStateAction<SurveyTemplate>>;
  selectedStakeholders: string[];
  setSelectedStakeholders: React.Dispatch<React.SetStateAction<string[]>>;
  forceResend: boolean;
  toggleForceResend: () => void;
  getStakeholderPriorityColor: (priority: string) => string;
  onSendSurveys: () => void;
}

const SurveyDialog: React.FC<SurveyDialogProps> = ({
  open,
  onOpenChange,
  stakeholders,
  stakeholderGroups,
  surveyTemplate,
  setSurveyTemplate,
  selectedStakeholders,
  setSelectedStakeholders,
  forceResend,
  toggleForceResend,
  getStakeholderPriorityColor,
  onSendSurveys
}) => {
  const {
    surveyPreviewMode,
    setSurveyPreviewMode,
    showSurveySuccess,
    setShowSurveySuccess,
    resetDialogState,
    handleSendSurveysSuccess
  } = useSurveyDialogState();

  // Reset dialog state when closing
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetDialogState();
    }
    onOpenChange(newOpen);
  };

  // Handle survey sending with success handling
  const handleSendSurvey = () => {
    onSendSurveys();
    handleSendSurveysSuccess(onOpenChange);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <SurveyDialogContent
        surveyTemplate={surveyTemplate}
        setSurveyTemplate={setSurveyTemplate}
        stakeholders={stakeholders}
        stakeholderGroups={stakeholderGroups}
        selectedStakeholders={selectedStakeholders}
        setSelectedStakeholders={setSelectedStakeholders}
        forceResend={forceResend}
        toggleForceResend={toggleForceResend}
        getStakeholderPriorityColor={getStakeholderPriorityColor}
        onSendSurveys={handleSendSurvey}
        onOpenChange={handleOpenChange}
        surveyPreviewMode={surveyPreviewMode}
        setSurveyPreviewMode={setSurveyPreviewMode}
        showSurveySuccess={showSurveySuccess}
        setShowSurveySuccess={setShowSurveySuccess}
      />
    </Dialog>
  );
};

export default SurveyDialog;
