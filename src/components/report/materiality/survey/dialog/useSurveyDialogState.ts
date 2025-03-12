
import React, { useState } from 'react';
import { SurveyTemplate } from '../../types';

export const useSurveyDialogState = () => {
  const [surveyPreviewMode, setSurveyPreviewMode] = useState(false);
  const [showSurveySuccess, setShowSurveySuccess] = useState(false);

  const resetDialogState = () => {
    setSurveyPreviewMode(false);
    setShowSurveySuccess(false);
  };

  return {
    surveyPreviewMode,
    setSurveyPreviewMode,
    showSurveySuccess,
    setShowSurveySuccess,
    resetDialogState
  };
};
