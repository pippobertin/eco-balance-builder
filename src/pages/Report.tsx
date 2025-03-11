
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BaseModuleMetrics from '@/components/report/BaseModuleMetrics';
import CompanyInformation from '@/components/report/CompanyInformation';
import ReportHeader from '@/components/report/ReportHeader';
import BasicInfoSection from '@/components/report/BasicInfoSection';
import { useSubsidiaries } from '@/hooks/use-subsidiaries';
import { useReport } from '@/context/ReportContext';
import { useReportForm } from '@/hooks/use-report-form';
import { useToast } from '@/hooks/use-toast';

const Report = () => {
  const { toast } = useToast();
  const {
    currentCompany,
    currentReport,
    saveCurrentReport,
    saveSubsidiaries
  } = useReport();
  
  // Use custom hooks for state management
  const {
    activeTab,
    setActiveTab,
    isConsolidated,
    sustainabilityPractices,
    setSustainabilityPractices,
    formValues,
    setFormValues,
    handleSaveReport,
    saveBasicInfo,
    saveMetrics,
    initialSection,
    initialField
  } = useReportForm();
  
  const {
    subsidiaries,
    setSubsidiaries,
    newSubsidiary,
    setNewSubsidiary,
    handleAddSubsidiary,
    removeSubsidiary
  } = useSubsidiaries();

  // Handle saving the report with subsidiaries
  const handleSaveWithSubsidiaries = async () => {
    await saveCurrentReport();
    
    if (currentReport && isConsolidated) {
      await saveSubsidiaries(subsidiaries, currentReport.id);
    }
    
    toast({
      title: "Report salvato",
      description: "Tutte le modifiche sono state salvate con successo"
    });
  };

  // Handle saving metrics with subsidiaries
  const saveMetricsWithSubsidiaries = async () => {
    saveMetrics();
    
    if (currentReport && isConsolidated) {
      await saveSubsidiaries(subsidiaries, currentReport.id);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <ReportHeader 
            currentCompany={currentCompany} 
            handleSaveReport={handleSaveWithSubsidiaries} 
          />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="company-info">Informazioni Azienda</TabsTrigger>
              <TabsTrigger value="basic-info">Informazioni Base</TabsTrigger>
              <TabsTrigger value="metrics">Metriche Base</TabsTrigger>
            </TabsList>

            <TabsContent value="company-info">
              <CompanyInformation 
                currentCompany={currentCompany}
                onNext={() => setActiveTab('basic-info')}
              />
            </TabsContent>

            <TabsContent value="basic-info">
              <BasicInfoSection 
                isConsolidated={isConsolidated}
                subsidiaries={subsidiaries}
                currentReport={currentReport}
                sustainabilityPractices={sustainabilityPractices}
                setSustainabilityPractices={setSustainabilityPractices}
                newSubsidiary={newSubsidiary}
                setNewSubsidiary={setNewSubsidiary}
                handleAddSubsidiary={handleAddSubsidiary}
                removeSubsidiary={removeSubsidiary}
                onContinue={saveBasicInfo}
              />
            </TabsContent>
            
            <TabsContent value="metrics">
              <BaseModuleMetrics 
                formValues={formValues} 
                setFormValues={setFormValues} 
                onPrevious={() => setActiveTab('basic-info')} 
                onSave={saveMetricsWithSubsidiaries} 
                selectedOption={currentReport?.report_type || 'A'}
                initialSection={initialSection}
                initialField={initialField}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Report;
