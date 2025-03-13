import React, { useState, useEffect, useRef } from 'react';
import { MaterialityIssue } from '../../types';
import { isHeaderTheme } from '../../utils/materialityUtils';
import AvailableIssuesPanel from './AvailableIssuesPanel';
import SelectedIssuesPanel from '../SelectedIssuesPanel';
import { useToast } from '@/hooks/use-toast';

interface DragDropContainerProps {
  availableIssues: MaterialityIssue[];
  selectedIssues: MaterialityIssue[];
  onIssueSelect: (issue: MaterialityIssue) => void;
  tabId?: string;
}

const DragDropContainer: React.FC<DragDropContainerProps> = ({
  availableIssues,
  selectedIssues,
  onIssueSelect,
  tabId = ''
}) => {
  const { toast } = useToast();
  
  // Local state to track changes before they propagate to parent
  const [localAvailable, setLocalAvailable] = useState<MaterialityIssue[]>([]);
  const [localSelected, setLocalSelected] = useState<MaterialityIssue[]>([]);
  
  // Track the last operation to prevent conflicting updates
  const lastOperationRef = useRef<{id: string, action: 'select' | 'deselect', timestamp: number} | null>(null);
  
  // Keep track of all known selections to prevent issues from disappearing
  const knownSelectionsRef = useRef<Set<string>>(new Set());
  
  // Flag to prevent processing props updates when we just made local changes
  const skipNextPropsUpdateRef = useRef(false);
  
  // Store the most recent state from props
  const latestPropsRef = useRef({
    available: [] as MaterialityIssue[],
    selected: [] as MaterialityIssue[]
  });
  
  // Initialize the component with the initial props
  useEffect(() => {
    if (localAvailable.length === 0 && localSelected.length === 0) {
      console.log(`DragDropContainer [${tabId}]: Initial setup with ${availableIssues.length} available and ${selectedIssues.length} selected`);
      
      // Deep clone to prevent reference issues
      setLocalAvailable(availableIssues.map(issue => structuredClone(issue)));
      setLocalSelected(selectedIssues.map(issue => structuredClone(issue)));
      
      // Record the initial set of selected issues
      const selectedIds = selectedIssues.map(issue => issue.id);
      knownSelectionsRef.current = new Set(selectedIds);
      
      // Store the latest props
      latestPropsRef.current = {
        available: availableIssues.map(issue => structuredClone(issue)),
        selected: selectedIssues.map(issue => structuredClone(issue))
      };
    }
  }, [availableIssues, selectedIssues, localAvailable.length, localSelected.length, tabId]);
  
  // Update local state when props change, but only if the arrays are different and we're not skipping
  useEffect(() => {
    // Store the latest props
    latestPropsRef.current = {
      available: availableIssues,
      selected: selectedIssues
    };
    
    // If we just made a change locally, skip this update
    if (skipNextPropsUpdateRef.current) {
      console.log(`DragDropContainer [${tabId}]: Skipping props update due to skip flag`);
      skipNextPropsUpdateRef.current = false;
      return;
    }
    
    // Skip updates immediately after a local operation to prevent flickering
    if (lastOperationRef.current && Date.now() - lastOperationRef.current.timestamp < 5000) {
      console.log(`DragDropContainer [${tabId}]: Skipping prop update, recent operation:`, lastOperationRef.current);
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
      console.log(`DragDropContainer [${tabId}]: Updating available issues from props:`, availableIssues.length);
      // Deep clone to prevent reference issues
      setLocalAvailable(availableIssues.map(issue => structuredClone(issue)));
    }
    
    if (selectedChanged) {
      console.log(`DragDropContainer [${tabId}]: Updating selected issues from props:`, selectedIssues.length);
      // Update known selections
      selectedIssues.forEach(issue => {
        if (issue.isMaterial === true) {
          knownSelectionsRef.current.add(issue.id);
        }
      });
      
      // Deep clone to prevent reference issues
      setLocalSelected(selectedIssues.map(issue => structuredClone(issue)));
    }
  }, [availableIssues, selectedIssues, tabId, localAvailable, localSelected]);

  // Handle issue selection or deselection via click
  const handleIssueClick = (issue: MaterialityIssue) => {
    // Prevent actions on header themes
    if (isHeaderTheme(issue.id, issue.name)) {
      toast({
        title: "Azione non consentita",
        description: `"${issue.name}" è una categoria principale e non può essere selezionata. Si prega di selezionare solo i temi specifici all'interno delle categorie.`,
        variant: "destructive"
      });
      return;
    }

    console.log(`DragDropContainer [${tabId}]: Clicking issue`, issue.id, "current isMaterial:", issue.isMaterial);
    
    // Create a deep copy of the issue to prevent reference issues
    const issueCopy = structuredClone(issue);
    
    // Set skipNextPropsUpdate to true to prevent the next useEffect from running
    skipNextPropsUpdateRef.current = true;
    
    // Determine if we're selecting or deselecting
    const isSelecting = !issueCopy.isMaterial;
    
    // Record the operation
    lastOperationRef.current = {
      id: issueCopy.id,
      action: isSelecting ? 'select' : 'deselect', 
      timestamp: Date.now()
    };
    
    // Update known selections
    if (isSelecting) {
      knownSelectionsRef.current.add(issueCopy.id);
    } else {
      knownSelectionsRef.current.delete(issueCopy.id);
    }
    
    // First, update local state for immediate UI feedback
    if (isSelecting) {
      // Moving from available to selected
      issueCopy.isMaterial = true; // Toggle before updating UI
      
      setLocalAvailable(prev => prev.filter(i => i.id !== issueCopy.id));
      setLocalSelected(prev => [...prev, issueCopy]);
    } else {
      // Moving from selected to available
      issueCopy.isMaterial = false; // Toggle before updating UI
      
      setLocalSelected(prev => prev.filter(i => i.id !== issueCopy.id));
      // Only add to available if it exists in latestPropsRef.current.available
      const existsInAvailable = latestPropsRef.current.available.some(i => i.id === issueCopy.id) ||
                              latestPropsRef.current.selected.some(i => i.id === issueCopy.id);
      
      if (existsInAvailable) {
        setLocalAvailable(prev => [...prev, issueCopy]);
      } else {
        console.log(`Issue ${issueCopy.id} not found in latest props, not adding to available`);
      }
    }
    
    // Make sure issueCopy.isMaterial is a boolean
    issueCopy.isMaterial = isSelecting;
    
    // Send the updated issue to the parent component after a small delay
    // This ensures our local UI updates first
    setTimeout(() => {
      console.log(`DragDropContainer [${tabId}]: Sending issue to parent with isMaterial:`, issueCopy.isMaterial);
      onIssueSelect(issueCopy);
    }, 50);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AvailableIssuesPanel 
        availableIssues={localAvailable}
        onIssueClick={handleIssueClick}
        tabId={tabId}
      />

      <SelectedIssuesPanel 
        selectedIssues={localSelected}
        onIssueClick={handleIssueClick}
        tabId={tabId}
      />
    </div>
  );
};

export default DragDropContainer;
