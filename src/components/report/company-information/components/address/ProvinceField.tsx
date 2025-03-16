
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProvinceFieldProps } from './types';
import { formatProvinceName } from './addressUtils';
import { Loader2 } from 'lucide-react';

const ProvinceField: React.FC<ProvinceFieldProps> = ({
  value,
  onChange,
  provinces,
  isLoading,
  disabled = false
}) => {
  return (
    <div>
      <Label htmlFor="address_province">Provincia</Label>
      <Select 
        value={value || ''}
        onValueChange={(value) => onChange(value)}
        disabled={disabled || isLoading}
      >
        <SelectTrigger id="address_province" className="flex items-center">
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span>Caricamento...</span>
            </div>
          ) : (
            <SelectValue placeholder={
              provinces.length === 0 
                ? "Nessuna provincia disponibile" 
                : "Seleziona provincia..."
            } />
          )}
        </SelectTrigger>
        <SelectContent>
          {provinces.length === 0 && !isLoading && (
            <div className="p-2 text-center text-sm text-muted-foreground">
              Nessuna provincia disponibile
            </div>
          )}
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
