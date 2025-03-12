
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Trash2, Leaf, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ESRSThemeFilter from './ESRSThemeFilter';
import PredefinedIssuesSelector from './PredefinedIssuesSelector';
import { predefinedIssues } from '../utils/materialityUtils';
import { useToast } from '@/hooks/use-toast';
import { categorizeIssuesByESG, getESGCategory } from '../utils/esgCategoryUtils';

// Aggiungi categoria ESG ai temi predefiniti in modo più accurato
const predefinedIssuesWithCategory = predefinedIssues.map(issue => {
  // Categorie per temi ambientali
  const environmentalPatterns = [
    'climate-', 'energy', 'pollution-', 'substances-', 
    'water-', 'ocean-', 'marine-', 'biodiversity-', 
    'species-', 'soil-', 'desertification', 'ecosystem-', 
    'resource-', 'waste'
  ];
  
  // Categorie per temi sociali
  const socialPatterns = [
    'labor-', 'supply-', 'community-', 'indigenous-', 
    'consumer-'
  ];
  
  // Categorie per temi di governance
  const governancePatterns = [
    'business-', 'whistleblower-', 'animal-', 
    'political-', 'supplier-', 'corruption-'
  ];
  
  // Determina la categoria in base al pattern dell'ID
  let category = 'governance'; // Default
  
  // Controlla se l'ID corrisponde a pattern ambientali
  if (environmentalPatterns.some(pattern => issue.id.startsWith(pattern))) {
    category = 'environmental';
  } 
  // Controlla se l'ID corrisponde a pattern sociali
  else if (socialPatterns.some(pattern => issue.id.startsWith(pattern))) {
    category = 'social';
  } 
  // Altrimenti è governance (default)
  
  return {
    ...issue,
    category
  };
});

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
  const [filteredIssues, setFilteredIssues] = useState(predefinedIssuesWithCategory);
  const { toast } = useToast();
  
  // Filter issues based on selected ESG categories and active tab
  useEffect(() => {
    if (selectedCategories.length === 0) {
      // Just filter by the active tab
      const tabFiltered = predefinedIssuesWithCategory.filter(issue => 
        issue.category === activeTab
      );
      setFilteredIssues(tabFiltered);
    } else {
      // Filter by both selected categories and the active tab
      const filtered = predefinedIssuesWithCategory.filter(issue => 
        selectedCategories.includes(issue.category || '') && issue.category === activeTab
      );
      setFilteredIssues(filtered);
    }
  }, [selectedCategories, activeTab]);
  
  // Get the selected issue IDs for quick lookup
  const selectedIssueIds = new Set(selectedIssues.map(issue => issue.id));
  
  // Handle issue selection
  const handleIssueSelect = (issue: any) => {
    console.log("Selected issue:", issue);
    
    // Check if this issue is already selected
    if (selectedIssueIds.has(issue.id)) {
      toast({
        title: "Tema già selezionato",
        description: "Questo tema è già stato aggiunto all'analisi",
        variant: "default"
      });
      return;
    }
    
    // Call the parent component's handler
    onIssueSelect(issue);
    
    toast({
      title: "Tema aggiunto",
      description: `"${issue.name}" è stato aggiunto all'analisi`,
      variant: "default"
    });
  };

  // Group issues by ESG category
  const environmentalIssues = predefinedIssuesWithCategory.filter(issue => issue.category === 'environmental');
  const socialIssues = predefinedIssuesWithCategory.filter(issue => issue.category === 'social');
  const governanceIssues = predefinedIssuesWithCategory.filter(issue => issue.category === 'governance');
  
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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="environmental" className="flex items-center gap-2">
                  <Leaf className="h-4 w-4" />
                  <span className="hidden sm:inline">Ambiente</span>
                </TabsTrigger>
                <TabsTrigger value="social" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Sociale</span>
                </TabsTrigger>
                <TabsTrigger value="governance" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Governance</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="environmental" className="mt-4">
                <ScrollArea className="h-[250px]">
                  <PredefinedIssuesSelector 
                    issues={environmentalIssues}
                    selectedIssueIds={selectedIssueIds}
                    onIssueSelect={handleIssueSelect}
                    groupByCategory={false}
                  />
                </ScrollArea>
              </TabsContent>
              <TabsContent value="social" className="mt-4">
                <ScrollArea className="h-[250px]">
                  <PredefinedIssuesSelector 
                    issues={socialIssues}
                    selectedIssueIds={selectedIssueIds}
                    onIssueSelect={handleIssueSelect}
                    groupByCategory={false}
                  />
                </ScrollArea>
              </TabsContent>
              <TabsContent value="governance" className="mt-4">
                <ScrollArea className="h-[250px]">
                  <PredefinedIssuesSelector 
                    issues={governanceIssues}
                    selectedIssueIds={selectedIssueIds}
                    onIssueSelect={handleIssueSelect}
                    groupByCategory={false}
                  />
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="p-4 font-semibold bg-muted/50 rounded-t-lg">
            Temi selezionati ({selectedIssues.length})
          </div>
          <ScrollArea className="h-[350px] p-4">
            {selectedIssues.length > 0 ? (
              <div className="space-y-2">
                {selectedIssues.map(issue => (
                  <div 
                    key={issue.id}
                    className="p-3 rounded-md bg-background flex justify-between items-center group hover:bg-muted/50"
                  >
                    <div>
                      <p className="font-medium text-sm">{issue.name}</p>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => onIssueRemove(issue.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Rimuovi tema</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Rimuovi tema</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-sm">
                  Nessun tema selezionato. Clicca sui temi a sinistra per aggiungerli.
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default DragDropThemes;

