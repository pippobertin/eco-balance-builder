import { useCallback, useEffect, useRef } from 'react';
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
  // Track the last changed issue to prevent unwanted reverts
  const lastChangedIssueRef = useRef<{id: string, field: string, value: any, timestamp: number}[]>([]);
  // Flag to track active updates and prevent concurrent operations
  const isUpdatingRef = useRef<boolean>(false);
  
  // Trigger update when issues change, with debounce
  const triggerUpdate = useCallback(() => {
    if (isUpdatingRef.current) {
      console.log("useIssueUpdater: Skipping update because another update is in progress");
      return;
    }
    
    console.log("useIssueUpdater: Triggering update with issues:", issues.length);
    // Count and log material issues for debugging
    const materialCount = issues.filter(issue => issue.isMaterial === true).length;
    console.log(`Sending update with ${issues.length} issues, ${materialCount} are material`);
    console.log("Material issues:", issues.filter(issue => issue.isMaterial === true).map(i => ({id: i.id, name: i.name})));
    
    isUpdatingRef.current = true;
    
    // Actually send the update
    onUpdate(issues);
    
    // Reset the updating flag after some delay
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 5000);
  }, [issues, onUpdate]);

  useEffect(() => {
    if (issues && issues.length > 0 && !isUpdatingRef.current) {
      console.log("Issues changed, scheduling update");
      const timeoutId = setTimeout(() => {
        triggerUpdate();
      }, 4000); // Increased timeout to ensure state settles completely
      
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
    
    // Record this change to prevent future unwanted reverts
    const newChange = {
      id,
      field: String(field),
      value,
      timestamp: Date.now()
    };
    
    lastChangedIssueRef.current = [
      newChange,
      ...lastChangedIssueRef.current.filter(change => 
        // Keep recent changes for other issues, or older changes for other fields of the same issue
        (change.id !== id || change.field !== String(field)) &&
        // But only keep changes from the last 30 seconds
        Date.now() - change.timestamp < 30000
      )
    ];
    
    setIssues(prevIssues => {
      // CRITICAL FIX: Create completely new array with new objects to avoid any reference issues
      const updatedIssues = prevIssues.map(issue => {
        if (issue.id !== id) {
          return { ...issue };
        }
        
        // Create a new copy of the issue to update
        const updatedIssue = structuredClone(issue);
        
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
      
      // Preserve the selection state of recently changed issues
      lastChangedIssueRef.current.forEach(change => {
        if (Date.now() - change.timestamp < 20000 && change.field === 'isMaterial') {
          const recentIssueInUpdated = updatedIssues.find(issue => issue.id === change.id);
          
          if (recentIssueInUpdated && recentIssueInUpdated.isMaterial !== change.value) {
            console.log("Preserving recent change for issue:", change.id, "setting isMaterial to", change.value);
            recentIssueInUpdated.isMaterial = change.value === true;
          }
        }
      });
      
      // Count material issues for debugging
      const materialCount = updatedIssues.filter(issue => issue.isMaterial === true).length;
      console.log(`Updated issues after change: ${updatedIssues.length} total, ${materialCount} material`);
      console.log("Material issue IDs:", updatedIssues.filter(i => i.isMaterial === true).map(i => i.id));
      
      return updatedIssues;
    });
  };

  return {
    handleIssueChange
  };
};
