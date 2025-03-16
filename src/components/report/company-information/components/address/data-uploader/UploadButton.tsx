
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';

interface UploadButtonProps {
  isUploading: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  isUploading,
  isDisabled,
  onClick
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={isDisabled || isUploading}
    >
      {isUploading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Caricamento...
        </>
      ) : (
        <>
          <Upload className="h-4 w-4 mr-2" />
          Carica
        </>
      )}
    </Button>
  );
};

export default UploadButton;
