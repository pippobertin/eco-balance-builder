
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useReport } from '@/context/ReportContext';

export const useReportForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    reportData,
    updateReportData,
    currentCompany,
    currentReport,
    saveCurrentReport,
    saveSubsidiaries
  } = useReport();
  
  const [activeTab, setActiveTab] = useState('company-info');
  const [isConsolidated, setIsConsolidated] = useState<boolean>(false);
  const [sustainabilityPractices, setSustainabilityPractices] = useState<string>('');
  const [formValues, setFormValues] = useState({
    environmentalMetrics: {},
    socialMetrics: {},
    conductMetrics: {},
    narrativePATMetrics: {},
    materialityAnalysis: {}
  });

  // Load current report data
  useEffect(() => {
    if (currentReport) {
      setIsConsolidated(currentReport.is_consolidated);
      
      // Load form data from report
      setFormValues({
        environmentalMetrics: reportData.environmentalMetrics || {},
        socialMetrics: reportData.socialMetrics || {},
        conductMetrics: reportData.conductMetrics || {},
        narrativePATMetrics: reportData.narrativePATMetrics || {},
        materialityAnalysis: reportData.materialityAnalysis || {}
      });
      
      // If no company or report is selected, redirect to the companies page
      if (!currentCompany) {
        toast({
          title: "Nessuna azienda selezionata",
          description: "Seleziona un'azienda e un report per continuare",
          variant: "destructive"
        });
        navigate('/companies');
      }
    } else {
      // If no active report, redirect to the companies page
      toast({
        title: "Nessun report attivo",
        description: "Seleziona o crea un report per continuare",
        variant: "destructive"
      });
      navigate('/companies');
    }
  }, [currentReport, currentCompany, navigate, toast, reportData]);

  // Save report handler
  const handleSaveReport = async () => {
    await saveCurrentReport();
    
    toast({
      title: "Report salvato",
      description: "Tutte le modifiche sono state salvate con successo"
    });
  };

  // Navigate to basic info tab
  const saveBasicInfo = () => {
    toast({
      title: "Informazioni salvate",
      description: "Le informazioni di base sono state salvate con successo."
    });
    setActiveTab('metrics');
  };
  
  // Save metrics
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
    saveMetrics
  };
};
