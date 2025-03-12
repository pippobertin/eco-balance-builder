
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import PredefinedIssuesSelector from './PredefinedIssuesSelector';

interface ThemesTabContentProps {
  issues: any[];
  selectedIssueIds: Set<string>;
  onIssueSelect: (issue: any) => void;
}

const ThemesTabContent: React.FC<ThemesTabContentProps> = ({
  issues,
  selectedIssueIds,
  onIssueSelect
}) => {
  return (
    <ScrollArea className="h-[250px]">
      <PredefinedIssuesSelector 
        issues={issues}
        selectedIssueIds={selectedIssueIds}
        onIssueSelect={onIssueSelect}
        groupByCategory={false}
      />
    </ScrollArea>
  );
};

export default ThemesTabContent;
