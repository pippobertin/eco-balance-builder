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
  // Store known material issues to prevent them from being lost
  const knownMaterialIssuesRef = useRef<Set<string>>(new Set());
  // Track initial load
  const initialLoadCompleteRef = useRef<boolean>(false);
  
  // When issues are loaded initially, record which ones are material
  useEffect(() => {
    if (!initialLoadCompleteRef.current && issues.length > 0) {
      const materialIssueIds = issues
        .filter(issue => issue.isMaterial === true)
        .map(issue => issue.id);
      
      console.log("useIssueUpdater: Initial material issues:", materialIssueIds);
      knownMaterialIssuesRef.current = new Set(materialIssueIds);
      initialLoadCompleteRef.current = true;
    }
  }, [issues]);
  
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
    
    // If changing isMaterial to true, add to known material issues
    if (field === 'isMaterial' && value === true) {
      knownMaterialIssuesRef.current.add(id);
      console.log(`Adding ${id} to known material issues`);
    }
    
    // If changing isMaterial to false, remove from known material issues
    if (field === 'isMaterial' && value === false) {
      knownMaterialIssuesRef.current.delete(id);
      console.log(`Removing ${id} from known material issues`);
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
        // But only keep changes from the last 60 seconds
        Date.now() - change.timestamp < 60000
      )
    ];
    
    setIssues(prevIssues => {
      // CRITICAL FIX: Create completely new array with new objects to avoid any reference issues
      const updatedIssues = prevIssues.map(issue => {
        // First create a deep copy of the issue
        const issueCopy = structuredClone(issue);
        
        // If this is the issue we're updating
        if (issueCopy.id === id) {
          if (field === 'impactRelevance' || field === 'financialRelevance') {
            const numericValue = typeof value === 'string' ? Number(value) : value;
            issueCopy[field] = numericValue;
          } else if (field === 'isMaterial') {
            // CRITICAL FIX: Force boolean type for isMaterial
            issueCopy.isMaterial = value === true;
            console.log(`Setting isMaterial for ${id} to strict boolean:`, issueCopy.isMaterial, typeof issueCopy.isMaterial);
          } else {
            // Use type assertion for dynamic field assignment
            (issueCopy as any)[field] = value;
          }
        }
        
        return issueCopy;
      });
      
      // Preserve the selection state of recently changed issues
      lastChangedIssueRef.current.forEach(change => {
        if (Date.now() - change.timestamp < 30000 && change.field === 'isMaterial') {
          const recentIssueInUpdated = updatedIssues.find(issue => issue.id === change.id);
          
          if (recentIssueInUpdated) {
            const oldValue = recentIssueInUpdated.isMaterial;
            const newValue = change.value === true;
            
            if (oldValue !== newValue) {
              console.log(`Preserving recent change for issue ${change.id}: isMaterial from ${oldValue} to ${newValue}`);
              recentIssueInUpdated.isMaterial = newValue;
            }
          }
        }
      });
      
      // Make sure all known material issues stay material
      updatedIssues.forEach(issue => {
        // Only force material state on issues that are in our known set
        // and aren't explicitly being set to false by the current operation
        const isBeingDeselected = id === issue.id && field === 'isMaterial' && value === false;
        
        if (knownMaterialIssuesRef.current.has(issue.id) && !isBeingDeselected) {
          // If this issue should be material but isn't, fix it
          if (issue.isMaterial !== true) {
            console.log(`Restoring material state for known issue: ${issue.id}`);
            issue.isMaterial = true;
          }
        }
      });
      
      // Count material issues for debugging
      const materialCount = updatedIssues.filter(issue => issue.isMaterial === true).length;
      console.log(`Updated issues after change: ${updatedIssues.length} total, ${materialCount} material`);
      
      if (materialCount > 0) {
        console.log("Material issue IDs:", updatedIssues.filter(i => i.isMaterial === true).map(i => i.id));
      }
      
      return updatedIssues;
    });
  };

  return {
    handleIssueChange
  };
};
