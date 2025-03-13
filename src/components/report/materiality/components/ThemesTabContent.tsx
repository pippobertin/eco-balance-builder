import React, { useState, useEffect, useRef } from 'react';
import { MaterialityIssue } from '../types';
import DragDropContainer from './drag-drop';

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
  // Track which issues are currently available and which are selected
  const [availableIssues, setAvailableIssues] = useState<MaterialityIssue[]>([]);
  const [selectedIssues, setSelectedIssues] = useState<MaterialityIssue[]>([]);
  
  // Keep track of the previous selected IDs to detect changes
  const prevSelectedIdsRef = useRef<Set<string>>(new Set());
  
  // Maintain the original order of all issues for proper repositioning
  const [originalIssueOrder, setOriginalIssueOrder] = useState<MaterialityIssue[]>([]);

  // Initialize issues when component mounts or issues/selectedIssueIds change
  useEffect(() => {
    // Force update when tab changes to ensure proper state
    console.log(`ThemesTabContent [${tabId}]: Effect running, issues length=${issues.length}, selectedIds=${Array.from(selectedIssueIds).join(',')}`);
    
    // Always update when the tab or issues change
    console.log(`ThemesTabContent [${tabId}]: Updating issue lists based on selectedIssueIds:`, 
      Array.from(selectedIssueIds));
    
    const available: MaterialityIssue[] = [];
    const selected: MaterialityIssue[] = [];
    
    // Save the original order of all issues
    setOriginalIssueOrder([...issues]);
    
    // Process issues for this specific tab
    issues.forEach(issue => {
      // Create a deep copy of the issue to prevent reference issues
      const issueCopy = JSON.parse(JSON.stringify(issue));
      
      // Check if this issue is in the selectedIssueIds set
      if (selectedIssueIds.has(issueCopy.id)) {
        console.log(`ThemesTabContent [${tabId}]: Issue is selected by ID:`, issueCopy.id);
        // Ensure isMaterial is explicitly true
        issueCopy.isMaterial = true;
        selected.push(issueCopy);
      } else {
        console.log(`ThemesTabContent [${tabId}]: Issue is not material:`, issueCopy.id);
        // Ensure isMaterial is explicitly false for available issues
        issueCopy.isMaterial = false;
        available.push(issueCopy);
      }
    });
    
    setAvailableIssues(available);
    setSelectedIssues(selected);
    
    console.log(`ThemesTabContent [${tabId}]: Available issues:`, available.length);
    console.log(`ThemesTabContent [${tabId}]: Selected issues:`, selected.length);
    
    // Update the previous selected IDs ref
    prevSelectedIdsRef.current = new Set(selectedIssueIds);
  }, [issues, selectedIssueIds, tabId]);

  // Function to handle issue selection or deselection
  const handleIssueSelect = (issue: MaterialityIssue) => {
    if (onIssueSelect) {
      console.log(`ThemesTabContent [${tabId}] handling issue select:`, issue.id, "isMaterial was:", issue.isMaterial);
      
      // Simply pass the issue to the parent handler, as isMaterial should already be set correctly
      onIssueSelect(issue);
      
      // Here we update local state for immediate UI feedback
      if (issue.isMaterial === true) {
        // Issue is being selected (moved to selected panel)
        setAvailableIssues(prev => prev.filter(i => i.id !== issue.id));
        setSelectedIssues(prev => [...prev, issue]);
      } else {
        // Issue is being deselected (moved to available panel)
        setSelectedIssues(prev => prev.filter(i => i.id !== issue.id));
        setAvailableIssues(prev => [...prev, issue]);
      }
    }
  };

  return (
    <DragDropContainer
      availableIssues={availableIssues}
      selectedIssues={selectedIssues}
      onIssueSelect={handleIssueSelect}
      tabId={tabId}
    />
  );
};

export default ThemesTabContent;
