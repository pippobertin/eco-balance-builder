
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { BusinessPartnersFormData, BusinessPartnersHookResult } from './types';

export const useBusinessPartnersData = (reportId: string): BusinessPartnersHookResult => {
  const [formData, setFormData] = useState<BusinessPartnersFormData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [needsSaving, setNeedsSaving] = useState(false);

  useEffect(() => {
    // Load data logic would go here
    setIsLoading(false);
  }, [reportId]);

  useEffect(() => {
    if (!isLoading) {
      setNeedsSaving(true);
    }
  }, [formData, isLoading]);

  const saveData = async (): Promise<boolean> => {
    try {
      // Save implementation would go here
      setLastSaved(new Date());
      setNeedsSaving(false);
      toast.success("Dati salvati con successo");
      return true;
    } catch (error) {
      console.error("Error saving business partners data:", error);
      toast.error("Errore nel salvataggio dei dati");
      return false;
    }
  };

  return {
    formData,
    setFormData,
    isLoading,
    saveData,
    lastSaved,
    needsSaving
  };
};
