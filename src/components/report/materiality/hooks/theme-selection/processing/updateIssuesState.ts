
import { MaterialityIssue } from '../../../types';
import { useToast } from '@/hooks/use-toast';

/**
 * Update the issues state with the newly categorized issues
 */
export const updateIssuesState = ({
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
