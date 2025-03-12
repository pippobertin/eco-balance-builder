
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MaterialityIssue, IROSelections } from '../types';
import { predefinedIROData } from '../utils/iroData';

interface IRODialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  issue: MaterialityIssue;
  onSave: (issueId: string, iroSelections: IROSelections) => void;
}

const IRODialog: React.FC<IRODialogProps> = ({
  open,
  onOpenChange,
  issue,
  onSave
}) => {
  const [selections, setSelections] = useState<IROSelections>({
    selectedImpacts: [],
    selectedRisks: [],
    selectedOpportunities: [],
    selectedActions: []
  });

  useEffect(() => {
    if (issue.iroSelections) {
      setSelections(issue.iroSelections);
    } else {
      setSelections({
        selectedImpacts: [],
        selectedRisks: [],
        selectedOpportunities: [],
        selectedActions: []
      });
    }
  }, [issue]);

  const handleSave = () => {
    onSave(issue.id, selections);
  };

  const handleSelectionChange = (category: keyof IROSelections, index: number, value: string) => {
    setSelections(prev => {
      const newSelections = { ...prev };
      const currentArray = [...(prev[category] || [])];
      
      while (currentArray.length <= index) {
        currentArray.push('');
      }
      
      currentArray[index] = value;
      newSelections[category] = currentArray;
      
      return newSelections;
    });
  };

  const iroData = predefinedIROData[issue.id] || {
    impacts: [],
    risks: [],
    opportunities: [],
    actions: []
  };

  const renderSelectGroup = (
    title: string,
    description: string,
    category: keyof IROSelections,
    options: string[]
  ) => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
      
      {[0, 1, 2, 3].map((index) => (
        <div key={`${category}-${index}`} className="mb-2">
          <Select 
            value={selections[category][index] || "none"} 
            onValueChange={(value) => handleSelectionChange(category, index, value === "none" ? "" : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Seleziona ${title.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nessuna selezione</SelectItem>
              {options.map((option, i) => (
                <SelectItem key={`${category}-option-${i}`} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">IRO e Azioni: {issue.name}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">{issue.description}</p>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderSelectGroup(
              "Impatti",
              "Seleziona gli impatti rilevanti per questo tema materiale",
              "selectedImpacts",
              iroData.impacts
            )}
            
            {renderSelectGroup(
              "Rischi",
              "Seleziona i rischi rilevanti per questo tema materiale",
              "selectedRisks",
              iroData.risks
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderSelectGroup(
              "Opportunità",
              "Seleziona le opportunità rilevanti per questo tema materiale",
              "selectedOpportunities",
              iroData.opportunities
            )}
            
            {renderSelectGroup(
              "Azioni",
              "Seleziona le azioni rilevanti per questo tema materiale",
              "selectedActions",
              iroData.actions
            )}
          </div>
        </div>
        
        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annulla</Button>
          <Button onClick={handleSave}>Salva</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IRODialog;
