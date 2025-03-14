
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface UploadOptionsProps {
  clearExisting: boolean;
  setClearExisting: (value: boolean) => void;
}

const UploadOptions: React.FC<UploadOptionsProps> = ({ clearExisting, setClearExisting }) => {
  return (
    <div className="flex items-center space-x-2 pt-2">
      <Checkbox 
        id="clear-existing" 
        checked={clearExisting}
        onCheckedChange={(checked) => setClearExisting(checked as boolean)}
      />
      <Label htmlFor="clear-existing">Cancella dati esistenti prima del caricamento</Label>
    </div>
  );
};

export default UploadOptions;
