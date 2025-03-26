
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SaveButtonProps {
  onClick: () => Promise<void | boolean>;
  isLoading?: boolean;
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

const SaveButton: React.FC<SaveButtonProps> = ({ 
  onClick, 
  isLoading = false, 
  children, 
  variant = 'default'
}) => {
  return (
    <Button 
      onClick={onClick}
      disabled={isLoading}
      variant={variant}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
};

export default SaveButton;
