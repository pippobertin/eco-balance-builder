
import React, { useState } from 'react';
import { DndContext, closestCenter, MouseSensor, TouchSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { MaterialityIssue } from '../../types';
import { isHeaderTheme } from '../../utils/materialityUtils';
import AvailableIssuesPanel from './AvailableIssuesPanel';
import SelectedIssuesPanel from './SelectedIssuesPanel';
import DragOverlay from './DragOverlay';
import { useToast } from '@/hooks/use-toast';

interface DragDropContainerProps {
  availableIssues: MaterialityIssue[];
  selectedIssues: MaterialityIssue[];
  onIssueSelect: (issue: MaterialityIssue) => void;
}

const DragDropContainer: React.FC<DragDropContainerProps> = ({
  availableIssues,
  selectedIssues,
  onIssueSelect
}) => {
  const { toast } = useToast();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overContainerId, setOverContainerId] = useState<string | null>(null);

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

  // Get sortable item IDs
  const availableItemIds = availableIssues
    .filter(issue => !isHeaderTheme(issue.id, issue.name))
    .map(issue => issue.id);
  
  const selectedItemIds = selectedIssues
    .filter(issue => !isHeaderTheme(issue.id, issue.name))
    .map(issue => issue.id);

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
        title: "Azione non consentita",
        description: `"${draggedIssue.name}" è una categoria principale e non può essere selezionata. Si prega di selezionare solo i temi specifici all'interno delle categorie.`,
        variant: "destructive"
      });
      return;
    }

    // Handle moving between containers
    if (isDroppedInSelected && !draggedIssue.isMaterial) {
      // Move to selected
      const updatedIssue = { ...draggedIssue, isMaterial: true };
      console.log("Moving to selected:", updatedIssue);
      onIssueSelect(updatedIssue);
    } 
    else if (isDroppedInAvailable && draggedIssue.isMaterial) {
      // Move to available
      const updatedIssue = { ...draggedIssue, isMaterial: false };
      console.log("Moving to available:", updatedIssue);
      onIssueSelect(updatedIssue);
    }
  };

  // Find active item for the overlay
  const getActiveItem = () => {
    return [...availableIssues, ...selectedIssues].find(issue => issue.id === activeId);
  };

  // Handle issue selection or deselection
  const handleIssueChange = (issue: MaterialityIssue) => {
    const updatedIssue = { ...issue, isMaterial: !issue.isMaterial };
    onIssueSelect(updatedIssue);
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
        <AvailableIssuesPanel 
          availableIssues={availableIssues}
          availableItemIds={availableItemIds}
          overContainerId={overContainerId}
          activeId={activeId}
          onIssueChange={handleIssueChange}
        />

        <SelectedIssuesPanel 
          selectedIssues={selectedIssues}
          selectedItemIds={selectedItemIds}
          overContainerId={overContainerId}
          activeId={activeId}
          onIssueChange={handleIssueChange}
        />
      </div>

      {activeId && <DragOverlay activeItem={getActiveItem()} />}
    </DndContext>
  );
};

export default DragDropContainer;
