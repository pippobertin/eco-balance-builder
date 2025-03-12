
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useReport } from '@/context/ReportContext';

export const useReportNavigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentCompany, currentReport } = useReport();

  useEffect(() => {
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
  }, [currentCompany, currentReport, navigate, toast]);

  return { currentCompany, currentReport };
};
