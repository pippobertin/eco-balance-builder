
import { useCallback, useEffect } from 'react';
import { MaterialityIssue } from '../../types';
import { isHeaderTheme } from '../../utils/materialityUtils';

/**
 * Hook for handling issue updates and changes
 */
export const useIssueUpdater = (
  issues: MaterialityIssue[],
  setIssues: React.Dispatch<React.SetStateAction<MaterialityIssue[]>>,
  onUpdate: (issues: MaterialityIssue[]) => void
) => {
  // Trigger update when issues change
  const triggerUpdate = useCallback(() => {
    console.log("useIssueUpdater: Triggering update with issues:", issues.length);
    // Count and log material issues for debugging
    const materialCount = issues.filter(issue => issue.isMaterial === true).length;
    console.log(`Sending update with ${issues.length} issues, ${materialCount} are material`);
    console.log("Material issues:", issues.filter(issue => issue.isMaterial === true).map(i => i.id));
    onUpdate(issues);
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

  // Handle changes to a specific issue field
  const handleIssueChange = (id: string, field: keyof MaterialityIssue, value: any) => {
    console.log(`Changing issue ${id} field ${String(field)} to`, value);
    
    // Don't allow modifications if it's a header theme
    const issueToUpdate = issues.find(issue => issue.id === id);
    if (issueToUpdate && isHeaderTheme(issueToUpdate.id, issueToUpdate.name)) {
      console.log("Cannot modify header theme:", issueToUpdate.name);
      return;
    }
    
    setIssues(prevIssues => {
      // Make a deep copy of prevIssues to avoid reference issues
      const updatedIssues = prevIssues.map(issue => {
        if (issue.id === id) {
          // Create a deep copy of the issue to prevent reference issues
          const updatedIssue = JSON.parse(JSON.stringify(issue));
          
          if (field === 'impactRelevance' || field === 'financialRelevance') {
            const numericValue = typeof value === 'string' ? Number(value) : value;
            updatedIssue[field] = numericValue;
          } else if (field === 'isMaterial') {
            // Critical fix: Ensure boolean value for isMaterial
            // Explicitly use equality with true to ensure a boolean result
            const boolValue = value === true;
            console.log(`Setting isMaterial for ${id} to strict boolean:`, boolValue, typeof boolValue);
            updatedIssue.isMaterial = boolValue;
          } else {
            // Use type assertion for dynamic field assignment
            (updatedIssue as any)[field] = value;
          }
          
          return updatedIssue;
        }
        // Deep clone other issues too to avoid reference problems
        return JSON.parse(JSON.stringify(issue));
      });
      
      // Count material issues for debugging
      const materialCount = updatedIssues.filter(issue => issue.isMaterial === true).length;
      console.log(`Updated issues after change: ${updatedIssues.length} total, ${materialCount} material`);
      console.log("Material issue IDs:", updatedIssues.filter(i => i.isMaterial === true).map(i => i.id));
      
      return updatedIssues;
    });
    
    // Always update immediately on isMaterial changes to ensure proper UI state
    if (field === 'isMaterial') {
      setTimeout(() => {
        triggerUpdate();
      }, 50);
    }
  };

  return {
    handleIssueChange
  };
};
