
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CityFieldProps } from './types';
import { Loader2 } from 'lucide-react';

const CityField: React.FC<CityFieldProps> = ({
  value,
  onChange,
  cities,
  isLoading,
  disabled = false
}) => {
  return (
    <div>
      <Label htmlFor="address_city">Comune</Label>
      <Select 
        value={value || ''}
        onValueChange={(value) => onChange(value)}
        disabled={disabled || isLoading}
      >
        <SelectTrigger id="address_city" className="flex items-center">
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span>Caricamento...</span>
            </div>
          ) : (
            <SelectValue placeholder={
              disabled 
                ? "Seleziona prima una provincia" 
                : cities.length === 0 
                  ? "Nessun comune disponibile" 
                  : "Seleziona comune..."
            } />
          )}
        </SelectTrigger>
        <SelectContent>
          {cities.length === 0 && !disabled && !isLoading && (
            <div className="p-2 text-center text-sm text-muted-foreground">
              Nessun comune disponibile per questa provincia
            </div>
          )}
          {cities.map((city, index) => (
            <SelectItem key={`${city.name}-${index}`} value={city.name}>
              {city.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CityField;
