
import React, { useState, useEffect, useRef } from 'react';
import { MaterialityIssue } from '../../types';
import { isHeaderTheme } from '../../utils/materialityUtils';
import AvailableIssuesPanel from './AvailableIssuesPanel';
import SelectedIssuesPanel from './SelectedIssuesPanel';
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
  const [localAvailable, setLocalAvailable] = useState<MaterialityIssue[]>(availableIssues);
  const [localSelected, setLocalSelected] = useState<MaterialityIssue[]>(selectedIssues);
  
  // Track the last operation to prevent conflicting updates
  const lastOperationRef = useRef<{id: string, action: 'select' | 'deselect', timestamp: number} | null>(null);
  
  // Flag to prevent processing props updates when we just made local changes
  const skipNextPropsUpdateRef = useRef(false);
  
  // Update local state when props change, but only if the arrays are different and we're not skipping
  useEffect(() => {
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
    
    const availableIds = new Set(availableIssues.map(issue => issue.id));
    const selectedIds = new Set(selectedIssues.map(issue => issue.id));
    
    const localAvailableIds = new Set(localAvailable.map(issue => issue.id));
    const localSelectedIds = new Set(localSelected.map(issue => issue.id));
    
    const availableChanged = 
      availableIssues.length !== localAvailable.length || 
      availableIssues.some(issue => !localAvailableIds.has(issue.id)) ||
      localAvailable.some(issue => !availableIds.has(issue.id));
      
    const selectedChanged = 
      selectedIssues.length !== localSelected.length || 
      selectedIssues.some(issue => !localSelectedIds.has(issue.id)) ||
      localSelected.some(issue => !selectedIds.has(issue.id));
    
    if (availableChanged) {
      console.log(`DragDropContainer [${tabId}]: Updating available issues from props:`, availableIssues.length);
      // Deep clone to prevent reference issues
      setLocalAvailable(availableIssues.map(issue => structuredClone(issue)));
    }
    
    if (selectedChanged) {
      console.log(`DragDropContainer [${tabId}]: Updating selected issues from props:`, selectedIssues.length);
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
    
    // Record the operation
    lastOperationRef.current = {
      id: issueCopy.id,
      action: issueCopy.isMaterial ? 'deselect' : 'select', 
      timestamp: Date.now()
    };
    
    // First, update local state for immediate UI feedback
    if (!issueCopy.isMaterial) {
      // Moving from available to selected
      issueCopy.isMaterial = true; // Toggle before updating UI
      
      setLocalAvailable(prev => prev.filter(i => i.id !== issueCopy.id));
      setLocalSelected(prev => [...prev, issueCopy]);
    } else {
      // Moving from selected to available
      issueCopy.isMaterial = false; // Toggle before updating UI
      
      setLocalSelected(prev => prev.filter(i => i.id !== issueCopy.id));
      setLocalAvailable(prev => [...prev, issueCopy]);
    }
    
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
