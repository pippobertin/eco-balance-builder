
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';
import { SaveButtonProps } from '../hooks/types';

const SaveButton: React.FC<SaveButtonProps> = ({ onClick, isLoading }) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={isLoading}
      className="ml-auto mt-4"
    >
      <Save className="mr-2 h-4 w-4" />
      {isLoading ? "Salvataggio..." : "Salva modifiche"}
    </Button>
  );
};

export default SaveButton;
