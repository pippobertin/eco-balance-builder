
import React, { useState, useEffect } from 'react';
import { MaterialityIssue } from '../types';
import DragDropContainer from './drag-drop';

interface ThemesTabContentProps {
  issues: MaterialityIssue[];
  selectedIssueIds?: Set<string>;
  onIssueSelect?: (issue: MaterialityIssue) => void;
  onAddIssue?: (name: string, description: string) => void;
}

const ThemesTabContent: React.FC<ThemesTabContentProps> = ({
  issues,
  selectedIssueIds = new Set(),
  onIssueSelect,
  onAddIssue
}) => {
  // Track which issues are currently available and which are selected
  const [availableIssues, setAvailableIssues] = useState<MaterialityIssue[]>([]);
  const [selectedIssues, setSelectedIssues] = useState<MaterialityIssue[]>([]);
  
  // Maintain the original order of all issues for proper repositioning
  const [originalIssueOrder, setOriginalIssueOrder] = useState<MaterialityIssue[]>([]);

  // Initialize issues when component mounts or issues prop changes
  useEffect(() => {
    const available: MaterialityIssue[] = [];
    const selected: MaterialityIssue[] = [];
    
    // Save the original order of all issues
    setOriginalIssueOrder([...issues]);
    
    issues.forEach(issue => {
      // Using === true for strict boolean comparison
      if (issue.isMaterial === true) {
        console.log("ThemesTabContent: Issue is material:", issue.id, issue.name, typeof issue.isMaterial, issue.isMaterial);
        selected.push(issue);
      } else {
        console.log("ThemesTabContent: Issue is not material:", issue.id, issue.name, typeof issue.isMaterial, issue.isMaterial);
        available.push(issue);
      }
    });
    
    setAvailableIssues(available);
    setSelectedIssues(selected);
    
    console.log("Available issues:", available.length);
    console.log("Selected issues:", selected.length);
  }, [issues]);

  // Function to handle issue selection or deselection
  const handleIssueSelect = (issue: MaterialityIssue) => {
    if (onIssueSelect) {
      console.log("ThemesTabContent handling issue select:", issue.id, issue.isMaterial);
      
      // Important: Create a new instance of the issue to prevent reference issues
      const updatedIssue = { ...issue };
      
      // Force isMaterial to be a boolean based on which panel it's in
      if (availableIssues.some(i => i.id === issue.id)) {
        // Issue is being moved from available to selected
        updatedIssue.isMaterial = true;
        console.log("Setting issue to material (true):", issue.id);
      } else {
        // Issue is being moved from selected to available
        updatedIssue.isMaterial = false;
        console.log("Setting issue to non-material (false):", issue.id);
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
    />
  );
};

export default ThemesTabContent;
