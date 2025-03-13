
/**
 * Determines if the update should be skipped based on recent operations
 */
export const shouldSkipUpdate = (
  lastOpRef: React.MutableRefObject<{id: string; operation: 'select'|'deselect'; timestamp: number} | undefined>,
  updatingRef: React.MutableRefObject<boolean>
): boolean => {
  // Skip processing if a recent operation is in progress
  if (lastOpRef.current && Date.now() - lastOpRef.current.timestamp < 5000) {
    console.log(`useThemeProcessing: Skipping update due to recent operation for: ${lastOpRef.current.id}`);
    return true;
  }
  
  // Prevent concurrent updates while one is in progress
  if (updatingRef.current) {
    console.log(`useThemeProcessing: Skipping update due to another update in progress`);
    return true;
  }
  
  return false;
};

/**
 * Determines if issues should be processed based on selection changes or initialization
 */
export const shouldProcessIssues = (
  selectedIssueIds: Set<string>,
  prevSelectedIdsRef: React.MutableRefObject<Set<string>>,
  hasMountedRef: React.MutableRefObject<boolean>,
  availableIssues: any[],
  selectedIssues: any[]
): boolean => {
  // Check if selectedIssueIds has changed
  const selectedIdsArray = Array.from(selectedIssueIds);
  const prevSelectedIdsArray = Array.from(prevSelectedIdsRef.current);
  
  const idsChanged = 
    selectedIdsArray.length !== prevSelectedIdsArray.length ||
    selectedIdsArray.some(id => !prevSelectedIdsRef.current.has(id)) ||
    prevSelectedIdsArray.some(id => !selectedIssueIds.has(id));
  
  // Only process issues if the selection has changed or it's the initial load
  return idsChanged || !hasMountedRef.current || availableIssues.length === 0 || selectedIssues.length === 0;
};
