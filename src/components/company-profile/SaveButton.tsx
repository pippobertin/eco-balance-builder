
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from 'lucide-react';

interface SaveButtonProps {
  isSaving: boolean;
  onSave: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({ isSaving, onSave }) => {
  return (
    <div className="flex justify-end">
      <Button 
        onClick={onSave} 
        className="bg-blue-500 hover:bg-blue-600"
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvataggio in corso...
          </>
        ) : (
          <>
            Salva informazioni
            <CheckCircle2 className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};

export default SaveButton;
