
import React from 'react';
import { Building } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import CompanyBasicInfo from './components/CompanyBasicInfo';
import ActivityCodes from './components/ActivityCodes';
import LegalDetails from './components/LegalDetails';

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
  handleSelectChange: (name: string, value: string) => void;
}

const CompanyGeneralInfo: React.FC<CompanyGeneralInfoProps> = ({ 
  companyData, 
  handleInputChange,
  handleSelectChange
}) => {
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
        <CompanyBasicInfo 
          name={companyData.name}
          vatNumber={companyData.vat_number}
          sector={companyData.sector}
          handleInputChange={handleInputChange}
          handleVatNumberChange={handleVatNumberChange}
        />
        
        <ActivityCodes 
          atecoCode={companyData.ateco_code}
          naceCode={companyData.nace_code}
          handleSelectChange={handleSelectChange}
        />
        
        <LegalDetails 
          legalForm={companyData.legal_form}
          collectiveAgreement={companyData.collective_agreement}
          handleSelectChange={handleSelectChange}
        />
      </div>
    </GlassmorphicCard>
  );
};

export default CompanyGeneralInfo;
