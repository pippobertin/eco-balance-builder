
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Stakeholder, SurveyTemplate } from '../../types';
import StakeholderSelector from '../StakeholderSelector';
import SurveyCustomizer from '../SurveyCustomizer';
import DialogFooterActions from '../DialogFooterActions';

interface SurveyConfigModeProps {
  surveyTemplate: SurveyTemplate;
  onSurveyTemplateChange: (updatedTemplate: SurveyTemplate) => void;
  stakeholderGroups: {
    pending: Stakeholder[];
    sent: Stakeholder[];
    completed: Stakeholder[];
  };
  selectedStakeholders: string[];
  onStakeholderSelection: (id: string) => void;
  toggleSelectAllStakeholders: () => void;
  getStakeholderPriorityColor: (priority: string) => string;
  forceResend: boolean;
  onToggleForceResend: () => void;
  onTogglePreviewMode: () => void;
  onSendSurveys: () => void;
  onClose: () => void;
}

const SurveyConfigMode: React.FC<SurveyConfigModeProps> = ({
  surveyTemplate,
  onSurveyTemplateChange,
  stakeholderGroups,
  selectedStakeholders,
  onStakeholderSelection,
  toggleSelectAllStakeholders,
  getStakeholderPriorityColor,
  forceResend,
  onToggleForceResend,
  onTogglePreviewMode,
  onSendSurveys,
  onClose
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Crea e invia sondaggio agli stakeholder</DialogTitle>
        <DialogDescription>
          Seleziona gli stakeholder a cui inviare il sondaggio di materialità.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 py-4">
        <StakeholderSelector 
          stakeholderGroups={stakeholderGroups}
          selectedStakeholders={selectedStakeholders}
          onStakeholderSelection={onStakeholderSelection}
          toggleSelectAllStakeholders={toggleSelectAllStakeholders}
          getStakeholderPriorityColor={getStakeholderPriorityColor}
          forceResend={forceResend}
          onToggleForceResend={onToggleForceResend}
        />
        
        <SurveyCustomizer 
          surveyTemplate={surveyTemplate}
          onSurveyTemplateChange={onSurveyTemplateChange}
        />
      </div>
      
      <DialogFooterActions 
        isPreviewMode={false}
        selectedStakeholdersCount={selectedStakeholders.length}
        onClose={onClose}
        onTogglePreviewMode={onTogglePreviewMode}
        onSendSurveys={onSendSurveys}
      />
    </>
  );
};

export default SurveyConfigMode;
