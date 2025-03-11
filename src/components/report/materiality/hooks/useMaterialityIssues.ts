
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    onUpdate(issues);
  }, [issues, onUpdate]);

  const handleIssueChange = (id: string, field: keyof MaterialityIssue, value: any) => {
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
    
    if (predefinedIssue) {
      // If it's predefined, use its ID and add default values for required properties
      setIssues([
        ...issues,
        {
          id: predefinedIssue.id,
          name: predefinedIssue.name,
          description: predefinedIssue.description,
          impactRelevance: 50,
          financialRelevance: 50,
          isMaterial: false
        }
      ]);
    } else {
      // If it's custom, generate a new ID and add default values for required properties
      const id = `custom-${Date.now()}`;
      setIssues([
        ...issues,
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
    setIssues(issues.filter(issue => issue.id !== id));
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
