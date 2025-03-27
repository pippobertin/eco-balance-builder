
import { useState } from 'react';
import { toast } from 'sonner';
import { useReport } from '@/hooks/use-report-context';

export interface UseBusinessPartnersSaveProps {
  reportId: string;
  onSave: () => Promise<boolean | void>;
}

export const useBusinessPartnersSave = ({ reportId, onSave }: UseBusinessPartnersSaveProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [needsSaving, setNeedsSaving] = useState(false);
  const { setNeedsSaving: setGlobalNeedsSaving } = useReport();

  const handleDataChange = () => {
    setNeedsSaving(true);
    setGlobalNeedsSaving(true);
  };

  const handleSave = async (): Promise<boolean> => {
    if (!reportId) {
      toast.error("ID report non valido");
      return false;
    }

    setIsSaving(true);
    
    try {
      const result = await onSave();
      const success = result !== false;
      
      if (success) {
        const now = new Date();
        setLastSaved(now);
        setNeedsSaving(false);
        setGlobalNeedsSaving(false);
        toast.success("Dati salvati con successo");
      } else {
        toast.error("Errore durante il salvataggio");
      }
      
      return success;
    } catch (error) {
      console.error("Error saving business partners data:", error);
      toast.error("Si è verificato un errore durante il salvataggio");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    lastSaved,
    needsSaving,
    setNeedsSaving,
    handleDataChange,
    handleSave
  };
};
