
import { useState, useEffect } from 'react';
import { MaterialityIssue, SurveyTemplate } from '../types';

export const useSurveyDialog = (materialIssues: MaterialityIssue[]) => {
  const [surveyTemplate, setSurveyTemplate] = useState<SurveyTemplate>({
    title: 'Analisi di Materialità - Valutazione degli Stakeholder',
    description: 'Vi chiediamo di valutare l\'importanza delle seguenti questioni di sostenibilità per la nostra organizzazione',
    issues: [],
    additionalComments: true
  });
  
  const [surveyDialogOpen, setSurveyDialogOpen] = useState(false);
  const [selectedStakeholders, setSelectedStakeholders] = useState<string[]>([]);

  // Update survey template issues whenever material issues change
  useEffect(() => {
    setSurveyTemplate(prev => ({
      ...prev,
      issues: materialIssues
    }));
  }, [materialIssues]);

  const openSurveyDialog = () => {
    setSurveyDialogOpen(true);
    setSelectedStakeholders([]);
  };

  const closeSurveyDialog = () => {
    setSurveyDialogOpen(false);
  };

  return {
    surveyTemplate,
    setSurveyTemplate,
    surveyDialogOpen,
    setSurveyDialogOpen,
    selectedStakeholders,
    setSelectedStakeholders,
    openSurveyDialog,
    closeSurveyDialog
  };
};
