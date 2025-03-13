
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

    // When selecting an issue, explicitly set isMaterial to the opposite of its current state
    // This is critical to ensure the isMaterial flag is toggled correctly
    console.log("DragDropContainer: Clicking issue", issue.id, "current isMaterial:", issue.isMaterial);
    
    // Toggle the issue's material status - use explicit boolean value
    const updatedIssue = { 
      ...issue, 
      isMaterial: issue.isMaterial === true ? false : true 
    };
    
    console.log("DragDropContainer: Toggling isMaterial to:", updatedIssue.isMaterial);
    onIssueSelect(updatedIssue);
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
