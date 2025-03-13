
import React, { useEffect } from 'react';
import { MaterialityIssue } from '../types';
import DragDropContainer from './drag-drop';
import { useThemeSelection } from '../hooks/useThemeSelection';

interface ThemesTabContentProps {
  issues: MaterialityIssue[];
  selectedIssueIds?: Set<string>;
  onIssueSelect?: (issue: MaterialityIssue) => void;
  onAddIssue?: (name: string, description: string) => void;
  allAvailableIssues?: MaterialityIssue[]; // All issues across all tabs
  tabId?: string; // ID of the current tab (environmental, social, governance)
}

const ThemesTabContent: React.FC<ThemesTabContentProps> = ({
  issues,
  selectedIssueIds = new Set(),
  onIssueSelect,
  onAddIssue,
  allAvailableIssues = [],
  tabId = ''
}) => {
  const { availableIssues, selectedIssues, handleIssueSelect } = useThemeSelection({
    issues,
    selectedIssueIds,
    onIssueSelect,
    tabId
  });

  // Preserve the selected issues when switching tabs
  useEffect(() => {
    console.log(`ThemesTabContent [${tabId}]: Tab mounted/updated with ${selectedIssues.length} selected issues`);
  }, [tabId, selectedIssues.length]);

  return (
    <DragDropContainer
      availableIssues={availableIssues}
      // Filter out deselected issues from the selected issues list
      selectedIssues={selectedIssues.filter(issue => issue.isMaterial === true)}
      onIssueSelect={handleIssueSelect}
      tabId={tabId}
    />
  );
};

export default ThemesTabContent;
