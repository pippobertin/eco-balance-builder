
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { streetTypes } from './types';

interface StreetTypeFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const StreetTypeField: React.FC<StreetTypeFieldProps> = ({ value, onChange }) => {
  return (
    <div>
      <Label htmlFor="address_street_type">Tipo Indirizzo</Label>
      <Select 
        value={value || ''}
        onValueChange={onChange}
      >
        <SelectTrigger id="address_street_type">
          <SelectValue placeholder="Seleziona..." />
        </SelectTrigger>
        <SelectContent>
          {streetTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StreetTypeField;
