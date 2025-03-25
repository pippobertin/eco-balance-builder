
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';

export interface SaveButtonProps {
  onClick: () => Promise<boolean | void>;
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

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
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Save className="h-4 w-4" />
      )}
      {children}
    </Button>
  );
};

export default SaveButton;
