
import { useCallback } from 'react';
import { MaterialityIssue } from '../types';
import { isHeaderTheme } from '../utils/materialityUtils';

interface UseIssueOperationsProps {
  onIssueSelect: (issue: MaterialityIssue) => void;
  lastOperationRef: React.MutableRefObject<{id: string, action: 'select' | 'deselect', timestamp: number} | null>;
  skipNextPropsUpdateRef: React.MutableRefObject<boolean>;
  knownSelectionsRef: React.MutableRefObject<Set<string>>;
  explicitlyDeselectedRef: React.MutableRefObject<Set<string>>;
  allSeenIssuesRef: React.MutableRefObject<Map<string, MaterialityIssue>>;
  setLocalAvailable: React.Dispatch<React.SetStateAction<MaterialityIssue[]>>;
  setLocalSelected: React.Dispatch<React.SetStateAction<MaterialityIssue[]>>;
  localAvailable: MaterialityIssue[];
  toast: any;
  tabId?: string;
}

export const useIssueOperations = ({
  onIssueSelect,
  lastOperationRef,
  skipNextPropsUpdateRef,
  knownSelectionsRef,
  explicitlyDeselectedRef,
  allSeenIssuesRef,
  setLocalAvailable,
  setLocalSelected,
  localAvailable,
  toast,
  tabId = ''
}: UseIssueOperationsProps) => {

  // Handle issue selection or deselection via click
  const handleIssueClick = useCallback((issue: MaterialityIssue) => {
    // Prevent actions on header themes
    if (isHeaderTheme(issue.id, issue.name)) {
      toast({
        title: "Azione non consentita",
        description: `"${issue.name}" è una categoria principale e non può essere selezionata. Si prega di selezionare solo i temi specifici all'interno delle categorie.`,
        variant: "destructive"
      });
      return;
    }

    console.log(`useIssueOperations [${tabId}]: Clicking issue`, issue.id, "current isMaterial:", issue.isMaterial);
    
    // Create a deep copy of the issue to prevent reference issues
    const issueCopy = structuredClone(issue);
    
    // Always add to allSeenIssues map
    allSeenIssuesRef.current.set(issueCopy.id, issueCopy);
    
    // Set skipNextPropsUpdate to true to prevent the next useEffect from running
    skipNextPropsUpdateRef.current = true;
    
    // Determine if we're selecting or deselecting
    const isSelecting = !issueCopy.isMaterial;
    
    // Record the operation
    lastOperationRef.current = {
      id: issueCopy.id,
      action: isSelecting ? 'select' : 'deselect', 
      timestamp: Date.now()
    };
    
    // Update tracking sets
    if (isSelecting) {
      knownSelectionsRef.current.add(issueCopy.id);
      explicitlyDeselectedRef.current.delete(issueCopy.id);
    } else {
      knownSelectionsRef.current.delete(issueCopy.id);
      explicitlyDeselectedRef.current.add(issueCopy.id);
    }
    
    // First, update local state for immediate UI feedback
    if (isSelecting) {
      // Moving from available to selected
      issueCopy.isMaterial = true; // Toggle before updating UI
      
      setLocalAvailable(prev => prev.filter(i => i.id !== issueCopy.id));
      setLocalSelected(prev => [...prev, issueCopy]);
    } else {
      // Moving from selected to available
      issueCopy.isMaterial = false; // Toggle before updating UI
      
      setLocalSelected(prev => prev.filter(i => i.id !== issueCopy.id));
      
      // Check if it's already in available to avoid duplicates
      const alreadyInAvailable = localAvailable.some(i => i.id === issueCopy.id);
      
      if (!alreadyInAvailable) {
        setLocalAvailable(prev => [...prev, issueCopy]);
      }
    }
    
    // Make sure issueCopy.isMaterial is a boolean
    issueCopy.isMaterial = isSelecting;
    
    // Send the updated issue to the parent component after a small delay
    // This ensures our local UI updates first
    setTimeout(() => {
      console.log(`useIssueOperations [${tabId}]: Sending issue to parent with isMaterial:`, issueCopy.isMaterial);
      onIssueSelect(issueCopy);
    }, 50);
  }, [
    onIssueSelect,
    lastOperationRef,
    skipNextPropsUpdateRef,
    knownSelectionsRef,
    explicitlyDeselectedRef,
    allSeenIssuesRef,
    setLocalAvailable,
    setLocalSelected,
    localAvailable,
    toast,
    tabId
  ]);

  return { handleIssueClick };
};
