import { useState, useRef } from 'react';
import { MaterialityIssue } from '../../types';

/**
 * Hook for managing the state of theme selection
 */
export const useThemeSelectionState = (tabId: string) => {
  // Track which issues are currently available and which are selected
  const [availableIssues, setAvailableIssues] = useState<MaterialityIssue[]>([]);
  const [selectedIssues, setSelectedIssues] = useState<MaterialityIssue[]>([]);
  
  // Keep track of the previous selected IDs to detect changes
  const prevSelectedIdsRef = useRef<Set<string>>(new Set());
  
  // Track all known material issues for this tab
  const knownMaterialIssuesRef = useRef<Set<string>>(new Set());
  
  // Track issues that have been explicitly deselected
  const explicitlyDeselectedRef = useRef<Set<string>>(new Set());
  
  // Track last operation to prevent immediate reversions
  const lastOpRef = useRef<{id: string; operation: 'select'|'deselect'; timestamp: number}>();
  
  // Flag to prevent re-processing issues while updates are pending
  const updatingRef = useRef<boolean>(false);
  
  // Flag to track whether the component has mounted
  const hasMountedRef = useRef<boolean>(false);
  
  // Store the most recent results of processing
  const latestProcessedIssuesRef = useRef({
    available: [] as MaterialityIssue[],
    selected: [] as MaterialityIssue[]
  });

  return {
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
  };
};
