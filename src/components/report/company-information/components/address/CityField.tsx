
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Municipality } from './types';
import { Loader2 } from 'lucide-react';

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
        <SelectTrigger id="address_city" className="flex items-center">
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span>Caricamento...</span>
            </div>
          ) : (
            <SelectValue placeholder={
              !provinceSelected 
                ? "Seleziona prima una provincia" 
                : municipalities.length === 0 
                  ? "Nessun comune disponibile" 
                  : "Seleziona comune..."
            } />
          )}
        </SelectTrigger>
        <SelectContent>
          {municipalities.length === 0 && provinceSelected && !isLoading && (
            <div className="p-2 text-center text-sm text-muted-foreground">
              Nessun comune disponibile per questa provincia
            </div>
          )}
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
