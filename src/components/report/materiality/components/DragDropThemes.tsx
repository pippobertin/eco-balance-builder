
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import ESRSThemeFilter from './ESRSThemeFilter';
import { useToast } from '@/hooks/use-toast';
import { getIssuesByCategory } from '../utils/categorizePredefinedIssues';
import ThemesCategoryTabs from './ThemesCategoryTabs';
import SelectedIssuesPanel from './SelectedIssuesPanel';

interface DragDropThemesProps {
  selectedIssues: any[];
  onIssueSelect: (issue: any) => void;
  onIssueRemove: (id: string) => void;
}

const DragDropThemes: React.FC<DragDropThemesProps> = ({ 
  selectedIssues, 
  onIssueSelect, 
  onIssueRemove 
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('environmental');
  const { toast } = useToast();
  
  // Get issues categorized by ESG
  const { environmental: environmentalIssues, social: socialIssues, governance: governanceIssues } = getIssuesByCategory();
  
  // Get the selected issue IDs for quick lookup - use a state to ensure it persists across renders
  const [selectedIssueIds, setSelectedIssueIds] = useState<Set<string>>(new Set());
  
  // Update selectedIssueIds when selectedIssues changes
  useEffect(() => {
    const newSelectedIds = new Set(selectedIssues.map(issue => issue.id));
    console.log("DragDropThemes: Updating selected issue IDs:", Array.from(newSelectedIds));
    setSelectedIssueIds(newSelectedIds);
  }, [selectedIssues]);
  
  // Handle issue selection
  const handleIssueSelect = (issue: any) => {
    console.log("Selected issue:", issue.id, issue.name);
    
    // Check if this issue is already selected
    if (selectedIssueIds.has(issue.id)) {
      toast({
        title: "Tema già selezionato",
        description: "Questo tema è già stato aggiunto all'analisi",
        variant: "default"
      });
      return;
    }
    
    // Add default values for impact and financial relevance
    const issueWithValues = {
      ...issue,
      impactRelevance: issue.impactRelevance || 50, // Use existing or default
      financialRelevance: issue.financialRelevance || 50, // Use existing or default
      isMaterial: true  // CRITICAL: Ensure this is a boolean true, not a string or truthy value
    };
    
    console.log("Adding issue with values:", issueWithValues);
    
    // Call the parent component's handler
    onIssueSelect(issueWithValues);
    
    toast({
      title: "Tema aggiunto",
      description: `"${issue.name}" è stato aggiunto all'analisi`,
      variant: "default"
    });
  };
  
  // Adapter function to match the expected signature for SelectedIssuesPanel
  const handleIssueClick = (issue: any) => {
    console.log("DragDropThemes: handleIssueClick called for issue:", issue.id, "isMaterial:", issue.isMaterial);
    
    // Only process remove if isMaterial is explicitly false
    if (issue.isMaterial === false) {
      console.log("Removing issue:", issue.id);
      onIssueRemove(issue.id);
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Seleziona i temi da analizzare</h3>
      
      <ESRSThemeFilter 
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="p-4 font-semibold bg-muted/50 rounded-t-lg">
            Temi disponibili
          </div>
          <div className="p-4">
            <ThemesCategoryTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              environmentalIssues={environmentalIssues}
              socialIssues={socialIssues}
              governanceIssues={governanceIssues}
              selectedIssueIds={selectedIssueIds}
              onIssueSelect={handleIssueSelect}
            />
          </div>
        </div>
        
        <SelectedIssuesPanel 
          selectedIssues={selectedIssues}
          onIssueClick={handleIssueClick}
        />
      </div>
    </div>
  );
};

export default DragDropThemes;
