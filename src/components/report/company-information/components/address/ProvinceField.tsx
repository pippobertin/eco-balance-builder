
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Province } from './types';

interface ProvinceFieldProps {
  value: string;
  onChange: (value: string) => void;
  provinces: Province[];
  isLoading: boolean;
  databaseStatus: 'empty' | 'loading' | 'loaded' | 'error';
}

const ProvinceField: React.FC<ProvinceFieldProps> = ({ 
  value, 
  onChange, 
  provinces, 
  isLoading, 
  databaseStatus 
}) => {
  return (
    <div>
      <Label htmlFor="address_province">Provincia</Label>
      <Select 
        value={value || ''}
        onValueChange={onChange}
        disabled={databaseStatus !== 'loaded' || isLoading}
      >
        <SelectTrigger id="address_province">
          <SelectValue placeholder={
            databaseStatus === 'empty' ? "Database non inizializzato" : 
            databaseStatus === 'loading' || isLoading ? "Caricamento..." : 
            "Seleziona provincia..."
          } />
        </SelectTrigger>
        <SelectContent>
          {provinces.map((province) => (
            <SelectItem key={province.code} value={province.code}>
              {province.name} ({province.code})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProvinceField;
