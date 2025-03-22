
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
      className="ml-auto"
    >
      <Save className="mr-2 h-4 w-4" />
      {isLoading ? "Salvataggio..." : "Salva modifiche"}
    </Button>
  );
};

export default SaveButton;
