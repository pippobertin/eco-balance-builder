
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building, CheckCircle2, Database, Loader2, Upload } from 'lucide-react';
import { useReport } from '@/context/ReportContext';
import CompanyGeneralInfo from '@/components/report/company-information/CompanyGeneralInfo';
import CompanyProfileInfo from '@/components/report/company-information/CompanyProfileInfo';
import { useCompanyInfo } from '@/components/report/company-information/useCompanyInfo';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DataUploader } from '@/components/report/company-information/components/address';
import { ensureLocationDataLoaded, countMunicipalities } from '@/components/report/company-information/utils/locationUtils';

const CompanyProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentCompany } = useReport();
  const [showDataUploader, setShowDataUploader] = useState(false);
  const [municipalityCount, setMunicipalityCount] = useState<number | null>(null);
  
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

  // Ensure location data is loaded when the component mounts
  useEffect(() => {
    const loadLocationData = async () => {
      await ensureLocationDataLoaded(false);
      
      // Count municipalities
      const count = await countMunicipalities();
      setMunicipalityCount(count);
    };
    
    loadLocationData();
  }, []);

  // Update municipality count when data uploader dialog is closed
  useEffect(() => {
    if (!showDataUploader) {
      countMunicipalities().then(count => setMunicipalityCount(count));
    }
  }, [showDataUploader]);

  // Force reload municipality data
  const handleForceLoadData = async () => {
    // Create a toast notification that will be updated with results
    const loadingToast = toast({
      title: 'Loading',
      description: 'Caricamento forzato dei dati geografici...',
    });
    
    try {
      await ensureLocationDataLoaded(true);
      const count = await countMunicipalities();
      setMunicipalityCount(count);
      
      // Update the toast with success message
      loadingToast.update({
        title: 'Success',
        description: `Dati geografici ricaricati. ${count} comuni disponibili.`,
      });
    } catch (error) {
      console.error('Error forcing data load:', error);
      
      // Update the toast with error message
      loadingToast.update({
        title: 'Error',
        description: 'Errore durante il ricaricamento dei dati',
        variant: 'destructive',
      });
    }
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <p className="text-gray-500">Caricamento informazioni aziendali in corso...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!currentCompany || !currentCompany.id) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-600">Nessuna azienda selezionata</p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/companies')}
              className="mt-4"
            >
              Torna alla lista aziende
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mr-2"
                  onClick={() => navigate('/companies')}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Indietro
                </Button>
                <h1 className="text-3xl font-bold">Anagrafica Azienda</h1>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleForceLoadData}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Ricarica Dati ({municipalityCount !== null ? municipalityCount : '...'} comuni)
                </Button>
                
                <Dialog open={showDataUploader} onOpenChange={setShowDataUploader}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Database className="h-4 w-4 mr-1" />
                      Gestione Dati Geografici
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Gestione Dati Geografici</DialogTitle>
                    </DialogHeader>
                    <DataUploader />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="flex items-center">
              <Building className="h-5 w-5 text-blue-500 mr-2" />
              <p className="text-xl font-semibold text-gray-700">
                {currentCompany.name}
              </p>
            </div>
          </motion.div>
          
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
                    Salva informazioni
                    <CheckCircle2 className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CompanyProfile;
