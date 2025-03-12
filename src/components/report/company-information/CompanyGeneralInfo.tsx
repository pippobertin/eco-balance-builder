
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';

interface CompanyGeneralInfoProps {
  companyData: {
    name: string;
    vat_number: string;
    sector: string;
    ateco_code: string;
    nace_code: string;
    legal_form: string;
    collective_agreement: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const CompanyGeneralInfo: React.FC<CompanyGeneralInfoProps> = ({ 
  companyData, 
  handleInputChange 
}) => {
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
          <Label htmlFor="vat_number">Partita IVA</Label>
          <Input
            id="vat_number"
            name="vat_number"
            value={companyData.vat_number || ''}
            onChange={handleInputChange}
            placeholder="Partita IVA"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sector">Settore</Label>
          <Input
            id="sector"
            name="sector"
            value={companyData.sector || ''}
            onChange={handleInputChange}
            placeholder="Settore di attività"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ateco_code">Codice ATECO</Label>
          <Input
            id="ateco_code"
            name="ateco_code"
            value={companyData.ateco_code || ''}
            onChange={handleInputChange}
            placeholder="Codice ATECO"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nace_code">Codice NACE</Label>
          <Input
            id="nace_code"
            name="nace_code"
            value={companyData.nace_code || ''}
            onChange={handleInputChange}
            placeholder="Codice NACE"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="legal_form">Forma Societaria</Label>
          <Input
            id="legal_form"
            name="legal_form"
            value={companyData.legal_form || ''}
            onChange={handleInputChange}
            placeholder="Forma societaria"
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="collective_agreement">Contratto Collettivo Applicato</Label>
          <Input
            id="collective_agreement"
            name="collective_agreement"
            value={companyData.collective_agreement || ''}
            onChange={handleInputChange}
            placeholder="Contratto collettivo applicato"
          />
        </div>
      </div>
    </GlassmorphicCard>
  );
};

export default CompanyGeneralInfo;
