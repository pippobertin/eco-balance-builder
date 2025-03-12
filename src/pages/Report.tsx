
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BaseModuleMetrics from '@/components/report/BaseModuleMetrics';
import CompanyInformation from '@/components/report/CompanyInformation';
import ReportHeader from '@/components/report/ReportHeader';
import BasicInfoSection from '@/components/report/BasicInfoSection';
import UnsavedChangesDialog from '@/components/report/UnsavedChangesDialog';
import { useSubsidiaries } from '@/hooks/use-subsidiaries';
import { useReport } from '@/context/ReportContext';
import { useReportForm } from '@/hooks/use-report-form';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useBeforeUnload } from 'react-router-dom';

const Report = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<() => void | null>(() => null);
  
  const {
    currentCompany,
    currentReport,
    saveCurrentReport,
    saveSubsidiaries,
    reportData,
    updateReportData,
    needsSaving
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

  // Handle tab change with unsaved changes check
  const handleTabChange = (value: string) => {
    if (needsSaving) {
      setPendingTab(value);
      setShowUnsavedDialog(true);
    } else {
      setActiveTab(value);
    }
  };

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

  // Handle saving and navigation
  const handleSaveAndContinue = async () => {
    try {
      await handleSaveWithSubsidiaries();
      
      if (pendingTab) {
        setActiveTab(pendingTab);
        setPendingTab(null);
      } else if (pendingAction) {
        pendingAction();
      }
      
      setShowUnsavedDialog(false);
    } catch (error) {
      console.error("Error saving:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio",
        variant: "destructive"
      });
    }
  };

  // Handle discarding changes
  const handleDiscardChanges = () => {
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    } else if (pendingAction) {
      pendingAction();
    }
    
    setShowUnsavedDialog(false);
  };

  // Handle closing the dialog
  const handleCloseDialog = () => {
    setPendingTab(null);
    setPendingAction(() => null);
    setShowUnsavedDialog(false);
  };

  // Save metrics with subsidiaries
  const saveMetricsWithSubsidiaries = async () => {
    saveMetrics();
    
    if (currentReport && isConsolidated) {
      await saveSubsidiaries(subsidiaries, currentReport.id);
    }
  };
  
  // Warn user before unload if there are unsaved changes
  useBeforeUnload(
    React.useCallback(
      (event) => {
        if (needsSaving) {
          event.preventDefault();
          return '';
        }
      },
      [needsSaving]
    )
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <ReportHeader 
            currentCompany={currentCompany} 
            handleSaveReport={handleSaveWithSubsidiaries} 
            needsSaving={needsSaving}
          />

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="company-info">Informazioni Azienda</TabsTrigger>
              <TabsTrigger value="basic-info">Informazioni Base</TabsTrigger>
              <TabsTrigger value="metrics">Metriche Base</TabsTrigger>
            </TabsList>

            <TabsContent value="company-info">
              <CompanyInformation 
                currentCompany={currentCompany}
                onNext={() => {
                  if (needsSaving) {
                    setPendingTab('basic-info');
                    setShowUnsavedDialog(true);
                  } else {
                    setActiveTab('basic-info');
                  }
                }}
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
                onContinue={() => {
                  if (needsSaving) {
                    setPendingTab('metrics');
                    setShowUnsavedDialog(true);
                  } else {
                    saveBasicInfo();
                  }
                }}
              />
            </TabsContent>
            
            <TabsContent value="metrics">
              <BaseModuleMetrics 
                formValues={formValues} 
                setFormValues={setFormValues} 
                onPrevious={() => {
                  if (needsSaving) {
                    setPendingTab('basic-info');
                    setShowUnsavedDialog(true);
                  } else {
                    setActiveTab('basic-info');
                  }
                }} 
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
      
      <UnsavedChangesDialog 
        open={showUnsavedDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveAndContinue}
        onDiscard={handleDiscardChanges}
      />
    </div>
  );
};

export default Report;
