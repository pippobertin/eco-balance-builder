
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
  
  const { currentReport, updateReportData, needsSaving, saveCurrentReport } = useReport();
  
  // Initialize activeTab from location state if present
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
    
    // Reset after first render
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
        companyName: currentReport.company?.name || '',
        fiscalYear: currentReport.report_year || '',
        // ... altre proprietà
      });
      
      // Set subsidiaries if exists
      if (currentReport.subsidiaries && Array.isArray(currentReport.subsidiaries)) {
        setSubsidiaries(currentReport.subsidiaries);
      }
      
      // Set isConsolidated
      if (currentReport.is_consolidated !== undefined) {
        setIsConsolidated(currentReport.is_consolidated);
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
      
      // Update UI to indicate data has been saved?
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
      company: {
        ...currentReport.company,
        name: formValues.companyName || currentReport.company?.name
      },
      report_year: formValues.fiscalYear || currentReport.report_year,
      is_consolidated: isConsolidated,
      subsidiaries,
      sustainabilityPractices,
      // Add other fields as needed
    };
    
    await updateReportData(updatedReport);
  };
  
  // Handle saving metrics
  const saveMetrics = async () => {
    if (!currentReport) return;
    
    const updatedReport = {
      ...currentReport,
      // Add metrics fields here
    };
    
    await updateReportData(updatedReport);
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
