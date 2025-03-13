
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
 * Hook for handling issue selection/deselection actions
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
  
  // Function to handle issue selection or deselection
  const handleIssueSelect = (issue: MaterialityIssue) => {
    try {
      if (!onIssueSelect) return;
      
      // Create a deep copy to prevent reference issues
      const issueToUpdate = structuredClone(issue);
      
      console.log(`useThemeSelectionActions [${tabId}] handling issue select:`, issueToUpdate.id, "isMaterial:", issueToUpdate.isMaterial);
      
      // Determine if we're selecting or deselecting
      const isSelecting = issueToUpdate.isMaterial === true;
      
      // Record the operation to prevent immediate reversion
      lastOpRef.current = {
        id: issueToUpdate.id,
        operation: isSelecting ? 'select' : 'deselect',
        timestamp: Date.now()
      };
      
      try {
        // Update knownMaterialIssues and explicitlyDeselected refs
        if (isSelecting) {
          knownMaterialIssuesRef.current.add(issueToUpdate.id);
          explicitlyDeselectedRef.current.delete(issueToUpdate.id);
        } else {
          knownMaterialIssuesRef.current.delete(issueToUpdate.id);
          explicitlyDeselectedRef.current.add(issueToUpdate.id);
        }
        
        // First update local state for immediate UI feedback
        if (isSelecting) {
          // Issue is being selected (moved to selected panel)
          console.log(`useThemeSelectionActions [${tabId}]: Moving issue to selected panel:`, issueToUpdate.id);
          
          setAvailableIssues(prev => prev.filter(i => i.id !== issueToUpdate.id));
          setSelectedIssues(prev => [...prev, issueToUpdate]);
          
          // Update the prevSelectedIdsRef to include this issue
          const newSelectedIds = new Set(prevSelectedIdsRef.current);
          newSelectedIds.add(issueToUpdate.id);
          prevSelectedIdsRef.current = newSelectedIds;
        } else {
          // Issue is being deselected (moved to available panel)
          console.log(`useThemeSelectionActions [${tabId}]: Moving issue to available panel:`, issueToUpdate.id);
          
          setSelectedIssues(prev => prev.filter(i => i.id !== issueToUpdate.id));
          
          // Always add back to available issues when deselected
          const wasInThisTab = latestProcessedIssuesRef.current.available.some(i => i.id === issueToUpdate.id) ||
                              latestProcessedIssuesRef.current.selected.some(i => i.id === issueToUpdate.id);
          
          if (wasInThisTab) {
            const availableIssueExists = latestProcessedIssuesRef.current.available.some(i => i.id === issueToUpdate.id);
            if (!availableIssueExists) {
              setAvailableIssues(prev => [...prev, issueToUpdate]);
            }
          } else {
            console.log(`Issue ${issueToUpdate.id} was not originally in this tab, not adding to available`);
          }
          
          // Update the prevSelectedIdsRef to remove this issue
          const newSelectedIds = new Set(prevSelectedIdsRef.current);
          newSelectedIds.delete(issueToUpdate.id);
          prevSelectedIdsRef.current = newSelectedIds;
        }
      } catch (stateError) {
        console.error(`Error updating state references for issue ${issueToUpdate.id}:`, stateError);
        toast({
          title: "Errore nell'aggiornamento",
          description: "Si è verificato un errore durante l'aggiornamento dello stato. Riprova.",
          variant: "destructive"
        });
      }
      
      // Ensure isMaterial is a boolean before sending to parent
      if (typeof issueToUpdate.isMaterial !== 'boolean') {
        issueToUpdate.isMaterial = Boolean(issueToUpdate.isMaterial);
      }
      
      // Delay parent update to ensure UI reflects our changes first
      setTimeout(() => {
        try {
          console.log(`useThemeSelectionActions [${tabId}]: Passing issue to parent handler:`, issueToUpdate.id, "isMaterial:", issueToUpdate.isMaterial);
          onIssueSelect(issueToUpdate);
        } catch (callbackError) {
          console.error(`Error in parent callback for issue ${issueToUpdate.id}:`, callbackError);
          toast({
            title: "Errore nella selezione",
            description: "Si è verificato un errore durante la selezione del tema. Riprova.",
            variant: "destructive"
          });
          
          // Attempt to revert UI state to maintain consistency
          if (isSelecting) {
            setSelectedIssues(prev => prev.filter(i => i.id !== issueToUpdate.id));
            setAvailableIssues(prev => [...prev, {...issueToUpdate, isMaterial: false}]);
          } else {
            setAvailableIssues(prev => prev.filter(i => i.id !== issueToUpdate.id));
            setSelectedIssues(prev => [...prev, {...issueToUpdate, isMaterial: true}]);
          }
        }
      }, 100);
    } catch (error) {
      console.error(`useThemeSelectionActions [${tabId}]: General error in handleIssueSelect:`, error);
      toast({
        title: "Errore nella gestione",
        description: "Si è verificato un errore durante la gestione del tema. Ricarica la pagina.",
        variant: "destructive"
      });
    }
  };

  return {
    handleIssueSelect
  };
};
