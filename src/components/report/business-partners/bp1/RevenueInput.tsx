
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RevenueInputProps {
  id: string;
  label: string;
  value: number | string;
  onChange: (value: number | undefined) => void;
  disabled?: boolean;
}

export const RevenueInput: React.FC<RevenueInputProps> = ({
  id,
  label,
  value,
  onChange,
  disabled = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? undefined : parseFloat(e.target.value);
    onChange(newValue);
  };

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm">
        {label}
      </Label>
      <Input
        id={id}
        type="number"
        value={value === undefined ? '' : value}
        onChange={handleChange}
        placeholder="0"
        disabled={disabled}
      />
    </div>
  );
};
