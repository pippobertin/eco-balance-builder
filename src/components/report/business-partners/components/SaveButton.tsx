
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SaveButtonProps {
  onClick: () => Promise<boolean> | void;
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  onClick,
  isLoading = false,
  children,
  className
}) => {
  return (
    <Button 
      variant="default" 
      onClick={onClick} 
      disabled={isLoading}
      className={className}
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
