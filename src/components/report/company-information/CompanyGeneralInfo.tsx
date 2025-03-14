
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface CompanyGeneralInfoProps {
  companyData: {
    name: string;
    vat_number: string;
    ateco_code: string;
    nace_code: string;
    legal_form: string;
    collective_agreement: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const CompanyGeneralInfo: React.FC<CompanyGeneralInfoProps> = ({ 
  companyData, 
  handleInputChange,
  handleSelectChange
}) => {
  // ATECO codes - Common Italian business activity codes
  const atecoOptions = [
    { value: "01", label: "01 - Coltivazioni agricole e produzione di prodotti animali" },
    { value: "10", label: "10 - Industrie alimentari" },
    { value: "25", label: "25 - Fabbricazione di prodotti in metallo" },
    { value: "41", label: "41 - Costruzione di edifici" },
    { value: "47", label: "47 - Commercio al dettaglio" },
    { value: "56", label: "56 - Attività dei servizi di ristorazione" },
    { value: "62", label: "62 - Produzione di software e consulenza informatica" },
    { value: "71", label: "71 - Attività di architettura e ingegneria" },
    { value: "85", label: "85 - Istruzione" },
    { value: "96", label: "96 - Altre attività di servizi per la persona" }
  ];

  // NACE codes - European classification of economic activities
  const naceOptions = [
    { value: "A", label: "A - Agricoltura, silvicoltura e pesca" },
    { value: "C", label: "C - Attività manifatturiere" },
    { value: "F", label: "F - Costruzioni" },
    { value: "G", label: "G - Commercio all'ingrosso e al dettaglio" },
    { value: "I", label: "I - Attività dei servizi di alloggio e di ristorazione" },
    { value: "J", label: "J - Servizi di informazione e comunicazione" },
    { value: "K", label: "K - Attività finanziarie e assicurative" },
    { value: "M", label: "M - Attività professionali, scientifiche e tecniche" },
    { value: "P", label: "P - Istruzione" },
    { value: "S", label: "S - Altre attività di servizi" }
  ];

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

  // Handle VAT number input to ensure only numbers and max 11 chars
  const handleVatNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    const target = { 
      name: e.target.name, 
      value 
    };
    handleInputChange({ target } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <GlassmorphicCard>
      <div className="flex items-center mb-4">
        <Building className="mr-2 h-5 w-5 text-blue-500" />
        <h2 className="text-xl font-semibold">Informazioni Generali dell'Azienda</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="name">Denominazione</Label>
          <Input
            id="name"
            name="name"
            value={companyData.name}
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
            value={companyData.vat_number || ''}
            onChange={handleVatNumberChange}
            placeholder="Inserisci partita IVA (solo numeri)"
            maxLength={11}
          />
          {companyData.vat_number && companyData.vat_number.length !== 11 && (
            <p className="text-sm text-red-500 mt-1">La partita IVA deve essere di 11 caratteri</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ateco_code">Codice ATECO</Label>
          <Select 
            value={companyData.ateco_code || ''} 
            onValueChange={(value) => handleSelectChange('ateco_code', value)}
          >
            <SelectTrigger id="ateco_code">
              <SelectValue placeholder="Seleziona codice ATECO" />
            </SelectTrigger>
            <SelectContent>
              {atecoOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nace_code">Codice NACE</Label>
          <Select 
            value={companyData.nace_code || ''} 
            onValueChange={(value) => handleSelectChange('nace_code', value)}
          >
            <SelectTrigger id="nace_code">
              <SelectValue placeholder="Seleziona codice NACE" />
            </SelectTrigger>
            <SelectContent>
              {naceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="legal_form">Forma Societaria</Label>
          <Select 
            value={companyData.legal_form || ''} 
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
            value={companyData.collective_agreement || ''} 
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
      </div>
    </GlassmorphicCard>
  );
};

export default CompanyGeneralInfo;
