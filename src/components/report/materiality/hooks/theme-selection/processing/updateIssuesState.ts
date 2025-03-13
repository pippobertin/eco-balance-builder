
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
    // Filter out any issues with isMaterial explicitly set to false from the selected list
    const filteredSelected = selected.filter(issue => issue.isMaterial !== false);
    
    // Store the latest processed issues
    latestProcessedIssuesRef.current = {
      available: available.map(issue => structuredClone(issue)),
      selected: filteredSelected.map(issue => structuredClone(issue))
    };
    
    // Set both states in a batch to prevent partial updates
    setAvailableIssues(available);
    setSelectedIssues(filteredSelected);
    
    // Update the previous selected IDs ref
    prevSelectedIdsRef.current = new Set([...selectedIssueIds]);
    hasMountedRef.current = true;
    
    // Reset updating flag immediately instead of using a timeout
    updatingRef.current = false;
  } catch (stateError) {
    console.error(`Error updating state:`, stateError);
    toast({
      title: "Errore nell'aggiornamento",
      description: "Si è verificato un errore durante l'aggiornamento dei temi. Ricarica la pagina.",
      variant: "destructive"
    });
    updatingRef.current = false;
  }
};
