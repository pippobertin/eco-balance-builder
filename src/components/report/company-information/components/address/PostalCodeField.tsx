
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PostalCodeFieldProps {
  postalCode: string;
  postalCodes: string[];
  citySelected: boolean;
  onChange: (field: string, value: string) => void;
}

const PostalCodeField: React.FC<PostalCodeFieldProps> = ({
  postalCode,
  postalCodes,
  citySelected,
  onChange
}) => {
  const hasMultiplePostalCodes = postalCodes.length > 1;

  return (
    <div>
      <Label htmlFor="address_postal_code">CAP</Label>
      {hasMultiplePostalCodes ? (
        <Select 
          value={postalCode || ''}
          onValueChange={(value) => onChange('address_postal_code', value)}
          disabled={!citySelected}
        >
          <SelectTrigger id="address_postal_code">
            <SelectValue placeholder="Seleziona CAP..." />
          </SelectTrigger>
          <SelectContent>
            {postalCodes.map((code) => (
              <SelectItem key={code} value={code}>
                {code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id="address_postal_code"
          name="address_postal_code"
          value={postalCode || ''}
          onChange={(e) => onChange('address_postal_code', e.target.value)}
          placeholder="CAP"
          disabled={!citySelected}
        />
      )}
    </div>
  );
};

export default PostalCodeField;
