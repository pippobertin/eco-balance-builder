
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SaveButtonProps } from '../hooks/types';
import { Loader2 } from 'lucide-react';

const SaveButton: React.FC<SaveButtonProps> = ({ 
  onClick, 
  isLoading: initialLoading = false,
  className = '',
  children = 'Salva'
}) => {
  const [isLoading, setIsLoading] = useState(initialLoading);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onClick();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSave} 
      disabled={isLoading}
      className={`flex items-center gap-2 ${className}`}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
};

export default SaveButton;
