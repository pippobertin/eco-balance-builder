
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
  const saveHook = useBusinessPartnersSave(reportId, loadHook.formData, loadHook.setIsLoading);
  
  // Track changes to update need-saving state
  useBusinessPartnersChanges(loadHook.formData, loadHook.isLoading, saveHook.setNeedsSaving);
  
  // Initial data load
  useEffect(() => {
    loadHook.loadData();
  }, [reportId]);

  return {
    formData: loadHook.formData,
    setFormData: loadHook.setFormData,
    isLoading: loadHook.isLoading,
    setIsLoading: loadHook.setIsLoading,
    saveData: saveHook.saveData,
    lastSaved: saveHook.lastSaved,
    setLastSaved: saveHook.setLastSaved,
    needsSaving: saveHook.needsSaving,
    setNeedsSaving: saveHook.setNeedsSaving
  };
};
