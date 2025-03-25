
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useReport } from '@/context/ReportContext';

export const useReportForm = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("info");
  const [isConsolidated, setIsConsolidated] = useState(false);
  const [sustainabilityPractices, setSustainabilityPractices] = useState<string[]>([]);
  const [formValues, setFormValues] = useState<any>({});
  const [subsidiaries, setSubsidiaries] = useState<any[]>([]);
  const [newSubsidiary, setNewSubsidiary] = useState({ name: '', address: '', shares: 0 });
  const [initialSection, setInitialSection] = useState<string | undefined>(undefined);
  const [initialField, setInitialField] = useState<string | undefined>(undefined);
  
  const { currentReport, updateReport, needsSaving, saveCurrentReport } = useReport();
  
  // Inizializza activeTab dal location state, se presente
  useEffect(() => {
    if (location.state) {
      if (location.state.activeTab) {
        setActiveTab(location.state.activeTab);
      }
      
      if (location.state.section) {
        setInitialSection(location.state.section);
      }
      
      if (location.state.field) {
        setInitialField(location.state.field);
      }
    }
    
    // Reset dopo il primo render
    return () => {
      setInitialSection(undefined);
      setInitialField(undefined);
    };
  }, [location.state]);
  
  // Initialize form values from currentReport when it changes
  useEffect(() => {
    if (currentReport) {
      setFormValues({
        // Basic info from report
        companyName: currentReport.companyName || '',
        fiscalYear: currentReport.fiscalYear || '',
        // ... altre proprietà
      });
      
      // Set subsidiaries if exists
      if (currentReport.subsidiaries && Array.isArray(currentReport.subsidiaries)) {
        setSubsidiaries(currentReport.subsidiaries);
      }
      
      // Set isConsolidated
      if (currentReport.isConsolidated !== undefined) {
        setIsConsolidated(currentReport.isConsolidated);
      }
      
      // Set practices
      if (currentReport.sustainabilityPractices && Array.isArray(currentReport.sustainabilityPractices)) {
        setSustainabilityPractices(currentReport.sustainabilityPractices);
      }
    }
  }, [currentReport]);
  
  // Save the entire report
  const handleSaveReport = async () => {
    if (!currentReport) return;
    
    try {
      if (activeTab === 'info') {
        await saveBasicInfo();
      } else if (activeTab === 'metrics') {
        await saveMetrics();
      }
      
      // Aggiornare UI per indicare che i dati sono stati salvati?
      return true;
    } catch (error) {
      console.error("Error saving report:", error);
      return false;
    }
  };
  
  // Handle saving basic info
  const saveBasicInfo = async () => {
    if (!currentReport) return;
    
    const updatedReport = {
      ...currentReport,
      companyName: formValues.companyName || currentReport.companyName,
      fiscalYear: formValues.fiscalYear || currentReport.fiscalYear,
      isConsolidated,
      subsidiaries,
      sustainabilityPractices,
      // Aggiungere altri campi secondo necessità
    };
    
    await updateReport(updatedReport);
  };
  
  // Handle saving metrics
  const saveMetrics = async () => {
    if (!currentReport) return;
    
    const updatedReport = {
      ...currentReport,
      // Aggiungere i campi di metriche qui
    };
    
    await updateReport(updatedReport);
  };
  
  // Handle adding a subsidiary
  const handleAddSubsidiary = () => {
    if (newSubsidiary.name.trim() === '') return;
    
    setSubsidiaries([...subsidiaries, { ...newSubsidiary, id: Date.now() }]);
    setNewSubsidiary({ name: '', address: '', shares: 0 });
  };
  
  // Handle removing a subsidiary
  const removeSubsidiary = (id: number) => {
    setSubsidiaries(subsidiaries.filter(sub => sub.id !== id));
  };
  
  return {
    activeTab,
    setActiveTab,
    isConsolidated,
    setIsConsolidated,
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
  };
};
