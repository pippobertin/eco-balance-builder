
import React from 'react';
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface CollectiveAgreementSelectorProps {
  value: string;
  onChange: (name: string, value: string) => void;
}

const CollectiveAgreementSelector: React.FC<CollectiveAgreementSelectorProps> = ({ value, onChange }) => {
  // Collective agreement options
  const collectiveAgreementOptions = [
    { value: "agricoltura", label: "Agricoltura" },
    { value: "chimici", label: "Chimici" },
    { value: "meccanici", label: "Meccanici" },
    { value: "tessili", label: "Tessili" },
    { value: "alimentaristi", label: "Alimentaristi" },
    { value: "edilizia", label: "Edilizia" },
    { value: "legno_arredamento", label: "Legno E Arredamento" },
    { value: "poligrafici_spettacolo", label: "Poligrafici e Spettacolo" },
    { value: "terziario", label: "Terziario" },
    { value: "servizi", label: "Servizi" },
    { value: "lavoro_domestico", label: "Lavoro Domestico e Di Cura" },
    { value: "trasporti", label: "Trasporti" },
    { value: "credito_assicurazioni", label: "Credito e Assicurazioni" },
    { value: "aziende_servizi", label: "Aziende Di Servizi" },
    { value: "istruzione_sanita", label: "Istruzione-Sanità-Assistenza-Cultura-Enti" },
    { value: "ccnl_plurisettoriali", label: "CCNL Plurisettoriali" },
    { value: "microsettoriali", label: "Microsettoriali" },
    { value: "altri", label: "Altri" }
  ];

  return (
    <div className="space-y-2 md:col-span-2">
      <Label htmlFor="collective_agreement">Contratto Collettivo Applicato</Label>
      <Select 
        value={value || ''} 
        onValueChange={(value) => onChange('collective_agreement', value)}
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
  );
};

export default CollectiveAgreementSelector;
