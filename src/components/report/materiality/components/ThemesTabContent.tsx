
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
    
    // Log the issues we received for debugging
    console.log("ThemesTabContent received issues:", issues.map(i => ({id: i.id, name: i.name, isMaterial: i.isMaterial})));
    
    issues.forEach(issue => {
      // Ensure isMaterial is always a boolean
      const isMat = issue.isMaterial === true;
      if (isMat) {
        console.log("Adding to selected:", issue.id, issue.name);
        selected.push({...issue, isMaterial: true});
      } else {
        console.log("Adding to available:", issue.id, issue.name);
        available.push({...issue, isMaterial: false});
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
      console.log("ThemesTabContent handling issue select:", issue.id, "Current isMaterial:", issue.isMaterial);
      
      // Make sure we're using a boolean value for isMaterial
      const newIsMaterial = issue.isMaterial !== true;
      console.log("Setting isMaterial to:", newIsMaterial);
      
      // Create updated issue with explicit isMaterial boolean
      const updatedIssue = {
        ...issue,
        isMaterial: newIsMaterial
      };
      
      // Call parent handler with the updated issue
      onIssueSelect(updatedIssue);
      console.log("Sent updated issue with isMaterial:", updatedIssue.isMaterial);
      
      // Update local state for immediate UI feedback
      if (!issue.isMaterial) {
        // Issue is being selected
        setAvailableIssues(prev => prev.filter(i => i.id !== issue.id));
        setSelectedIssues(prev => [...prev, {...issue, isMaterial: true}]);
      } else {
        // Issue is being deselected - preserve original order when returning to available issues
        setSelectedIssues(prev => prev.filter(i => i.id !== issue.id));
        
        // Find the correct position to reinsert the deselected issue
        const updatedAvailable = [...availableIssues];
        const deselectedIssue = {...issue, isMaterial: false};
        
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
          updatedAvailable.splice(insertIndex, 0, deselectedIssue);
        } else {
          // Fallback - just add to the end if original position unknown
          updatedAvailable.push(deselectedIssue);
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
