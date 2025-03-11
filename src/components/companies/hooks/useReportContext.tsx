
import { useState, useEffect, useCallback } from 'react';
import { useReport } from '@/context/ReportContext';
import { Company } from '@/context/types';

export const useReportContext = () => {
  const { currentCompany, companies, setCurrentCompany } = useReport();
  const [isAddReportDialogOpen, setIsAddReportDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(currentCompany);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize selectedCompany with currentCompany only once
  useEffect(() => {
    if (!isInitialized && currentCompany) {
      setSelectedCompany(currentCompany);
      setIsInitialized(true);
    }
  }, [currentCompany, isInitialized]);
  
  // Only update selectedCompany when currentCompany changes (one-way sync)
  useEffect(() => {
    if (isInitialized && currentCompany && (!selectedCompany || currentCompany.id !== selectedCompany.id)) {
      console.log("Updating selectedCompany from currentCompany change:", currentCompany.name);
      setSelectedCompany(currentCompany);
    }
  }, [currentCompany, selectedCompany, isInitialized]);
  
  // Memoized function to select a company
  const selectCompany = useCallback((company: Company) => {
    console.log("Selecting company in context:", company.name);
    setSelectedCompany(company);
    setCurrentCompany(company);
  }, [setCurrentCompany]);
  
  return {
    selectedCompany,
    selectCompany,
    isAddReportDialogOpen,
    setIsAddReportDialogOpen,
    companies
  };
};
