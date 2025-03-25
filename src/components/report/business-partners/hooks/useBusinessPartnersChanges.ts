
import { useEffect } from 'react';
import { BusinessPartnersFormData } from './types';

export const useBusinessPartnersChanges = (
  formData: BusinessPartnersFormData,
  isLoading: boolean,
  setNeedsSaving: (value: React.SetStateAction<Record<string, boolean>>) => void
) => {
  // Update needsSaving flags when form data changes
  useEffect(() => {
    if (!isLoading) {
      setNeedsSaving(prev => ({ ...prev, bp1: true }));
    }
  }, [formData.bp1, isLoading, setNeedsSaving]);
  
  useEffect(() => {
    if (!isLoading) {
      setNeedsSaving(prev => ({ ...prev, bp2: true }));
    }
  }, [formData.bp2, isLoading, setNeedsSaving]);
  
  useEffect(() => {
    if (!isLoading) {
      setNeedsSaving(prev => ({ ...prev, bp3: true }));
    }
  }, [formData.bp3, isLoading, setNeedsSaving]);
  
  useEffect(() => {
    if (!isLoading) {
      setNeedsSaving(prev => ({ ...prev, bp4: true }));
    }
  }, [formData.bp4, isLoading, setNeedsSaving]);
  
  useEffect(() => {
    if (!isLoading) {
      setNeedsSaving(prev => ({ ...prev, bp5: true }));
    }
  }, [formData.bp5, isLoading, setNeedsSaving]);
  
  useEffect(() => {
    if (!isLoading) {
      setNeedsSaving(prev => ({ ...prev, bp6: true }));
    }
  }, [formData.bp6, isLoading, setNeedsSaving]);
  
  useEffect(() => {
    if (!isLoading) {
      setNeedsSaving(prev => ({ ...prev, bp7: true }));
    }
  }, [formData.bp7, isLoading, setNeedsSaving]);
  
  useEffect(() => {
    if (!isLoading) {
      setNeedsSaving(prev => ({ ...prev, bp8: true }));
    }
  }, [formData.bp8, isLoading, setNeedsSaving]);
  
  useEffect(() => {
    if (!isLoading) {
      setNeedsSaving(prev => ({ ...prev, bp9: true }));
    }
  }, [formData.bp9, isLoading, setNeedsSaving]);
  
  useEffect(() => {
    if (!isLoading) {
      setNeedsSaving(prev => ({ ...prev, bp10: true }));
    }
  }, [formData.bp10, isLoading, setNeedsSaving]);
  
  useEffect(() => {
    if (!isLoading) {
      setNeedsSaving(prev => ({ ...prev, bp11: true }));
    }
  }, [formData.bp11, isLoading, setNeedsSaving]);
};
