
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { MaterialityIssue } from '../../types';
import DraggableIssueItem from '../DraggableIssueItem';

interface SelectedIssuesPanelProps {
  selectedIssues: MaterialityIssue[];
  selectedItemIds: string[];
  overContainerId: string | null;
  activeId: string | null;
  onIssueChange: (issue: MaterialityIssue) => void;
}

const SelectedIssuesPanel: React.FC<SelectedIssuesPanelProps> = ({
  selectedIssues,
  selectedItemIds,
  overContainerId,
  activeId,
  onIssueChange
}) => {
  return (
    <div 
      id="selected-container" 
      className={`border rounded-lg p-2 ${overContainerId === 'selected-container' && activeId ? 'bg-green-50 border-green-300' : ''}`}
    >
      <h3 className="text-base font-semibold mb-2 text-gray-700">Temi Selezionati</h3>
      <ScrollArea className="h-[400px] pr-4">
        <SortableContext items={selectedItemIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {selectedIssues.length === 0 ? (
              <div className="p-4 text-center text-gray-500 italic">
                Nessun tema selezionato. Trascina i temi dalla colonna di sinistra o clicca sul + per aggiungerli.
              </div>
            ) : (
              selectedIssues.map((issue) => (
                <DraggableIssueItem
                  key={issue.id}
                  issue={issue}
                  onIssueChange={() => onIssueChange(issue)}
                  onRemoveIssue={() => onIssueChange(issue)}
                  isPredefined={!issue.id.startsWith('custom-')}
                />
              ))
            )}
          </div>
        </SortableContext>
      </ScrollArea>
    </div>
  );
};

export default SelectedIssuesPanel;
