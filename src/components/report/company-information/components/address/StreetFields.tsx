
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StreetFieldsProps {
  streetType: string;
  street: string;
  onChange: (field: string, value: string) => void;
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
  street,
  onChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="address_street_type">Tipo Indirizzo</Label>
        <Select 
          value={streetType || ''}
          onValueChange={(value) => onChange('address_street_type', value)}
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
      <div className="md:col-span-2">
        <Label htmlFor="address_street">Nome Via/Piazza</Label>
        <Input
          id="address_street"
          name="address_street"
          value={street || ''}
          onChange={(e) => onChange('address_street', e.target.value)}
          placeholder="Nome della via/piazza"
        />
      </div>
    </div>
  );
};

export default StreetFields;
