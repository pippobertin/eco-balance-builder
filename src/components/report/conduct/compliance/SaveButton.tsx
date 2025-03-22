
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';

interface SaveButtonProps {
  onClick: () => Promise<void>;
  isLoading: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onClick, isLoading }) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={isLoading}
      className="bg-blue-500 hover:bg-blue-600 text-white"
    >
      <Save className="mr-2 h-4 w-4" />
      {isLoading ? "Salvataggio..." : "Salva dati compliance"}
    </Button>
  );
};

export default SaveButton;
