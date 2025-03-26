
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RevenueInputProps {
  id: string;
  label: string;
  value: number | string;
  onChange: (value: string) => void;
}

const RevenueInput: React.FC<RevenueInputProps> = ({ id, label, value, onChange }) => {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input 
        id={id}
        type="number"
        min="0"
        max="100"
        placeholder="0-100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1"
      />
    </div>
  );
};

export default RevenueInput;
