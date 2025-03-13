
import React, { useState } from 'react';
import { MaterialityIssue } from '../../types';
import { isHeaderTheme } from '../../utils/materialityUtils';
import AvailableIssuesPanel from './AvailableIssuesPanel';
import SelectedIssuesPanel from './SelectedIssuesPanel';
import { useToast } from '@/hooks/use-toast';

interface DragDropContainerProps {
  availableIssues: MaterialityIssue[];
  selectedIssues: MaterialityIssue[];
  onIssueSelect: (issue: MaterialityIssue) => void;
}

const DragDropContainer: React.FC<DragDropContainerProps> = ({
  availableIssues,
  selectedIssues,
  onIssueSelect
}) => {
  const { toast } = useToast();

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

    console.log("DragDropContainer: Clicking issue", issue.id, "current isMaterial:", issue.isMaterial);
    
    // Important: Create a deep clone to avoid reference issues
    const clonedIssue = { ...issue };
    
    // If the issue is in the available issues list, it's being selected
    if (availableIssues.some(i => i.id === issue.id)) {
      console.log("DragDropContainer: Setting issue to material (true):", issue.id);
      clonedIssue.isMaterial = true; // Being moved to selected - force true
    } else {
      console.log("DragDropContainer: Setting issue to non-material (false):", issue.id);
      clonedIssue.isMaterial = false; // Being moved to available - force false
    }
    
    console.log("DragDropContainer: Passing issue with isMaterial =", clonedIssue.isMaterial);
    onIssueSelect(clonedIssue);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AvailableIssuesPanel 
        availableIssues={availableIssues}
        onIssueClick={handleIssueClick}
      />

      <SelectedIssuesPanel 
        selectedIssues={selectedIssues}
        onIssueClick={handleIssueClick}
      />
    </div>
  );
};

export default DragDropContainer;
