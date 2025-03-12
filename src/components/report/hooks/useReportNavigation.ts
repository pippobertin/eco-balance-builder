
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useReport } from '@/context/ReportContext';

export const useReportNavigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentCompany, currentReport, loadReport } = useReport();

  useEffect(() => {
    // If we have a currentReport but no company data loaded
    if (currentReport && !currentReport.company && currentReport.company_id) {
      console.log("Loading report data for", currentReport.id);
      loadReport(currentReport.id);
    }
    
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
  }, [currentCompany, currentReport, navigate, toast, loadReport]);

  return { currentCompany, currentReport };
};
