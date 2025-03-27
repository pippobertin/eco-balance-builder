import React, { useState, useEffect } from 'react';
import { useLocation, useBeforeUnload } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ReportHeader from '@/components/report/ReportHeader';
import UnsavedChangesDialog from '@/components/report/UnsavedChangesDialog';
import ReportModuleTabs from '@/components/report/components/ReportModuleTabs';
import { useReport } from '@/context/ReportContext';
import { useReportForm } from '@/hooks/use-report-form';
import { useReportNavigation } from '@/components/report/hooks/useReportNavigation';

const Report = () => {
  const location = useLocation();
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<() => void | null>(() => null);
  
  const { needsSaving, saveCurrentReport } = useReport();
  const { currentCompany, currentReport, isLoading } = useReportNavigation();
  
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
    initialField,
    subsidiaries,
    newSubsidiary,
    setNewSubsidiary,
    handleAddSubsidiary,
    removeSubsidiary
  } = useReportForm();

  useEffect(() => {
    const state = location.state as any;
    if (state && state.section === 'business-partners') {
      const newState = { ...state, section: 'business-partners-alt' };
      window.history.replaceState(newState, '');
    }
  }, [location.state]);

  useBeforeUnload(
    React.useCallback(
      (event) => {
        if (needsSaving) {
          const message = "Hai modifiche non salvate. Sei sicuro di voler lasciare questa pagina?";
          event.returnValue = message;
          return message;
        }
      },
      [needsSaving]
    )
  );

  useEffect(() => {
    if (formValues && Object.keys(formValues).length > 0) {
      console.log("Form values changed, marking as needs saving");
    }
  }, [formValues]);

  const handleTabChange = (value: string) => {
    if (needsSaving) {
      setPendingTab(value);
      setShowUnsavedDialog(true);
    } else {
      setActiveTab(value);
    }
  };

  const handleSaveAndContinue = async () => {
    try {
      await handleSaveReport();
      
      if (pendingTab) {
        setActiveTab(pendingTab);
        setPendingTab(null);
      } else if (pendingAction) {
        pendingAction();
      }
      
      setShowUnsavedDialog(false);
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const handleDiscardChanges = () => {
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    } else if (pendingAction) {
      pendingAction();
    }
    setShowUnsavedDialog(false);
  };

  const handleCloseDialog = () => {
    setPendingTab(null);
    setPendingAction(() => null);
    setShowUnsavedDialog(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-600">Caricamento dati in corso...</p>
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
          <ReportHeader 
            currentCompany={currentCompany} 
            needsSaving={needsSaving}
          />

          <ReportModuleTabs 
            activeTab={activeTab}
            onTabChange={handleTabChange}
            formValues={formValues}
            setFormValues={setFormValues}
            isConsolidated={isConsolidated}
            subsidiaries={subsidiaries}
            currentReport={currentReport}
            sustainabilityPractices={sustainabilityPractices}
            setSustainabilityPractices={setSustainabilityPractices}
            newSubsidiary={newSubsidiary}
            setNewSubsidiary={setNewSubsidiary}
            handleAddSubsidiary={handleAddSubsidiary}
            removeSubsidiary={removeSubsidiary}
            saveBasicInfo={saveBasicInfo}
            saveMetrics={saveMetrics}
            initialSection={initialSection?.replace('business-partners', 'business-partners-alt')}
            initialField={initialField}
          />
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
