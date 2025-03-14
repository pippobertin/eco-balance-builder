
import React from 'react';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { legalFormOptions, collectiveAgreementOptions } from '../data/formOptions';

interface LegalDetailsProps {
  legalForm: string;
  collectiveAgreement: string;
  handleSelectChange: (name: string, value: string) => void;
}

const LegalDetails: React.FC<LegalDetailsProps> = ({
  legalForm,
  collectiveAgreement,
  handleSelectChange
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="legal_form">Forma Societaria</Label>
        <Select 
          value={legalForm || ''} 
          onValueChange={(value) => handleSelectChange('legal_form', value)}
        >
          <SelectTrigger id="legal_form">
            <SelectValue placeholder="Seleziona forma societaria" />
          </SelectTrigger>
          <SelectContent>
            {legalFormOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="collective_agreement">Contratto Collettivo Applicato</Label>
        <Select 
          value={collectiveAgreement || ''} 
          onValueChange={(value) => handleSelectChange('collective_agreement', value)}
        >
          <SelectTrigger id="collective_agreement">
            <SelectValue placeholder="Seleziona contratto collettivo" />
          </SelectTrigger>
          <SelectContent>
            {collectiveAgreementOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default LegalDetails;
