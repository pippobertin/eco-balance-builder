
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

  // Filter out any deselected issues in the selected list
  const filteredSelectedIssues = React.useMemo(() => {
    return selectedIssues.filter(issue => issue.isMaterial === true);
  }, [selectedIssues]);

  // Preserve the selected issues when switching tabs
  useEffect(() => {
    console.log(`ThemesTabContent [${tabId}]: Tab mounted/updated with ${filteredSelectedIssues.length} selected issues`);
    
    // Log all selected issues for debugging
    if (filteredSelectedIssues.length > 0) {
      console.log(`ThemesTabContent [${tabId}]: Selected issues:`, 
        filteredSelectedIssues.map(i => ({id: i.id, name: i.name, isMaterial: i.isMaterial})));
    }
  }, [tabId, filteredSelectedIssues]);

  // Custom handler to ensure proper deselection
  const handleWrappedIssueSelect = (issue: MaterialityIssue) => {
    // Ensure the isMaterial property is a proper boolean
    const updatedIssue = {
      ...issue,
      isMaterial: issue.isMaterial === true
    };
    
    console.log(`ThemesTabContent [${tabId}]: Handling issue selection for:`, 
      updatedIssue.id, "isMaterial:", updatedIssue.isMaterial, "type:", typeof updatedIssue.isMaterial);
    
    // Pass to the theme selection handler
    handleIssueSelect(updatedIssue);
  };

  return (
    <DragDropContainer
      availableIssues={availableIssues}
      selectedIssues={filteredSelectedIssues}
      onIssueSelect={handleWrappedIssueSelect}
      tabId={tabId}
    />
  );
};

export default ThemesTabContent;
