
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

interface PollutantFormActionsProps {
  isEditing: boolean;
  isSubmitting: boolean;
  onCancel?: () => void;
  isValid?: boolean;
}

const PollutantFormActions: React.FC<PollutantFormActionsProps> = ({
  isEditing,
  isSubmitting,
  onCancel,
  isValid = true
}) => {
  return (
    <div className="flex justify-end space-x-2">
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
      
      <Button
        type="submit"
        disabled={isSubmitting || !isValid}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditing ? "Salvataggio..." : "Aggiunta..."}
          </>
        ) : (
          isEditing ? "Aggiorna" : "Aggiungi"
        )}
      </Button>
    </div>
  );
};

export default PollutantFormActions;
