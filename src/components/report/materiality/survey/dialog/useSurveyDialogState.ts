
import { useState } from 'react';
import { SurveyTemplate } from '../../types';

export const useSurveyDialogState = () => {
  const [surveyPreviewMode, setSurveyPreviewMode] = useState(false);
  const [showSurveySuccess, setShowSurveySuccess] = useState(false);

  const resetDialogState = () => {
    setSurveyPreviewMode(false);
    setShowSurveySuccess(false);
  };

  const handleSendSurveysSuccess = (onOpenChange: (open: boolean) => void) => {
    setShowSurveySuccess(true);
    
    // Close dialog after a delay
    setTimeout(() => {
      onOpenChange(false);
      resetDialogState();
    }, 3000);
  };

  const togglePreviewMode = () => {
    setSurveyPreviewMode(!surveyPreviewMode);
  };

  return {
    surveyPreviewMode,
    setSurveyPreviewMode,
    showSurveySuccess,
    setShowSurveySuccess,
    resetDialogState,
    handleSendSurveysSuccess,
    togglePreviewMode
  };
};
