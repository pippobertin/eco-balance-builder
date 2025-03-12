import { useState, useEffect, useCallback } from 'react';
import { MaterialityIssue } from '../types';
import { predefinedIssues } from '../utils/materialityUtils';

export const useMaterialityIssues = (
  initialIssues: MaterialityIssue[] | undefined, 
  onUpdate: (issues: MaterialityIssue[]) => void
) => {
  const [issues, setIssues] = useState<MaterialityIssue[]>(
    initialIssues && initialIssues.length > 0 
      ? initialIssues.map(issue => ({ ...issue, isMaterial: true }))
      : []
  );

  useEffect(() => {
    if (initialIssues && initialIssues.length > 0) {
      const currentIds = new Set(issues.map(issue => issue.id));
      const initialIds = new Set(initialIssues.map(issue => issue.id));
      
      const needsUpdate = 
        issues.length !== initialIssues.length || 
        initialIssues.some(issue => !currentIds.has(issue.id)) ||
        issues.some(issue => !initialIds.has(issue.id));
      
      if (needsUpdate) {
        console.log("Updating issues from initialIssues:", initialIssues);
        const processedIssues = initialIssues.map(issue => ({
          ...issue,
          isMaterial: true,
          impactRelevance: Number(issue.impactRelevance),
          financialRelevance: Number(issue.financialRelevance)
        }));
        setIssues(processedIssues);
      }
    }
  }, [initialIssues]);

  const triggerUpdate = useCallback(() => {
    if (issues && issues.length > 0) {
      console.log("Triggering update with issues:", issues);
      onUpdate(issues);
    }
  }, [issues, onUpdate]);

  useEffect(() => {
    if (issues && issues.length > 0) {
      console.log("Issues changed, scheduling update");
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
          if (field === 'impactRelevance' || field === 'financialRelevance') {
            const numericValue = typeof value === 'string' ? Number(value) : value;
            return { ...issue, [field]: numericValue };
          }
          return { ...issue, [field]: value };
        }
        return issue;
      });
      
      console.log("Updated issues after change:", updatedIssues);
      
      setTimeout(() => {
        onUpdate(updatedIssues);
      }, 50);
      
      return updatedIssues;
    });
  };

  const addCustomIssue = (name: string, description: string) => {
    const predefinedIssue = predefinedIssues.find(
      issue => issue.name === name && issue.description === description
    );
    
    console.log("Adding issue:", name, "predefined:", !!predefinedIssue);
    
    setIssues(prevIssues => {
      if (predefinedIssue) {
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
            isMaterial: true
          }
        ];
        
        setTimeout(() => onUpdate(updatedIssues), 0);
        return updatedIssues;
      } else {
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
            isMaterial: true
          }
        ];
        
        setTimeout(() => onUpdate(updatedIssues), 0);
        return updatedIssues;
      }
    });
  };

  const removeIssue = (id: string) => {
    console.log("Removing issue:", id);
    setIssues(prevIssues => {
      const updatedIssues = prevIssues.filter(issue => issue.id !== id);
      
      setTimeout(() => onUpdate(updatedIssues), 0);
      
      return updatedIssues;
    });
  };

  const updateIssuesWithStakeholderRelevance = (updatedIssues: MaterialityIssue[]) => {
    const relevanceMap = new Map(
      updatedIssues.map(issue => [issue.id, issue.stakeholderRelevance])
    );
    
    setIssues(prevIssues => {
      const newIssues = prevIssues.map(issue => ({
        ...issue,
        stakeholderRelevance: relevanceMap.get(issue.id)
      }));
      
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
