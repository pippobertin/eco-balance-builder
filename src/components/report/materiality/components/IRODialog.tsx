
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

  const handleSelectionChange = (category: keyof IROSelections, value: string) => {
    setSelections(prev => {
      const newSelections = { ...prev };
      const currentValues = [...(prev[category] || [])];
      
      // If value is already selected, remove it
      if (currentValues.includes(value)) {
        newSelections[category] = currentValues.filter(item => item !== value);
      } else {
        // Add the value if not already selected
        newSelections[category] = [...currentValues, value];
      }
      
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
      
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Selezionati: {selections[category].length > 0 ? 
          selections[category].join(', ') : 'Nessuna selezione'}</p>
        
        <Select
          onValueChange={(value) => handleSelectionChange(category, value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={`Seleziona ${title.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option, i) => (
              <SelectItem 
                key={`${category}-option-${i}`} 
                value={option}
                className={selections[category].includes(option) ? "bg-gray-100" : ""}
              >
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selections[category].length > 0 && (
        <div className="mt-2">
          <ul className="list-disc list-inside space-y-1">
            {selections[category].map((selected, idx) => (
              <li key={idx} className="flex items-center text-sm">
                <span>{selected}</span>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2 h-6 w-6 p-0" 
                  onClick={() => handleSelectionChange(category, selected)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
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
