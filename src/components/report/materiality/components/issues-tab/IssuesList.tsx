
import React from 'react';
import { MaterialityIssue } from '../../types';
import IssueItem from '../../IssueItem';
import NoIssuesFound from '../NoIssuesFound';

interface IssuesListProps {
  issues: MaterialityIssue[];
  onIssueChange: (id: string, field: keyof MaterialityIssue, value: any) => void;
  onRemoveIssue: (id: string) => void;
}

const IssuesList: React.FC<IssuesListProps> = ({ 
  issues, 
  onIssueChange, 
  onRemoveIssue 
}) => {
  if (issues.length === 0) {
    return <NoIssuesFound />;
  }

  return (
    <div className="space-y-2">
      {issues.map((issue) => (
        <IssueItem
          key={issue.id}
          issue={issue}
          onIssueChange={onIssueChange}
          onRemoveIssue={onRemoveIssue}
          isPredefined={!issue.id.startsWith('custom-')}
        />
      ))}
    </div>
  );
};

export default IssuesList;
