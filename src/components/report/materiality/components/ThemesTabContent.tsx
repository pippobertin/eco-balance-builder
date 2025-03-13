
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

  // Initialize issues when component mounts or issues prop changes
  useEffect(() => {
    const available: MaterialityIssue[] = [];
    const selected: MaterialityIssue[] = [];
    
    issues.forEach(issue => {
      if (issue.isMaterial) {
        selected.push(issue);
      } else {
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
      onIssueSelect(issue);
      
      // Update local state for immediate UI feedback
      if (issue.isMaterial) {
        setAvailableIssues(prev => prev.filter(i => i.id !== issue.id));
        setSelectedIssues(prev => [...prev, issue]);
      } else {
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
    />
  );
};

export default ThemesTabContent;
