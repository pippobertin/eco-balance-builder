
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import IssueItem from '../IssueItem';
import { MaterialityIssue } from '../types';
import { isHeaderTheme } from '../utils/materialityUtils';

interface ThemesTabContentProps {
  issues: MaterialityIssue[];
  selectedIssueIds?: Set<string>;
  onIssueSelect?: (issue: any) => void;
  onAddIssue?: (name: string, description: string) => void;
}

const ThemesTabContent: React.FC<ThemesTabContentProps> = ({
  issues,
  selectedIssueIds = new Set(),
  onIssueSelect,
  onAddIssue
}) => {
  // Filter out header themes
  const nonHeaderIssues = issues.filter(issue => !isHeaderTheme(issue.id, issue.name));
  
  // Separate issues into available and selected
  const availableIssues = nonHeaderIssues.filter(issue => !issue.isMaterial);
  const selectedIssues = nonHeaderIssues.filter(issue => issue.isMaterial);
  
  // Also get header themes for display purposes only
  const headerIssues = issues.filter(issue => isHeaderTheme(issue.id, issue.name));

  // Function to handle issue selection or deselection
  const handleIssueChange = (issue: MaterialityIssue, field: keyof MaterialityIssue, value: any) => {
    if (onIssueSelect && field === 'isMaterial') {
      onIssueSelect({ ...issue, isMaterial: value });
    }
  };

  // Group headers with their respective issues in the available column
  const organizeAvailableIssues = () => {
    // First, render all headers
    return (
      <>
        {headerIssues.map((issue) => (
          <IssueItem
            key={issue.id}
            issue={issue}
            onIssueChange={() => {}} // Headers cannot be selected
            isPredefined={true}
          />
        ))}
        
        {/* Then render all available non-header issues */}
        {availableIssues.map((issue) => (
          <IssueItem
            key={issue.id}
            issue={issue}
            onIssueChange={(id, field, value) => handleIssueChange(issue, field, value)}
            isPredefined={!issue.id.startsWith('custom-')}
          />
        ))}
      </>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left column: available themes */}
      <div>
        <h3 className="text-base font-semibold mb-2 text-gray-700">Temi Disponibili</h3>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {organizeAvailableIssues()}
          </div>
        </ScrollArea>
      </div>

      {/* Right column: selected themes */}
      <div>
        <h3 className="text-base font-semibold mb-2 text-gray-700">Temi Selezionati</h3>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {selectedIssues.length === 0 ? (
              <div className="p-4 text-center text-gray-500 italic">
                Nessun tema selezionato. Seleziona i temi dalla colonna di sinistra.
              </div>
            ) : (
              selectedIssues.map((issue) => (
                <IssueItem
                  key={issue.id}
                  issue={issue}
                  onIssueChange={(id, field, value) => handleIssueChange(issue, field, value)}
                  onRemoveIssue={() => {
                    if (onIssueSelect) {
                      onIssueSelect({ ...issue, isMaterial: false });
                    }
                  }}
                  isPredefined={!issue.id.startsWith('custom-')}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ThemesTabContent;
