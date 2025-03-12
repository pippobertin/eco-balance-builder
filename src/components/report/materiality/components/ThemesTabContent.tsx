
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import PredefinedIssuesSelector from './PredefinedIssuesSelector';

interface ThemesTabContentProps {
  issues: any[];
  selectedIssueIds?: Set<string>;
  onIssueSelect?: (issue: any) => void;
  onAddIssue?: (name: string, description: string) => void;
}

const ThemesTabContent: React.FC<ThemesTabContentProps> = ({
  issues,
  selectedIssueIds = new Set(),
  onIssueSelect,
  onAddIssue
}) => {
  return (
    <ScrollArea className="h-[250px]">
      <PredefinedIssuesSelector 
        issues={issues}
        selectedIssueIds={selectedIssueIds}
        onIssueSelect={onIssueSelect}
        onAddIssue={onAddIssue}
        groupByCategory={false}
      />
    </ScrollArea>
  );
};

export default ThemesTabContent;
