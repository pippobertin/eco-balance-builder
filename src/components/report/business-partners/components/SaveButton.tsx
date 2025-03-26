
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { SaveButtonProps } from '../hooks/types';

const SaveButton: React.FC<SaveButtonProps> = ({ 
  onClick, 
  isLoading = false, 
  children,
  className = ''
}) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={isLoading}
      className={className}
    >
      <Save className="mr-2 h-4 w-4" />
      {isLoading ? 'Salvataggio...' : children}
    </Button>
  );
};

export default SaveButton;
