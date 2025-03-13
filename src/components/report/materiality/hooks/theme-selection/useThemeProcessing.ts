
import { useEffect } from 'react';
import { MaterialityIssue } from '../../types';

interface UseThemeProcessingProps {
  issues: MaterialityIssue[];
  selectedIssueIds: Set<string>;
  tabId: string;
  availableIssues: MaterialityIssue[];
  selectedIssues: MaterialityIssue[];
  setAvailableIssues: React.Dispatch<React.SetStateAction<MaterialityIssue[]>>;
  setSelectedIssues: React.Dispatch<React.SetStateAction<MaterialityIssue[]>>;
  prevSelectedIdsRef: React.MutableRefObject<Set<string>>;
  knownMaterialIssuesRef: React.MutableRefObject<Set<string>>;
  explicitlyDeselectedRef: React.MutableRefObject<Set<string>>;
  lastOpRef: React.MutableRefObject<{id: string; operation: 'select'|'deselect'; timestamp: number} | undefined>;
  updatingRef: React.MutableRefObject<boolean>;
  hasMountedRef: React.MutableRefObject<boolean>;
  latestProcessedIssuesRef: React.MutableRefObject<{
    available: MaterialityIssue[];
    selected: MaterialityIssue[];
  }>;
}

/**
 * Hook for processing issues into available and selected categories
 */
export const useThemeProcessing = ({
  issues,
  selectedIssueIds,
  tabId,
  availableIssues,
  selectedIssues,
  setAvailableIssues,
  setSelectedIssues,
  prevSelectedIdsRef,
  knownMaterialIssuesRef,
  explicitlyDeselectedRef,
  lastOpRef,
  updatingRef,
  hasMountedRef,
  latestProcessedIssuesRef
}: UseThemeProcessingProps) => {
  
  // Process issues into available and selected categories
  useEffect(() => {
    // Skip processing if a recent operation is in progress
    if (lastOpRef.current && Date.now() - lastOpRef.current.timestamp < 5000) {
      console.log(`useThemeProcessing [${tabId}]: Skipping update due to recent operation for: ${lastOpRef.current.id}`);
      return;
    }
    
    // Prevent concurrent updates while one is in progress
    if (updatingRef.current) {
      console.log(`useThemeProcessing [${tabId}]: Skipping update due to another update in progress`);
      return;
    }
    
    // Log for debugging
    console.log(`useThemeProcessing [${tabId}]: Effect running, issues length=${issues.length}, selectedIds=${Array.from(selectedIssueIds).join(',')}`);
    
    // Check if selectedIssueIds has changed
    const selectedIdsArray = Array.from(selectedIssueIds);
    const prevSelectedIdsArray = Array.from(prevSelectedIdsRef.current);
    
    const idsChanged = 
      selectedIdsArray.length !== prevSelectedIdsArray.length ||
      selectedIdsArray.some(id => !prevSelectedIdsRef.current.has(id)) ||
      prevSelectedIdsArray.some(id => !selectedIssueIds.has(id));
    
    // Only process issues if the selection has changed or it's the initial load
    if (idsChanged || !hasMountedRef.current || availableIssues.length === 0 || selectedIssues.length === 0) {
      updatingRef.current = true;
      
      const available: MaterialityIssue[] = [];
      const selected: MaterialityIssue[] = [];
      
      // Process issues for this specific tab
      issues.forEach(issue => {
        // Create a deep copy of the issue to prevent reference issues
        const issueCopy = structuredClone(issue);
        
        // If a recent operation was performed on this issue, preserve that state
        if (lastOpRef.current && lastOpRef.current.id === issueCopy.id && Date.now() - lastOpRef.current.timestamp < 5000) {
          if (lastOpRef.current.operation === 'select') {
            issueCopy.isMaterial = true;
            knownMaterialIssuesRef.current.add(issueCopy.id);
            selected.push(issueCopy);
            return;
          } else if (lastOpRef.current.operation === 'deselect') {
            issueCopy.isMaterial = false;
            knownMaterialIssuesRef.current.delete(issueCopy.id);
            explicitlyDeselectedRef.current.add(issueCopy.id);
            available.push(issueCopy);
            return;
          }
        }
        
        // Check if this issue has been explicitly deselected
        if (explicitlyDeselectedRef.current.has(issueCopy.id)) {
          console.log(`useThemeProcessing [${tabId}]: Issue was explicitly deselected:`, issueCopy.id);
          issueCopy.isMaterial = false;
          available.push(issueCopy);
          return;
        }
        
        // Check if this issue is in the selectedIssueIds set
        if (selectedIssueIds.has(issueCopy.id) || knownMaterialIssuesRef.current.has(issueCopy.id)) {
          console.log(`useThemeProcessing [${tabId}]: Issue is selected by ID:`, issueCopy.id);
          // Ensure isMaterial is explicitly true (BOOLEAN)
          issueCopy.isMaterial = true;
          knownMaterialIssuesRef.current.add(issueCopy.id);
          selected.push(issueCopy);
        } else {
          console.log(`useThemeProcessing [${tabId}]: Issue is not material:`, issueCopy.id);
          // Ensure isMaterial is explicitly false for available issues (BOOLEAN)
          issueCopy.isMaterial = false;
          available.push(issueCopy);
        }
      });
      
      console.log(`useThemeProcessing [${tabId}]: Setting available issues:`, available.length);
      console.log(`useThemeProcessing [${tabId}]: Setting selected issues:`, selected.length);
      
      // Store the latest processed issues
      latestProcessedIssuesRef.current = {
        available: available.map(issue => structuredClone(issue)),
        selected: selected.map(issue => structuredClone(issue))
      };
      
      // Set both states in a batch to prevent partial updates
      setAvailableIssues(available);
      setSelectedIssues(selected);
      
      // Update the previous selected IDs ref
      prevSelectedIdsRef.current = new Set([...selectedIssueIds]);
      hasMountedRef.current = true;
      
      // Reset updating flag after a delay
      setTimeout(() => {
        updatingRef.current = false;
      }, 3000);
    }
  }, [
    issues, 
    selectedIssueIds, 
    tabId, 
    availableIssues.length, 
    selectedIssues.length, 
    setAvailableIssues, 
    setSelectedIssues
  ]);
};
