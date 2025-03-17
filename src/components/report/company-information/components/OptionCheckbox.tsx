
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface OptionCheckboxProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const OptionCheckbox: React.FC<OptionCheckboxProps> = ({ 
  id, 
  label, 
  description, 
  checked, 
  onCheckedChange 
}) => {
  return (
    <div className="flex items-start space-x-2">
      <Checkbox 
        id={id} 
        checked={checked} 
        onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
      />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default OptionCheckbox;
