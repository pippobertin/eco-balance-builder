
import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Trash2, ChevronRight } from 'lucide-react';
import { MaterialityIssue } from './types';

interface IssueItemProps {
  issue: MaterialityIssue;
  onIssueChange: (id: string, field: keyof MaterialityIssue, value: any) => void;
  onRemoveIssue: (id: string) => void;
  isPredefined: boolean;
}

const IssueItem: React.FC<IssueItemProps> = ({ 
  issue, 
  onIssueChange, 
  onRemoveIssue,
  isPredefined
}) => {
  const determineQuadrant = (impactRelevance: number, financialRelevance: number) => {
    const threshold = 70;
    if (impactRelevance >= threshold && financialRelevance >= threshold) return "Alto impatto, Alta rilevanza finanziaria";
    if (impactRelevance >= threshold) return "Alto impatto, Bassa rilevanza finanziaria";
    if (financialRelevance >= threshold) return "Basso impatto, Alta rilevanza finanziaria";
    return "Basso impatto, Bassa rilevanza finanziaria";
  };

  const handleImpactChange = (value: number[]) => {
    onIssueChange(issue.id, 'impactRelevance', Number(value[0]));
  };

  const handleFinancialChange = (value: number[]) => {
    onIssueChange(issue.id, 'financialRelevance', Number(value[0]));
  };

  const hasIROSelections = issue.iroSelections && (
    (issue.iroSelections.selectedPositiveImpacts && issue.iroSelections.selectedPositiveImpacts.some(i => i)) ||
    (issue.iroSelections.selectedNegativeImpacts && issue.iroSelections.selectedNegativeImpacts.some(i => i)) ||
    (issue.iroSelections.selectedRisks && issue.iroSelections.selectedRisks.some(r => r)) ||
    (issue.iroSelections.selectedOpportunities && issue.iroSelections.selectedOpportunities.some(o => o)) ||
    (issue.iroSelections.selectedActions && issue.iroSelections.selectedActions.some(a => a))
  );

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium text-gray-900">{issue.name}</h4>
          <p className="text-sm text-gray-700">{issue.description}</p>
          {hasIROSelections && (
            <span className="inline-flex items-center mt-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
              IRO configurato
            </span>
          )}
        </div>
        {!isPredefined && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onRemoveIssue(issue.id)}
            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
            title="Rimuovi questione"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-6 mt-4">
        <div>
          <div className="flex justify-between mb-2">
            <Label className="text-gray-900">Rilevanza dell'impatto: {issue.impactRelevance}%</Label>
          </div>
          <Slider
            value={[Number(issue.impactRelevance)]}
            min={0}
            max={100}
            step={1}
            onValueChange={handleImpactChange}
            className="mb-4"
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <Label className="text-gray-900">Rilevanza finanziaria: {issue.financialRelevance}%</Label>
          </div>
          <Slider
            value={[Number(issue.financialRelevance)]}
            min={0}
            max={100}
            step={1}
            onValueChange={handleFinancialChange}
            className="mb-4"
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-700">
            {determineQuadrant(Number(issue.impactRelevance), Number(issue.financialRelevance))}
          </div>
          {issue.stakeholderRelevance !== undefined && (
            <div className="text-sm text-blue-600">
              <span className="font-medium">Rilevanza stakeholder:</span> {Math.round(issue.stakeholderRelevance)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueItem;
