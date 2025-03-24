import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useReport } from '@/hooks/use-report-context';
import { useSubsidiaries } from './use-subsidiaries';

export const useReportForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  useEffect(() => {
    setFormValues({
      environmentalMetrics: reportData.environmentalMetrics || {},
      socialMetrics: reportData.socialMetrics || {},
      conductMetrics: reportData.conductMetrics || {},
      narrativePATMetrics: reportData.narrativePATMetrics || {},
      materialityAnalysis: reportData.materialityAnalysis || {}
    });
  }, [reportData]);

  useEffect(() => {
    const ensureData = async () => {
      try {
        if (!currentCompany) {
          console.log("No current company, loading companies");
          await loadCompanies();
        }
        
        if (currentReport) {
          console.log("Current report exists:", currentReport.id);
          setIsConsolidated(currentReport.is_consolidated || false);
          
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
      updateReportData(formValues);
      await saveCurrentReport();
      toast.success("Report salvato con successo");
    } catch (error) {
      console.error("Error saving report:", error);
      toast.error("Si è verificato un errore durante il salvataggio del report");
    }
  };

  const saveBasicInfo = async () => {
    try {
      if (isConsolidated && currentReport && currentReport.id) {
        console.log("Saving subsidiaries for report:", currentReport.id);
        await saveSubsidiaries(subsidiariesState.subsidiaries, currentReport.id);
      }
      
      toast.success("Informazioni salvate con successo");
      setActiveTab('metrics');
      return true;
    } catch (error) {
      console.error("Error saving basic info:", error);
      toast.error("Si è verificato un errore durante il salvataggio delle informazioni di base");
      return false;
    }
  };
  
  const saveMetrics = async () => {
    try {
      console.log("Saving metrics");
      updateReportData(formValues);
      await saveCurrentReport();
      toast.success("Report completato con successo");
      return true;
    } catch (error) {
      console.error("Error saving metrics:", error);
      toast.error("Si è verificato un errore durante il salvataggio delle metriche");
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
