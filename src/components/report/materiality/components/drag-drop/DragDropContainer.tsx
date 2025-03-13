
import React from 'react';
import { MaterialityIssue } from '../../types';
import AvailableIssuesPanel from './AvailableIssuesPanel';
import SelectedIssuesPanel from '../SelectedIssuesPanel';
import { useDragDropState } from '../../hooks/useDragDropState';
import { useIssueOperations } from '../../hooks/useIssueOperations';

interface DragDropContainerProps {
  availableIssues: MaterialityIssue[];
  selectedIssues: MaterialityIssue[];
  onIssueSelect: (issue: MaterialityIssue) => void;
  tabId?: string;
}

const DragDropContainer: React.FC<DragDropContainerProps> = ({
  availableIssues,
  selectedIssues,
  onIssueSelect,
  tabId = ''
}) => {
  // Use our custom hooks for state management and issue operations
  const {
    localAvailable,
    localSelected,
    lastOperationRef,
    skipNextPropsUpdateRef,
    knownSelectionsRef,
    explicitlyDeselectedRef,
    allSeenIssuesRef,
    setLocalAvailable,
    setLocalSelected,
    toast
  } = useDragDropState({
    availableIssues,
    selectedIssues,
    onIssueSelect,
    tabId
  });

  const { handleIssueClick } = useIssueOperations({
    onIssueSelect,
    lastOperationRef,
    skipNextPropsUpdateRef,
    knownSelectionsRef,
    explicitlyDeselectedRef,
    allSeenIssuesRef,
    setLocalAvailable,
    setLocalSelected,
    localAvailable,
    toast,
    tabId
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AvailableIssuesPanel 
        availableIssues={localAvailable}
        onIssueClick={handleIssueClick}
        tabId={tabId}
      />

      <SelectedIssuesPanel 
        selectedIssues={localSelected}
        onIssueClick={handleIssueClick}
        tabId={tabId}
      />
    </div>
  );
};

export default DragDropContainer;
