
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MaterialityIssue } from '../../types';
import { isHeaderTheme } from '../../utils/materialityUtils';
import IssueItem from '../../IssueItem';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface AvailableIssuesPanelProps {
  availableIssues: MaterialityIssue[];
  onIssueClick: (issue: MaterialityIssue) => void;
  tabId?: string;
}

const AvailableIssuesPanel: React.FC<AvailableIssuesPanelProps> = ({
  availableIssues,
  onIssueClick,
  tabId = ''
}) => {
  // When clicking on an issue from the available panel, we want to select it (set isMaterial to true)
  const handleIssueClick = (issue: MaterialityIssue) => {
    // Don't allow clicking on header themes
    if (isHeaderTheme(issue.id, issue.name)) return;
    
    console.log(`AvailableIssuesPanel [${tabId}]: Clicking to select issue:`, issue.id);
    
    // Pass the issue directly to the parent component
    // The parent (DragDropContainer) is responsible for creating a clean copy and toggling isMaterial
    onIssueClick(issue);
  };

  return (
    <div id="available-container" className="border rounded-lg p-2">
      <h3 className="text-base font-semibold mb-2 text-gray-700">Temi Disponibili</h3>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-2">
          {availableIssues.map((issue) => (
            <div key={issue.id} className={`${isHeaderTheme(issue.id, issue.name) ? '' : 'cursor-pointer hover:bg-blue-50'}`}>
              {isHeaderTheme(issue.id, issue.name) ? (
                <IssueItem
                  key={issue.id}
                  issue={issue}
                  onIssueChange={(id, field, value) => {}}
                  isPredefined={!issue.id.startsWith('custom-')}
                />
              ) : (
                <div 
                  className="p-4 rounded-lg border mb-2 bg-white border-gray-100 flex justify-between items-center hover:bg-blue-50"
                  onClick={() => handleIssueClick(issue)}
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
                    className="text-blue-600 hover:text-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleIssueClick(issue);
                    }}
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span className="sr-only">Aggiungi tema</span>
                  </Button>
                </div>
              )}
            </div>
          ))}
          
          {availableIssues.length === 0 && (
            <div className="p-4 text-center text-gray-500 italic">
              Tutti i temi sono stati selezionati.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AvailableIssuesPanel;
