
import { MaterialityIssue } from '../../../types';

interface CategorizeIssuesParams {
  issues: MaterialityIssue[];
  selectedIssueIds: Set<string>;
  tabId: string;
  knownMaterialIssuesRef: React.MutableRefObject<Set<string>>;
  explicitlyDeselectedRef: React.MutableRefObject<Set<string>>;
  lastOpRef: React.MutableRefObject<{id: string; operation: 'select'|'deselect'; timestamp: number} | undefined>;
}

interface CategorizedIssues {
  available: MaterialityIssue[];
  selected: MaterialityIssue[];
}

export const categorizeIssues = ({
  issues,
  selectedIssueIds,
  tabId,
  knownMaterialIssuesRef,
  explicitlyDeselectedRef,
  lastOpRef
}: CategorizeIssuesParams): CategorizedIssues => {
  console.log(`categorizeIssues [${tabId}]: Processing ${issues.length} issues, ${selectedIssueIds.size} selected`);
  
  const available: MaterialityIssue[] = [];
  const selected: MaterialityIssue[] = [];
  
  // Process each issue
  issues.forEach(issue => {
    // Make a copy to avoid reference issues
    const issueCopy = { ...issue };
    
    // Check if there's a recent operation on this issue to respect
    const recentOp = lastOpRef.current && lastOpRef.current.id === issue.id;
    
    // Determine the most accurate material status
    let isMaterial = false;
    
    // First priority: recent user operation
    if (recentOp) {
      isMaterial = lastOpRef.current!.operation === 'select';
    } 
    // Second priority: explicit material flag in the issue
    else if (typeof issue.isMaterial === 'boolean') {
      isMaterial = issue.isMaterial;
    } 
    // Third priority: selected IDs set from parent
    else if (selectedIssueIds.has(issue.id)) {
      isMaterial = true;
    }
    // Fourth priority: known material issues tracking
    else if (knownMaterialIssuesRef.current.has(issue.id)) {
      isMaterial = true;
    }
    
    // Override if explicitly deselected (unless there's a more recent operation)
    if (!recentOp && explicitlyDeselectedRef.current.has(issue.id)) {
      isMaterial = false;
    }
    
    // Set the material flag explicitly
    issueCopy.isMaterial = isMaterial;
    
    // Add to the appropriate category
    if (isMaterial) {
      selected.push(issueCopy);
    } else {
      available.push(issueCopy);
    }
  });
  
  console.log(`categorizeIssues [${tabId}]: Categorized ${available.length} available, ${selected.length} selected`);
  
  return { available, selected };
};
