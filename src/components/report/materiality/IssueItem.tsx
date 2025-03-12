
import React from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { MaterialityIssue } from './types';
import { isHeaderTheme } from './utils/materialityUtils';

interface IssueItemProps {
  issue: MaterialityIssue;
  onIssueChange: (id: string, field: keyof MaterialityIssue, value: any) => void;
  onRemoveIssue?: (id: string) => void;
  isPredefined?: boolean;
}

const IssueItem: React.FC<IssueItemProps> = ({
  issue,
  onIssueChange,
  onRemoveIssue,
  isPredefined = false
}) => {
  const isHeader = isHeaderTheme(issue.id);
  
  return (
    <div 
      className={`p-4 rounded-lg border mb-2 ${
        isHeader 
          ? 'bg-gray-100 border-gray-300' 
          : 'bg-white border-gray-100 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className={`${isHeader ? 'font-semibold text-gray-700' : 'text-sm font-medium text-gray-900'}`}>
            {issue.name}
          </h4>
          {issue.description && !isHeader && (
            <p className="mt-1 text-sm text-gray-500">{issue.description}</p>
          )}
        </div>
        
        {!isHeader && (
          <div className="flex items-center gap-2">
            {!isPredefined && onRemoveIssue && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveIssue(issue.id)}
                className="text-red-600 hover:text-red-700"
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onIssueChange(issue.id, 'isMaterial', !issue.isMaterial)}
              className={issue.isMaterial ? "text-green-600" : "text-gray-400"}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueItem;
