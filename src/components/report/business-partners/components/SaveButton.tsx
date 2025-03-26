
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { SaveButtonProps } from '../hooks/types';

const SaveButton: React.FC<SaveButtonProps> = ({ 
  onClick, 
  isLoading = false, 
  children, 
  className = '',
  disabled = false,
  ...props 
}) => {
  return (
    <Button
      onClick={async () => {
        await onClick();
      }}
      disabled={disabled || isLoading}
      className={`flex items-center space-x-2 ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Save className="h-4 w-4" />
      )}
      <span>{children}</span>
    </Button>
  );
};

export default SaveButton;
