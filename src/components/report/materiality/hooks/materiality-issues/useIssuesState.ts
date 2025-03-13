
import { useState, useEffect } from 'react';
import { MaterialityIssue } from '../../types';

/**
 * Hook for managing the core state of materiality issues
 */
export const useIssuesState = (
  initialIssues: MaterialityIssue[] | undefined,
  onUpdate: (issues: MaterialityIssue[]) => void
) => {
  const [issues, setIssues] = useState<MaterialityIssue[]>([]);

  // Initialize issues when component mounts or initialIssues prop changes
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
          impactRelevance: Number(issue.impactRelevance) || 50,
          financialRelevance: Number(issue.financialRelevance) || 50,
          // Ensure isMaterial is explicitly a boolean value
          isMaterial: issue.isMaterial === true
        }));
        
        // Count material issues for debugging
        const materialCount = processedIssues.filter(issue => issue.isMaterial === true).length;
        console.log(`Processed ${processedIssues.length} issues, ${materialCount} are material`);
        
        setIssues(processedIssues);
      }
    } else {
      // If no initial issues, ensure the list is empty
      console.log("No initial issues, resetting to empty array");
      setIssues([]);
    }
  }, [initialIssues]);

  return {
    issues,
    setIssues
  };
};
