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
    loadReport
  } = useReport();
  
  const subsidiariesState = useSubsidiaries();
  
  const initialTab = location.state?.activeTab || 'company-info';
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
    if (currentReport) {
      setIsConsolidated(currentReport.is_consolidated);
      
      setFormValues({
        environmentalMetrics: reportData.environmentalMetrics || {},
        socialMetrics: reportData.socialMetrics || {},
        conductMetrics: reportData.conductMetrics || {},
        narrativePATMetrics: reportData.narrativePATMetrics || {},
        materialityAnalysis: reportData.materialityAnalysis || {}
      });
      
      if (currentReport.id && (!currentReport.company || !currentReport.company?.name)) {
        console.log("Loading full report data");
        loadReport(currentReport.id);
      }
      
      if (!currentCompany) {
        toast({
          title: "Nessuna azienda selezionata",
          description: "Seleziona un'azienda e un report per continuare",
          variant: "destructive"
        });
        navigate('/companies');
      }
    } else {
      toast({
        title: "Nessun report attivo",
        description: "Seleziona o crea un report per continuare",
        variant: "destructive"
      });
      navigate('/companies');
    }
  }, [currentReport, currentCompany, navigate, toast, reportData, loadReport]);

  const handleSaveReport = async () => {
    updateReportData(formValues);
    
    await saveCurrentReport();
    
    toast({
      title: "Report salvato",
      description: "Tutte le modifiche sono state salvate con successo"
    });
  };

  const saveBasicInfo = () => {
    if (isConsolidated && currentReport) {
      saveSubsidiaries(subsidiariesState.subsidiaries, currentReport.id);
    }
    
    toast({
      title: "Informazioni salvate",
      description: "Le informazioni di base sono state salvate con successo."
    });
    setActiveTab('metrics');
  };
  
  const saveMetrics = async () => {
    updateReportData(formValues);
    
    await saveCurrentReport();
    
    toast({
      title: "Report completato",
      description: "Il report V-SME è stato compilato e salvato con successo."
    });
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
