
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { MaterialityIssue, Stakeholder } from '../types';

export const useSurveyValidation = () => {
  const { toast } = useToast();
  const [surveyDialogOpen, setSurveyDialogOpen] = useState(false);

  const validateSurveyCreation = (
    materialIssues: MaterialityIssue[],
    stakeholders: Stakeholder[]
  ): boolean => {
    if (materialIssues.length === 0) {
      toast({
        title: "Nessuna questione materiale",
        description: "Devi identificare almeno una questione materiale prima di creare un sondaggio.",
        variant: "destructive"
      });
      return false;
    }
    
    if (stakeholders.length === 0) {
      toast({
        title: "Nessuno stakeholder",
        description: "Devi aggiungere almeno uno stakeholder prima di creare un sondaggio.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const validateSurveySending = (selectedStakeholders: string[]): boolean => {
    if (selectedStakeholders.length === 0) {
      toast({
        title: "Nessuno stakeholder selezionato",
        description: "Seleziona almeno uno stakeholder a cui inviare il sondaggio.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const openSurveyDialog = (
    materialIssues: MaterialityIssue[],
    stakeholders: Stakeholder[]
  ): boolean => {
    if (validateSurveyCreation(materialIssues, stakeholders)) {
      setSurveyDialogOpen(true);
      return true;
    }
    
    return false;
  };

  return {
    surveyDialogOpen,
    setSurveyDialogOpen,
    validateSurveyCreation,
    validateSurveySending,
    openSurveyDialog
  };
};
