
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart2, List, Search, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import IssueItem from './IssueItem';
import AddIssueForm from './AddIssueForm';
import MaterialityMatrixChart from './MaterialityMatrixChart';
import MaterialityReport from './MaterialityReport';
import { MaterialityIssue } from './types';
import NoIssuesFound from './components/NoIssuesFound';
import PredefinedIssuesSelector from './components/PredefinedIssuesSelector';
import ThemesCategoryTabs from './components/ThemesCategoryTabs';
import { isHeaderTheme } from './utils/materialityUtils';

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
  
  // Filter material issues (those with isMaterial true)
  const materialIssues = issues.filter(issue => issue.isMaterial && !isHeaderTheme(issue.id, issue.name));
  
  // Filter available issues (those with isMaterial false or headers)
  const availableIssues = issues.filter(issue => !issue.isMaterial || isHeaderTheme(issue.id, issue.name));
  
  // Filter current issues based on search query
  const filteredMaterialIssues = searchQuery 
    ? materialIssues.filter(issue => 
        issue.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        issue.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : materialIssues;
    
  const filteredAvailableIssues = searchQuery 
    ? availableIssues.filter(issue => 
        issue.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        issue.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableIssues;

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
          
          <PredefinedIssuesSelector 
            onAddIssue={onAddCustomIssue}
            currentIssues={issues}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Colonna sinistra: temi disponibili */}
            <div>
              <h3 className="text-base font-semibold mb-2 text-gray-700 flex items-center">
                <PlusCircle className="mr-2 h-4 w-4 text-green-600" />
                Temi Disponibili
              </h3>
              
              {filteredAvailableIssues.length === 0 ? (
                <div className="p-4 border rounded-lg bg-gray-50">
                  <p className="text-gray-500 text-sm">Nessun tema disponibile con questi criteri di ricerca.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-auto pr-2">
                  {filteredAvailableIssues.map((issue) => (
                    <IssueItem
                      key={issue.id}
                      issue={issue}
                      onIssueChange={onIssueChange}
                      isPredefined={!issue.id.startsWith('custom-')}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Colonna destra: temi selezionati */}
            <div>
              <h3 className="text-base font-semibold mb-2 text-gray-700">Temi Selezionati</h3>
              
              {filteredMaterialIssues.length === 0 ? (
                <div className="p-4 border rounded-lg bg-gray-50">
                  <p className="text-gray-500 text-sm">Nessun tema selezionato. Usa il pulsante "+" per aggiungere temi.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-auto pr-2">
                  {filteredMaterialIssues.map((issue) => (
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
            </div>
          </div>
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
