
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
    console.log("Triggering update with issues:", issues.length);
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
      const updatedIssues = prevIssues.map(issue => {
        if (issue.id === id) {
          if (field === 'impactRelevance' || field === 'financialRelevance') {
            const numericValue = typeof value === 'string' ? Number(value) : value;
            return { ...issue, [field]: numericValue };
          }
          
          // Critical fix: Ensure boolean value for isMaterial
          if (field === 'isMaterial') {
            const boolValue = value === true || value === 'true';
            console.log(`Setting isMaterial for ${id} to strict boolean:`, boolValue);
            return { ...issue, isMaterial: boolValue };
          }
          
          return { ...issue, [field]: value };
        }
        return issue;
      });
      
      // Count material issues for debugging
      const materialCount = updatedIssues.filter(issue => issue.isMaterial === true).length;
      console.log(`Updated issues after change: ${updatedIssues.length} total, ${materialCount} material`);
      console.log("Material issue IDs:", updatedIssues.filter(i => i.isMaterial === true).map(i => i.id));
      
      return updatedIssues;
    });
    
    // Always update immediately on isMaterial changes to ensure proper UI state
    if (field === 'isMaterial') {
      setIssues(prevIssues => {
        const updatedIssues = prevIssues.map(issue => {
          if (issue.id === id) {
            const boolValue = value === true || value === 'true';
            console.log(`Immediately updating isMaterial for ${id} to strict boolean:`, boolValue);
            return { ...issue, isMaterial: boolValue };
          }
          return issue;
        });
        
        // Count material issues for debugging
        const materialCount = updatedIssues.filter(issue => issue.isMaterial === true).length;
        console.log(`Immediately updating after setting isMaterial for issue ${id}. Material issues: ${materialCount}`);
        console.log("Material issue IDs:", updatedIssues.filter(i => i.isMaterial === true).map(i => i.id));
        
        // Call onUpdate immediately for this change
        onUpdate(updatedIssues);
        return updatedIssues;
      });
    }
  };

  return {
    handleIssueChange
  };
};
