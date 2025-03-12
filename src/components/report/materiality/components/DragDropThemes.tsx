
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ESRSThemeFilter from './ESRSThemeFilter';
import PredefinedIssuesSelector from './PredefinedIssuesSelector';
import { predefinedIssues } from '../utils/materialityUtils';
import { useToast } from '@/hooks/use-toast';

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
  const [filteredIssues, setFilteredIssues] = useState(predefinedIssues);
  const { toast } = useToast();
  
  // Filter issues based on selected categories
  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilteredIssues(predefinedIssues);
    } else {
      const filtered = predefinedIssues.filter(issue => 
        selectedCategories.includes(issue.category)
      );
      setFilteredIssues(filtered);
    }
  }, [selectedCategories]);
  
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
          <ScrollArea className="h-[300px] p-4">
            <PredefinedIssuesSelector 
              issues={filteredIssues}
              selectedIssueIds={selectedIssueIds}
              onIssueSelect={handleIssueSelect}
            />
          </ScrollArea>
        </div>
        
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="p-4 font-semibold bg-muted/50 rounded-t-lg">
            Temi selezionati ({selectedIssues.length})
          </div>
          <ScrollArea className="h-[300px] p-4">
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
