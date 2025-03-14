
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CompanyNameInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CompanyNameInput: React.FC<CompanyNameInputProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="name">Denominazione</Label>
      <Input
        id="name"
        name="name"
        value={value}
        onChange={onChange}
        placeholder="Nome azienda"
      />
    </div>
  );
};

export default CompanyNameInput;
