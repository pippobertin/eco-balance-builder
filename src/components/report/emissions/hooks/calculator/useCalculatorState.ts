
import { useState, useEffect } from 'react';
import { EmissionCalculationLogs } from '@/hooks/emissions-calculator/types';
import { useEmissionRecords } from '@/hooks/emissions-calculator/useEmissionRecords';

export const useCalculatorState = (reportId?: string) => {
  // Tab state
  const [activeTab, setActiveTab] = useState('scope1');
  
  // Emissions calculation state
  const [calculatedEmissions, setCalculatedEmissions] = useState({
    scope1: 0,
    scope2: 0,
    scope3: 0,
    total: 0
  });
  
  // Calculation logs state
  const [calculationLogs, setCalculationLogs] = useState<EmissionCalculationLogs>({
    scope1Calculations: [],
    scope2Calculations: [],
    scope3Calculations: []
  });
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);
  
  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Initialize the emission records service
  const { loadEmissionRecords, calculateTotals } = useEmissionRecords(reportId);
  
  // Load existing records when component mounts
  useEffect(() => {
    if (reportId) {
      loadExistingRecords(reportId);
    }
  }, [reportId]);
  
  // Load existing records from the database
  const loadExistingRecords = async (reportId: string) => {
    setIsLoadingExisting(true);
    
    try {
      const records = await loadEmissionRecords(reportId);
      
      if (records && records.length > 0) {
        // Group records by scope
        const scope1Records = records.filter(record => record.scope === 'scope1');
        const scope2Records = records.filter(record => record.scope === 'scope2');
        const scope3Records = records.filter(record => record.scope === 'scope3');
        
        // Create calculation logs
        const logs: EmissionCalculationLogs = {
          scope1Calculations: scope1Records,
          scope2Calculations: scope2Records,
          scope3Calculations: scope3Records
        };
        
        // Update logs state
        setCalculationLogs(logs);
        
        // Calculate totals
        const totals = calculateTotals(records);
        setCalculatedEmissions(totals);
        
        console.log('Loaded existing emission records:', {
          records: records.length,
          scope1: scope1Records.length,
          scope2: scope2Records.length,
          scope3: scope3Records.length,
          totals
        });
      }
    } catch (error) {
      console.error('Error loading existing records:', error);
    } finally {
      setIsLoadingExisting(false);
    }
  };
  
  return {
    activeTab,
    setActiveTab,
    calculatedEmissions,
    setCalculatedEmissions,
    calculationLogs,
    setCalculationLogs,
    isLoading,
    isLoadingExisting,
    isSaving,
    lastSaved
  };
};
