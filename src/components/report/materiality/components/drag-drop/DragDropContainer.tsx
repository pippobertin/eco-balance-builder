
import React, { useState, useEffect } from 'react';
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
  
  // Update local state when props change, but only if the arrays are different
  useEffect(() => {
    const shouldUpdateAvailable = 
      availableIssues.length !== localAvailable.length || 
      availableIssues.some(issue => !localAvailable.some(local => local.id === issue.id));
      
    const shouldUpdateSelected = 
      selectedIssues.length !== localSelected.length || 
      selectedIssues.some(issue => !localSelected.some(local => local.id === issue.id));
    
    if (shouldUpdateAvailable) {
      setLocalAvailable(availableIssues);
    }
    
    if (shouldUpdateSelected) {
      setLocalSelected(selectedIssues);
    }
  }, [availableIssues, selectedIssues]);

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
    
    // First, update local state for immediate UI feedback
    if (!issue.isMaterial) {
      // Moving from available to selected
      setLocalAvailable(prev => prev.filter(i => i.id !== issue.id));
      
      // Create a deep copy with isMaterial set to true
      const selectedIssue = JSON.parse(JSON.stringify(issue));
      selectedIssue.isMaterial = true;
      
      setLocalSelected(prev => [...prev, selectedIssue]);
      
      // Create a new object for parent component with isMaterial explicitly set to true
      const newIssue = {
        ...issue,
        isMaterial: true
      };
      
      console.log(`DragDropContainer [${tabId}]: Sending issue to parent with isMaterial:`, newIssue.isMaterial);
      onIssueSelect(newIssue);
    } else {
      // Moving from selected to available
      setLocalSelected(prev => prev.filter(i => i.id !== issue.id));
      
      // Create a deep copy with isMaterial set to false
      const availableIssue = JSON.parse(JSON.stringify(issue));
      availableIssue.isMaterial = false;
      
      setLocalAvailable(prev => [...prev, availableIssue]);
      
      // Create a new object for parent component with isMaterial explicitly set to false
      const newIssue = {
        ...issue,
        isMaterial: false
      };
      
      console.log(`DragDropContainer [${tabId}]: Sending issue to parent with isMaterial:`, newIssue.isMaterial);
      onIssueSelect(newIssue);
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
