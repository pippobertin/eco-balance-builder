
import { MaterialityIssue } from '../../types';
import { useToast } from '@/hooks/use-toast';

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

/**
 * Hook for theme selection actions
 */
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
  const { toast } = useToast();
  
  /**
   * Handle issue selection
   */
  const handleIssueSelect = (issue: MaterialityIssue) => {
    try {
      // Create a deep copy to prevent reference issues
      const issueCopy = structuredClone(issue);
      const isCurrentlyMaterial = !!issue.isMaterial;
      
      console.log(`useThemeSelectionActions [${tabId}]: Handling issue select for:`, issue.id, "current isMaterial:", isCurrentlyMaterial);
      
      // Record the operation
      lastOpRef.current = {
        id: issue.id,
        operation: isCurrentlyMaterial ? 'deselect' : 'select',
        timestamp: Date.now()
      };
      
      // Updated issue with toggled material state
      const updatedIssue = {
        ...issueCopy,
        isMaterial: !isCurrentlyMaterial
      };
      
      // Apply the change immediately in the UI
      updateLocalState(
        updatedIssue, 
        isCurrentlyMaterial,
        setAvailableIssues,
        setSelectedIssues,
        latestProcessedIssuesRef,
        knownMaterialIssuesRef,
        explicitlyDeselectedRef,
        prevSelectedIdsRef
      );
      
      // Pass the update to the parent handler for backend synchronization
      if (onIssueSelect) {
        console.log(`useThemeSelectionActions [${tabId}]: Calling parent onIssueSelect for:`, updatedIssue.id, "new isMaterial:", updatedIssue.isMaterial);
        onIssueSelect(updatedIssue);
      }
    } catch (error) {
      console.error(`useThemeSelectionActions [${tabId}]: Error selecting issue:`, error);
      toast({
        title: "Errore nella selezione",
        description: "Si è verificato un errore durante la selezione del tema. Riprova.",
        variant: "destructive"
      });
    }
  };
  
  /**
   * Update local state based on issue selection
   */
  const updateLocalState = (
    updatedIssue: MaterialityIssue,
    isCurrentlyMaterial: boolean,
    setAvailableIssues: React.Dispatch<React.SetStateAction<MaterialityIssue[]>>,
    setSelectedIssues: React.Dispatch<React.SetStateAction<MaterialityIssue[]>>,
    latestProcessedIssuesRef: React.MutableRefObject<{
      available: MaterialityIssue[];
      selected: MaterialityIssue[];
    }>,
    knownMaterialIssuesRef: React.MutableRefObject<Set<string>>,
    explicitlyDeselectedRef: React.MutableRefObject<Set<string>>,
    prevSelectedIdsRef: React.MutableRefObject<Set<string>>
  ) => {
    if (isCurrentlyMaterial) {
      // Issue was material, now it's not - remove from selected, add to available
      setSelectedIssues(prev => prev.filter(item => item.id !== updatedIssue.id));
      
      // Update prevSelectedIdsRef to reflect this change immediately
      prevSelectedIdsRef.current.delete(updatedIssue.id);
      
      // Add to available without duplicating
      setAvailableIssues(prev => {
        // Check if the issue is already in the available list
        const exists = prev.some(item => item.id === updatedIssue.id);
        
        if (exists) {
          // Just update the existing issue
          return prev.map(item => 
            item.id === updatedIssue.id ? updatedIssue : item
          );
        } else {
          // Add the issue to the list
          return [...prev, updatedIssue];
        }
      });
      
      // Update tracking state
      knownMaterialIssuesRef.current.delete(updatedIssue.id);
      explicitlyDeselectedRef.current.add(updatedIssue.id);
      
      // Update the latest processed issues ref to reflect this change
      latestProcessedIssuesRef.current = {
        available: [...latestProcessedIssuesRef.current.available.filter(i => i.id !== updatedIssue.id), updatedIssue],
        selected: latestProcessedIssuesRef.current.selected.filter(i => i.id !== updatedIssue.id)
      };
      
      console.log(`updateLocalState [${updatedIssue.id}]: Moved from selected to available`);
    } else {
      // Issue was not material, now it is - remove from available, add to selected
      setAvailableIssues(prev => prev.filter(item => item.id !== updatedIssue.id));
      
      // Update prevSelectedIdsRef to reflect this change immediately
      prevSelectedIdsRef.current.add(updatedIssue.id);
      
      // Add to selected without duplicating
      setSelectedIssues(prev => {
        // Check if the issue is already in the selected list
        const exists = prev.some(item => item.id === updatedIssue.id);
        
        if (exists) {
          // Just update the existing issue
          return prev.map(item => 
            item.id === updatedIssue.id ? updatedIssue : item
          );
        } else {
          // Add the issue to the list
          return [...prev, updatedIssue];
        }
      });
      
      // Update tracking state
      knownMaterialIssuesRef.current.add(updatedIssue.id);
      explicitlyDeselectedRef.current.delete(updatedIssue.id);
      
      // Update the latest processed issues ref to reflect this change
      latestProcessedIssuesRef.current = {
        available: latestProcessedIssuesRef.current.available.filter(i => i.id !== updatedIssue.id),
        selected: [...latestProcessedIssuesRef.current.selected.filter(i => i.id !== updatedIssue.id), updatedIssue]
      };
      
      console.log(`updateLocalState [${updatedIssue.id}]: Moved from available to selected`);
    }
  };
  
  return { handleIssueSelect };
};
