
import React from 'react';
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

    console.log(`DragDropContainer [${tabId}]: Clicking issue`, issue.id, "isMaterial:", issue.isMaterial, "type:", typeof issue.isMaterial);
    
    // CRITICAL FIX: Create a completely new object to avoid any reference issues
    const newIssue = {
      id: issue.id,
      name: issue.name,
      description: issue.description || "",
      impactRelevance: issue.impactRelevance || 50,
      financialRelevance: issue.financialRelevance || 50,
      // Toggle isMaterial based on current state, ensure it's a boolean type
      isMaterial: !issue.isMaterial
    };
    
    console.log(`DragDropContainer [${tabId}]: Created new issue with isMaterial:`, newIssue.isMaterial, "type:", typeof newIssue.isMaterial);
    
    // Pass the new issue directly to the parent handler
    onIssueSelect(newIssue);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AvailableIssuesPanel 
        availableIssues={availableIssues}
        onIssueClick={handleIssueClick}
        tabId={tabId}
      />

      <SelectedIssuesPanel 
        selectedIssues={selectedIssues}
        onIssueClick={handleIssueClick}
        tabId={tabId}
      />
    </div>
  );
};

export default DragDropContainer;
