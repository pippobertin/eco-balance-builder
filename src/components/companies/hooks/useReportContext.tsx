
import { useState, useEffect, useCallback, useRef } from 'react';
import { useReport } from '@/context/ReportContext';
import { Company } from '@/context/types';

export const useReportContext = () => {
  const { currentCompany, companies, setCurrentCompany } = useReport();
  const [isAddReportDialogOpen, setIsAddReportDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(currentCompany);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Use a ref to track if we're currently updating to prevent loops
  const isUpdatingRef = useRef(false);
  
  // Initialize selectedCompany with currentCompany only once
  useEffect(() => {
    if (!isInitialized && currentCompany) {
      setSelectedCompany(currentCompany);
      setIsInitialized(true);
    }
  }, [currentCompany, isInitialized]);
  
  // Only update selectedCompany when currentCompany changes (one-way sync)
  // with additional safeguards to prevent update loops
  useEffect(() => {
    if (isInitialized && currentCompany && !isUpdatingRef.current) {
      if (!selectedCompany || currentCompany.id !== selectedCompany.id) {
        console.log("Updating selectedCompany from currentCompany change:", currentCompany.name);
        setSelectedCompany(currentCompany);
      }
    }
  }, [currentCompany, selectedCompany, isInitialized]);
  
  // Memoized function to select a company with update loop protection
  const selectCompany = useCallback((company: Company) => {
    console.log("Selecting company in context:", company.name);
    
    // Check if we're already selecting this company
    if (selectedCompany?.id === company.id) {
      console.log("Company already selected, skipping update");
      return;
    }
    
    // Set flag to prevent loop
    isUpdatingRef.current = true;
    
    // Update local state first
    setSelectedCompany(company);
    
    // Update context state
    setCurrentCompany(company);
    
    // Reset flag after next tick
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 0);
  }, [setCurrentCompany, selectedCompany]);
  
  return {
    selectedCompany,
    selectCompany,
    isAddReportDialogOpen,
    setIsAddReportDialogOpen,
    companies
  };
};
