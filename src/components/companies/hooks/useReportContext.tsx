
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
  
  // One-way sync: Only update local state when context state changes
  // and make sure we're not in the middle of an update
  useEffect(() => {
    if (!isUpdatingRef.current && currentCompany) {
      // Only update if there's an actual change to prevent unnecessary renders
      if (!selectedCompany || currentCompany.id !== selectedCompany.id) {
        console.log('Syncing selectedCompany with currentCompany', currentCompany.name);
        setSelectedCompany(currentCompany);
      }
    }
  }, [currentCompany, selectedCompany]);
  
  // Memoized function to select a company with update loop protection
  const selectCompany = useCallback((company: Company) => {
    // Skip if already selecting this company
    if (selectedCompany?.id === company.id) {
      return;
    }
    
    // Log the selection for debugging
    console.log('Selecting company:', company.name);
    
    // Set flag to prevent loop
    isUpdatingRef.current = true;
    
    // Update both states
    setSelectedCompany(company);
    setCurrentCompany(company);
    
    // Reset flag after state updates have been processed
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 50);
  }, [setCurrentCompany, selectedCompany]);
  
  return {
    selectedCompany,
    selectCompany,
    isAddReportDialogOpen,
    setIsAddReportDialogOpen,
    companies
  };
};
