
import { useState, useEffect, useMemo } from 'react';
import { MaterialityIssue, SurveyTemplate, Stakeholder } from '../types';

export const useSurveyDialog = (materialIssues: MaterialityIssue[], stakeholders: Stakeholder[]) => {
  const [surveyTemplate, setSurveyTemplate] = useState<SurveyTemplate>({
    title: 'Analisi di Materialità - Valutazione degli Stakeholder',
    description: 'Vi chiediamo di valutare l\'importanza delle seguenti questioni di sostenibilità per la nostra organizzazione',
    issues: [],
    additionalComments: true
  });
  
  const [surveyDialogOpen, setSurveyDialogOpen] = useState(false);
  const [selectedStakeholders, setSelectedStakeholders] = useState<string[]>([]);
  const [forceResend, setForceResend] = useState(false);

  // Stakeholders grouped by survey status for easier selection
  const stakeholderGroups = useMemo(() => {
    return {
      pending: stakeholders.filter(s => !s.surveyStatus || s.surveyStatus === 'pending'),
      sent: stakeholders.filter(s => s.surveyStatus === 'sent'),
      completed: stakeholders.filter(s => s.surveyStatus === 'completed')
    };
  }, [stakeholders]);

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
    setForceResend(false);
  };

  const closeSurveyDialog = () => {
    setSurveyDialogOpen(false);
  };

  const toggleForceResend = () => {
    setForceResend(!forceResend);
    // Se disabilitiamo il re-invio forzato, rimuoviamo gli stakeholder con sondaggio già inviato
    if (forceResend) {
      setSelectedStakeholders(prev => 
        prev.filter(id => {
          const stakeholder = stakeholders.find(s => s.id === id);
          return !stakeholder || !stakeholder.surveyStatus || stakeholder.surveyStatus === 'pending';
        })
      );
    }
  };

  return {
    surveyTemplate,
    setSurveyTemplate,
    surveyDialogOpen,
    setSurveyDialogOpen,
    selectedStakeholders,
    setSelectedStakeholders,
    stakeholderGroups,
    forceResend,
    toggleForceResend,
    openSurveyDialog,
    closeSurveyDialog
  };
};
