
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SaveButtonProps {
  onClick: () => Promise<void>;
  isLoading: boolean;
  children: React.ReactNode;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onClick, isLoading, children }) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
};

export default SaveButton;
