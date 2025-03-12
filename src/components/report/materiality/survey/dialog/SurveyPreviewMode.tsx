
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SurveyTemplate } from '../../types';
import SurveyPreview from '../SurveyPreview';
import DialogFooterActions from '../DialogFooterActions';

interface SurveyPreviewModeProps {
  surveyTemplate: SurveyTemplate;
  selectedStakeholdersCount: number;
  onTogglePreviewMode: () => void;
  onSendSurveys: () => void;
}

const SurveyPreviewMode: React.FC<SurveyPreviewModeProps> = ({
  surveyTemplate,
  selectedStakeholdersCount,
  onTogglePreviewMode,
  onSendSurveys
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Anteprima del sondaggio di materialità</DialogTitle>
        <DialogDescription>
          Questa è un'anteprima di come apparirà il sondaggio agli stakeholder.
        </DialogDescription>
      </DialogHeader>

      <SurveyPreview surveyTemplate={surveyTemplate} />

      <DialogFooterActions 
        isPreviewMode={true}
        selectedStakeholdersCount={selectedStakeholdersCount}
        onClose={() => {}}
        onTogglePreviewMode={onTogglePreviewMode}
        onSendSurveys={onSendSurveys}
      />
    </>
  );
};

export default SurveyPreviewMode;
