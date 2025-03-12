import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart2, List, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import IssueItem from './IssueItem';
import AddIssueForm from './AddIssueForm';
import MaterialityMatrixChart from './MaterialityMatrixChart';
import MaterialityReport from './MaterialityReport';
import { MaterialityIssue, IROSelections } from './types';
import PredefinedIssuesSelector from './components/PredefinedIssuesSelector';
import ESRSThemeFilter from './components/ESRSThemeFilter';
import NoIssuesFound from './components/NoIssuesFound';
import { categorizePredefinedIssues } from './utils/categorizePredefinedIssues';
import { esrsThemes } from './utils/materialityUtils';
import ThemesCategoryTabs from './components/ThemesCategoryTabs';

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
  const [isAddingCustomIssue, setIsAddingCustomIssue] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('current');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [themesTabValue, setThemesTabValue] = useState<string>('all');
  
  const categorizedIssues = categorizePredefinedIssues();
  
  // Filter material issues (those marked as material)
  const materialIssues = issues.filter(issue => issue.isMaterial);
  
  // Filter current issues based on search query
  const filteredIssues = searchQuery 
    ? issues.filter(issue => 
        issue.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        issue.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : issues;

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
          <div className="flex items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cerca temi di materialità..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button onClick={() => setIsAddingCustomIssue(true)} disabled={isAddingCustomIssue}>
              Aggiungi Tema Personalizzato
            </Button>
          </div>
          
          {isAddingCustomIssue && (
            <div className="p-4 border rounded-lg bg-gray-50">
              <AddIssueForm 
                onAddIssue={onAddCustomIssue}
                onClose={() => setIsAddingCustomIssue(false)}
              />
            </div>
          )}
          
          {filteredIssues.length === 0 ? (
            <NoIssuesFound />
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Seleziona i temi materiali e valuta la loro rilevanza finanziaria e d'impatto.
              </p>
              
              <div className="space-y-2">
                {filteredIssues.map((issue) => (
                  <IssueItem
                    key={issue.id}
                    issue={issue}
                    onIssueChange={onIssueChange}
                    onRemoveIssue={onRemoveIssue}
                    isPredefined={issue.id.startsWith('custom-')}
                  />
                ))}
              </div>
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
