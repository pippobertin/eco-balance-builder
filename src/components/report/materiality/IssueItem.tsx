
import React, { useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Trash2 } from 'lucide-react';
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
    console.log(`Changing impact relevance for ${issue.id} from ${issue.impactRelevance} to ${value[0]}`);
    onIssueChange(issue.id, 'impactRelevance', Number(value[0]));
  };

  const handleFinancialChange = (value: number[]) => {
    console.log(`Changing financial relevance for ${issue.id} from ${issue.financialRelevance} to ${value[0]}`);
    onIssueChange(issue.id, 'financialRelevance', Number(value[0]));
  };

  useEffect(() => {
    console.log(`Issue updated:`, issue);
  }, [issue]);

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium text-gray-900">{issue.name}</h4>
          <p className="text-sm text-gray-700">{issue.description}</p>
        </div>
        {!isPredefined && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onRemoveIssue(issue.id)}
            className="h-8 w-8 text-red-500 hover:text-red-700"
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
        
        <div className="text-sm text-gray-700">
          {determineQuadrant(Number(issue.impactRelevance), Number(issue.financialRelevance))}
        </div>
      </div>
    </div>
  );
};

export default IssueItem;
