
import { useEffect } from 'react';
import { MaterialityIssue } from '../../types';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  
  // Process issues into available and selected categories
  useEffect(() => {
    try {
      if (shouldSkipUpdate(lastOpRef, updatingRef)) {
        return;
      }
      
      // Log for debugging
      console.log(`useThemeProcessing [${tabId}]: Effect running, issues length=${issues.length}, selectedIds=${Array.from(selectedIssueIds).join(',')}`);
      
      if (shouldProcessIssues(selectedIssueIds, prevSelectedIdsRef, hasMountedRef, availableIssues, selectedIssues)) {
        processIssues({
          issues,
          selectedIssueIds,
          tabId,
          updatingRef,
          knownMaterialIssuesRef,
          explicitlyDeselectedRef,
          lastOpRef,
          latestProcessedIssuesRef,
          setAvailableIssues,
          setSelectedIssues,
          prevSelectedIdsRef,
          hasMountedRef,
          toast
        });
      }
    } catch (error) {
      handleProcessingError(error, tabId, updatingRef, toast);
    }
  }, [
    issues, 
    selectedIssueIds, 
    tabId, 
    availableIssues.length, 
    selectedIssues.length, 
    setAvailableIssues, 
    setSelectedIssues,
    toast
  ]);
};

/**
 * Determines if the update should be skipped based on recent operations
 */
const shouldSkipUpdate = (
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
const shouldProcessIssues = (
  selectedIssueIds: Set<string>,
  prevSelectedIdsRef: React.MutableRefObject<Set<string>>,
  hasMountedRef: React.MutableRefObject<boolean>,
  availableIssues: MaterialityIssue[],
  selectedIssues: MaterialityIssue[]
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

/**
 * Process issues into available and selected categories
 */
const processIssues = ({
  issues,
  selectedIssueIds,
  tabId,
  updatingRef,
  knownMaterialIssuesRef,
  explicitlyDeselectedRef,
  lastOpRef,
  latestProcessedIssuesRef,
  setAvailableIssues,
  setSelectedIssues,
  prevSelectedIdsRef,
  hasMountedRef,
  toast
}: {
  issues: MaterialityIssue[];
  selectedIssueIds: Set<string>;
  tabId: string;
  updatingRef: React.MutableRefObject<boolean>;
  knownMaterialIssuesRef: React.MutableRefObject<Set<string>>;
  explicitlyDeselectedRef: React.MutableRefObject<Set<string>>;
  lastOpRef: React.MutableRefObject<{id: string; operation: 'select'|'deselect'; timestamp: number} | undefined>;
  latestProcessedIssuesRef: React.MutableRefObject<{
    available: MaterialityIssue[];
    selected: MaterialityIssue[];
  }>;
  setAvailableIssues: React.Dispatch<React.SetStateAction<MaterialityIssue[]>>;
  setSelectedIssues: React.Dispatch<React.SetStateAction<MaterialityIssue[]>>;
  prevSelectedIdsRef: React.MutableRefObject<Set<string>>;
  hasMountedRef: React.MutableRefObject<boolean>;
  toast: ReturnType<typeof useToast>['toast'];
}) => {
  updatingRef.current = true;
  
  const { available, selected } = categorizeIssues({
    issues,
    selectedIssueIds,
    tabId,
    knownMaterialIssuesRef,
    explicitlyDeselectedRef,
    lastOpRef
  });
  
  updateIssuesState({
    available,
    selected,
    tabId,
    latestProcessedIssuesRef,
    setAvailableIssues,
    setSelectedIssues,
    prevSelectedIdsRef,
    selectedIssueIds,
    hasMountedRef,
    updatingRef,
    toast
  });
};

/**
 * Categorize issues into available and selected arrays
 */
const categorizeIssues = ({
  issues,
  selectedIssueIds,
  tabId,
  knownMaterialIssuesRef,
  explicitlyDeselectedRef,
  lastOpRef
}: {
  issues: MaterialityIssue[];
  selectedIssueIds: Set<string>;
  tabId: string;
  knownMaterialIssuesRef: React.MutableRefObject<Set<string>>;
  explicitlyDeselectedRef: React.MutableRefObject<Set<string>>;
  lastOpRef: React.MutableRefObject<{id: string; operation: 'select'|'deselect'; timestamp: number} | undefined>;
}) => {
  const available: MaterialityIssue[] = [];
  const selected: MaterialityIssue[] = [];
  
  // Process issues for this specific tab
  issues.forEach(issue => {
    try {
      // Create a deep copy of the issue to prevent reference issues
      const issueCopy = structuredClone(issue);
      
      // Handle issue based on recent operations or selection state
      if (handleRecentOperation(issueCopy, lastOpRef, knownMaterialIssuesRef, explicitlyDeselectedRef, selected, available)) {
        return;
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
    } catch (issueError) {
      console.error(`Error processing issue:`, issue.id, issueError);
      // Continue with next issue rather than breaking the whole process
    }
  });
  
  return { available, selected };
};

/**
 * Handle an issue based on recent operations
 */
const handleRecentOperation = (
  issueCopy: MaterialityIssue,
  lastOpRef: React.MutableRefObject<{id: string; operation: 'select'|'deselect'; timestamp: number} | undefined>,
  knownMaterialIssuesRef: React.MutableRefObject<Set<string>>,
  explicitlyDeselectedRef: React.MutableRefObject<Set<string>>,
  selected: MaterialityIssue[],
  available: MaterialityIssue[]
): boolean => {
  // If a recent operation was performed on this issue, preserve that state
  if (lastOpRef.current && lastOpRef.current.id === issueCopy.id && Date.now() - lastOpRef.current.timestamp < 5000) {
    if (lastOpRef.current.operation === 'select') {
      issueCopy.isMaterial = true;
      knownMaterialIssuesRef.current.add(issueCopy.id);
      selected.push(issueCopy);
      return true;
    } else if (lastOpRef.current.operation === 'deselect') {
      issueCopy.isMaterial = false;
      knownMaterialIssuesRef.current.delete(issueCopy.id);
      explicitlyDeselectedRef.current.add(issueCopy.id);
      available.push(issueCopy);
      return true;
    }
  }
  
  return false;
};

/**
 * Update the issues state with the newly categorized issues
 */
const updateIssuesState = ({
  available,
  selected,
  tabId,
  latestProcessedIssuesRef,
  setAvailableIssues,
  setSelectedIssues,
  prevSelectedIdsRef,
  selectedIssueIds,
  hasMountedRef,
  updatingRef,
  toast
}: {
  available: MaterialityIssue[];
  selected: MaterialityIssue[];
  tabId: string;
  latestProcessedIssuesRef: React.MutableRefObject<{
    available: MaterialityIssue[];
    selected: MaterialityIssue[];
  }>;
  setAvailableIssues: React.Dispatch<React.SetStateAction<MaterialityIssue[]>>;
  setSelectedIssues: React.Dispatch<React.SetStateAction<MaterialityIssue[]>>;
  prevSelectedIdsRef: React.MutableRefObject<Set<string>>;
  selectedIssueIds: Set<string>;
  hasMountedRef: React.MutableRefObject<boolean>;
  updatingRef: React.MutableRefObject<boolean>;
  toast: ReturnType<typeof useToast>['toast'];
}) => {
  console.log(`useThemeProcessing [${tabId}]: Setting available issues:`, available.length);
  console.log(`useThemeProcessing [${tabId}]: Setting selected issues:`, selected.length);
  
  try {
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
  } catch (stateError) {
    console.error(`Error updating state:`, stateError);
    toast({
      title: "Errore nell'aggiornamento",
      description: "Si è verificato un errore durante l'aggiornamento dei temi. Ricarica la pagina.",
      variant: "destructive"
    });
  }
  
  // Reset updating flag after a delay
  setTimeout(() => {
    updatingRef.current = false;
  }, 3000);
};

/**
 * Handle errors that occur during issue processing
 */
const handleProcessingError = (
  error: unknown,
  tabId: string, 
  updatingRef: React.MutableRefObject<boolean>,
  toast: ReturnType<typeof useToast>['toast']
) => {
  console.error(`useThemeProcessing [${tabId}]: Error in theme processing:`, error);
  updatingRef.current = false;
  toast({
    title: "Errore nell'elaborazione",
    description: "Si è verificato un errore durante l'elaborazione dei temi. Riprova o ricarica la pagina.",
    variant: "destructive"
  });
};
