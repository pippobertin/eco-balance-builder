
import { useEffect } from 'react';
import { MaterialityIssue } from '../../../types';
import { useToast } from '@/hooks/use-toast';
import { shouldSkipUpdate, shouldProcessIssues } from './shouldProcess';
import { categorizeIssues } from './categorizeIssues';
import { updateIssuesState } from './updateIssuesState';
import { handleProcessingError } from './errorHandling';

interface UseThemeProcessingProps {
  issues: MaterialityIssue[];
  selectedIssueIds: Set<string>;
  tabId: string;
  availableIssues: MaterialityIssue[];
  selectedIssues: MaterialityIssue[];
  setAvailableIssues: React.Dispatch<React.SetStateAction<MaterialityIssue[]>>;
  setSelectedIssues: React.Dispatch<React.SetStateAction<MaterialityIssue[]>>;
  prevSelectedIdsRef: React.MutableRefObject<Set<string>>;
  knownMaterialIssuesRef: React.MutableRefObject<Set<string>>;
  explicitlyDeselectedRef: React.MutableRefObject<Set<string>>;
  lastOpRef: React.MutableRefObject<{id: string; operation: 'select'|'deselect'; timestamp: number} | undefined>;
  updatingRef: React.MutableRefObject<boolean>;
  hasMountedRef: React.MutableRefObject<boolean>;
  latestProcessedIssuesRef: React.MutableRefObject<{
    available: MaterialityIssue[];
    selected: MaterialityIssue[];
  }>;
}

/**
 * Hook for processing issues into available and selected categories
 */
export const useThemeProcessing = ({
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
}: UseThemeProcessingProps) => {
  const { toast } = useToast();
  
  // Process issues into available and selected categories
  useEffect(() => {
    try {
      if (shouldSkipUpdate(lastOpRef, updatingRef)) {
        return;
      }
      
      // Log for debugging
      console.log(`useThemeProcessing [${tabId}]: Effect running, issues length=${issues.length}, selectedIds=${Array.from(selectedIssueIds).join(',')}`);
      
      if (shouldProcessIssues(selectedIssueIds, prevSelectedIdsRef, hasMountedRef, availableIssues, selectedIssues)) {
        // Set updating flag to prevent unnecessary re-renders
        updatingRef.current = true;
        
        // Categorize issues
        const { available, selected } = categorizeIssues({
          issues,
          selectedIssueIds,
          tabId,
          knownMaterialIssuesRef,
          explicitlyDeselectedRef,
          lastOpRef
        });
        
        // Update the state
        updateIssuesState({
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
        });
      }
    } catch (error) {
      handleProcessingError(error, tabId, updatingRef, toast);
    }
  }, [
    issues, 
    selectedIssueIds, 
    tabId, 
    availableIssues.length, 
    selectedIssues.length, 
    setAvailableIssues, 
    setSelectedIssues,
    toast
  ]);
};
