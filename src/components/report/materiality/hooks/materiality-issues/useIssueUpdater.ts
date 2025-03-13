
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
      }, 200); // CRITICAL FIX: Increased timeout to ensure state settles
      
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
      // Make a NEW deep copy of prevIssues to avoid reference issues
      // CRITICAL FIX: Use deep clone for ALL issues to ensure no reference issues
      const updatedIssues = JSON.parse(JSON.stringify(prevIssues));
      
      // Find and update the specific issue
      const issueIndex = updatedIssues.findIndex((issue: MaterialityIssue) => issue.id === id);
      if (issueIndex >= 0) {
        if (field === 'impactRelevance' || field === 'financialRelevance') {
          const numericValue = typeof value === 'string' ? Number(value) : value;
          updatedIssues[issueIndex][field] = numericValue;
        } else if (field === 'isMaterial') {
          // CRITICAL FIX: Force boolean type for isMaterial - double check with strict equality
          updatedIssues[issueIndex].isMaterial = value === true;
          console.log(`Setting isMaterial for ${id} to strict boolean:`, updatedIssues[issueIndex].isMaterial, typeof updatedIssues[issueIndex].isMaterial);
        } else {
          // Use type assertion for dynamic field assignment
          (updatedIssues[issueIndex] as any)[field] = value;
        }
      }
      
      // Count material issues for debugging
      const materialCount = updatedIssues.filter((issue: MaterialityIssue) => issue.isMaterial === true).length;
      console.log(`Updated issues after change: ${updatedIssues.length} total, ${materialCount} material`);
      console.log("Material issue IDs:", updatedIssues.filter((i: MaterialityIssue) => i.isMaterial === true).map((i: MaterialityIssue) => i.id));
      
      return updatedIssues;
    });
    
    // CRITICAL FIX: Always trigger update with a short delay to ensure state is settled
    // This is especially important for isMaterial changes
    setTimeout(() => {
      triggerUpdate();
    }, 300);
  };

  return {
    handleIssueChange
  };
};
