
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MaterialityIssue } from '../types';
import IssueItem from '../IssueItem';
import { GripVertical } from 'lucide-react';

interface DraggableIssueItemProps {
  issue: MaterialityIssue;
  onIssueChange: (id: string, field: keyof MaterialityIssue, value: any) => void;
  onRemoveIssue?: (id: string) => void;
  isPredefined?: boolean;
}

const DraggableIssueItem: React.FC<DraggableIssueItemProps> = ({
  issue,
  onIssueChange,
  onRemoveIssue,
  isPredefined = false
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: issue.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative' as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative group"
    >
      <div 
        className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab opacity-30 group-hover:opacity-100"
        {...listeners}
      >
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>
      <div className="pl-8">
        <IssueItem
          issue={issue}
          onIssueChange={onIssueChange}
          onRemoveIssue={onRemoveIssue}
          isPredefined={isPredefined}
        />
      </div>
    </div>
  );
};

export default DraggableIssueItem;
