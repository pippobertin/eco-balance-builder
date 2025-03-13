
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
  
  // Update local state when props change, but only if the arrays are different
  useEffect(() => {
    // Skip updates immediately after a local operation to prevent flickering
    if (lastOperationRef.current && Date.now() - lastOperationRef.current.timestamp < 3000) {
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
      setLocalAvailable(availableIssues.map(issue => ({...issue})));
    }
    
    if (selectedChanged) {
      console.log(`DragDropContainer [${tabId}]: Updating selected issues from props:`, selectedIssues.length);
      setLocalSelected(selectedIssues.map(issue => ({...issue})));
    }
  }, [availableIssues, selectedIssues, tabId]);

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
    const issueCopy = JSON.parse(JSON.stringify(issue));
    
    // First, update local state for immediate UI feedback
    if (!issueCopy.isMaterial) {
      // Record the operation
      lastOperationRef.current = {
        id: issueCopy.id,
        action: 'select',
        timestamp: Date.now()
      };
      
      // Moving from available to selected
      setLocalAvailable(prev => prev.filter(i => i.id !== issueCopy.id));
      
      // Set isMaterial to true explicitly
      issueCopy.isMaterial = true;
      
      setLocalSelected(prev => [...prev, issueCopy]);
      
      console.log(`DragDropContainer [${tabId}]: Sending issue to parent with isMaterial:`, issueCopy.isMaterial);
      onIssueSelect(issueCopy);
    } else {
      // Record the operation
      lastOperationRef.current = {
        id: issueCopy.id,
        action: 'deselect',
        timestamp: Date.now()
      };
      
      // Moving from selected to available
      setLocalSelected(prev => prev.filter(i => i.id !== issueCopy.id));
      
      // Set isMaterial to false explicitly
      issueCopy.isMaterial = false;
      
      setLocalAvailable(prev => [...prev, issueCopy]);
      
      console.log(`DragDropContainer [${tabId}]: Sending issue to parent with isMaterial:`, issueCopy.isMaterial);
      onIssueSelect(issueCopy);
    }
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
