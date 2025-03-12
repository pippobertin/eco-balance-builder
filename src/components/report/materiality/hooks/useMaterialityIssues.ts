
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
      // Only update if the data is actually different to prevent infinite loops
      const currentIds = new Set(issues.map(issue => issue.id));
      const initialIds = new Set(initialIssues.map(issue => issue.id));
      
      // Check if arrays have different lengths or different elements
      const needsUpdate = 
        issues.length !== initialIssues.length || 
        initialIssues.some(issue => !currentIds.has(issue.id)) ||
        issues.some(issue => !initialIds.has(issue.id));
      
      if (needsUpdate) {
        console.log("Updating issues from initialIssues:", initialIssues);
        // Ensure all numeric values are properly converted
        const processedIssues = initialIssues.map(issue => ({
          ...issue,
          impactRelevance: Number(issue.impactRelevance),
          financialRelevance: Number(issue.financialRelevance)
        }));
        setIssues(processedIssues);
      }
    }
  }, [initialIssues]);

  // Call onUpdate whenever issues changes
  const triggerUpdate = useCallback(() => {
    if (issues && issues.length > 0) {
      console.log("Triggering update with issues:", issues);
      onUpdate(issues);
    }
  }, [issues, onUpdate]);

  // Use useEffect to call the update function
  useEffect(() => {
    // Only trigger update if issues exist and are changed from initial state
    if (issues && issues.length > 0) {
      console.log("Issues changed, scheduling update");
      // Add a small delay to avoid rapid consecutive updates
      const timeoutId = setTimeout(() => {
        triggerUpdate();
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [triggerUpdate, issues]);

  const handleIssueChange = (id: string, field: keyof MaterialityIssue, value: any) => {
    console.log(`Changing issue ${id} field ${String(field)} to`, value);
    
    setIssues(prevIssues => {
      const updatedIssues = prevIssues.map(issue => {
        if (issue.id === id) {
          // Ensure we convert to number for numeric fields
          if (field === 'impactRelevance' || field === 'financialRelevance') {
            const numericValue = typeof value === 'string' ? Number(value) : value;
            return { ...issue, [field]: numericValue };
          }
          return { ...issue, [field]: value };
        }
        return issue;
      });
      
      // Log the change and return updated issues
      console.log("Updated issues after change:", updatedIssues);
      
      // Force an immediate save after a change
      setTimeout(() => {
        onUpdate(updatedIssues);
      }, 50);
      
      return updatedIssues;
    });
  };

  const addCustomIssue = (name: string, description: string) => {
    // First check if this is a predefined issue
    const predefinedIssue = predefinedIssues.find(
      issue => issue.name === name && issue.description === description
    );
    
    console.log("Adding issue:", name, "predefined:", !!predefinedIssue);
    
    setIssues(prevIssues => {
      if (predefinedIssue) {
        // If it's predefined, use its ID and add default values for required properties
        // Check if issue with this ID already exists to avoid duplicates
        if (prevIssues.some(issue => issue.id === predefinedIssue.id)) {
          console.log("Issue already exists, not adding duplicate:", predefinedIssue.id);
          return prevIssues;
        }
        
        console.log("Adding predefined issue:", predefinedIssue);
        const updatedIssues = [
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
        
        // Immediately trigger an update to save changes
        setTimeout(() => onUpdate(updatedIssues), 0);
        
        return updatedIssues;
      } else {
        // If it's custom, generate a new ID and add default values for required properties
        const id = `custom-${Date.now()}`;
        console.log("Adding custom issue with ID:", id);
        const updatedIssues = [
          ...prevIssues,
          {
            id,
            name,
            description,
            impactRelevance: 50,
            financialRelevance: 50,
            isMaterial: false
          }
        ];
        
        // Immediately trigger an update to save changes
        setTimeout(() => onUpdate(updatedIssues), 0);
        
        return updatedIssues;
      }
    });
  };

  const removeIssue = (id: string) => {
    console.log("Removing issue:", id);
    setIssues(prevIssues => {
      const updatedIssues = prevIssues.filter(issue => issue.id !== id);
      
      // Immediately trigger an update to save changes
      setTimeout(() => onUpdate(updatedIssues), 0);
      
      return updatedIssues;
    });
  };

  // Update issues with stakeholder relevance data
  const updateIssuesWithStakeholderRelevance = (updatedIssues: MaterialityIssue[]) => {
    // Create a map of issue id to stakeholder relevance
    const relevanceMap = new Map(
      updatedIssues.map(issue => [issue.id, issue.stakeholderRelevance])
    );
    
    // Update all issues with their respective stakeholder relevance
    setIssues(prevIssues => {
      const newIssues = prevIssues.map(issue => ({
        ...issue,
        stakeholderRelevance: relevanceMap.get(issue.id)
      }));
      
      // Immediately trigger an update to save changes
      setTimeout(() => onUpdate(newIssues), 0);
      
      return newIssues;
    });
  };

  return {
    issues,
    handleIssueChange,
    addCustomIssue,
    removeIssue,
    updateIssuesWithStakeholderRelevance
  };
};
