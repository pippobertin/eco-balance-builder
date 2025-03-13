
import React from 'react';
import { MaterialityIssue } from '../types';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SelectedIssuesPanelProps {
  selectedIssues: MaterialityIssue[];
  onIssueClick: (issue: MaterialityIssue) => void;
}

const SelectedIssuesPanel: React.FC<SelectedIssuesPanelProps> = ({ 
  selectedIssues, 
  onIssueClick 
}) => {
  // Handle issue removal - wrapper for onIssueClick
  const handleIssueRemove = (issue: MaterialityIssue) => {
    console.log("SelectedIssuesPanel: Removing issue", issue.id, issue.name);
    // Clone issue and force isMaterial to false (should be handled by DragDropContainer as well)
    const updatedIssue = { ...issue, isMaterial: false };
    onIssueClick(updatedIssue);
  };

  return (
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
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
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
