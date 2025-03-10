
import { useState, useEffect } from 'react';
import { MaterialityIssue } from '../types';
import { predefinedIssues } from '../utils/materialityUtils';

export const useMaterialityIssues = (
  initialIssues: MaterialityIssue[] | undefined, 
  onUpdate: (issues: MaterialityIssue[]) => void
) => {
  const [issues, setIssues] = useState<MaterialityIssue[]>(
    initialIssues || 
    predefinedIssues.map(issue => ({
      ...issue,
      impactRelevance: 50,
      financialRelevance: 50,
      isMaterial: false
    }))
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
  };

  const removeIssue = (id: string) => {
    setIssues(issues.filter(issue => issue.id !== id));
  };

  return {
    issues,
    handleIssueChange,
    addCustomIssue,
    removeIssue
  };
};
