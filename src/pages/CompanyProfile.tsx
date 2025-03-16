
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { useReport } from '@/context/ReportContext';
import { useCompanyInfo } from '@/components/report/company-information/useCompanyInfo';
import { useToast } from '@/hooks/use-toast';

// Import our new components
import LoadingState from '@/components/company-profile/LoadingState';
import NoCompanySelected from '@/components/company-profile/NoCompanySelected';
import ProfileHeader from '@/components/company-profile/ProfileHeader';
import SaveButton from '@/components/company-profile/SaveButton';
import { useMunicipalityData } from '@/components/company-profile/hooks/useMunicipalityData';

// Import existing components
import CompanyGeneralInfo from '@/components/report/company-information/CompanyGeneralInfo';
import CompanyProfileInfo from '@/components/report/company-information/CompanyProfileInfo';

const CompanyProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentCompany } = useReport();
  
  // Use our new municipality data hook
  const {
    municipalityCount,
    showDataUploader,
    setShowDataUploader,
    handleForceLoadData
  } = useMunicipalityData();
  
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
  } = useCompanyInfo(currentCompany, () => {
    toast({
      title: 'Informazioni salvate',
      description: 'Le informazioni aziendali sono state salvate con successo',
    });
  });

  useEffect(() => {
    if (!currentCompany) {
      navigate('/companies');
    }
  }, [currentCompany, navigate]);

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

  // Use our LoadingState component
  if (isLoading) {
    return <LoadingState />;
  }

  // Use our NoCompanySelected component
  if (!currentCompany || !currentCompany.id) {
    return <NoCompanySelected />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          
          {/* Use our ProfileHeader component */}
          <ProfileHeader 
            companyName={currentCompany.name}
            municipalityCount={municipalityCount}
            onForceLoadData={handleForceLoadData}
            showDataUploader={showDataUploader}
            setShowDataUploader={setShowDataUploader}
          />
          
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
            
            {/* Use our SaveButton component */}
            <SaveButton 
              isSaving={isSaving}
              onSave={saveCompanyInfo}
            />
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CompanyProfile;
