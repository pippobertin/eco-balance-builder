
import { MaterialityIssue } from '../types';
import { useToast } from '@/hooks/use-toast';

interface UseIssueOperationsProps {
  onIssueSelect: (issue: MaterialityIssue) => void;
  lastOperationRef: React.MutableRefObject<{id: string; operation: 'select'|'deselect'; timestamp: number} | undefined>;
  skipNextPropsUpdateRef: React.MutableRefObject<boolean>;
  knownSelectionsRef: React.MutableRefObject<Set<string>>;
  explicitlyDeselectedRef: React.MutableRefObject<Set<string>>;
  allSeenIssuesRef: React.MutableRefObject<Map<string, MaterialityIssue>>;
  setLocalAvailable: React.Dispatch<React.SetStateAction<MaterialityIssue[]>>;
  setLocalSelected: React.Dispatch<React.SetStateAction<MaterialityIssue[]>>;
  localAvailable: MaterialityIssue[];
  toast: ReturnType<typeof useToast>['toast'];
  tabId: string;
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
  tabId
}: UseIssueOperationsProps) => {
  
  // Handle clicking on an issue
  const handleIssueClick = (issue: MaterialityIssue) => {
    try {
      console.log(`useIssueOperations [${tabId}]: Handling issue click for:`, issue.id, "current isMaterial:", issue.isMaterial);
      
      // Block operations for 300ms to prevent double clicks
      if (lastOperationRef.current && 
          lastOperationRef.current.id === issue.id && 
          Date.now() - lastOperationRef.current.timestamp < 300) {
        console.log(`useIssueOperations [${tabId}]: Ignoring rapid click on:`, issue.id);
        return;
      }
      
      // Create a deep copy to avoid reference issues
      const issueCopy = structuredClone(issue);
      const isCurrentlyMaterial = !!issueCopy.isMaterial;
      
      // Record this operation to prevent immediate reversion
      lastOperationRef.current = {
        id: issueCopy.id,
        operation: isCurrentlyMaterial ? 'deselect' : 'select',
        timestamp: Date.now()
      };
      
      // Tell parent component we're handling our own state for now
      skipNextPropsUpdateRef.current = true;
      
      if (isCurrentlyMaterial) {
        // Item was selected, now deselecting
        console.log(`useIssueOperations [${tabId}]: Removing from selected, adding to available:`, issueCopy.id);
        
        // Make sure isMaterial is explicitly false
        issueCopy.isMaterial = false;
        
        // Remove from selected list
        setLocalSelected(prev => prev.filter(item => item.id !== issueCopy.id));
        
        // Add to available list if not already there
        const alreadyInAvailable = localAvailable.some(item => item.id === issueCopy.id);
        if (!alreadyInAvailable) {
          setLocalAvailable(prev => [...prev, issueCopy]);
        }
        
        // Update tracking state
        knownSelectionsRef.current.delete(issueCopy.id);
        explicitlyDeselectedRef.current.add(issueCopy.id);
      } else {
        // Item was not selected, now selecting
        console.log(`useIssueOperations [${tabId}]: Adding to selected, removing from available:`, issueCopy.id);
        
        // Make sure isMaterial is explicitly true
        issueCopy.isMaterial = true;
        
        // Remove from available list
        setLocalAvailable(prev => prev.filter(item => item.id !== issueCopy.id));
        
        // Add to selected list if not already there
        setLocalSelected(prev => {
          const alreadyInSelected = prev.some(item => item.id === issueCopy.id);
          if (alreadyInSelected) {
            return prev.map(item => item.id === issueCopy.id ? issueCopy : item);
          }
          return [...prev, issueCopy];
        });
        
        // Update tracking state
        knownSelectionsRef.current.add(issueCopy.id);
        explicitlyDeselectedRef.current.delete(issueCopy.id);
      }
      
      // Store the complete issue data
      allSeenIssuesRef.current.set(issueCopy.id, issueCopy);
      
      // Pass to parent handler for backend sync
      onIssueSelect(issueCopy);
    } catch (error) {
      console.error(`useIssueOperations [${tabId}]: Error handling issue click:`, error);
      toast({
        title: "Errore nell'operazione",
        description: "Si è verificato un errore durante l'operazione sul tema. Riprova.",
        variant: "destructive"
      });
    }
  };
  
  return { handleIssueClick };
};
