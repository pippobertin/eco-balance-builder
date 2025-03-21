
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WasteNumericFieldProps {
  id: string;
  name: string;
  label: string;
  value: number | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const WasteNumericField: React.FC<WasteNumericFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange
}) => {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        type="number"
        step="0.01"
        value={value === null ? '' : value}
        onChange={onChange}
        placeholder="0.00"
      />
    </div>
  );
};

export default WasteNumericField;
