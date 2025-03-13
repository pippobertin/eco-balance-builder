
import React, { useState } from 'react';
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

  // Print all issues with their isMaterial property for debugging
  console.log("All issues in MaterialityIssuesTab:", issues.map(i => ({
    id: i.id,
    name: i.name,
    isMaterial: i.isMaterial,
    typeOfIsMaterial: typeof i.isMaterial
  })));

  // Use strict comparison to filter only issues with isMaterial === true
  const materialIssues = issues.filter(issue => issue.isMaterial === true);
  
  // Log for debugging
  console.log(`MaterialityIssuesTab: Found ${materialIssues.length} material issues from ${issues.length} total issues`);
  console.log("Material issues:", materialIssues.map(issue => ({ id: issue.id, name: issue.name })));
  
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
