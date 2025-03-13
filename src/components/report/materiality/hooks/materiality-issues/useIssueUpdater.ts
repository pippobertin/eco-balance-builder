
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
      }, 1000); // CRITICAL FIX: Increased timeout to ensure state settles
      
      return () => clearTimeout(timeoutId);
    }
  }, [triggerUpdate, issues]);

  // Handle changes to a specific issue field
  const handleIssueChange = (id: string, field: keyof MaterialityIssue, value: any) => {
    console.log(`Changing issue ${id} field ${String(field)} to`, value, typeof value);
    
    // Don't allow modifications if it's a header theme
    const issueToUpdate = issues.find(issue => issue.id === id);
    if (issueToUpdate && isHeaderTheme(issueToUpdate.id, issueToUpdate.name)) {
      console.log("Cannot modify header theme:", issueToUpdate.name);
      return;
    }
    
    setIssues(prevIssues => {
      // CRITICAL FIX: Create completely new array with new objects to avoid any reference issues
      const updatedIssues = prevIssues.map(issue => {
        if (issue.id !== id) {
          return { ...issue };
        }
        
        // Create a new copy of the issue to update
        const updatedIssue = { ...issue };
        
        if (field === 'impactRelevance' || field === 'financialRelevance') {
          const numericValue = typeof value === 'string' ? Number(value) : value;
          updatedIssue[field] = numericValue;
        } else if (field === 'isMaterial') {
          // CRITICAL FIX: Force boolean type for isMaterial
          updatedIssue.isMaterial = value === true;
          console.log(`Setting isMaterial for ${id} to strict boolean:`, updatedIssue.isMaterial, typeof updatedIssue.isMaterial);
        } else {
          // Use type assertion for dynamic field assignment
          (updatedIssue as any)[field] = value;
        }
        
        return updatedIssue;
      });
      
      // Count material issues for debugging
      const materialCount = updatedIssues.filter(issue => issue.isMaterial === true).length;
      console.log(`Updated issues after change: ${updatedIssues.length} total, ${materialCount} material`);
      console.log("Material issue IDs:", updatedIssues.filter(i => i.isMaterial === true).map(i => i.id));
      
      return updatedIssues;
    });
    
    // CRITICAL FIX: Always trigger update with a longer delay to ensure state is settled
    setTimeout(() => {
      triggerUpdate();
    }, 1200);
  };

  return {
    handleIssueChange
  };
};
