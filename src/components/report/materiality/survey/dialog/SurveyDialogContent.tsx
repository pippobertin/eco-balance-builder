
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Stakeholder, SurveyTemplate } from '../../types';
import StakeholderSelector from '../StakeholderSelector';
import SurveyCustomizer from '../SurveyCustomizer';
import SurveyPreview from '../SurveyPreview';
import SuccessMessage from '../SuccessMessage';
import DialogFooterActions from '../DialogFooterActions';

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
  stakeholders,
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
  showSurveySuccess,
  setShowSurveySuccess
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
    setShowSurveySuccess(true);
    
    // Close dialog after a delay
    setTimeout(() => {
      onOpenChange(false);
      setShowSurveySuccess(false);
      setSurveyPreviewMode(false);
    }, 3000);
  };

  const handleSurveyTemplateChange = (updatedTemplate: SurveyTemplate) => {
    setSurveyTemplate(updatedTemplate);
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {surveyPreviewMode 
            ? "Anteprima del sondaggio di materialità" 
            : "Crea e invia sondaggio agli stakeholder"}
        </DialogTitle>
        <DialogDescription>
          {surveyPreviewMode 
            ? "Questa è un'anteprima di come apparirà il sondaggio agli stakeholder."
            : "Seleziona gli stakeholder a cui inviare il sondaggio di materialità."
          }
        </DialogDescription>
      </DialogHeader>

      {showSurveySuccess ? (
        <SuccessMessage selectedStakeholdersCount={selectedStakeholders.length} />
      ) : surveyPreviewMode ? (
        <SurveyPreview surveyTemplate={surveyTemplate} />
      ) : (
        <div className="space-y-6 py-4">
          <StakeholderSelector 
            stakeholderGroups={stakeholderGroups}
            selectedStakeholders={selectedStakeholders}
            onStakeholderSelection={handleStakeholderSelection}
            toggleSelectAllStakeholders={toggleSelectAllStakeholders}
            getStakeholderPriorityColor={getStakeholderPriorityColor}
            forceResend={forceResend}
            onToggleForceResend={toggleForceResend}
          />
          
          <SurveyCustomizer 
            surveyTemplate={surveyTemplate}
            onSurveyTemplateChange={handleSurveyTemplateChange}
          />
        </div>
      )}
      
      <DialogFooter className="flex justify-between items-center space-x-2">
        <DialogFooterActions 
          isPreviewMode={surveyPreviewMode}
          selectedStakeholdersCount={selectedStakeholders.length}
          onClose={() => onOpenChange(false)}
          onTogglePreviewMode={toggleSurveyPreviewMode}
          onSendSurveys={handleSendSurveys}
        />
      </DialogFooter>
    </DialogContent>
  );
};

export default SurveyDialogContent;
