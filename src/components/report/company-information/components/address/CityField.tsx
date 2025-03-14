
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Municipality } from './types';

interface CityFieldProps {
  city: string;
  municipalities: Municipality[];
  provinceSelected: boolean;
  isLoading: boolean;
  onChange: (field: string, value: string) => void;
}

const CityField: React.FC<CityFieldProps> = ({
  city,
  municipalities,
  provinceSelected,
  isLoading,
  onChange
}) => {
  return (
    <div>
      <Label htmlFor="address_city">Comune</Label>
      <Select 
        value={city || ''}
        onValueChange={(value) => onChange('address_city', value)}
        disabled={!provinceSelected || isLoading}
      >
        <SelectTrigger id="address_city">
          <SelectValue placeholder={isLoading ? "Caricamento..." : "Seleziona comune..."} />
        </SelectTrigger>
        <SelectContent>
          {municipalities.map((municipality) => (
            <SelectItem key={municipality.id} value={municipality.name}>
              {municipality.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CityField;
