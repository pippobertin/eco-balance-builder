import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useReport } from '@/context/ReportContext';
import { useSubsidiaries } from './use-subsidiaries';

export const useReportForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const {
    reportData,
    updateReportData,
    currentCompany,
    currentReport,
    saveCurrentReport,
    saveSubsidiaries,
    loadReport,
    loadCompanies
  } = useReport();
  
  const subsidiariesState = useSubsidiaries();
  
  const initialTab = location.state?.activeTab || 'basic-info';
  const initialSection = location.state?.section;
  const initialField = location.state?.field;
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isConsolidated, setIsConsolidated] = useState<boolean>(false);
  const [sustainabilityPractices, setSustainabilityPractices] = useState<string>('');
  const [formValues, setFormValues] = useState({
    environmentalMetrics: reportData.environmentalMetrics || {},
    socialMetrics: reportData.socialMetrics || {},
    conductMetrics: reportData.conductMetrics || {},
    narrativePATMetrics: reportData.narrativePATMetrics || {},
    materialityAnalysis: reportData.materialityAnalysis || {}
  });

  // Synchronize formValues with reportData whenever reportData changes
  useEffect(() => {
    setFormValues({
      environmentalMetrics: reportData.environmentalMetrics || {},
      socialMetrics: reportData.socialMetrics || {},
      conductMetrics: reportData.conductMetrics || {},
      narrativePATMetrics: reportData.narrativePATMetrics || {},
      materialityAnalysis: reportData.materialityAnalysis || {}
    });
  }, [reportData]);

  // Make sure we have company data
  useEffect(() => {
    const ensureData = async () => {
      try {
        // If we don't have companies, load them
        if (!currentCompany) {
          console.log("No current company, loading companies");
          await loadCompanies();
        }
        
        if (currentReport) {
          console.log("Current report exists:", currentReport.id);
          setIsConsolidated(currentReport.is_consolidated || false);
          
          // If the report doesn't have complete company data, reload it
          if (currentReport.id && (!currentReport.company || !currentReport.company.name)) {
            console.log("Report missing company data, reloading full report:", currentReport.id);
            await loadReport(currentReport.id);
          }
          
          if (!currentCompany) {
            console.log("Still no company after loading, redirecting to companies page");
            toast({
              title: "Nessuna azienda selezionata",
              description: "Seleziona un'azienda e un report per continuare",
              variant: "destructive"
            });
            navigate('/companies');
          }
        } else {
          console.log("No current report, redirecting to companies page");
          toast({
            title: "Nessun report attivo",
            description: "Seleziona o crea un report per continuare",
            variant: "destructive"
          });
          navigate('/companies');
        }
      } catch (error) {
        console.error("Error ensuring data:", error);
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante il caricamento dei dati",
          variant: "destructive"
        });
        navigate('/companies');
      }
    };
    
    ensureData();
  }, [currentReport, currentCompany, navigate, toast, loadReport, loadCompanies]);

  const handleSaveReport = async (): Promise<void> => {
    try {
      console.log("Saving report data");
      // First update the context with the latest form values
      updateReportData(formValues);
      
      // Then save the updated data to the database
      await saveCurrentReport();
      
      toast({
        title: "Report salvato",
        description: "Tutte le modifiche sono state salvate con successo"
      });
    } catch (error) {
      console.error("Error saving report:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio del report",
        variant: "destructive"
      });
    }
  };

  const saveBasicInfo = async () => {
    try {
      if (isConsolidated && currentReport && currentReport.id) {
        console.log("Saving subsidiaries for report:", currentReport.id);
        await saveSubsidiaries(subsidiariesState.subsidiaries, currentReport.id);
      }
      
      toast({
        title: "Informazioni salvate",
        description: "Le informazioni di base sono state salvate con successo."
      });
      setActiveTab('metrics');
      return true;
    } catch (error) {
      console.error("Error saving basic info:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio delle informazioni di base",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const saveMetrics = async () => {
    try {
      console.log("Saving metrics");
      // First update the context with the latest form values
      updateReportData(formValues);
      
      // Then save the updated data to the database
      await saveCurrentReport();
      
      toast({
        title: "Report completato",
        description: "Il report V-SME è stato compilato e salvato con successo."
      });
      return true;
    } catch (error) {
      console.error("Error saving metrics:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio delle metriche",
        variant: "destructive"
      });
      return false;
    }
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
    ...subsidiariesState
  };
};
