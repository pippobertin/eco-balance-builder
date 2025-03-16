
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StreetFieldsProps {
  streetType: string;
  streetName: string;
  streetNumber: string;
  onChangeStreetType: (value: string) => void;
  onChangeStreetName: (value: string) => void;
  onChangeStreetNumber: (value: string) => void;
  disabled?: boolean;
}

const streetTypes = [
  { value: 'via', label: 'Via' },
  { value: 'viale', label: 'Viale' },
  { value: 'piazza', label: 'Piazza' },
  { value: 'largo', label: 'Largo' },
  { value: 'corso', label: 'Corso' },
  { value: 'vicolo', label: 'Vicolo' },
  { value: 'strada', label: 'Strada' },
  { value: 'località', label: 'Località' },
];

const StreetFields: React.FC<StreetFieldsProps> = ({
  streetType,
  streetName,
  streetNumber,
  onChangeStreetType,
  onChangeStreetName,
  onChangeStreetNumber,
  disabled = false
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="address_street_type">Tipo Indirizzo</Label>
        <Select 
          value={streetType || ''}
          onValueChange={onChangeStreetType}
          disabled={disabled}
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
      <div>
        <Label htmlFor="address_street">Nome Via/Piazza</Label>
        <Input
          id="address_street"
          name="address_street"
          value={streetName || ''}
          onChange={(e) => onChangeStreetName(e.target.value)}
          placeholder="Nome della via/piazza"
          disabled={disabled}
        />
      </div>
      <div>
        <Label htmlFor="address_number">Numero Civico</Label>
        <Input
          id="address_number"
          name="address_number"
          value={streetNumber || ''}
          onChange={(e) => onChangeStreetNumber(e.target.value)}
          placeholder="Numero civico"
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default StreetFields;
