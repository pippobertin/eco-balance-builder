
import { useToast } from '@/hooks/use-toast';
import { MaterialityIssue } from '../types';
import { 
  useThemeSelectionState, 
  useThemeProcessing, 
  useThemeSelectionActions 
} from './theme-selection';

interface UseThemeSelectionProps {
  issues: MaterialityIssue[];
  selectedIssueIds: Set<string>;
  onIssueSelect?: (issue: MaterialityIssue) => void;
  tabId: string;
}

export const useThemeSelection = ({
  issues,
  selectedIssueIds,
  onIssueSelect,
  tabId
}: UseThemeSelectionProps) => {
  const { toast } = useToast();

  try {
    // Use the state management hook
    const {
      availableIssues,
      setAvailableIssues,
      selectedIssues,
      setSelectedIssues,
      prevSelectedIdsRef,
      knownMaterialIssuesRef,
      explicitlyDeselectedRef,
      lastOpRef,
      updatingRef,
      hasMountedRef,
      latestProcessedIssuesRef
    } = useThemeSelectionState(tabId);
    
    // Use the issue processing hook
    useThemeProcessing({
      issues,
      selectedIssueIds,
      tabId,
      availableIssues,
      selectedIssues,
      setAvailableIssues,
      setSelectedIssues,
      prevSelectedIdsRef,
      knownMaterialIssuesRef,
      explicitlyDeselectedRef,
      lastOpRef,
      updatingRef,
      hasMountedRef,
      latestProcessedIssuesRef
    });
    
    // Use the actions hook
    const { handleIssueSelect } = useThemeSelectionActions({
      tabId,
      onIssueSelect,
      setAvailableIssues,
      setSelectedIssues,
      lastOpRef,
      knownMaterialIssuesRef,
      explicitlyDeselectedRef,
      prevSelectedIdsRef,
      latestProcessedIssuesRef
    });

    return {
      availableIssues,
      selectedIssues,
      handleIssueSelect
    };
  } catch (error) {
    console.error(`useThemeSelection [${tabId}]: Error initializing theme selection:`, error);
    toast({
      title: "Errore di inizializzazione",
      description: "Si è verificato un errore durante l'inizializzazione della selezione dei temi. Ricarica la pagina.",
      variant: "destructive"
    });
    
    // Return empty data and no-op function as fallback
    return {
      availableIssues: [],
      selectedIssues: [],
      handleIssueSelect: () => console.error("Theme selection unavailable due to initialization error")
    };
  }
};
