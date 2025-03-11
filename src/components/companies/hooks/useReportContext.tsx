
import { useState, useEffect } from 'react';
import { useReport } from '@/context/ReportContext';
import { Company } from '@/context/types';

export const useReportContext = () => {
  const { currentCompany, companies, setCurrentCompany } = useReport();
  const [isAddReportDialogOpen, setIsAddReportDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(currentCompany);
  
  // Quando cambia currentCompany, aggiorniamo anche lo stato locale
  useEffect(() => {
    if (currentCompany !== selectedCompany) {
      setSelectedCompany(currentCompany);
    }
  }, [currentCompany, selectedCompany]);
  
  // Funzione per selezionare un'azienda
  const selectCompany = (company: Company) => {
    console.log("Selecting company in context:", company.name);
    setSelectedCompany(company);
    setCurrentCompany(company);
  };
  
  return {
    selectedCompany,
    selectCompany,
    isAddReportDialogOpen,
    setIsAddReportDialogOpen,
    companies
  };
};
