
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart2, List, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import IssueItem from './IssueItem';
import MaterialityMatrixChart from './MaterialityMatrixChart';
import MaterialityReport from './MaterialityReport';
import { MaterialityIssue } from './types';
import NoIssuesFound from './components/NoIssuesFound';

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
  const materialIssues = issues.filter(issue => issue.isMaterial);
  
  // Filter issues based on search query
  const filteredIssues = searchQuery 
    ? materialIssues.filter(issue => 
        issue.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        issue.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : materialIssues;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="current" className="flex items-center">
            <List className="mr-2 h-4 w-4" />
            Temi Materialità
          </TabsTrigger>
          <TabsTrigger value="matrix" className="flex items-center">
            <BarChart2 className="mr-2 h-4 w-4" />
            Matrice di Materialità
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="space-y-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cerca temi di materialità..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredIssues.length === 0 ? (
            <NoIssuesFound />
          ) : (
            <div className="space-y-2">
              {filteredIssues.map((issue) => (
                <IssueItem
                  key={issue.id}
                  issue={issue}
                  onIssueChange={onIssueChange}
                  onRemoveIssue={onRemoveIssue}
                  isPredefined={!issue.id.startsWith('custom-')}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="matrix">
          <MaterialityMatrixChart issues={issues} />
        </TabsContent>
      </Tabs>
      
      <MaterialityReport 
        materialIssues={materialIssues} 
        surveyProgress={surveyProgress}
        handleUpdateIssue={handleUpdateIssue}
      />
    </div>
  );
};

export default MaterialityIssuesTab;
