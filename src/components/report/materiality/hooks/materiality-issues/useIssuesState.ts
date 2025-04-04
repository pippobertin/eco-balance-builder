
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
        issues.some(issue => !initialIds.has(issue.id)) ||
        // Also compare isMaterial status to catch changes in that property
        initialIssues.some(issue => {
          const currentIssue = issues.find(i => i.id === issue.id);
          return currentIssue && currentIssue.isMaterial !== issue.isMaterial;
        });
      
      if (needsUpdate) {
        console.log("Updating issues from initialIssues:", initialIssues);
        console.log("Initial material issues:", initialIssues.filter(i => i.isMaterial === true).map(i => i.id));
        
        const processedIssues = initialIssues.map(issue => {
          // Create a deep copy to prevent reference issues
          const processedIssue = JSON.parse(JSON.stringify(issue));
          
          // Ensure numeric values
          processedIssue.impactRelevance = Number(processedIssue.impactRelevance) || 50;
          processedIssue.financialRelevance = Number(processedIssue.financialRelevance) || 50;
          
          // Critical fix: Ensure isMaterial is explicitly a boolean value
          // Use strict equality to convert to boolean
          processedIssue.isMaterial = processedIssue.isMaterial === true;
          
          return processedIssue;
        });
        
        // Count material issues for debugging
        const materialCount = processedIssues.filter(issue => issue.isMaterial === true).length;
        console.log(`Processed ${processedIssues.length} issues, ${materialCount} are material`);
        console.log("Processed material issues:", processedIssues.filter(i => i.isMaterial === true).map(i => i.id));
        
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
