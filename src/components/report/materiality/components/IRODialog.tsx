
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MaterialityIssue, IROSelections } from '../types';
import { predefinedIROData } from '../utils/iroData';
import CategorySelect from './iro/CategorySelect';
import IRODialogHeader from './iro/IRODialogHeader';

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
    selectedPositiveImpacts: [],
    selectedNegativeImpacts: [],
    selectedRisks: [],
    selectedOpportunities: [],
    selectedActions: []
  });

  const iroData = predefinedIROData[issue.id] || {
    positiveImpacts: [],
    negativeImpacts: [],
    risks: [],
    opportunities: [],
    actions: []
  };

  useEffect(() => {
    if (issue.iroSelections) {
      setSelections(issue.iroSelections);
    } else {
      setSelections({
        selectedPositiveImpacts: [],
        selectedNegativeImpacts: [],
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
      
      if (currentValues.includes(value)) {
        newSelections[category] = currentValues.filter(item => item !== value);
      } else {
        newSelections[category] = [...currentValues, value];
      }
      
      return newSelections;
    });
  };

  console.log('IRO Data for issue:', issue.id, iroData);
  console.log('Current selections:', selections);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <IRODialogHeader 
          issue={issue}
          onClose={() => onOpenChange(false)}
        />
        
        <div className="py-4 space-y-6">
          {/* Prima riga: Impatti positivi e negativi */}
          <div className="grid grid-cols-2 gap-6">
            <CategorySelect
              title="Impatti Positivi"
              description="Seleziona i potenziali impatti positivi per questo tema materiale"
              options={iroData.positiveImpacts}
              selections={selections.selectedPositiveImpacts}
              onSelectionChange={(value) => handleSelectionChange("selectedPositiveImpacts", value)}
            />
            
            <CategorySelect
              title="Impatti Negativi"
              description="Seleziona i potenziali impatti negativi per questo tema materiale"
              options={iroData.negativeImpacts}
              selections={selections.selectedNegativeImpacts}
              onSelectionChange={(value) => handleSelectionChange("selectedNegativeImpacts", value)}
            />
          </div>
          
          {/* Seconda riga: Rischi e Opportunità */}
          <div className="grid grid-cols-2 gap-6">
            <CategorySelect
              title="Rischi"
              description="Seleziona i rischi rilevanti per questo tema materiale"
              options={iroData.risks}
              selections={selections.selectedRisks}
              onSelectionChange={(value) => handleSelectionChange("selectedRisks", value)}
            />
            
            <CategorySelect
              title="Opportunità"
              description="Seleziona le opportunità rilevanti per questo tema materiale"
              options={iroData.opportunities}
              selections={selections.selectedOpportunities}
              onSelectionChange={(value) => handleSelectionChange("selectedOpportunities", value)}
            />
          </div>
          
          {/* Terza riga: Azioni (larghezza doppia) */}
          <div className="grid grid-cols-1 gap-6">
            <CategorySelect
              title="Azioni"
              description="Seleziona le azioni rilevanti per questo tema materiale"
              options={iroData.actions}
              selections={selections.selectedActions}
              onSelectionChange={(value) => handleSelectionChange("selectedActions", value)}
              className="col-span-1"
            />
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
