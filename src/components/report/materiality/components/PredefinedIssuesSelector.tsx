
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { translateESGCategory } from '../utils/esgCategoryUtils';
import { MaterialityIssue } from '../types';

interface PredefinedIssue {
  id: string;
  name: string;
  description: string;
  category?: string; // Categoria ESG
}

interface PredefinedIssuesSelectorProps {
  issues?: PredefinedIssue[];
  selectedIssueIds?: Set<string>;
  onIssueSelect?: (issue: PredefinedIssue) => void;
  groupByCategory?: boolean;
  // Added new props to match usage in MaterialityIssuesTab
  onAddIssue?: (name: string, description: string) => void;
  currentIssues?: MaterialityIssue[];
}

const PredefinedIssuesSelector: React.FC<PredefinedIssuesSelectorProps> = ({
  issues = [],
  selectedIssueIds = new Set(),
  onIssueSelect,
  groupByCategory = false, // Changed default to false since we're using tabs
  onAddIssue,
  currentIssues = []
}) => {
  // If onAddIssue is provided, we're in the "add" mode rather than "select" mode
  const isAddMode = !!onAddIssue;
  
  // Handle the addition of an issue
  const handleAddIssue = (issue: PredefinedIssue) => {
    if (onAddIssue) {
      onAddIssue(issue.name, issue.description);
    } else if (onIssueSelect) {
      onIssueSelect(issue);
    }
  };

  // Check if an issue is already added (for add mode)
  const isIssueAlreadyAdded = (issue: PredefinedIssue) => {
    return currentIssues.some(
      existingIssue => 
        existingIssue.name === issue.name && 
        existingIssue.description === issue.description
    );
  };
  
  // Se non ci sono issues, mostra il messaggio
  if (issues.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">
        Non ci sono questioni predefinite disponibili per questo tema o sono già state tutte aggiunte.
      </p>
    );
  }

  // Se groupByCategory è true, raggruppa i temi per categoria
  if (groupByCategory) {
    // Raggruppa i temi per categoria
    const categorizedIssues: Record<string, PredefinedIssue[]> = {};
    
    // Prima passa: raccoglie tutte le categorie
    issues.forEach(issue => {
      const category = issue.category || 'altro';
      if (!categorizedIssues[category]) {
        categorizedIssues[category] = [];
      }
      categorizedIssues[category].push(issue);
    });

    return (
      <div className="space-y-6">
        {Object.entries(categorizedIssues).map(([category, categoryIssues]) => (
          <div key={category} className="space-y-3">
            <h4 className="text-sm font-semibold uppercase text-gray-700 mb-2">
              {translateESGCategory(category)}
            </h4>
            {categoryIssues.map(issue => (
              <IssueCard 
                key={issue.id} 
                issue={issue} 
                isSelected={isAddMode ? isIssueAlreadyAdded(issue) : selectedIssueIds.has(issue.id)} 
                onSelect={handleAddIssue} 
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
  
  // Altrimenti mostra la lista normale (senza raggruppamento, ideale per le tab)
  return (
    <div className="space-y-3">
      {issues.map(issue => (
        <IssueCard 
          key={issue.id} 
          issue={issue} 
          isSelected={isAddMode ? isIssueAlreadyAdded(issue) : selectedIssueIds.has(issue.id)} 
          onSelect={handleAddIssue} 
        />
      ))}
    </div>
  );
};

// Componente per la card di un tema
const IssueCard: React.FC<{
  issue: PredefinedIssue;
  isSelected: boolean;
  onSelect: (issue: PredefinedIssue) => void;
}> = ({ issue, isSelected, onSelect }) => {
  return (
    <div 
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
          onClick={() => onSelect(issue)}
          disabled={isSelected}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PredefinedIssuesSelector;
