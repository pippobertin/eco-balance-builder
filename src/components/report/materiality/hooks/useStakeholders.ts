
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Stakeholder } from '../types';
import { calculatePriority } from '../utils/materialityUtils';

export const useStakeholders = (
  initialStakeholders: Stakeholder[] | undefined,
  onUpdate: (stakeholders: Stakeholder[]) => void
) => {
  const { toast } = useToast();
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(
    initialStakeholders || []
  );

  useEffect(() => {
    onUpdate(stakeholders);
  }, [stakeholders, onUpdate]);

  const addStakeholder = (newStakeholderData: Omit<Stakeholder, 'id' | 'priority' | 'surveyStatus'>) => {
    const id = `stakeholder-${Date.now()}`;
    const priority = calculatePriority(newStakeholderData.influence, newStakeholderData.interest);
    
    setStakeholders([
      ...stakeholders,
      {
        ...newStakeholderData,
        id,
        priority,
        surveyStatus: 'pending'
      }
    ]);
    
    toast({
      title: "Stakeholder aggiunto",
      description: `${newStakeholderData.name} è stato aggiunto alla mappatura degli stakeholder.`
    });
  };
  
  const removeStakeholder = (id: string) => {
    setStakeholders(stakeholders.filter(stakeholder => stakeholder.id !== id));
  };
  
  const handleStakeholderChange = (id: string, field: keyof Stakeholder, value: any) => {
    setStakeholders(prevStakeholders => 
      prevStakeholders.map(stakeholder => {
        if (stakeholder.id === id) {
          const updatedStakeholder = { ...stakeholder, [field]: value };
          
          // Update priority if influence or interest changes
          if (field === 'influence' || field === 'interest') {
            updatedStakeholder.priority = calculatePriority(
              field === 'influence' ? value : stakeholder.influence,
              field === 'interest' ? value : stakeholder.interest
            );
          }
          
          return updatedStakeholder;
        }
        return stakeholder;
      })
    );
  };

  const updateStakeholderSurveyStatus = (selectedIds: string[], status: 'sent' | 'completed' | 'pending') => {
    const updatedStakeholders = stakeholders.map(stakeholder => {
      if (selectedIds.includes(stakeholder.id)) {
        return { ...stakeholder, surveyStatus: status };
      }
      return stakeholder;
    });
    
    setStakeholders(updatedStakeholders);
  };

  return {
    stakeholders,
    addStakeholder,
    removeStakeholder,
    handleStakeholderChange,
    updateStakeholderSurveyStatus
  };
};
