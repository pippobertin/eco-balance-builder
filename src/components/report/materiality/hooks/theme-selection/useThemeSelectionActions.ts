
import { MaterialityIssue } from '../../types';

interface UseThemeSelectionActionsProps {
  tabId: string;
  onIssueSelect?: (issue: MaterialityIssue) => void;
  setAvailableIssues: React.Dispatch<React.SetStateAction<MaterialityIssue[]>>;
  setSelectedIssues: React.Dispatch<React.SetStateAction<MaterialityIssue[]>>;
  lastOpRef: React.MutableRefObject<{id: string; operation: 'select'|'deselect'; timestamp: number} | undefined>;
  knownMaterialIssuesRef: React.MutableRefObject<Set<string>>;
  explicitlyDeselectedRef: React.MutableRefObject<Set<string>>;
  prevSelectedIdsRef: React.MutableRefObject<Set<string>>;
  latestProcessedIssuesRef: React.MutableRefObject<{
    available: MaterialityIssue[];
    selected: MaterialityIssue[];
  }>;
}

export const useThemeSelectionActions = ({
  tabId,
  onIssueSelect,
  setAvailableIssues,
  setSelectedIssues,
  lastOpRef,
  knownMaterialIssuesRef,
  explicitlyDeselectedRef,
  prevSelectedIdsRef,
  latestProcessedIssuesRef
}: UseThemeSelectionActionsProps) => {

  // Handle the selection or deselection of an issue
  const handleIssueSelect = (issue: MaterialityIssue) => {
    console.log(`useThemeSelectionActions [${tabId}]: Handling issue selection for:`, issue.id, "isMaterial:", issue.isMaterial);
    
    // Block rapid double-clicks
    if (lastOpRef.current && 
        lastOpRef.current.id === issue.id && 
        Date.now() - lastOpRef.current.timestamp < 300) {
      console.log(`useThemeSelectionActions [${tabId}]: Ignoring rapid click on:`, issue.id);
      return;
    }
    
    // Make a deep copy of the issue to prevent reference issues
    const issueCopy = structuredClone(issue);
    
    // Get the selected state (ensure it's a boolean)
    const isSelected = issueCopy.isMaterial === true;
    
    // Record this operation to prevent processing loops
    lastOpRef.current = {
      id: issueCopy.id,
      operation: isSelected ? 'select' : 'deselect',
      timestamp: Date.now()
    };

    // Process according to selected state
    if (isSelected) {
      // This is a selection operation
      
      // Update UI immediately
      setAvailableIssues(prev => 
        prev.filter(item => item.id !== issueCopy.id)
      );
      
      setSelectedIssues(prev => {
        // Check if issue is already in selected list
        const alreadySelected = prev.some(item => item.id === issueCopy.id);
        if (alreadySelected) {
          // Update existing item
          return prev.map(item => 
            item.id === issueCopy.id ? issueCopy : item
          );
        }
        // Add to list
        return [...prev, issueCopy];
      });
      
      // Update tracking state
      knownMaterialIssuesRef.current.add(issueCopy.id);
      explicitlyDeselectedRef.current.delete(issueCopy.id);
      
      // Update the latest processed items for reference
      latestProcessedIssuesRef.current = {
        available: latestProcessedIssuesRef.current.available.filter(i => i.id !== issueCopy.id),
        selected: [
          ...latestProcessedIssuesRef.current.selected.filter(i => i.id !== issueCopy.id),
          issueCopy
        ]
      };
    } else {
      // This is a deselection operation
      
      // Update UI immediately
      setSelectedIssues(prev => 
        prev.filter(item => item.id !== issueCopy.id)
      );
      
      setAvailableIssues(prev => {
        // Check if issue is already in available list
        const alreadyAvailable = prev.some(item => item.id === issueCopy.id);
        if (alreadyAvailable) {
          // Update existing item ensuring isMaterial is false
          return prev.map(item => 
            item.id === issueCopy.id ? {...item, isMaterial: false} : item
          );
        }
        // Add to list ensuring isMaterial is false
        return [...prev, {...issueCopy, isMaterial: false}];
      });
      
      // Update tracking state
      knownMaterialIssuesRef.current.delete(issueCopy.id);
      explicitlyDeselectedRef.current.add(issueCopy.id);
      
      // Update the latest processed items for reference
      latestProcessedIssuesRef.current = {
        selected: latestProcessedIssuesRef.current.selected.filter(i => i.id !== issueCopy.id),
        available: [
          ...latestProcessedIssuesRef.current.available.filter(i => i.id !== issueCopy.id),
          {...issueCopy, isMaterial: false}
        ]
      };
    }
    
    // Pass the updated issue to the parent handler
    if (onIssueSelect) {
      // Make sure isMaterial is a proper boolean before passing to parent
      onIssueSelect({...issueCopy, isMaterial: isSelected});
    }
  };

  return { handleIssueSelect };
};
