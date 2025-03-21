
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, PenLine } from 'lucide-react';

interface PollutantFormActionsProps {
  isEditing: boolean;
  isSubmitting: boolean;
  onCancel?: () => void;
  isValid: boolean;
}

const PollutantFormActions: React.FC<PollutantFormActionsProps> = ({
  isEditing,
  isSubmitting,
  onCancel,
  isValid
}) => {
  return (
    <div className="flex gap-2">
      <Button 
        type="submit" 
        disabled={!isValid || isSubmitting} 
        className="flex-1"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditing ? 'Aggiornamento...' : 'Salvataggio...'}
          </>
        ) : (
          <>
            {isEditing ? (
              <>
                <PenLine className="mr-2 h-4 w-4" />
                Aggiorna Inquinante
              </>
            ) : (
              'Aggiungi Inquinante'
            )}
          </>
        )}
      </Button>
      
      {isEditing && onCancel && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annulla
        </Button>
      )}
    </div>
  );
};

export default PollutantFormActions;
