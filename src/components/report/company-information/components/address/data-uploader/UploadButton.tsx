
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';

interface UploadButtonProps {
  isUploading: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ isUploading, isDisabled, onClick }) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={isUploading || isDisabled}
    >
      {isUploading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Caricamento in corso...
        </>
      ) : (
        <>
          <Upload className="mr-2 h-4 w-4" />
          Carica dati
        </>
      )}
    </Button>
  );
};

export default UploadButton;
