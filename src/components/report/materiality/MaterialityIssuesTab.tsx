
import React, { useState, useEffect } from 'react';
import { SearchBar, IssuesList, IssueTabs } from './components/issues-tab';
import MaterialityReport from './MaterialityReport';
import { MaterialityIssue } from './types';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

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
  const [refreshKey, setRefreshKey] = useState<number>(0);

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

  // Update refresh key when issues change
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [issues]);

  // Handle refresh
  const handleRefresh = () => {
    console.log("Refreshing materiality issues view");
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6" key={refreshKey}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Temi di Materialità</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Aggiorna
        </Button>
      </div>

      <IssueTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        issues={issues}
        refreshKey={refreshKey}
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
