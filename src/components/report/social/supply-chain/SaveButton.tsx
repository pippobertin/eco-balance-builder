
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';

interface SaveButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onClick, isLoading }) => {
  return (
    <div className="flex justify-end mt-6">
      <Button 
        onClick={onClick} 
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        <Save className="h-4 w-4" />
        {isLoading ? "Salvataggio..." : "Salva dati catena del valore"}
      </Button>
    </div>
  );
};

export default SaveButton;
