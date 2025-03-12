
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PredefinedIssue {
  id: string;
  name: string;
  description: string;
  category?: string; // Add category as an optional property
}

interface PredefinedIssuesSelectorProps {
  issues: PredefinedIssue[];
  selectedIssueIds: Set<string>;
  onIssueSelect: (issue: PredefinedIssue) => void;
}

const PredefinedIssuesSelector: React.FC<PredefinedIssuesSelectorProps> = ({
  issues,
  selectedIssueIds,
  onIssueSelect
}) => {
  return (
    <div className="space-y-3">
      {issues.map(issue => (
        <div 
          key={issue.id} 
          className="p-3 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <h5 className="text-sm font-medium">{issue.name}</h5>
              <p className="text-xs text-gray-600 mt-1">{issue.description}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-green-600 hover:text-green-800"
              onClick={() => onIssueSelect(issue)}
              disabled={selectedIssueIds.has(issue.id)}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      
      {issues.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          Non ci sono questioni predefinite disponibili per questo tema o sono già state tutte aggiunte.
        </p>
      )}
    </div>
  );
};

export default PredefinedIssuesSelector;
