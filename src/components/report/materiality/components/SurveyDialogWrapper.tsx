
import React from 'react';
import SurveyDialog from '../SurveyDialog';

interface SurveyDialogWrapperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stakeholders: any[];
  stakeholderGroups: {
    pending: any[];
    sent: any[];
    completed: any[];
  };
  surveyTemplate: any;
  setSurveyTemplate: React.Dispatch<React.SetStateAction<any>>;
  selectedStakeholders: string[];
  setSelectedStakeholders: React.Dispatch<React.SetStateAction<string[]>>;
  forceResend: boolean;
  toggleForceResend: () => void;
  getStakeholderPriorityColor: (priority: string) => string;
  onSendSurveys: () => void;
}

const SurveyDialogWrapper: React.FC<SurveyDialogWrapperProps> = (props) => {
  return (
    <SurveyDialog 
      open={props.open}
      onOpenChange={props.onOpenChange}
      stakeholders={props.stakeholders}
      stakeholderGroups={props.stakeholderGroups}
      surveyTemplate={props.surveyTemplate}
      setSurveyTemplate={props.setSurveyTemplate}
      selectedStakeholders={props.selectedStakeholders}
      setSelectedStakeholders={props.setSelectedStakeholders}
      forceResend={props.forceResend}
      toggleForceResend={props.toggleForceResend}
      getStakeholderPriorityColor={props.getStakeholderPriorityColor}
      onSendSurveys={props.onSendSurveys}
    />
  );
};

export default SurveyDialogWrapper;
