
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useReport } from '@/hooks/use-report-context';
import { useSubsidiaries } from '@/hooks/use-subsidiaries';
import { Report, Subsidiary } from '@/context/types';

export const useReportForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get values from context
  const {
    reportData,
    updateReportData,
    currentCompany,
    currentReport,
    saveCurrentReport,
    saveSubsidiaries,
    loadReport,
    loadCompanies,
    setNeedsSaving,
    setLastSaved
  } = useReport();

  // Local state
  const [activeTab, setActiveTab] = useState('basic-info');
  const [sustainabilityPractices, setSustainabilityPractices] = useState('');
  const [formValues, setFormValues] = useState<any>({});
  const [initialSection, setInitialSection] = useState<string | null>(null);
  const [initialField, setInitialField] = useState<string | null>(null);

  // Use the subsidiaries hook
  const {
    subsidiaries,
    setSubsidiaries,
    newSubsidiary,
    setNewSubsidiary,
    handleAddSubsidiary,
    removeSubsidiary
  } = useSubsidiaries([]);

  // Derive if report is consolidated
  const isConsolidated = useMemo(() => {
    return currentReport?.is_consolidated || false;
  }, [currentReport]);

  // Save basic info
  const saveBasicInfo = async () => {
    try {
      if (!currentReport?.id) {
        throw new Error('Report ID is missing');
      }
      
      // Save subsidiaries if report is consolidated
      if (isConsolidated) {
        await saveSubsidiaries(subsidiaries, currentReport.id);
      }
      
      // Save sustainability practices
      await saveCurrentReport();
      
      toast({
        title: "Successo",
        description: "Informazioni di base salvate con successo",
      });
      
      return true;
    } catch (error) {
      console.error('Error saving basic info:', error);
      toast({
        title: "Errore",
        description: "Impossibile salvare le informazioni di base",
        variant: "destructive"
      });
      return false;
    }
  };

  // Save metrics
  const saveMetrics = async () => {
    try {
      await saveCurrentReport();
      
      toast({
        title: "Successo",
        description: "Metriche salvate con successo",
      });
      
      return true;
    } catch (error) {
      console.error('Error saving metrics:', error);
      toast({
        title: "Errore",
        description: "Impossibile salvare le metriche",
        variant: "destructive"
      });
      return false;
    }
  };

  // Save report
  const handleSaveReport = async () => {
    try {
      await saveCurrentReport();
      
      toast({
        title: "Successo",
        description: "Report salvato con successo",
      });
      
      return true;
    } catch (error) {
      console.error('Error saving report:', error);
      toast({
        title: "Errore",
        description: "Impossibile salvare il report",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
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
  };
};
