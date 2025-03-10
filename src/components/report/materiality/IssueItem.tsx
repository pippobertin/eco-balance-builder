
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium">{issue.name}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{issue.description}</p>
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
            <Label>Rilevanza dell'impatto: {issue.impactRelevance}%</Label>
          </div>
          <Slider
            value={[issue.impactRelevance]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => onIssueChange(issue.id, 'impactRelevance', value[0])}
            className="mb-4"
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <Label>Rilevanza finanziaria: {issue.financialRelevance}%</Label>
          </div>
          <Slider
            value={[issue.financialRelevance]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => onIssueChange(issue.id, 'financialRelevance', value[0])}
            className="mb-4"
          />
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox 
            id={`material-${issue.id}`} 
            checked={issue.isMaterial}
            onCheckedChange={(checked) => onIssueChange(issue.id, 'isMaterial', checked === true)}
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor={`material-${issue.id}`} className="text-sm font-medium">
              Questione materiale
            </Label>
            <p className="text-sm text-muted-foreground">
              {determineQuadrant(issue.impactRelevance, issue.financialRelevance)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueItem;
