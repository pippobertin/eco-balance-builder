
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
  
  // Flag to prevent re-processing issues while updates are pending
  const updatingRef = useRef<boolean>(false);
  // Flag to track whether the component has mounted
  const hasMountedRef = useRef<boolean>(false);

  // Initialize issues when component mounts or issues/selectedIssueIds change
  useEffect(() => {
    // Prevent concurrent updates while one is in progress
    if (updatingRef.current) {
      return;
    }
    
    // Log for debugging
    console.log(`ThemesTabContent [${tabId}]: Effect running, issues length=${issues.length}, selectedIds=${Array.from(selectedIssueIds).join(',')}`);
    
    const available: MaterialityIssue[] = [];
    const selected: MaterialityIssue[] = [];
    
    // Check if selectedIssueIds has changed
    const selectedIdsArray = Array.from(selectedIssueIds);
    const prevSelectedIdsArray = Array.from(prevSelectedIdsRef.current);
    
    const idsChanged = 
      selectedIdsArray.length !== prevSelectedIdsArray.length ||
      selectedIdsArray.some(id => !prevSelectedIdsRef.current.has(id)) ||
      prevSelectedIdsArray.some(id => !selectedIssueIds.has(id));
    
    // Only process issues if the selection has changed or it's the initial load
    if (idsChanged || !hasMountedRef.current || availableIssues.length === 0 || selectedIssues.length === 0) {
      // Process issues for this specific tab
      issues.forEach(issue => {
        // Create a deep copy of the issue to prevent reference issues
        const issueCopy = JSON.parse(JSON.stringify(issue));
        
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
      
      console.log(`ThemesTabContent [${tabId}]: Setting available issues:`, available.length);
      console.log(`ThemesTabContent [${tabId}]: Setting selected issues:`, selected.length);
      
      // Set both states in a batch to prevent partial updates
      setAvailableIssues(available);
      setSelectedIssues(selected);
      
      // Update the previous selected IDs ref
      prevSelectedIdsRef.current = new Set(selectedIssueIds);
      hasMountedRef.current = true;
    }
  }, [issues, selectedIssueIds, tabId]);

  // Function to handle issue selection or deselection
  const handleIssueSelect = (issue: MaterialityIssue) => {
    if (!onIssueSelect) return;
    
    // Set updating flag to prevent concurrent updates
    updatingRef.current = true;
    
    console.log(`ThemesTabContent [${tabId}] handling issue select:`, issue.id, "isMaterial:", issue.isMaterial);
    
    // Create a deep copy to prevent reference issues
    const issueToUpdate = JSON.parse(JSON.stringify(issue));
    
    // First update local state for immediate UI feedback
    if (issueToUpdate.isMaterial) {
      // Issue is being selected (moved to selected panel)
      console.log(`ThemesTabContent [${tabId}]: Moving issue to selected panel:`, issueToUpdate.id);
      setAvailableIssues(prev => prev.filter(i => i.id !== issueToUpdate.id));
      setSelectedIssues(prev => [...prev, {...issueToUpdate, isMaterial: true}]); // Ensure true boolean
      
      // Update the prevSelectedIdsRef to include this issue
      const newSelectedIds = new Set(prevSelectedIdsRef.current);
      newSelectedIds.add(issueToUpdate.id);
      prevSelectedIdsRef.current = newSelectedIds;
    } else {
      // Issue is being deselected (moved to available panel)
      console.log(`ThemesTabContent [${tabId}]: Moving issue to available panel:`, issueToUpdate.id);
      setSelectedIssues(prev => prev.filter(i => i.id !== issueToUpdate.id));
      setAvailableIssues(prev => [...prev, {...issueToUpdate, isMaterial: false}]); // Ensure false boolean
      
      // Update the prevSelectedIdsRef to remove this issue
      const newSelectedIds = new Set(prevSelectedIdsRef.current);
      newSelectedIds.delete(issueToUpdate.id);
      prevSelectedIdsRef.current = newSelectedIds;
    }
    
    // Then pass to parent handler for global state update
    // Use a timeout to make sure this happens after the UI update
    setTimeout(() => {
      console.log(`ThemesTabContent [${tabId}]: Passing issue to parent handler:`, issueToUpdate.id, "isMaterial:", issueToUpdate.isMaterial);
      onIssueSelect(issueToUpdate);
      
      // Clear the updating flag after a delay to allow the state to settle
      setTimeout(() => {
        updatingRef.current = false;
      }, 1000);
    }, 50);
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
