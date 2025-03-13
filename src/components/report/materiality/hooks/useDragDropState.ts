import { useState, useEffect, useRef } from 'react';
import { MaterialityIssue } from '../types';
import { useToast } from '@/hooks/use-toast';

interface UseDragDropStateProps {
  availableIssues: MaterialityIssue[];
  selectedIssues: MaterialityIssue[];
  onIssueSelect: (issue: MaterialityIssue) => void;
  tabId?: string;
}

export const useDragDropState = ({
  availableIssues,
  selectedIssues,
  onIssueSelect,
  tabId = ''
}: UseDragDropStateProps) => {
  const { toast } = useToast();
  
  // Local state to track changes before they propagate to parent
  const [localAvailable, setLocalAvailable] = useState<MaterialityIssue[]>([]);
  const [localSelected, setLocalSelected] = useState<MaterialityIssue[]>([]);
  
  // Track the last operation to prevent conflicting updates
  const lastOperationRef = useRef<{id: string, action: 'select' | 'deselect', timestamp: number} | null>(null);
  
  // Keep track of all known selections to prevent issues from disappearing
  const knownSelectionsRef = useRef<Set<string>>(new Set());
  
  // Track issues that have been explicitly deselected
  const explicitlyDeselectedRef = useRef<Set<string>>(new Set());
  
  // Flag to prevent processing props updates when we just made local changes
  const skipNextPropsUpdateRef = useRef(false);
  
  // Store the most recent state from props
  const latestPropsRef = useRef({
    available: [] as MaterialityIssue[],
    selected: [] as MaterialityIssue[]
  });
  
  // Track all seen issues by ID to ensure we don't lose them
  const allSeenIssuesRef = useRef<Map<string, MaterialityIssue>>(new Map());
  
  // Initialize the component with the initial props
  useEffect(() => {
    if (localAvailable.length === 0 && localSelected.length === 0) {
      console.log(`useDragDropState [${tabId}]: Initial setup with ${availableIssues.length} available and ${selectedIssues.length} selected`);
      
      // Deep clone to prevent reference issues
      setLocalAvailable(availableIssues.map(issue => structuredClone(issue)));
      setLocalSelected(selectedIssues.map(issue => structuredClone(issue)));
      
      // Record the initial set of selected issues
      const selectedIds = selectedIssues.map(issue => issue.id);
      knownSelectionsRef.current = new Set(selectedIds);
      
      // Store the latest props and update allSeenIssues
      latestPropsRef.current = {
        available: availableIssues.map(issue => structuredClone(issue)),
        selected: selectedIssues.map(issue => structuredClone(issue))
      };
      
      // Add all issues to the seen map
      [...availableIssues, ...selectedIssues].forEach(issue => {
        allSeenIssuesRef.current.set(issue.id, structuredClone(issue));
      });
    }
  }, [availableIssues, selectedIssues, localAvailable.length, localSelected.length, tabId]);
  
  // Update local state when props change, but only if the arrays are different and we're not skipping
  useEffect(() => {
    // Store the latest props and update allSeenIssues
    latestPropsRef.current = {
      available: availableIssues,
      selected: selectedIssues
    };
    
    // Add all new issues to the seen map
    [...availableIssues, ...selectedIssues].forEach(issue => {
      if (!allSeenIssuesRef.current.has(issue.id)) {
        allSeenIssuesRef.current.set(issue.id, structuredClone(issue));
      }
    });
    
    // If we just made a change locally, skip this update
    if (skipNextPropsUpdateRef.current) {
      console.log(`useDragDropState [${tabId}]: Skipping props update due to skip flag`);
      skipNextPropsUpdateRef.current = false;
      return;
    }
    
    // Skip updates immediately after a local operation to prevent flickering
    if (lastOperationRef.current && Date.now() - lastOperationRef.current.timestamp < 3000) {
      console.log(`useDragDropState [${tabId}]: Skipping prop update, recent operation:`, lastOperationRef.current);
      return;
    }
    
    // Get the IDs for quick comparison
    const availableIds = new Set(availableIssues.map(issue => issue.id));
    const selectedIds = new Set(selectedIssues.map(issue => issue.id));
    const localAvailableIds = new Set(localAvailable.map(issue => issue.id));
    const localSelectedIds = new Set(localSelected.map(issue => issue.id));
    
    // Check if available issues have changed
    const availableChanged = 
      availableIssues.length !== localAvailable.length || 
      availableIssues.some(issue => !localAvailableIds.has(issue.id)) ||
      localAvailable.some(issue => !availableIds.has(issue.id));
      
    // Check if selected issues have changed
    const selectedChanged = 
      selectedIssues.length !== localSelected.length || 
      selectedIssues.some(issue => !localSelectedIds.has(issue.id)) ||
      localSelected.some(issue => !selectedIds.has(issue.id));
    
    // Update the local state if either array has changed
    if (availableChanged) {
      console.log(`useDragDropState [${tabId}]: Updating available issues from props:`, availableIssues.length);
      
      // Check for issues that should be in available but are missing
      const missingAvailableIssues = [...explicitlyDeselectedRef.current]
        .filter(id => !availableIds.has(id) && !selectedIds.has(id))
        .map(id => allSeenIssuesRef.current.get(id))
        .filter(Boolean) as MaterialityIssue[];
      
      if (missingAvailableIssues.length > 0) {
        console.log(`useDragDropState [${tabId}]: Adding ${missingAvailableIssues.length} missing deselected issues back to available`);
      }
      
      // Deep clone to prevent reference issues and include missing issues
      const newAvailableIssues = [
        ...availableIssues.map(issue => structuredClone(issue)),
        ...missingAvailableIssues.map(issue => {
          const clone = structuredClone(issue);
          clone.isMaterial = false; // Ensure it's not material
          return clone;
        })
      ];
      
      setLocalAvailable(newAvailableIssues);
    }
    
    if (selectedChanged) {
      console.log(`useDragDropState [${tabId}]: Updating selected issues from props:`, selectedIssues.length);
      // Update known selections
      selectedIssues.forEach(issue => {
        if (issue.isMaterial === true) {
          knownSelectionsRef.current.add(issue.id);
          // If an issue is now selected, remove it from explicitly deselected
          explicitlyDeselectedRef.current.delete(issue.id);
        }
      });
      
      // Deep clone to prevent reference issues
      setLocalSelected(selectedIssues.map(issue => structuredClone(issue)));
    }
  }, [availableIssues, selectedIssues, tabId, localAvailable, localSelected]);

  return {
    localAvailable,
    localSelected,
    lastOperationRef,
    skipNextPropsUpdateRef,
    knownSelectionsRef,
    explicitlyDeselectedRef, 
    allSeenIssuesRef,
    setLocalAvailable,
    setLocalSelected,
    toast
  };
};
