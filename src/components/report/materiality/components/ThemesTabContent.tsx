
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
  
  // Track all known material issues for this tab
  const knownMaterialIssuesRef = useRef<Set<string>>(new Set());
  
  // Track issues that have been explicitly deselected
  const explicitlyDeselectedRef = useRef<Set<string>>(new Set());
  
  // Track last operation to prevent immediate reversions
  const lastOpRef = useRef<{id: string; operation: 'select'|'deselect'; timestamp: number}>();
  
  // Flag to prevent re-processing issues while updates are pending
  const updatingRef = useRef<boolean>(false);
  
  // Flag to track whether the component has mounted
  const hasMountedRef = useRef<boolean>(false);
  
  // Store the most recent results of processing
  const latestProcessedIssuesRef = useRef({
    available: [] as MaterialityIssue[],
    selected: [] as MaterialityIssue[]
  });

  // Initialize issues when component mounts or issues/selectedIssueIds change
  useEffect(() => {
    // Skip processing if a recent operation is in progress
    if (lastOpRef.current && Date.now() - lastOpRef.current.timestamp < 5000) {
      console.log(`ThemesTabContent [${tabId}]: Skipping update due to recent operation for: ${lastOpRef.current.id}`);
      return;
    }
    
    // Prevent concurrent updates while one is in progress
    if (updatingRef.current) {
      console.log(`ThemesTabContent [${tabId}]: Skipping update due to another update in progress`);
      return;
    }
    
    // Log for debugging
    console.log(`ThemesTabContent [${tabId}]: Effect running, issues length=${issues.length}, selectedIds=${Array.from(selectedIssueIds).join(',')}`);
    
    // Check if selectedIssueIds has changed
    const selectedIdsArray = Array.from(selectedIssueIds);
    const prevSelectedIdsArray = Array.from(prevSelectedIdsRef.current);
    
    const idsChanged = 
      selectedIdsArray.length !== prevSelectedIdsArray.length ||
      selectedIdsArray.some(id => !prevSelectedIdsRef.current.has(id)) ||
      prevSelectedIdsArray.some(id => !selectedIssueIds.has(id));
    
    // Only process issues if the selection has changed or it's the initial load
    if (idsChanged || !hasMountedRef.current || availableIssues.length === 0 || selectedIssues.length === 0) {
      updatingRef.current = true;
      
      const available: MaterialityIssue[] = [];
      const selected: MaterialityIssue[] = [];
      
      // Process issues for this specific tab
      issues.forEach(issue => {
        // Create a deep copy of the issue to prevent reference issues
        const issueCopy = structuredClone(issue);
        
        // If a recent operation was performed on this issue, preserve that state
        if (lastOpRef.current && lastOpRef.current.id === issueCopy.id && Date.now() - lastOpRef.current.timestamp < 5000) {
          if (lastOpRef.current.operation === 'select') {
            issueCopy.isMaterial = true;
            knownMaterialIssuesRef.current.add(issueCopy.id);
            selected.push(issueCopy);
            return;
          } else if (lastOpRef.current.operation === 'deselect') {
            issueCopy.isMaterial = false;
            knownMaterialIssuesRef.current.delete(issueCopy.id);
            explicitlyDeselectedRef.current.add(issueCopy.id);
            available.push(issueCopy);
            return;
          }
        }
        
        // Check if this issue has been explicitly deselected
        if (explicitlyDeselectedRef.current.has(issueCopy.id)) {
          console.log(`ThemesTabContent [${tabId}]: Issue was explicitly deselected:`, issueCopy.id);
          issueCopy.isMaterial = false;
          available.push(issueCopy);
          return;
        }
        
        // Check if this issue is in the selectedIssueIds set
        if (selectedIssueIds.has(issueCopy.id) || knownMaterialIssuesRef.current.has(issueCopy.id)) {
          console.log(`ThemesTabContent [${tabId}]: Issue is selected by ID:`, issueCopy.id);
          // Ensure isMaterial is explicitly true (BOOLEAN)
          issueCopy.isMaterial = true;
          knownMaterialIssuesRef.current.add(issueCopy.id);
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
      
      // Store the latest processed issues
      latestProcessedIssuesRef.current = {
        available: available.map(issue => structuredClone(issue)),
        selected: selected.map(issue => structuredClone(issue))
      };
      
      // Set both states in a batch to prevent partial updates
      setAvailableIssues(available);
      setSelectedIssues(selected);
      
      // Update the previous selected IDs ref
      prevSelectedIdsRef.current = new Set([...selectedIssueIds]);
      hasMountedRef.current = true;
      
      // Reset updating flag after a delay
      setTimeout(() => {
        updatingRef.current = false;
      }, 3000);
    }
  }, [issues, selectedIssueIds, tabId, availableIssues.length, selectedIssues.length]);

  // Function to handle issue selection or deselection
  const handleIssueSelect = (issue: MaterialityIssue) => {
    if (!onIssueSelect) return;
    
    // Create a deep copy to prevent reference issues
    const issueToUpdate = structuredClone(issue);
    
    console.log(`ThemesTabContent [${tabId}] handling issue select:`, issueToUpdate.id, "isMaterial:", issueToUpdate.isMaterial);
    
    // Determine if we're selecting or deselecting
    const isSelecting = issueToUpdate.isMaterial === true;
    
    // Record the operation to prevent immediate reversion
    lastOpRef.current = {
      id: issueToUpdate.id,
      operation: isSelecting ? 'select' : 'deselect',
      timestamp: Date.now()
    };
    
    // Update knownMaterialIssues and explicitlyDeselected refs
    if (isSelecting) {
      knownMaterialIssuesRef.current.add(issueToUpdate.id);
      explicitlyDeselectedRef.current.delete(issueToUpdate.id);
    } else {
      knownMaterialIssuesRef.current.delete(issueToUpdate.id);
      explicitlyDeselectedRef.current.add(issueToUpdate.id);
    }
    
    // First update local state for immediate UI feedback
    if (isSelecting) {
      // Issue is being selected (moved to selected panel)
      console.log(`ThemesTabContent [${tabId}]: Moving issue to selected panel:`, issueToUpdate.id);
      
      setAvailableIssues(prev => prev.filter(i => i.id !== issueToUpdate.id));
      setSelectedIssues(prev => [...prev, issueToUpdate]);
      
      // Update the prevSelectedIdsRef to include this issue
      const newSelectedIds = new Set(prevSelectedIdsRef.current);
      newSelectedIds.add(issueToUpdate.id);
      prevSelectedIdsRef.current = newSelectedIds;
    } else {
      // Issue is being deselected (moved to available panel)
      console.log(`ThemesTabContent [${tabId}]: Moving issue to available panel:`, issueToUpdate.id);
      
      setSelectedIssues(prev => prev.filter(i => i.id !== issueToUpdate.id));
      
      // Always add back to available issues when deselected
      const wasInThisTab = latestProcessedIssuesRef.current.available.some(i => i.id === issueToUpdate.id) ||
                            latestProcessedIssuesRef.current.selected.some(i => i.id === issueToUpdate.id) ||
                            issues.some(i => i.id === issueToUpdate.id);
      
      if (wasInThisTab) {
        const availableIssueExists = availableIssues.some(i => i.id === issueToUpdate.id);
        if (!availableIssueExists) {
          setAvailableIssues(prev => [...prev, issueToUpdate]);
        }
      } else {
        console.log(`Issue ${issueToUpdate.id} was not originally in this tab, not adding to available`);
      }
      
      // Update the prevSelectedIdsRef to remove this issue
      const newSelectedIds = new Set(prevSelectedIdsRef.current);
      newSelectedIds.delete(issueToUpdate.id);
      prevSelectedIdsRef.current = newSelectedIds;
    }
    
    // Ensure isMaterial is a boolean before sending to parent
    if (typeof issueToUpdate.isMaterial !== 'boolean') {
      issueToUpdate.isMaterial = Boolean(issueToUpdate.isMaterial);
    }
    
    // Delay parent update to ensure UI reflects our changes first
    setTimeout(() => {
      console.log(`ThemesTabContent [${tabId}]: Passing issue to parent handler:`, issueToUpdate.id, "isMaterial:", issueToUpdate.isMaterial);
      onIssueSelect(issueToUpdate);
    }, 100);
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
