
import { useState } from 'react';
import { Subsidiary } from '@/context/types';

export const useSubsidiaries = (initialSubsidiaries: Subsidiary[] = []) => {
  const [subsidiaries, setSubsidiaries] = useState<Subsidiary[]>(initialSubsidiaries);
  const [newSubsidiary, setNewSubsidiary] = useState<Subsidiary>({ 
    name: '', 
    location: '', 
    id: undefined, 
    report_id: undefined 
  });

  const handleAddSubsidiary = () => {
    if (newSubsidiary.name && newSubsidiary.location) {
      setSubsidiaries([...subsidiaries, { ...newSubsidiary, id: `temp-${Date.now()}` }]);
      setNewSubsidiary({ 
        name: '', 
        location: '', 
        id: undefined, 
        report_id: undefined 
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
