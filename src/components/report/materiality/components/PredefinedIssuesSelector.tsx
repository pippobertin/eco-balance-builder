
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PredefinedIssue {
  id: string;
  name: string;
  description: string;
}

interface PredefinedIssuesSelectorProps {
  filteredPredefinedIssues: PredefinedIssue[];
  addPredefinedIssue: (issue: PredefinedIssue) => void;
}

const PredefinedIssuesSelector: React.FC<PredefinedIssuesSelectorProps> = ({
  filteredPredefinedIssues,
  addPredefinedIssue
}) => {
  return (
    <div className="mb-8 p-4 border border-dashed border-gray-300 rounded-lg">
      <h4 className="text-sm font-medium mb-3">Seleziona questioni predefinite da aggiungere</h4>
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-3">
          {filteredPredefinedIssues.map(issue => (
            <div key={issue.id} className="p-3 bg-gray-50 rounded border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="text-sm font-medium">{issue.name}</h5>
                  <p className="text-xs text-gray-600 mt-1">{issue.description}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-green-600 hover:text-green-800"
                  onClick={() => addPredefinedIssue(issue)}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {filteredPredefinedIssues.length === 0 && (
            <p className="text-sm text-gray-500 italic">
              Non ci sono questioni predefinite disponibili per questo tema o sono già state tutte aggiunte.
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PredefinedIssuesSelector;
