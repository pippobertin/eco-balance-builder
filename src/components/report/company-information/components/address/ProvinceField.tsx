
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Province } from './types';
import { formatProvinceName } from './addressUtils';

interface ProvinceFieldProps {
  province: string;
  provinces: Province[];
  isLoading: boolean;
  onChange: (field: string, value: string) => void;
}

const ProvinceField: React.FC<ProvinceFieldProps> = ({
  province,
  provinces,
  isLoading,
  onChange
}) => {
  return (
    <div>
      <Label htmlFor="address_province">Provincia</Label>
      <Select 
        value={province || ''}
        onValueChange={(value) => onChange('address_province', value)}
        disabled={isLoading}
      >
        <SelectTrigger id="address_province">
          <SelectValue placeholder={isLoading ? "Caricamento..." : "Seleziona provincia..."} />
        </SelectTrigger>
        <SelectContent>
          {provinces.map((province) => (
            <SelectItem key={province.code} value={province.code}>
              {formatProvinceName(province.name, province.code)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProvinceField;
