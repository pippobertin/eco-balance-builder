
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface NumberFieldProps {
  number: string;
  onChange: (field: string, value: string) => void;
}

const NumberField: React.FC<NumberFieldProps> = ({ 
  number, 
  onChange 
}) => {
  return (
    <div>
      <Label htmlFor="address_number">Numero Civico</Label>
      <Input
        id="address_number"
        name="address_number"
        value={number || ''}
        onChange={(e) => onChange('address_number', e.target.value)}
        placeholder="Numero civico"
      />
    </div>
  );
};

export default NumberField;
