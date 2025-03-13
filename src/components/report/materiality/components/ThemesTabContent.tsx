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
    // Check if we actually need to update
    const prevSelectedIdsArray = Array.from(prevSelectedIdsRef.current);
    const currentSelectedIdsArray = Array.from(selectedIssueIds);
    
    const needsUpdate = 
      prevSelectedIdsArray.length !== currentSelectedIdsArray.length ||
      prevSelectedIdsArray.some(id => !selectedIssueIds.has(id)) ||
      currentSelectedIdsArray.some(id => !prevSelectedIdsRef.current.has(id));
    
    if (needsUpdate || availableIssues.length === 0) {
      console.log(`ThemesTabContent [${tabId}]: Updating issue lists based on selectedIssueIds:`, 
        Array.from(selectedIssueIds));
      
      const available: MaterialityIssue[] = [];
      const selected: MaterialityIssue[] = [];
      
      // Save the original order of all issues
      setOriginalIssueOrder([...issues]);
      
      // Process issues for this specific tab
      issues.forEach(issue => {
        // Check if this issue is in the selectedIssueIds set
        if (selectedIssueIds.has(issue.id)) {
          console.log(`ThemesTabContent [${tabId}]: Issue is selected by ID:`, issue.id);
          // Create a copy with isMaterial explicitly true
          const selectedIssue = { 
            ...issue, 
            isMaterial: true 
          };
          selected.push(selectedIssue);
        } else if (issue.isMaterial === true) {
          // If issue.isMaterial is true but not in selectedIssueIds (shouldn't normally happen)
          console.log(`ThemesTabContent [${tabId}]: Issue is material by property:`, issue.id);
          selected.push(issue);
        } else {
          console.log(`ThemesTabContent [${tabId}]: Issue is not material:`, issue.id);
          available.push(issue);
        }
      });
      
      setAvailableIssues(available);
      setSelectedIssues(selected);
      
      console.log(`ThemesTabContent [${tabId}]: Available issues:`, available.length);
      console.log(`ThemesTabContent [${tabId}]: Selected issues:`, selected.length);
      
      // Update the previous selected IDs ref
      prevSelectedIdsRef.current = new Set(selectedIssueIds);
    }
  }, [issues, selectedIssueIds, tabId]);

  // Function to handle issue selection or deselection
  const handleIssueSelect = (issue: MaterialityIssue) => {
    if (onIssueSelect) {
      console.log(`ThemesTabContent [${tabId}] handling issue select:`, issue.id, "isMaterial was:", issue.isMaterial);
      
      // Important: Create a new instance of the issue to prevent reference issues
      const updatedIssue = { ...issue };
      
      // Force isMaterial to be a boolean based on which panel it's in
      if (availableIssues.some(i => i.id === issue.id)) {
        // Issue is being moved from available to selected
        updatedIssue.isMaterial = true;
        console.log(`ThemesTabContent [${tabId}]: Setting issue to material (true):`, issue.id, typeof updatedIssue.isMaterial);
      } else {
        // Issue is being moved from selected to available
        updatedIssue.isMaterial = false;
        console.log(`ThemesTabContent [${tabId}]: Setting issue to non-material (false):`, issue.id, typeof updatedIssue.isMaterial);
      }
      
      // Pass the updated issue to the parent component
      onIssueSelect(updatedIssue);
      
      // Here we update local state for immediate UI feedback
      if (updatedIssue.isMaterial === true) {
        // Issue is being selected (moved to selected panel)
        setAvailableIssues(prev => prev.filter(i => i.id !== issue.id));
        setSelectedIssues(prev => [...prev, updatedIssue]);
      } else {
        // Issue is being deselected (moved to available panel)
        setSelectedIssues(prev => prev.filter(i => i.id !== issue.id));
        
        // Find the correct position to reinsert the deselected issue
        const updatedAvailable = [...availableIssues];
        
        // Find the original index of this issue
        const originalIndex = originalIssueOrder.findIndex(i => i.id === issue.id);
        
        if (originalIndex !== -1) {
          // Find where to insert this item based on surrounding items that are already in available list
          let insertIndex = -1;
          
          // Look for the first available item that comes after this one in the original order
          for (let i = originalIndex + 1; i < originalIssueOrder.length && insertIndex === -1; i++) {
            const afterItemIndex = updatedAvailable.findIndex(a => a.id === originalIssueOrder[i].id);
            if (afterItemIndex !== -1) {
              insertIndex = afterItemIndex;
            }
          }
          
          // If no item found after, look for items before and insert after the last one
          if (insertIndex === -1) {
            let lastBeforeIndex = -1;
            for (let i = originalIndex - 1; i >= 0; i--) {
              const beforeItemIndex = updatedAvailable.findIndex(a => a.id === originalIssueOrder[i].id);
              if (beforeItemIndex !== -1) {
                lastBeforeIndex = beforeItemIndex;
                break;
              }
            }
            
            if (lastBeforeIndex !== -1) {
              insertIndex = lastBeforeIndex + 1;
            } else {
              // If no reference point found, insert at beginning
              insertIndex = 0;
            }
          }
          
          // Insert at the calculated position
          updatedAvailable.splice(insertIndex, 0, updatedIssue);
        } else {
          // Fallback - just add to the end if original position unknown
          updatedAvailable.push(updatedIssue);
        }
        
        setAvailableIssues(updatedAvailable);
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
