
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VATNumberInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const VATNumberInput: React.FC<VATNumberInputProps> = ({ value, onChange }) => {
  // Handle VAT number input to ensure only numbers and max 11 chars
  const handleVatNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    const target = { 
      name: e.target.name, 
      value 
    };
    onChange({ target } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="vat_number">Partita IVA (11 caratteri)</Label>
      <Input
        id="vat_number"
        name="vat_number"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value || ''}
        onChange={handleVatNumberChange}
        placeholder="Inserisci partita IVA (solo numeri)"
        maxLength={11}
      />
      {value && value.length !== 11 && (
        <p className="text-sm text-red-500 mt-1">La partita IVA deve essere di 11 caratteri</p>
      )}
    </div>
  );
};

export default VATNumberInput;
