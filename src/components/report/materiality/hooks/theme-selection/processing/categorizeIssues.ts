
import { MaterialityIssue } from '../../../types';
import { useToast } from '@/hooks/use-toast';

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
      
      // If this issue has been explicitly deselected
      if (explicitlyDeselectedRef.current.has(issueCopy.id) || issueCopy.isMaterial === false) {
        console.log(`useThemeProcessing [${tabId}]: Issue ${issueCopy.id} is deselected, adding to available`);
        issueCopy.isMaterial = false;
        available.push(issueCopy);
        return;
      }
      
      // Handle recent operations
      if (lastOpRef.current && lastOpRef.current.id === issueCopy.id && Date.now() - lastOpRef.current.timestamp < 5000) {
        if (lastOpRef.current.operation === 'select') {
          issueCopy.isMaterial = true;
          knownMaterialIssuesRef.current.add(issueCopy.id);
          selected.push(issueCopy);
          return;
        } else if (lastOpRef.current.operation === 'deselect') {
          issueCopy.isMaterial = false;
          knownMaterialIssuesRef.current.delete(issueCopy.id);
          available.push(issueCopy);
          return;
        }
      }
      
      // Check if this issue should be selected
      if (selectedIssueIds.has(issueCopy.id) && !explicitlyDeselectedRef.current.has(issueCopy.id)) {
        console.log(`useThemeProcessing [${tabId}]: Issue is selected by ID:`, issueCopy.id);
        issueCopy.isMaterial = true;
        knownMaterialIssuesRef.current.add(issueCopy.id);
        selected.push(issueCopy);
      } else {
        console.log(`useThemeProcessing [${tabId}]: Issue is not material:`, issueCopy.id);
        issueCopy.isMaterial = false;
        available.push(issueCopy);
      }
    } catch (issueError) {
      console.error(`Error processing issue:`, issue.id, issueError);
    }
  });
  
  return { available, selected };
};
