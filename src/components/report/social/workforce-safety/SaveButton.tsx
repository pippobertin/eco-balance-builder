
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';

interface SaveButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

const SaveButton = ({ onClick, isLoading }: SaveButtonProps) => {
  return (
    <div className="flex justify-end mt-6">
      <Button 
        onClick={onClick} 
        disabled={isLoading}
      >
        <Save className="mr-2 h-4 w-4" />
        {isLoading ? "Salvataggio..." : "Salva dati sicurezza"}
      </Button>
    </div>
  );
};

export default SaveButton;
