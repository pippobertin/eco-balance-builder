
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SearchBar, IssuesList, IssueTabs } from './components/issues-tab';
import MaterialityReport from './MaterialityReport';
import { MaterialityIssue } from './types';

interface MaterialityIssuesTabProps {
  issues: MaterialityIssue[];
  onIssueChange: (id: string, field: keyof MaterialityIssue, value: any) => void;
  onAddCustomIssue: (name: string, description: string) => void;
  onRemoveIssue: (id: string) => void;
  surveyProgress: {
    sent: number;
    completed: number;
    total: number;
  };
  handleUpdateIssue?: (id: string, updatedIssue: Partial<MaterialityIssue>) => void;
}

const MaterialityIssuesTab: React.FC<MaterialityIssuesTabProps> = ({
  issues,
  onIssueChange,
  onAddCustomIssue,
  onRemoveIssue,
  surveyProgress,
  handleUpdateIssue
}) => {
  const [activeTab, setActiveTab] = useState<string>('current');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { toast } = useToast();

  // Track the last set of material issues to prevent unwanted updates
  const [lastMaterialIssueIds, setLastMaterialIssueIds] = useState<Set<string>>(new Set());

  // Use strict comparison to filter only issues with isMaterial === true
  const materialIssues = issues.filter(issue => issue.isMaterial === true);
  
  // Log for debugging
  console.log(`MaterialityIssuesTab: Found ${materialIssues.length} material issues from ${issues.length} total issues`);
  
  // Check if the material issues have changed
  useEffect(() => {
    try {
      const currentMaterialIds = new Set(materialIssues.map(issue => issue.id));
      const hasChanges = 
        currentMaterialIds.size !== lastMaterialIssueIds.size || 
        materialIssues.some(issue => !lastMaterialIssueIds.has(issue.id)) ||
        Array.from(lastMaterialIssueIds).some(id => !currentMaterialIds.has(id));
      
      if (hasChanges) {
        console.log("Material issues changed:", 
          Array.from(currentMaterialIds), 
          "previous:", 
          Array.from(lastMaterialIssueIds));
        setLastMaterialIssueIds(currentMaterialIds);
      }
    } catch (error) {
      console.error("Error checking material issues changes:", error);
      toast({
        title: "Errore di aggiornamento",
        description: "Si è verificato un errore durante l'aggiornamento dei temi. Ricarica la pagina se i dati non sono aggiornati.",
        variant: "destructive"
      });
    }
  }, [materialIssues, lastMaterialIssueIds, toast]);
  
  // Filter issues based on search query
  const filteredIssues = searchQuery 
    ? materialIssues.filter(issue => 
        issue.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (issue.description && issue.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : materialIssues;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Temi di Materialità</h3>
      </div>

      <IssueTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        issues={issues}
      >
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />

        <h3 className="text-lg font-semibold mt-6 mb-4 text-gray-800">Rilevanza</h3>

        {materialIssues.length > 0 ? (
          <IssuesList 
            issues={filteredIssues}
            onIssueChange={onIssueChange}
            onRemoveIssue={onRemoveIssue}
          />
        ) : (
          <div className="p-6 text-center bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-gray-600">
              Nessun tema selezionato. Seleziona i temi dalla sezione "Temi Disponibili" per aggiungerli qui.
            </p>
          </div>
        )}
      </IssueTabs>
      
      <MaterialityReport 
        materialIssues={materialIssues} 
        surveyProgress={surveyProgress}
        handleUpdateIssue={handleUpdateIssue}
      />
    </div>
  );
};

export default MaterialityIssuesTab;
