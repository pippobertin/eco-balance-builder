
import React from 'react';
import { Building } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import AtecoCodeSelector from './AtecoCodeSelector';
import CompanyNameInput from './CompanyNameInput';
import VATNumberInput from './VATNumberInput';
import LegalFormSelector from './LegalFormSelector';
import CollectiveAgreementSelector from './CollectiveAgreementSelector';

interface CompanyGeneralInfoProps {
  companyData: {
    name: string;
    vat_number: string;
    ateco_code: string;
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
  return (
    <GlassmorphicCard>
      <div className="flex items-center mb-4">
        <Building className="mr-2 h-5 w-5 text-blue-500" />
        <h2 className="text-xl font-semibold">Informazioni Generali dell'Azienda</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <CompanyNameInput 
          value={companyData.name} 
          onChange={handleInputChange} 
        />
        
        <VATNumberInput 
          value={companyData.vat_number} 
          onChange={handleInputChange} 
        />
        
        <div className="space-y-2">
          <AtecoCodeSelector 
            value={companyData.ateco_code || ''}
            onChange={(value) => handleSelectChange('ateco_code', value)}
          />
        </div>
        
        <LegalFormSelector 
          value={companyData.legal_form || ''} 
          onChange={handleSelectChange} 
        />
        
        <CollectiveAgreementSelector 
          value={companyData.collective_agreement || ''} 
          onChange={handleSelectChange} 
        />
      </div>
    </GlassmorphicCard>
  );
};

export default CompanyGeneralInfo;
