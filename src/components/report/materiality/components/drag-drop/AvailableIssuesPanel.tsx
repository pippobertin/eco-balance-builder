
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { MaterialityIssue } from '../../types';
import { isHeaderTheme } from '../../utils/materialityUtils';
import IssueItem from '../../IssueItem';
import DraggableIssueItem from '../DraggableIssueItem';

interface AvailableIssuesPanelProps {
  availableIssues: MaterialityIssue[];
  availableItemIds: string[];
  overContainerId: string | null;
  activeId: string | null;
  onIssueChange: (issue: MaterialityIssue) => void;
}

const AvailableIssuesPanel: React.FC<AvailableIssuesPanelProps> = ({
  availableIssues,
  availableItemIds,
  overContainerId,
  activeId,
  onIssueChange
}) => {
  return (
    <div 
      id="available-container"
      className={`border rounded-lg p-2 ${overContainerId === 'available-container' && activeId ? 'bg-blue-50 border-blue-300' : ''}`}
    >
      <h3 className="text-base font-semibold mb-2 text-gray-700">Temi Disponibili</h3>
      <ScrollArea className="h-[400px] pr-4">
        <SortableContext items={availableItemIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {availableIssues.map((issue) => (
              isHeaderTheme(issue.id, issue.name) ? (
                <IssueItem
                  key={issue.id}
                  issue={issue}
                  onIssueChange={(id, field, value) => {}}
                  isPredefined={!issue.id.startsWith('custom-')}
                />
              ) : (
                <DraggableIssueItem
                  key={issue.id}
                  issue={issue}
                  onIssueChange={() => onIssueChange(issue)}
                  isPredefined={!issue.id.startsWith('custom-')}
                />
              )
            ))}
            
            {availableIssues.length === 0 && (
              <div className="p-4 text-center text-gray-500 italic">
                Tutti i temi sono stati selezionati.
              </div>
            )}
          </div>
        </SortableContext>
      </ScrollArea>
    </div>
  );
};

export default AvailableIssuesPanel;
