
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from 'lucide-react';
import { Company } from '@/context/types';
import CompanyGeneralInfo from './CompanyGeneralInfo';
import CompanyProfileInfo from './CompanyProfileInfo';
import { useCompanyInfo } from './useCompanyInfo';

interface CompanyInformationProps {
  currentCompany: Company | null;
  onNext: () => void;
}

const CompanyInformation: React.FC<CompanyInformationProps> = ({ 
  currentCompany,
  onNext
}) => {
  const {
    companyData,
    handleInputChange,
    saveCompanyInfo,
    isSaving
  } = useCompanyInfo(currentCompany, onNext);

  const containerAnimation = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (!currentCompany) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Nessuna azienda selezionata</p>
      </div>
    );
  }

  return (
    <motion.div variants={containerAnimation} initial="hidden" animate="visible" className="space-y-6">
      <CompanyGeneralInfo 
        companyData={companyData} 
        handleInputChange={handleInputChange} 
      />
      
      <CompanyProfileInfo 
        companyData={companyData} 
        handleInputChange={handleInputChange} 
      />
      
      <div className="flex justify-end">
        <Button 
          onClick={saveCompanyInfo} 
          className="bg-blue-500 hover:bg-blue-600"
          disabled={isSaving}
        >
          {isSaving ? 'Salvataggio in corso...' : 'Salva informazioni e continua'}
          <CheckCircle2 className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default CompanyInformation;
