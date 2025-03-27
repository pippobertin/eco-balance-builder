
import { useState } from 'react';
import { Subsidiary } from '@/context/ReportContext';
import { useToast } from '@/hooks/use-toast';

export const useSubsidiaries = () => {
  const [subsidiaries, setSubsidiaries] = useState<Subsidiary[]>([]);
  const [newSubsidiary, setNewSubsidiary] = useState<Subsidiary>({
    name: '',
    location: ''
  });
  const { toast } = useToast();

  const handleAddSubsidiary = () => {
    if (newSubsidiary.name.trim() && newSubsidiary.location.trim()) {
      setSubsidiaries([...subsidiaries, {
        ...newSubsidiary
      }]);
      setNewSubsidiary({
        name: '',
        location: ''
      });
    } else {
      toast({
        title: "Informazione mancante",
        description: "Per favore inserisci sia il nome che la sede legale dell'impresa figlia.",
        variant: "destructive"
      });
    }
  };
  
  const removeSubsidiary = (index: number) => {
    const updatedSubsidiaries = [...subsidiaries];
    updatedSubsidiaries.splice(index, 1);
    setSubsidiaries(updatedSubsidiaries);
  };

  return {
    subsidiaries,
    setSubsidiaries,
    newSubsidiary,
    setNewSubsidiary,
    handleAddSubsidiary,
    removeSubsidiary
  };
};
