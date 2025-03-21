
import { useEffect } from 'react';
import { useSupplyChainLoad } from './useSupplyChainLoad';
import { useSupplyChainSave } from './useSupplyChainSave';
import { SupplyChainData } from './types';

export const useSupplyChainData = (reportId: string | undefined) => {
  const { loading, supplyChainData, setSupplyChainData, loadSupplyChainData } = useSupplyChainLoad(reportId);
  const { isSaving, lastSaved, saveSupplyChainData } = useSupplyChainSave(reportId, setSupplyChainData);

  // Initial data load
  useEffect(() => {
    if (reportId) {
      console.log("Loading supply chain data on mount for report:", reportId);
      loadSupplyChainData();
    }
  }, [reportId, loadSupplyChainData]);

  return {
    loading,
    supplyChainData,
    loadSupplyChainData,
    saveSupplyChainData,
    isSaving,
    lastSaved
  };
};
