
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
  try {
    console.log(`useThemeProcessing [${tabId}]: Setting available issues:`, available.length);
    console.log(`useThemeProcessing [${tabId}]: Setting selected issues:`, selected.length);
    
    // Ensure we only include issues that are explicitly material in selected
    const filteredSelected = selected.filter(issue => {
      const shouldInclude = issue.isMaterial === true;
      if (!shouldInclude) {
        console.log(`Filtering out non-material issue from selected:`, issue.id);
      }
      return shouldInclude;
    });
    
    // Ensure deselected issues are in available
    const additionalAvailable = selected.filter(issue => issue.isMaterial === false);
    const combinedAvailable = [...available, ...additionalAvailable];
    
    // Store the latest processed issues
    latestProcessedIssuesRef.current = {
      available: combinedAvailable.map(issue => structuredClone(issue)),
      selected: filteredSelected.map(issue => structuredClone(issue))
    };
    
    // Set both states
    setAvailableIssues(combinedAvailable);
    setSelectedIssues(filteredSelected);
    
    // Update refs
    prevSelectedIdsRef.current = new Set([...selectedIssueIds]);
    hasMountedRef.current = true;
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
