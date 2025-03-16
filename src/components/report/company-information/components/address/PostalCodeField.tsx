
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PostalCodeFieldProps {
  value: string;
  onChange: (value: string) => void;
  postalCodes: string[];
  disabled?: boolean;
}

const PostalCodeField: React.FC<PostalCodeFieldProps> = ({
  value,
  onChange,
  postalCodes,
  disabled = false
}) => {
  const hasMultiplePostalCodes = postalCodes.length > 1;

  return (
    <div>
      <Label htmlFor="address_postal_code">CAP</Label>
      {hasMultiplePostalCodes ? (
        <Select 
          value={value || ''}
          onValueChange={(value) => onChange(value)}
          disabled={disabled}
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
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="CAP"
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default PostalCodeField;
