
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
      console.log(`categorizeIssues [${tabId}]: Using recent operation for ${issue.id}, isMaterial=${isMaterial}`);
    } 
    // Second priority: explicit material flag in the issue (ensuring it's a strict boolean)
    else if (issue.isMaterial === true) {
      isMaterial = true;
      console.log(`categorizeIssues [${tabId}]: Using explicit true flag for ${issue.id}`);
    } 
    else if (issue.isMaterial === false) {
      isMaterial = false;
      console.log(`categorizeIssues [${tabId}]: Using explicit false flag for ${issue.id}`);
    }
    // Third priority: selected IDs set from parent
    else if (selectedIssueIds.has(issue.id)) {
      isMaterial = true;
      console.log(`categorizeIssues [${tabId}]: Using selectedIssueIds for ${issue.id}, isMaterial=${isMaterial}`);
    }
    // Fourth priority: known material issues tracking
    else if (knownMaterialIssuesRef.current.has(issue.id)) {
      isMaterial = true;
      console.log(`categorizeIssues [${tabId}]: Using knownMaterialIssuesRef for ${issue.id}, isMaterial=${isMaterial}`);
    }
    
    // Override if explicitly deselected (unless there's a more recent operation)
    if (!recentOp && explicitlyDeselectedRef.current.has(issue.id)) {
      isMaterial = false;
      console.log(`categorizeIssues [${tabId}]: Overriding due to explicitlyDeselectedRef for ${issue.id}, isMaterial=${isMaterial}`);
    }
    
    // Set the material flag explicitly as a boolean
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
