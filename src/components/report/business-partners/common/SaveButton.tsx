
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface SaveButtonProps {
  onClick: () => Promise<void | boolean>;
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({ 
  onClick, 
  isLoading = false, 
  children,
  className = '',
  disabled = false
}) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={disabled || isLoading}
      className={className}
    >
      <Save className="mr-2 h-4 w-4" />
      {isLoading ? 'Salvataggio...' : children}
    </Button>
  );
};

export default SaveButton;
