
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import IssueItem from '../IssueItem';
import { MaterialityIssue } from '../types';
import { isHeaderTheme } from '../utils/materialityUtils';
import { DndContext, closestCenter, MouseSensor, TouchSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableIssueItem from './DraggableIssueItem';
import { useToast } from '@/hooks/use-toast';

interface ThemesTabContentProps {
  issues: MaterialityIssue[];
  selectedIssueIds?: Set<string>;
  onIssueSelect?: (issue: MaterialityIssue) => void;
  onAddIssue?: (name: string, description: string) => void;
}

const ThemesTabContent: React.FC<ThemesTabContentProps> = ({
  issues,
  selectedIssueIds = new Set(),
  onIssueSelect,
  onAddIssue
}) => {
  const { toast } = useToast();
  
  // Track which issues are currently available and which are selected
  const [availableIssues, setAvailableIssues] = useState<MaterialityIssue[]>([]);
  const [selectedIssues, setSelectedIssues] = useState<MaterialityIssue[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overContainerId, setOverContainerId] = useState<string | null>(null);

  // Initialize issues when component mounts or issues prop changes
  useEffect(() => {
    const available: MaterialityIssue[] = [];
    const selected: MaterialityIssue[] = [];
    
    issues.forEach(issue => {
      if (issue.isMaterial) {
        selected.push(issue);
      } else {
        available.push(issue);
      }
    });
    
    setAvailableIssues(available);
    setSelectedIssues(selected);
    
    console.log("Available issues:", available.length);
    console.log("Selected issues:", selected.length);
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
  const handleIssueChange = (issue: MaterialityIssue) => {
    if (onIssueSelect) {
      const updatedIssue = { ...issue, isMaterial: !issue.isMaterial };
      onIssueSelect(updatedIssue);
    }
  };

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };
  
  // Handle drag over to track which container we're hovering
  const handleDragOver = (event: DragOverEvent) => {
    const containerId = event.over?.id as string;
    if (containerId === 'available-container' || containerId === 'selected-container') {
      setOverContainerId(containerId);
    }
  };

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Reset the active ID
    setActiveId(null);
    setOverContainerId(null);
    
    if (!over) return;
    
    // Check for container drop targets
    const isDroppedInSelected = over.id === 'selected-container' || 
                               (selectedIssues.some(issue => issue.id === over.id));
    
    const isDroppedInAvailable = over.id === 'available-container' || 
                                (availableIssues.some(issue => issue.id === over.id));
    
    console.log(`Dragged item ${active.id} dropped over ${over.id}`);
    console.log(`Dropped in selected: ${isDroppedInSelected}`);
    console.log(`Dropped in available: ${isDroppedInAvailable}`);
    
    // Find the issue being dragged
    const draggedIssue = [...availableIssues, ...selectedIssues].find(issue => issue.id === active.id);
    
    if (!draggedIssue) {
      console.log("Couldn't find dragged issue:", active.id);
      return;
    }
    
    // Prevent dragging header themes
    if (isHeaderTheme(draggedIssue.id, draggedIssue.name)) {
      console.log("Cannot drag header theme:", draggedIssue.name);
      toast({
        title: "Operazione non consentita",
        description: "I temi header non possono essere selezionati",
        variant: "destructive"
      });
      return;
    }
    
    // Handle moving between containers
    if (isDroppedInSelected && !draggedIssue.isMaterial) {
      // Move to selected
      if (onIssueSelect) {
        const updatedIssue = { ...draggedIssue, isMaterial: true };
        console.log("Moving to selected:", updatedIssue);
        onIssueSelect(updatedIssue);
        
        // Update local state for immediate UI feedback
        setAvailableIssues(prev => prev.filter(i => i.id !== draggedIssue.id));
        setSelectedIssues(prev => [...prev, { ...draggedIssue, isMaterial: true }]);
      }
    } 
    else if (isDroppedInAvailable && draggedIssue.isMaterial) {
      // Move to available
      if (onIssueSelect) {
        const updatedIssue = { ...draggedIssue, isMaterial: false };
        console.log("Moving to available:", updatedIssue);
        onIssueSelect(updatedIssue);
        
        // Update local state for immediate UI feedback
        setSelectedIssues(prev => prev.filter(i => i.id !== draggedIssue.id));
        setAvailableIssues(prev => [...prev, { ...draggedIssue, isMaterial: false }]);
      }
    }
  };

  // Get sortable item IDs
  const availableItemIds = availableIssues
    .filter(issue => !isHeaderTheme(issue.id, issue.name))
    .map(issue => issue.id);
  
  const selectedItemIds = selectedIssues
    .filter(issue => !isHeaderTheme(issue.id, issue.name))
    .map(issue => issue.id);

  // Find active item for the overlay
  const getActiveItem = () => {
    return [...availableIssues, ...selectedIssues].find(issue => issue.id === activeId);
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Colonna sinistra: temi disponibili */}
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
                      onIssueChange={() => handleIssueChange(issue)}
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

        {/* Colonna destra: temi selezionati */}
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
                      onIssueChange={() => handleIssueChange(issue)}
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
            </SortableContext>
          </ScrollArea>
        </div>
      </div>

      {activeId && (
        <div 
          className="fixed pointer-events-none top-0 left-0 w-full h-full z-50"
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
          }}
        >
          <div className="p-3 rounded-lg border bg-white border-blue-300 shadow-lg opacity-90 max-w-xs">
            {getActiveItem()?.name}
          </div>
        </div>
      )}
    </DndContext>
  );
};

export default ThemesTabContent;
