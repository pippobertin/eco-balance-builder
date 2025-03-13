
import { useState, useRef, useEffect } from 'react';
import { MaterialityIssue } from '../types';
import { useToast } from '@/hooks/use-toast';

interface UseDragDropStateProps {
  availableIssues: MaterialityIssue[];
  selectedIssues: MaterialityIssue[];
  onIssueSelect: (issue: MaterialityIssue) => void;
  tabId: string;
}

export const useDragDropState = ({
  availableIssues,
  selectedIssues,
  onIssueSelect,
  tabId
}: UseDragDropStateProps) => {
  const { toast } = useToast();
  
  // Local state for UI rendering (prevents flickering)
  const [localAvailable, setLocalAvailable] = useState<MaterialityIssue[]>(availableIssues);
  const [localSelected, setLocalSelected] = useState<MaterialityIssue[]>(selectedIssues);
  
  // Track operations to prevent recursion/race conditions
  const lastOperationRef = useRef<{id: string; operation: 'select'|'deselect'; timestamp: number}>();
  const skipNextPropsUpdateRef = useRef<boolean>(false);
  
  // Track which issues have been seen in which state
  const knownSelectionsRef = useRef<Set<string>>(new Set());
  const explicitlyDeselectedRef = useRef<Set<string>>(new Set());
  const allSeenIssuesRef = useRef<Map<string, MaterialityIssue>>(new Map());
  
  // Remove duplicates from any array of issues
  const removeDuplicates = (issues: MaterialityIssue[]) => {
    const uniqueIds = new Set<string>();
    return issues.filter(issue => {
      if (uniqueIds.has(issue.id)) {
        return false;
      }
      uniqueIds.add(issue.id);
      return true;
    });
  };
  
  // Update local state when props change (except when we want to skip)
  useEffect(() => {
    try {
      if (skipNextPropsUpdateRef.current) {
        skipNextPropsUpdateRef.current = false;
        return;
      }
      
      const uniqueAvailable = removeDuplicates(availableIssues);
      const uniqueSelected = removeDuplicates(selectedIssues);
      
      // Only update the state if there are actual changes
      if (JSON.stringify(uniqueAvailable.map(i => i.id)) !== JSON.stringify(localAvailable.map(i => i.id))) {
        setLocalAvailable(uniqueAvailable);
      }
      
      if (JSON.stringify(uniqueSelected.map(i => i.id)) !== JSON.stringify(localSelected.map(i => i.id))) {
        setLocalSelected(uniqueSelected);
      }
      
      // Update our refs for tracking issue states
      uniqueSelected.forEach(issue => {
        knownSelectionsRef.current.add(issue.id);
        explicitlyDeselectedRef.current.delete(issue.id);
        allSeenIssuesRef.current.set(issue.id, issue);
      });
    } catch (error) {
      console.error(`useDragDropState [${tabId}]: Error updating local state:`, error);
      toast({
        title: "Errore nell'aggiornamento",
        description: "Si è verificato un errore durante l'aggiornamento dei temi. Ricarica la pagina se si verificano problemi.",
        variant: "destructive"
      });
    }
  }, [availableIssues, selectedIssues, tabId, toast, localAvailable, localSelected]);
  
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
