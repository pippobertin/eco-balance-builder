
import { MaterialityIssue } from '../../../types';

/**
 * Determines if we should skip the update based on recent operations
 */
export const shouldSkipUpdate = (
  lastOpRef: React.MutableRefObject<{id: string; operation: 'select'|'deselect'; timestamp: number} | undefined>,
  updatingRef: React.MutableRefObject<boolean>
): boolean => {
  // Check if we're already processing an update
  if (updatingRef.current) {
    console.log(`shouldSkipUpdate: Already updating, skipping`);
    return true;
  }
  
  // Check if this is due to a very recent operation (within 50ms)
  if (lastOpRef.current && Date.now() - lastOpRef.current.timestamp < 50) {
    console.log(`shouldSkipUpdate: Recent operation detected, skipping immediate processing`);
    return true;
  }
  
  return false;
};

/**
 * Determines if we should process the issues based on changes
 */
export const shouldProcessIssues = (
  selectedIssueIds: Set<string>, 
  prevSelectedIdsRef: React.MutableRefObject<Set<string>>,
  hasMountedRef: React.MutableRefObject<boolean>,
  availableIssues: MaterialityIssue[],
  selectedIssues: MaterialityIssue[]
): boolean => {
  // Always process on first mount
  if (!hasMountedRef.current) {
    console.log(`shouldProcessIssues: First mount, processing`);
    hasMountedRef.current = true;
    return true;
  }
  
  // Check if the selected issue IDs have changed
  const prevIds = Array.from(prevSelectedIdsRef.current).sort().join(',');
  const currentIds = Array.from(selectedIssueIds).sort().join(',');
  
  if (prevIds !== currentIds) {
    console.log(`shouldProcessIssues: Selected IDs changed, processing`);
    console.log(`  - Previous: ${prevIds}`);
    console.log(`  - Current: ${currentIds}`);
    return true;
  }
  
  // Check if we need to initialize empty arrays
  if ((availableIssues.length === 0 && selectedIssues.length === 0) && selectedIssueIds.size > 0) {
    console.log(`shouldProcessIssues: Empty arrays with selected IDs, processing`);
    return true;
  }
  
  // Check for issues with mismatched material states
  const mismatchedIssues = [
    ...availableIssues.filter(issue => issue.isMaterial === true),
    ...selectedIssues.filter(issue => issue.isMaterial === false)
  ];
  
  if (mismatchedIssues.length > 0) {
    console.log(`shouldProcessIssues: Found ${mismatchedIssues.length} mismatched issues, processing`);
    return true;
  }
  
  // Special case: check for recently deselected issues that are still in the selected list
  const recentlyDeselected = selectedIssues.filter(issue => issue.isMaterial === false);
  if (recentlyDeselected.length > 0) {
    console.log(`shouldProcessIssues: Found ${recentlyDeselected.length} recently deselected issues, processing`);
    return true;
  }
  
  // Force process for any explicitly false isMaterial values to ensure they are properly removed
  const explicitlyFalseIssues = selectedIssues.filter(issue => issue.isMaterial === false);
  if (explicitlyFalseIssues.length > 0) {
    console.log(`shouldProcessIssues: Found ${explicitlyFalseIssues.length} explicitly false issues in selected, processing`);
    return true;
  }
  
  console.log(`useThemeProcessing: No changes detected, skipping processing`);
  return false;
};
