
import React from 'react';
import { MaterialityIssue } from '../types';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface SelectedIssuesPanelProps {
  selectedIssues: MaterialityIssue[];
  onIssueClick: (issue: MaterialityIssue) => void;
  tabId?: string;
}

const SelectedIssuesPanel: React.FC<SelectedIssuesPanelProps> = ({ 
  selectedIssues, 
  onIssueClick,
  tabId = ''
}) => {
  const { toast } = useToast();

  // Handle issue removal - wrapper for onIssueClick
  const handleIssueRemove = (issue: MaterialityIssue) => {
    try {
      // Debug log for tracking
      console.log(`SelectedIssuesPanel [${tabId}]: Removing issue`, issue.id, issue.name);
      
      // Create a deep copy of the issue to prevent reference issues
      const updatedIssue = structuredClone(issue);
      
      // Set isMaterial to a strict boolean false - This is crucial
      updatedIssue.isMaterial = false;
      
      console.log(`SelectedIssuesPanel [${tabId}]: Set isMaterial to`, updatedIssue.isMaterial, "type:", typeof updatedIssue.isMaterial);
      
      // Immediately call onIssueClick with the updated issue
      onIssueClick(updatedIssue);
      
      // Show toast for user feedback
      toast({
        title: "Tema rimosso",
        description: `"${issue.name}" è stato rimosso dai temi selezionati.`,
        variant: "default"
      });
    } catch (error) {
      console.error(`SelectedIssuesPanel [${tabId}]: Error removing issue:`, error);
      toast({
        title: "Errore nella rimozione",
        description: "Si è verificato un errore durante la rimozione del tema. Riprova.",
        variant: "destructive"
      });
    }
  };

  // Explicitly filter out any issues with isMaterial === false
  const filteredSelectedIssues = React.useMemo(() => {
    return selectedIssues.filter(issue => issue.isMaterial === true);
  }, [selectedIssues]);

  // Deduplicate the filtered selected issues
  const uniqueSelectedIssues = React.useMemo(() => {
    const seenIds = new Set<string>();
    return filteredSelectedIssues.filter(issue => {
      if (seenIds.has(issue.id)) {
        return false;
      }
      seenIds.add(issue.id);
      return true;
    });
  }, [filteredSelectedIssues]);

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="p-4 font-semibold bg-muted/50 rounded-t-lg">
        Temi selezionati ({uniqueSelectedIssues.length})
      </div>
      <ScrollArea className="h-[350px] p-4">
        {uniqueSelectedIssues.length > 0 ? (
          <div className="space-y-2">
            {uniqueSelectedIssues.map(issue => (
              <div 
                key={issue.id}
                className="p-3 rounded-md bg-background flex justify-between items-center group hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium text-sm">{issue.name}</p>
                  {issue.impactRelevance !== undefined && (
                    <p className="text-xs text-muted-foreground">
                      Impatto: {issue.impactRelevance}% | Finanziario: {issue.financialRelevance}%
                    </p>
                  )}
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-70 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleIssueRemove(issue)}
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
  );
};

export default SelectedIssuesPanel;
