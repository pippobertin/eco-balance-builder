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
    // Log for debugging
    console.log(`ThemesTabContent [${tabId}]: Effect running, issues length=${issues.length}, selectedIds=${Array.from(selectedIssueIds).join(',')}`);
    
    const available: MaterialityIssue[] = [];
    const selected: MaterialityIssue[] = [];
    
    // Save the original order of all issues
    setOriginalIssueOrder([...issues]);
    
    // Process issues for this specific tab
    issues.forEach(issue => {
      // Create a deep copy of the issue to prevent reference issues
      const issueCopy = { ...issue };
      
      // Check if this issue is in the selectedIssueIds set
      if (selectedIssueIds.has(issueCopy.id)) {
        console.log(`ThemesTabContent [${tabId}]: Issue is selected by ID:`, issueCopy.id);
        // Ensure isMaterial is explicitly true (BOOLEAN)
        issueCopy.isMaterial = true;
        selected.push(issueCopy);
      } else {
        console.log(`ThemesTabContent [${tabId}]: Issue is not material:`, issueCopy.id);
        // Ensure isMaterial is explicitly false for available issues (BOOLEAN)
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
    if (!onIssueSelect) return;
    
    console.log(`ThemesTabContent [${tabId}] handling issue select:`, issue.id, "isMaterial:", issue.isMaterial, "type:", typeof issue.isMaterial);
    
    // Pass along to parent component - the parent will create a clean copy with toggled isMaterial
    onIssueSelect(issue);
    
    // CRITICAL FIX: Update local state immediately for UI feedback
    // Check if issue is being selected (toggled to true) or deselected (toggled to false)
    // Since we are toggling in DragDropContainer, we need to do the opposite of current state
    const willBeSelected = !issue.isMaterial;
    
    if (willBeSelected) {
      // Issue is being selected (moved to selected panel)
      setAvailableIssues(prev => prev.filter(i => i.id !== issue.id));
      const issueWithMaterial = { ...issue, isMaterial: true };
      setSelectedIssues(prev => [...prev, issueWithMaterial]);
    } else {
      // Issue is being deselected (moved to available panel)
      setSelectedIssues(prev => prev.filter(i => i.id !== issue.id));
      const issueWithoutMaterial = { ...issue, isMaterial: false };
      setAvailableIssues(prev => [...prev, issueWithoutMaterial]);
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
