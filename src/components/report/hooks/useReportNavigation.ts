
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useReport } from '@/context/ReportContext';

export const useReportNavigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentCompany, currentReport, loadReport, loadCompanies } = useReport();
  
  useEffect(() => {
    const fetchData = async () => {
      // Ensure we have companies loaded
      if (!currentCompany) {
        await loadCompanies();
      }
      
      // If we have a currentReport but no company data loaded
      if (currentReport && currentReport.id) {
        console.log("Loading report data for", currentReport.id);
        await loadReport(currentReport.id);
      }
      
      // After loading, if we still don't have company data, navigate to companies
      if (!currentCompany) {
        toast({
          title: "Nessuna azienda selezionata",
          description: "Seleziona un'azienda e un report per continuare",
          variant: "destructive"
        });
        navigate('/companies');
      } else if (!currentReport) {
        toast({
          title: "Nessun report attivo",
          description: "Seleziona o crea un report per continuare",
          variant: "destructive"
        });
        navigate('/companies');
      }
    };
    
    fetchData();
  }, [currentCompany, currentReport, navigate, toast, loadReport, loadCompanies]);

  return { currentCompany, currentReport };
};
