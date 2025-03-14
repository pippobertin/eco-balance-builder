
import React from 'react';
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface LegalFormSelectorProps {
  value: string;
  onChange: (name: string, value: string) => void;
}

const LegalFormSelector: React.FC<LegalFormSelectorProps> = ({ value, onChange }) => {
  // Legal form options
  const legalFormOptions = [
    { value: "ditta_individuale", label: "Ditta individuale" },
    { value: "snc", label: "SNC" },
    { value: "sas", label: "SAS" },
    { value: "srls", label: "SRLS" },
    { value: "srl", label: "SRL" },
    { value: "spa", label: "SpA" },
    { value: "sapa", label: "SAPA" },
    { value: "coop", label: "Società Cooperativa" }
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="legal_form">Forma Societaria</Label>
      <Select 
        value={value || ''} 
        onValueChange={(value) => onChange('legal_form', value)}
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
  );
};

export default LegalFormSelector;
