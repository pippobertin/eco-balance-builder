
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
    selectedImpacts: [],
    selectedRisks: [],
    selectedOpportunities: [],
    selectedActions: []
  });

  // Ottieni i dati IRO per l'issue corrente
  const iroData = predefinedIROData[issue.id] || {
    impacts: [],
    risks: [],
    opportunities: [],
    actions: []
  };

  // Aggiorna le selezioni quando cambia l'issue
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

  // Log dei dati IRO per debug
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CategorySelect
              title="Impatti"
              description="Seleziona gli impatti rilevanti per questo tema materiale"
              options={iroData.impacts}
              selections={selections.selectedImpacts}
              onSelectionChange={(value) => handleSelectionChange("selectedImpacts", value)}
            />
            
            <CategorySelect
              title="Rischi"
              description="Seleziona i rischi rilevanti per questo tema materiale"
              options={iroData.risks}
              selections={selections.selectedRisks}
              onSelectionChange={(value) => handleSelectionChange("selectedRisks", value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CategorySelect
              title="Opportunità"
              description="Seleziona le opportunità rilevanti per questo tema materiale"
              options={iroData.opportunities}
              selections={selections.selectedOpportunities}
              onSelectionChange={(value) => handleSelectionChange("selectedOpportunities", value)}
            />
            
            <CategorySelect
              title="Azioni"
              description="Seleziona le azioni rilevanti per questo tema materiale"
              options={iroData.actions}
              selections={selections.selectedActions}
              onSelectionChange={(value) => handleSelectionChange("selectedActions", value)}
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
