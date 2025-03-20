
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
  const maxRetryAttemptsRef = useRef(2); // Limit retries to prevent infinite loops
  const retryCountRef = useRef(0);
  
  useEffect(() => {
    const fetchData = async () => {
      // Prevent concurrent loading attempts
      if (isLoadingRef.current) {
        return;
      }
      
      // Don't retry more than maxRetryAttemptsRef
      if (retryCountRef.current >= maxRetryAttemptsRef.current) {
        console.log("Max retry attempts reached, aborting further load attempts");
        setIsLoading(false);
        isLoadingRef.current = false;
        
        // If we still don't have data, redirect to companies
        if (!currentCompany || !currentReport) {
          console.error("Failed to load report or company data after max retries");
          toast({
            title: "Errore di caricamento",
            description: "Impossibile caricare i dati del report. Tornando alla pagina aziende.",
            variant: "destructive"
          });
          navigate('/companies');
        }
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
        
        // Check if we have a report but it's missing essential data
        if (currentReport && currentReport.id) {
          const needsReload = !currentReport.company || !currentReport.company.name;
          
          if (needsReload && !reportLoadAttemptedRef.current) {
            console.log("Report exists but missing company data. Loading full report:", currentReport.id);
            reportLoadAttemptedRef.current = true;
            retryCountRef.current++;
            const result = await loadReport(currentReport.id);
            
            // Verify we got the company data this time
            if (result && result.report && (!result.report.company || !result.report.company.name)) {
              console.error("Still missing company data after reload:", currentReport.id);
              // We'll continue and check again in the next section
            } else {
              console.log("Successfully loaded report with company data");
            }
          } else if (needsReload) {
            console.log("Still missing company data, but already attempted reload");
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
