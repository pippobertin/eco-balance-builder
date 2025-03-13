
import { MaterialityIssue } from '../../../types';
import { useToast } from '@/hooks/use-toast';
import { updateIssuesState } from './updateIssuesState';

/**
 * Process issues into available and selected categories
 */
export const processIssues = ({
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
export const categorizeIssues = ({
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
export const handleRecentOperation = (
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
