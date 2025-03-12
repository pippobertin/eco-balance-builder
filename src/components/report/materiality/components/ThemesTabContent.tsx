
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
  // Separa gli issues in disponibili e selezionati
  const availableIssues = issues.filter(issue => !issue.isMaterial);
  const selectedIssues = issues.filter(issue => issue.isMaterial);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Colonna sinistra: temi disponibili */}
      <div>
        <h3 className="text-base font-semibold mb-2 text-gray-700">Temi Disponibili</h3>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {availableIssues.map((issue) => (
              <IssueItem
                key={issue.id}
                issue={issue}
                onIssueChange={(id, field, value) => {
                  if (onIssueSelect && field === 'isMaterial') {
                    onIssueSelect({ ...issue, isMaterial: value });
                  }
                }}
                isPredefined={!issue.id.startsWith('custom-')}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Colonna destra: temi selezionati */}
      <div>
        <h3 className="text-base font-semibold mb-2 text-gray-700">Temi Selezionati</h3>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {selectedIssues.map((issue) => (
              <IssueItem
                key={issue.id}
                issue={issue}
                onIssueChange={(id, field, value) => {
                  if (onIssueSelect && field === 'isMaterial') {
                    onIssueSelect({ ...issue, isMaterial: value });
                  }
                }}
                onRemoveIssue={(id) => {
                  if (onIssueSelect) {
                    onIssueSelect({ ...issue, isMaterial: false });
                  }
                }}
                isPredefined={!issue.id.startsWith('custom-')}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ThemesTabContent;
