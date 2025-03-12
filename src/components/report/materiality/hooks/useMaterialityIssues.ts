
import { useState, useEffect, useCallback } from 'react';
import { MaterialityIssue } from '../types';
import { predefinedIssues } from '../utils/materialityUtils';

export const useMaterialityIssues = (
  initialIssues: MaterialityIssue[] | undefined, 
  onUpdate: (issues: MaterialityIssue[]) => void
) => {
  const [issues, setIssues] = useState<MaterialityIssue[]>(
    initialIssues && initialIssues.length > 0 
      ? initialIssues 
      : []
  );

  // Make sure to update issues when initialIssues change (e.g., when loading saved data)
  useEffect(() => {
    if (initialIssues && initialIssues.length > 0) {
      // Don't overwrite if we already have the same number of issues
      // This prevents infinite loops when our own updates come back to us
      if (issues.length !== initialIssues.length || 
          JSON.stringify(issues) !== JSON.stringify(initialIssues)) {
        console.log("Updating issues from initialIssues:", initialIssues);
        setIssues(initialIssues);
      }
    }
  }, [initialIssues]);

  // Call onUpdate whenever issues changes
  // Use useCallback to memoize the update function
  const triggerUpdate = useCallback(() => {
    console.log("Triggering update with issues:", issues);
    onUpdate(issues);
  }, [issues, onUpdate]);

  // Use useEffect to call the update function
  useEffect(() => {
    triggerUpdate();
  }, [triggerUpdate]);

  const handleIssueChange = (id: string, field: keyof MaterialityIssue, value: any) => {
    console.log(`Changing issue ${id} field ${String(field)} to`, value);
    setIssues(prevIssues => 
      prevIssues.map(issue => 
        issue.id === id ? { ...issue, [field]: value } : issue
      )
    );
  };

  const addCustomIssue = (name: string, description: string) => {
    // First check if this is a predefined issue
    const predefinedIssue = predefinedIssues.find(
      issue => issue.name === name && issue.description === description
    );
    
    console.log("Adding issue:", name, "predefined:", !!predefinedIssue);
    
    if (predefinedIssue) {
      // If it's predefined, use its ID and add default values for required properties
      setIssues(prevIssues => {
        // Check if issue with this ID already exists to avoid duplicates
        if (prevIssues.some(issue => issue.id === predefinedIssue.id)) {
          return prevIssues;
        }
        
        return [
          ...prevIssues,
          {
            id: predefinedIssue.id,
            name: predefinedIssue.name,
            description: predefinedIssue.description,
            impactRelevance: 50,
            financialRelevance: 50,
            isMaterial: false
          }
        ];
      });
    } else {
      // If it's custom, generate a new ID and add default values for required properties
      const id = `custom-${Date.now()}`;
      setIssues(prevIssues => [
        ...prevIssues,
        {
          id,
          name,
          description,
          impactRelevance: 50,
          financialRelevance: 50,
          isMaterial: false
        }
      ]);
    }
  };

  const removeIssue = (id: string) => {
    console.log("Removing issue:", id);
    setIssues(prevIssues => prevIssues.filter(issue => issue.id !== id));
  };

  // Update issues with stakeholder relevance data
  const updateIssuesWithStakeholderRelevance = (updatedIssues: MaterialityIssue[]) => {
    // Create a map of issue id to stakeholder relevance
    const relevanceMap = new Map(
      updatedIssues.map(issue => [issue.id, issue.stakeholderRelevance])
    );
    
    // Update all issues with their respective stakeholder relevance
    setIssues(prevIssues => 
      prevIssues.map(issue => ({
        ...issue,
        stakeholderRelevance: relevanceMap.get(issue.id)
      }))
    );
  };

  return {
    issues,
    handleIssueChange,
    addCustomIssue,
    removeIssue,
    updateIssuesWithStakeholderRelevance
  };
};
