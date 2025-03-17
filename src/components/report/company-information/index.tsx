
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Company } from '@/context/types';
import CompanyGeneralInfo from './CompanyGeneralInfo';
import CompanyProfileInfo from './CompanyProfileInfo';
import { useCompanyInfo } from './useCompanyInfo';
import { useToast } from '@/hooks/use-toast';
import { AddressData } from './components/AddressFields';

interface CompanyInformationProps {
  currentCompany: Company | null;
  onNext: () => void;
}

const CompanyInformation: React.FC<CompanyInformationProps> = ({ 
  currentCompany,
  onNext
}) => {
  const { toast } = useToast();
  const {
    companyData,
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    handleAddressChange,
    saveCompanyInfo,
    isSaving,
    isLoading,
    groupCompanies,
    companyLocations,
    handleAddGroupCompany,
    handleUpdateGroupCompany,
    handleRemoveGroupCompany,
    handleAddLocation,
    handleUpdateLocation,
    handleRemoveLocation
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        <p className="text-gray-500">Caricamento informazioni aziendali in corso...</p>
      </div>
    );
  }

  if (!currentCompany || !currentCompany.id) {
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
        handleSelectChange={handleSelectChange}
        handleCheckboxChange={handleCheckboxChange}
        handleAddressChange={handleAddressChange}
        groupCompanies={groupCompanies}
        companyLocations={companyLocations}
        handleAddGroupCompany={handleAddGroupCompany}
        handleUpdateGroupCompany={handleUpdateGroupCompany}
        handleRemoveGroupCompany={handleRemoveGroupCompany}
        handleAddLocation={handleAddLocation}
        handleUpdateLocation={handleUpdateLocation}
        handleRemoveLocation={handleRemoveLocation}
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
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvataggio in corso...
            </>
          ) : (
            <>
              Salva informazioni e continua
              <CheckCircle2 className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default CompanyInformation;
