
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import IssueItem from '../IssueItem';
import { MaterialityIssue } from '../types';
import { isHeaderTheme } from '../utils/materialityUtils';
import { DndContext, closestCenter, MouseSensor, TouchSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableIssueItem from './DraggableIssueItem';

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
  // Track which issues are currently available and which are selected
  const [availableIssues, setAvailableIssues] = useState<MaterialityIssue[]>(
    issues.filter(issue => !issue.isMaterial)
  );
  const [selectedIssues, setSelectedIssues] = useState<MaterialityIssue[]>(
    issues.filter(issue => issue.isMaterial)
  );

  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  // Function to handle issue selection or deselection
  const handleIssueChange = (issue: MaterialityIssue, field: keyof MaterialityIssue, value: any) => {
    if (onIssueSelect && field === 'isMaterial') {
      const updatedIssue = { ...issue, isMaterial: value };
      onIssueSelect(updatedIssue);
      
      if (value) {
        // Move to selected
        setAvailableIssues(prev => prev.filter(i => i.id !== issue.id));
        setSelectedIssues(prev => [...prev, updatedIssue]);
      } else {
        // Move back to available
        setSelectedIssues(prev => prev.filter(i => i.id !== issue.id));
        setAvailableIssues(prev => [...prev, updatedIssue]);
      }
    }
  };

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // Find the issue that was dragged
      const draggedIssue = availableIssues.find(issue => issue.id === active.id);
      
      if (draggedIssue && !isHeaderTheme(draggedIssue.id, draggedIssue.name)) {
        // Mark as material and move to selected
        const updatedIssue = { ...draggedIssue, isMaterial: true };
        
        // Call parent component's handler
        if (onIssueSelect) {
          onIssueSelect(updatedIssue);
        }
        
        // Update local state
        setAvailableIssues(prev => prev.filter(i => i.id !== draggedIssue.id));
        setSelectedIssues(prev => [...prev, updatedIssue]);
      }
    }
  };

  // Handle removing an issue from selected
  const handleRemoveIssue = (issueId: string) => {
    const issueToRemove = selectedIssues.find(issue => issue.id === issueId);
    
    if (issueToRemove) {
      const updatedIssue = { ...issueToRemove, isMaterial: false };
      
      // Call parent component's handler
      if (onIssueSelect) {
        onIssueSelect(updatedIssue);
      }
      
      // Update local state
      setSelectedIssues(prev => prev.filter(i => i.id !== issueId));
      setAvailableIssues(prev => [...prev, updatedIssue]);
    }
  };

  React.useEffect(() => {
    // Update our state whenever the issues prop changes
    setAvailableIssues(issues.filter(issue => !issue.isMaterial));
    setSelectedIssues(issues.filter(issue => issue.isMaterial));
  }, [issues]);

  // Get sortable item IDs for DnD context
  const availableItemIds = availableIssues.map(issue => issue.id);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Colonna sinistra: temi disponibili */}
      <div>
        <h3 className="text-base font-semibold mb-2 text-gray-700">Temi Disponibili</h3>
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToParentElement]}
        >
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
                      onIssueChange={(id, field, value) => handleIssueChange(issue, field, value)}
                      isPredefined={!issue.id.startsWith('custom-')}
                    />
                  )
                ))}
              </div>
            </SortableContext>
          </ScrollArea>
        </DndContext>
      </div>

      {/* Colonna destra: temi selezionati */}
      <div>
        <h3 className="text-base font-semibold mb-2 text-gray-700">Temi Selezionati</h3>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {selectedIssues.length === 0 ? (
              <div className="p-4 text-center text-gray-500 italic">
                Nessun tema selezionato. Trascina i temi dalla colonna di sinistra o clicca sul + per aggiungerli.
              </div>
            ) : (
              selectedIssues.map((issue) => (
                <IssueItem
                  key={issue.id}
                  issue={issue}
                  onIssueChange={(id, field, value) => handleIssueChange(issue, field, value)}
                  onRemoveIssue={() => handleRemoveIssue(issue.id)}
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
