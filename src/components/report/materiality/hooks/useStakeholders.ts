
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Stakeholder, SurveyResponse, MaterialityIssue } from '../types';
import { calculatePriority } from '../utils/stakeholderUtils';

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
    // Make sure influence and interest are numbers
    const influence = typeof newStakeholderData.influence === 'string' 
      ? parseFloat(newStakeholderData.influence) 
      : newStakeholderData.influence;
    
    const interest = typeof newStakeholderData.interest === 'string'
      ? parseFloat(newStakeholderData.interest)
      : newStakeholderData.interest;
    
    // Calculate priority based on influence and interest
    const priority = calculatePriority(influence, interest);
    
    console.log('Adding stakeholder with influence:', influence, 'interest:', interest, 'priority:', priority);
    
    const newStakeholder = {
      ...newStakeholderData,
      id,
      priority,
      influence,
      interest,
      surveyStatus: 'pending' as const
    };
    
    setStakeholders(prevStakeholders => [...prevStakeholders, newStakeholder]);
    
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
            const influenceVal = field === 'influence' ? value : stakeholder.influence;
            const interestVal = field === 'interest' ? value : stakeholder.interest;
            
            // Make sure values are numbers
            const numericInfluence = typeof influenceVal === 'string' ? parseFloat(influenceVal) : influenceVal;
            const numericInterest = typeof interestVal === 'string' ? parseFloat(interestVal) : interestVal;
            
            updatedStakeholder.priority = calculatePriority(numericInfluence, numericInterest);
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
        const updatedStakeholder = { ...stakeholder, surveyStatus: status };
        
        // Generate survey token if status is 'sent'
        if (status === 'sent' && (!stakeholder.surveyToken || stakeholder.surveyStatus !== 'sent')) {
          updatedStakeholder.surveyToken = `${stakeholder.id}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        }
        
        return updatedStakeholder;
      }
      return stakeholder;
    });
    
    setStakeholders(updatedStakeholders);
  };

  const processSurveyResponse = (response: SurveyResponse, materialIssues: MaterialityIssue[]) => {
    // Update stakeholder status
    setStakeholders(prevStakeholders => 
      prevStakeholders.map(stakeholder => {
        if (stakeholder.id === response.stakeholderId) {
          return {
            ...stakeholder,
            surveyStatus: 'completed',
            surveyResponse: response
          };
        }
        return stakeholder;
      })
    );
    
    toast({
      title: "Risposta ricevuta",
      description: `Un nuovo stakeholder ha completato il sondaggio di materialità.`
    });
    
    // Return updated issues with stakeholder assessments
    return calculateStakeholderRelevance(materialIssues, stakeholders);
  };

  // Calculate average stakeholder relevance for each issue
  const calculateStakeholderRelevance = (issues: MaterialityIssue[], allStakeholders: Stakeholder[]): MaterialityIssue[] => {
    const stakeholdersWithResponses = allStakeholders.filter(s => s.surveyResponse);
    
    return issues.map(issue => {
      // Get all ratings for this issue
      const ratings = stakeholdersWithResponses
        .map(s => s.surveyResponse?.issueRatings.find(r => r.issueId === issue.id)?.relevance)
        .filter(r => r !== undefined) as number[];
      
      // Calculate average if there are any ratings
      const averageRelevance = ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : undefined;
      
      return {
        ...issue,
        stakeholderRelevance: averageRelevance
      };
    });
  };

  return {
    stakeholders,
    addStakeholder,
    removeStakeholder,
    handleStakeholderChange,
    updateStakeholderSurveyStatus,
    processSurveyResponse,
    calculateStakeholderRelevance
  };
};
