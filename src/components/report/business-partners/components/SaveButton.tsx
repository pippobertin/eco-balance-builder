
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SaveButtonProps {
  onClick: () => Promise<boolean> | void;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  onClick,
  isLoading = false,
  children
}) => {
  return (
    <Button 
      variant="primary" 
      onClick={onClick} 
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Salvataggio...
        </>
      ) : (
        children
      )}
    </Button>
  );
};
