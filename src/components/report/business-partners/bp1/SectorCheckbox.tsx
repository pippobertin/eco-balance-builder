
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface SectorCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: () => void;
}

export const SectorCheckbox: React.FC<SectorCheckboxProps> = ({
  id,
  label,
  checked,
  onCheckedChange
}) => {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
};
