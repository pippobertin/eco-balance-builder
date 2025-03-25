
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';

interface SaveButtonProps {
  onClick: () => Promise<boolean>;
  isLoading: boolean;
  className?: string;
  children?: React.ReactNode;
}

const SaveButton: React.FC<SaveButtonProps> = ({ 
  onClick, 
  isLoading, 
  className = '',
  children
}) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={isLoading}
      className={className}
    >
      <Save className="mr-2 h-4 w-4" />
      {isLoading ? "Salvataggio..." : children || "Salva modifiche"}
    </Button>
  );
};

export default SaveButton;
