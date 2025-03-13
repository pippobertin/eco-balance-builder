
import { MaterialityIssue } from '../../../types';

/**
 * Check if we should skip this update due to a recent operation
 */
export const shouldSkipUpdate = (
  lastOpRef: React.MutableRefObject<{id: string; operation: 'select'|'deselect'; timestamp: number} | undefined>, 
  updatingRef: React.MutableRefObject<boolean>
) => {
  // If we're already updating, skip
  if (updatingRef.current) {
    console.log("useThemeProcessing: Skipping update because another update is in progress");
    return true;
  }
  
  // If there was a recent user operation (less than 200ms ago), skip
  if (lastOpRef.current && Date.now() - lastOpRef.current.timestamp < 200) {
    console.log(`useThemeProcessing: Skipping update due to recent operation on ${lastOpRef.current.id}`);
    return true;
  }
  
  return false;
};

/**
 * Check if we should process issues based on various conditions
 */
export const shouldProcessIssues = (
  selectedIssueIds: Set<string>,
  prevSelectedIdsRef: React.MutableRefObject<Set<string>>,
  hasMountedRef: React.MutableRefObject<boolean>,
  availableIssues: MaterialityIssue[],
  selectedIssues: MaterialityIssue[]
) => {
  // Always process on first mount
  if (!hasMountedRef.current) {
    console.log("useThemeProcessing: Processing on first mount");
    return true;
  }
  
  // Check if selected IDs have changed
  const prevSelectedArray = Array.from(prevSelectedIdsRef.current);
  const currentSelectedArray = Array.from(selectedIssueIds);
  
  if (prevSelectedArray.length !== currentSelectedArray.length) {
    console.log("useThemeProcessing: Selected IDs count changed, processing");
    return true;
  }
  
  // Check if any IDs are different
  for (const id of currentSelectedArray) {
    if (!prevSelectedIdsRef.current.has(id)) {
      console.log(`useThemeProcessing: New selected ID: ${id}, processing`);
      return true;
    }
  }
  
  for (const id of prevSelectedArray) {
    if (!selectedIssueIds.has(id)) {
      console.log(`useThemeProcessing: ID removed from selection: ${id}, processing`);
      return true;
    }
  }
  
  // Check if we have no issues yet
  if (availableIssues.length === 0 && selectedIssues.length === 0) {
    console.log("useThemeProcessing: No issues in state yet, processing");
    return true;
  }
  
  // Check if any selected issues have isMaterial=false (need to be removed)
  const hasDeselectedIssues = selectedIssues.some(issue => issue.isMaterial === false);
  if (hasDeselectedIssues) {
    console.log("useThemeProcessing: Found deselected issues in selected list, processing");
    return true;
  }
  
  // Check if any available issues have isMaterial=true (need to be moved to selected)
  const hasSelectedIssues = availableIssues.some(issue => issue.isMaterial === true);
  if (hasSelectedIssues) {
    console.log("useThemeProcessing: Found selected issues in available list, processing");
    return true;
  }
  
  console.log("useThemeProcessing: No changes detected, skipping processing");
  return false;
};
