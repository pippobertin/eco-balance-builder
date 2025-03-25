
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface SectorCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}

export const SectorCheckbox: React.FC<SectorCheckboxProps> = ({
  id,
  label,
  checked,
  onChange
}) => {
  return (
    <div className="flex items-start space-x-2">
      <Checkbox 
        id={id} 
        checked={checked} 
        onCheckedChange={onChange} 
        className="mt-1"
      />
      <Label htmlFor={id} className="cursor-pointer text-sm">
        {label}
      </Label>
    </div>
  );
};
