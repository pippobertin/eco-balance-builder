
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface SectorCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}

const SectorCheckbox: React.FC<SectorCheckboxProps> = ({ id, label, checked, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id={id} 
        checked={checked} 
        onCheckedChange={onChange}
      />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
};

export default SectorCheckbox;
