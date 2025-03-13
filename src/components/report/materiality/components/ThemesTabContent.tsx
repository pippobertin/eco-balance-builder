
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import IssueItem from '../IssueItem';
import { MaterialityIssue } from '../types';
import { isHeaderTheme } from '../utils/materialityUtils';
import { DndContext, closestCenter, MouseSensor, TouchSensor, useSensor, useSensors, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
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
  const [availableIssues, setAvailableIssues] = useState<MaterialityIssue[]>([]);
  const [selectedIssues, setSelectedIssues] = useState<MaterialityIssue[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Initialize issues when component mounts or issues prop changes
  useEffect(() => {
    setAvailableIssues(issues.filter(issue => !issue.isMaterial));
    setSelectedIssues(issues.filter(issue => issue.isMaterial));
  }, [issues]);

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

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over) return;
    
    // Find container IDs
    const isDroppedInSelected = over.id === 'selected-container' || 
                               (typeof over.id === 'string' && selectedIssues.some(issue => issue.id === over.id));
    
    const isDroppedInAvailable = over.id === 'available-container' || 
                                (typeof over.id === 'string' && availableIssues.some(issue => issue.id === over.id));
    
    // Find the issue that was dragged
    const draggedIssueFromAvailable = availableIssues.find(issue => issue.id === active.id);
    const draggedIssueFromSelected = selectedIssues.find(issue => issue.id === active.id);
    
    if (draggedIssueFromAvailable && isDroppedInSelected) {
      // Moving from Available to Selected
      if (!isHeaderTheme(draggedIssueFromAvailable.id, draggedIssueFromAvailable.name)) {
        const updatedIssue = { ...draggedIssueFromAvailable, isMaterial: true };
        
        // Call parent handler
        if (onIssueSelect) {
          onIssueSelect(updatedIssue);
        }
        
        // Update local state
        setAvailableIssues(prev => prev.filter(i => i.id !== draggedIssueFromAvailable.id));
        setSelectedIssues(prev => [...prev, updatedIssue]);
      }
    } else if (draggedIssueFromSelected && isDroppedInAvailable) {
      // Moving from Selected to Available
      if (!isHeaderTheme(draggedIssueFromSelected.id, draggedIssueFromSelected.name)) {
        const updatedIssue = { ...draggedIssueFromSelected, isMaterial: false };
        
        // Call parent handler
        if (onIssueSelect) {
          onIssueSelect(updatedIssue);
        }
        
        // Update local state
        setSelectedIssues(prev => prev.filter(i => i.id !== draggedIssueFromSelected.id));
        setAvailableIssues(prev => [...prev, updatedIssue]);
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

  // Get sortable item IDs for DnD context
  const availableItemIds = availableIssues
    .filter(issue => !isHeaderTheme(issue.id, issue.name))
    .map(issue => issue.id);
  
  const selectedItemIds = selectedIssues
    .filter(issue => !isHeaderTheme(issue.id, issue.name))
    .map(issue => issue.id);

  // Find active item
  const getActiveItem = () => {
    const fromAvailable = availableIssues.find(issue => issue.id === activeId);
    const fromSelected = selectedIssues.find(issue => issue.id === activeId);
    return fromAvailable || fromSelected;
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Colonna sinistra: temi disponibili */}
        <div id="available-container">
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
                      onIssueChange={(id, field, value) => handleIssueChange(issue, field, value)}
                      isPredefined={!issue.id.startsWith('custom-')}
                    />
                  )
                ))}
              </div>
            </SortableContext>
          </ScrollArea>
        </div>

        {/* Colonna destra: temi selezionati */}
        <div id="selected-container">
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
                      onIssueChange={(id, field, value) => handleIssueChange(issue, field, value)}
                      onRemoveIssue={() => handleRemoveIssue(issue.id)}
                      isPredefined={!issue.id.startsWith('custom-')}
                    />
                  ))
                )}
              </div>
            </SortableContext>
          </ScrollArea>
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="p-4 rounded-lg border bg-white border-blue-300 shadow-lg opacity-80">
            {getActiveItem()?.name}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default ThemesTabContent;
