
import React from 'react';
import { Send } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface DialogFooterActionsProps {
  isPreviewMode: boolean;
  selectedStakeholdersCount: number;
  onClose: () => void;
  onTogglePreviewMode: () => void;
  onSendSurveys: () => void;
}

const DialogFooterActions: React.FC<DialogFooterActionsProps> = ({
  isPreviewMode,
  selectedStakeholdersCount,
  onClose,
  onTogglePreviewMode,
  onSendSurveys
}) => {
  return (
    <>
      {isPreviewMode ? (
        <>
          <Button 
            variant="outline" 
            onClick={onTogglePreviewMode}
          >
            Torna alle impostazioni
          </Button>
          <Button 
            onClick={onSendSurveys}
            disabled={selectedStakeholdersCount === 0}
          >
            <Send className="mr-2 h-4 w-4" />
            Invia sondaggio a {selectedStakeholdersCount} stakeholder
          </Button>
        </>
      ) : (
        <>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Annulla
          </Button>
          <div className="flex space-x-2">
            <Button 
              variant="secondary" 
              onClick={onTogglePreviewMode}
            >
              Anteprima sondaggio
            </Button>
            <Button 
              onClick={onSendSurveys}
              disabled={selectedStakeholdersCount === 0}
            >
              <Send className="mr-2 h-4 w-4" />
              Invia sondaggio
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default DialogFooterActions;
