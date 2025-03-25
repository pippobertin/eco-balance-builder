
import { useState, useEffect } from 'react';
import { BusinessPartnersHookResult } from './types';
import { useBusinessPartnersLoad } from './useBusinessPartnersLoad';
import { useBusinessPartnersSave } from './useBusinessPartnersSave';
import { useBusinessPartnersChanges } from './useBusinessPartnersChanges';

export const useBusinessPartnersData = (reportId: string): BusinessPartnersHookResult => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Use the load hook to get initial data and loading state
  const loadHook = useBusinessPartnersLoad(reportId);
  
  // Use the save hook for saving data and managing save state
  const saveHook = useBusinessPartnersSave(reportId, loadHook.formData, setIsLoading);
  
  // Track changes to update need-saving state
  useBusinessPartnersChanges(loadHook.formData, loadHook.isLoading, saveHook.setNeedsSaving);
  
  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      await loadHook.loadData();
      console.log("Business partners data loaded successfully");
    };
    
    loadData();
  }, [reportId]);

  // Save data wrapper with logging
  const saveData = async (): Promise<boolean> => {
    console.log("Starting save operation for business partners data");
    try {
      const result = await saveHook.saveData();
      console.log("Save operation completed with result:", result);
      return result;
    } catch (error) {
      console.error("Error in save operation:", error);
      return false;
    }
  };

  return {
    formData: loadHook.formData,
    setFormData: loadHook.setFormData,
    isLoading: loadHook.isLoading,
    setIsLoading: setIsLoading,
    saveData,
    lastSaved: saveHook.lastSaved,
    setLastSaved: saveHook.setLastSaved,
    needsSaving: saveHook.needsSaving,
    setNeedsSaving: saveHook.setNeedsSaving
  };
};
