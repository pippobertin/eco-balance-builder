
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
    
    console.log(`After filtering, selected issues count:`, filteredSelected.length);
    
    // Move deselected issues to available
    const deselectedIssues = selected.filter(issue => issue.isMaterial === false);
    
    if (deselectedIssues.length > 0) {
      console.log(`Found ${deselectedIssues.length} deselected issues to move to available`);
    }
    
    // Ensure deselected issues are in available with isMaterial explicitly set to false
    const additionalAvailable = deselectedIssues.map(issue => ({
      ...issue,
      isMaterial: false // Ensure it's a boolean false
    }));
    
    // Filter available to remove duplicates (preferring the ones with explicitly set isMaterial)
    const seenIds = new Set<string>();
    const uniqueAvailable = available.filter(issue => {
      if (seenIds.has(issue.id)) {
        return false;
      }
      seenIds.add(issue.id);
      return true;
    });
    
    // Add the deselected issues to available (they already have isMaterial set to false)
    additionalAvailable.forEach(issue => {
      if (!seenIds.has(issue.id)) {
        uniqueAvailable.push(issue);
        seenIds.add(issue.id);
      }
    });
    
    // Store the latest processed issues
    latestProcessedIssuesRef.current = {
      available: uniqueAvailable.map(issue => structuredClone(issue)),
      selected: filteredSelected.map(issue => structuredClone(issue))
    };
    
    // Set both states
    setAvailableIssues(uniqueAvailable);
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
