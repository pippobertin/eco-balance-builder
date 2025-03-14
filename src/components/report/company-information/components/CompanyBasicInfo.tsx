
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CompanyBasicInfoProps {
  name: string;
  vatNumber: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleVatNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CompanyBasicInfo: React.FC<CompanyBasicInfoProps> = ({
  name,
  vatNumber,
  handleInputChange,
  handleVatNumberChange
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Denominazione</Label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={handleInputChange}
          placeholder="Nome azienda"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="vat_number">Partita IVA (11 caratteri)</Label>
        <Input
          id="vat_number"
          name="vat_number"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={vatNumber || ''}
          onChange={handleVatNumberChange}
          placeholder="Inserisci partita IVA (solo numeri)"
          maxLength={11}
        />
        {vatNumber && vatNumber.length !== 11 && (
          <p className="text-sm text-red-500 mt-1">La partita IVA deve essere di 11 caratteri</p>
        )}
      </div>
    </>
  );
};

export default CompanyBasicInfo;
