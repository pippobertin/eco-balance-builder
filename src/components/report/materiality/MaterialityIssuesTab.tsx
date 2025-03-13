
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

  // Filter only material issues
  const materialIssues = issues.filter(issue => issue.isMaterial === true);
  
  // Filter issues based on search query
  const filteredIssues = searchQuery 
    ? materialIssues.filter(issue => 
        issue.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        issue.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : materialIssues;
    
  console.log(`MaterialityIssuesTab: Found ${materialIssues.length} material issues`);

  return (
    <div className="space-y-6">
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

        <IssuesList 
          issues={filteredIssues}
          onIssueChange={onIssueChange}
          onRemoveIssue={onRemoveIssue}
        />
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
