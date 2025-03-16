
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface UploadOptionsProps {
  clearExisting: boolean;
  setClearExisting: (value: boolean) => void;
}

const UploadOptions: React.FC<UploadOptionsProps> = ({
  clearExisting,
  setClearExisting
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="clear-existing"
        checked={clearExisting}
        onCheckedChange={setClearExisting}
      />
      <Label htmlFor="clear-existing">
        Cancella i dati esistenti prima di caricare
      </Label>
    </div>
  );
};

export default UploadOptions;
