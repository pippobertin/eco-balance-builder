
import { useState, useEffect } from 'react';
import { useComplianceLoad } from './useComplianceLoad';
import { useComplianceSave } from './useComplianceSave';
import { ComplianceData } from './types';

export const useComplianceData = (reportId: string | undefined) => {
  const { 
    loading, 
    complianceData, 
    setComplianceData, 
    loadComplianceData 
  } = useComplianceLoad(reportId);
  
  const { 
    isSaving, 
    lastSaved, 
    saveComplianceData 
  } = useComplianceSave(reportId, setComplianceData);

  // Initial data load
  useEffect(() => {
    if (reportId) {
      console.log("Loading compliance data on mount for report:", reportId);
      loadComplianceData();
    }
  }, [reportId, loadComplianceData]);

  return {
    loading,
    complianceData,
    loadComplianceData,
    saveComplianceData,
    isSaving,
    lastSaved
  };
};
