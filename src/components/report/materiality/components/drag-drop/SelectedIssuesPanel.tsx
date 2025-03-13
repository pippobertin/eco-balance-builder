
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MaterialityIssue } from '../../types';
import { Button } from '@/components/ui/button';
import { MinusCircle } from 'lucide-react';

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
  // Handle removing an issue from selected panel
  const handleIssueClick = (issue: MaterialityIssue) => {
    console.log(`SelectedIssuesPanel [${tabId}]: Clicking to remove issue:`, issue.id);
    onIssueClick(issue);
  };

  return (
    <div id="selected-container" className="border rounded-lg p-2">
      <h3 className="text-base font-semibold mb-2 text-gray-700">Temi Selezionati</h3>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-2">
          {selectedIssues.length === 0 ? (
            <div className="p-4 text-center text-gray-500 italic">
              Nessun tema selezionato. Clicca sui temi dalla colonna di sinistra per aggiungerli.
            </div>
          ) : (
            selectedIssues.map((issue) => (
              <div 
                key={issue.id}
                className="p-4 rounded-lg border mb-2 bg-white border-gray-100 hover:bg-red-50 cursor-pointer flex justify-between items-center"
              >
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{issue.name}</h4>
                  {issue.description && (
                    <p className="mt-1 text-sm text-gray-500">{issue.description}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIssueClick(issue);
                  }}
                >
                  <MinusCircle className="h-4 w-4" />
                  <span className="sr-only">Rimuovi tema</span>
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SelectedIssuesPanel;
