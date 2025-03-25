
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface RevenueInputProps {
  id: string;
  label: string;
  value: number | string;
  onChange: (value: number | undefined) => void;
}

export const RevenueInput: React.FC<RevenueInputProps> = ({
  id,
  label,
  value,
  onChange
}) => {
  return (
    <div>
      <Label htmlFor={id} className="text-sm">
        {label}
      </Label>
      <Input
        id={id}
        type="number"
        value={value || ''}
        onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
        placeholder="Percentuale dei ricavi"
        className="mt-1"
      />
    </div>
  );
};
