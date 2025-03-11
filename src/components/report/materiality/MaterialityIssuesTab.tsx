
import React, { useState, useEffect } from 'react';
import { Target, Filter, PlusCircle } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import IssueItem from './IssueItem';
import AddIssueForm from './AddIssueForm';
import MaterialityReport from './MaterialityReport';
import MaterialityMatrixChart from './MaterialityMatrixChart';
import { MaterialityIssue } from './types';
import { predefinedIssues, esrsThemes } from './utils/materialityUtils';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface MaterialityIssuesTabProps {
  issues: MaterialityIssue[];
  onIssueChange: (id: string, field: keyof MaterialityIssue, value: any) => void;
  onAddCustomIssue: (name: string, description: string) => void;
  onRemoveIssue: (id: string) => void;
  surveyProgress?: {
    sent: number;
    completed: number;
    total: number;
  };
}

const MaterialityIssuesTab: React.FC<MaterialityIssuesTabProps> = ({
  issues,
  onIssueChange,
  onAddCustomIssue,
  onRemoveIssue,
  surveyProgress = { sent: 0, completed: 0, total: 0 }
}) => {
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [showPredefinedSelector, setShowPredefinedSelector] = useState(false);
  
  // Get already added issue IDs for filtering out from predefined issues
  const addedIssueIds = issues.map(issue => issue.id);
  
  // Filter issues by theme if a theme is selected
  const filteredIssues = selectedTheme === 'all' 
    ? issues 
    : issues.filter(issue => {
        const matchingPredefined = predefinedIssues.find(p => p.id === issue.id);
        if (!matchingPredefined) return false;
        
        // Match based on issue id prefix that corresponds to themes
        if (selectedTheme === 'Cambiamenti climatici') return issue.id.startsWith('climate') || issue.id === 'energy';
        if (selectedTheme === 'Inquinamento') return issue.id.startsWith('pollution') || issue.id.includes('substances');
        if (selectedTheme === 'Acque e risorse marine') return issue.id.startsWith('water') || issue.id.includes('marine');
        if (selectedTheme === 'Biodiversità ed ecosistemi') return issue.id.startsWith('biodiversity') || issue.id.includes('soil') || issue.id.includes('ecosystem') || issue.id.includes('species');
        if (selectedTheme === 'Economia circolare') return issue.id.startsWith('resource') || issue.id === 'waste';
        if (selectedTheme === 'Forza lavoro propria') return issue.id.startsWith('labor') && !issue.id.includes('supply');
        if (selectedTheme === 'Lavoratori nella catena del valore') return issue.id.startsWith('supply-labor');
        if (selectedTheme === 'Comunità interessate') return issue.id.startsWith('community') || issue.id.startsWith('indigenous');
        if (selectedTheme === 'Consumatori e utilizzatori finali') return issue.id.startsWith('consumer');
        if (selectedTheme === 'Condotta delle imprese') return (
          issue.id.startsWith('business') || 
          issue.id === 'whistleblower-protection' || 
          issue.id === 'animal-welfare' || 
          issue.id === 'political-engagement' || 
          issue.id === 'supplier-relations' ||
          issue.id.includes('corruption')
        );
        
        return false;
      });
      
  // Filter predefined issues by theme
  const getFilteredPredefinedIssues = () => {
    if (selectedTheme === 'all') return predefinedIssues.filter(issue => !addedIssueIds.includes(issue.id));
    
    return predefinedIssues.filter(issue => {
      if (addedIssueIds.includes(issue.id)) return false;
      
      if (selectedTheme === 'Cambiamenti climatici') return issue.id.startsWith('climate') || issue.id === 'energy';
      if (selectedTheme === 'Inquinamento') return issue.id.startsWith('pollution') || issue.id.includes('substances');
      if (selectedTheme === 'Acque e risorse marine') return issue.id.startsWith('water') || issue.id.includes('marine');
      if (selectedTheme === 'Biodiversità ed ecosistemi') return issue.id.startsWith('biodiversity') || issue.id.includes('soil') || issue.id.includes('ecosystem') || issue.id.includes('species');
      if (selectedTheme === 'Economia circolare') return issue.id.startsWith('resource') || issue.id === 'waste';
      if (selectedTheme === 'Forza lavoro propria') return issue.id.startsWith('labor') && !issue.id.includes('supply');
      if (selectedTheme === 'Lavoratori nella catena del valore') return issue.id.startsWith('supply-labor');
      if (selectedTheme === 'Comunità interessate') return issue.id.startsWith('community') || issue.id.startsWith('indigenous');
      if (selectedTheme === 'Consumatori e utilizzatori finali') return issue.id.startsWith('consumer');
      if (selectedTheme === 'Condotta delle imprese') return (
        issue.id.startsWith('business') || 
        issue.id === 'whistleblower-protection' || 
        issue.id === 'animal-welfare' || 
        issue.id === 'political-engagement' || 
        issue.id === 'supplier-relations' ||
        issue.id.includes('corruption')
      );
      
      return false;
    });
  };
  
  // Add a predefined issue to the current issues
  const addPredefinedIssue = (predefinedIssue: MaterialityIssue) => {
    const newIssue = {
      ...predefinedIssue,
      impactRelevance: 50,
      financialRelevance: 50,
      isMaterial: false
    };
    
    onAddCustomIssue(newIssue.name, newIssue.description);
  };

  return (
    <>
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Target className="mr-2 h-5 w-5 text-green-600" />
          <h3 className="text-xl font-semibold text-gray-900">Valutazione della Doppia Materialità</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-800 mb-4">
            L'analisi di materialità valuta la rilevanza delle questioni di sostenibilità considerando due dimensioni:
            <br />- <strong>Rilevanza dell'impatto:</strong> impatti effettivi o potenziali sulle persone o sull'ambiente
            <br />- <strong>Rilevanza finanziaria:</strong> rischi e opportunità finanziarie che derivano dalle questioni di sostenibilità
          </p>
          
          <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
            <p className="text-sm font-medium mb-2 text-gray-900">Come utilizzare questo strumento:</p>
            <ol className="text-sm space-y-1 list-decimal pl-4 text-gray-800">
              <li>Valuta la rilevanza dell'impatto per ciascuna questione spostando il primo slider</li>
              <li>Valuta la rilevanza finanziaria spostando il secondo slider</li>
              <li>Contrassegna come "materiale" le questioni che consideri rilevanti</li>
              <li>Aggiungi questioni personalizzate o selezionane tra quelle predefinite</li>
            </ol>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <h4 className="text-sm font-medium text-gray-800">Filtra per tema ESRS</h4>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center" 
              onClick={() => setShowPredefinedSelector(!showPredefinedSelector)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {showPredefinedSelector ? 'Nascondi temi predefiniti' : 'Aggiungi temi predefiniti'}
            </Button>
          </div>
          
          <Select value={selectedTheme} onValueChange={setSelectedTheme}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Seleziona un tema ESRS" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Tutti i temi</SelectItem>
                {esrsThemes.map(theme => (
                  <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        {/* Predefined issues selector */}
        {showPredefinedSelector && (
          <div className="mb-8 p-4 border border-dashed border-gray-300 rounded-lg">
            <h4 className="text-sm font-medium mb-3">Seleziona questioni predefinite da aggiungere</h4>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {getFilteredPredefinedIssues().map(issue => (
                  <div key={issue.id} className="p-3 bg-gray-50 rounded border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="text-sm font-medium">{issue.name}</h5>
                        <p className="text-xs text-gray-600 mt-1">{issue.description}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-green-600 hover:text-green-800"
                        onClick={() => addPredefinedIssue(issue)}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {getFilteredPredefinedIssues().length === 0 && (
                  <p className="text-sm text-gray-500 italic">
                    Non ci sono questioni predefinite disponibili per questo tema o sono già state tutte aggiunte.
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        )}

        <div className="space-y-8">
          {issues.length > 0 && <MaterialityMatrixChart issues={issues} />}
          
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <IssueItem 
                key={issue.id}
                issue={issue}
                onIssueChange={onIssueChange}
                onRemoveIssue={onRemoveIssue}
                isPredefined={predefinedIssues.some(predefined => predefined.id === issue.id)}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Nessuna questione di materialità aggiunta per questo tema.</p>
              <p className="text-gray-500 text-sm mt-2">
                Usa il pulsante "Aggiungi temi predefiniti" per selezionare le questioni predefinite o aggiungi una questione personalizzata utilizzando il modulo sottostante.
              </p>
            </div>
          )}
          
          <AddIssueForm onAddIssue={onAddCustomIssue} />
        </div>
      </GlassmorphicCard>
      
      <MaterialityReport 
        materialIssues={issues.filter(issue => issue.isMaterial)}
        surveyProgress={surveyProgress}
      />
    </>
  );
};

export default MaterialityIssuesTab;
