
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useReport } from '@/context/ReportContext';

export const useReportNavigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentCompany, currentReport, loadReport, loadCompanies } = useReport();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Ensure we have companies loaded
        if (!currentCompany) {
          console.log("No current company, loading companies");
          await loadCompanies();
        }
        
        // If we have a currentReport but it doesn't have complete company data, reload it
        if (currentReport && currentReport.id) {
          if (!currentReport.company || !currentReport.company.name) {
            console.log("Report exists but missing company data. Loading full report:", currentReport.id);
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
      }
    };
    
    fetchData();
  }, [currentCompany, currentReport, navigate, toast, loadReport, loadCompanies]);

  return { currentCompany, currentReport, isLoading };
};
