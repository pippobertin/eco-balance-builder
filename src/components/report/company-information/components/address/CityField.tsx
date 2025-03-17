
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Municipality } from './types';

interface CityFieldProps {
  value: string;
  onChange: (value: string) => void;
  municipalities: Municipality[];
  isLoading: boolean;
  databaseStatus: 'empty' | 'loading' | 'loaded' | 'error';
  provinceSelected: boolean;
}

const CityField: React.FC<CityFieldProps> = ({ 
  value, 
  onChange, 
  municipalities, 
  isLoading, 
  databaseStatus,
  provinceSelected
}) => {
  return (
    <div>
      <Label htmlFor="address_city">Comune</Label>
      <Select 
        value={value || ''}
        onValueChange={onChange}
        disabled={!provinceSelected || databaseStatus !== 'loaded' || isLoading}
      >
        <SelectTrigger id="address_city">
          <SelectValue placeholder={
            databaseStatus === 'empty' ? "Database non inizializzato" : 
            isLoading ? "Caricamento..." : 
            !provinceSelected ? "Seleziona prima la provincia" :
            municipalities.length === 0 ? "Nessun comune trovato" :
            "Seleziona comune..."
          } />
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
