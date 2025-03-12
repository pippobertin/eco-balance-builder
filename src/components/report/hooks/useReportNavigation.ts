
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useReport } from '@/context/ReportContext';

export const useReportNavigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentCompany, currentReport, loadReport, loadCompanies } = useReport();
  const [isLoading, setIsLoading] = useState(true);
  
  // Add refs to track data loading state and prevent loops
  const isLoadingRef = useRef(false);
  const reportLoadAttemptedRef = useRef(false);
  
  useEffect(() => {
    const fetchData = async () => {
      // Prevent concurrent loading attempts
      if (isLoadingRef.current) {
        return;
      }
      
      isLoadingRef.current = true;
      setIsLoading(true);
      
      try {
        // Ensure we have companies loaded
        if (!currentCompany) {
          console.log("No current company, loading companies");
          await loadCompanies();
        }
        
        // Only attempt to load the report once per component lifecycle
        // Unless we have a report ID but missing company data
        if (currentReport && currentReport.id && !reportLoadAttemptedRef.current) {
          if (!currentReport.company || !currentReport.company.name) {
            console.log("Report exists but missing company data. Loading full report:", currentReport.id);
            reportLoadAttemptedRef.current = true;
            await loadReport(currentReport.id);
          } else {
            console.log("Report already has company data:", currentReport.company.name);
          }
        }
        
        // After loading, if we still don't have company data, navigate to companies
        if (!currentCompany) {
          console.log("Still no company after loading, redirecting to companies page");
          toast({
            title: "Nessuna azienda selezionata",
            description: "Seleziona un'azienda e un report per continuare",
            variant: "destructive"
          });
          navigate('/companies');
        } else if (!currentReport) {
          console.log("No current report, redirecting to companies page");
          toast({
            title: "Nessun report attivo",
            description: "Seleziona o crea un report per continuare",
            variant: "destructive"
          });
          navigate('/companies');
        }
      } catch (error) {
        console.error("Error in useReportNavigation:", error);
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante il caricamento dei dati",
          variant: "destructive"
        });
        navigate('/companies');
      } finally {
        setIsLoading(false);
        isLoadingRef.current = false;
      }
    };
    
    fetchData();
  }, [currentCompany?.id, currentReport?.id]); // Only trigger on ID changes, not the entire objects

  return { currentCompany, currentReport, isLoading };
};
