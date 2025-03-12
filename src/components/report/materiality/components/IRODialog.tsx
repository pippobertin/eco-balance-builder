
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MaterialityIssue, IROSelections } from '../types';
import { predefinedIROData } from '../utils/materialityUtils';

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

  // Impostare le selezioni iniziali se esistono
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
      
      // Se l'indice è maggiore della lunghezza dell'array, aggiungiamo elementi vuoti fino a raggiungere l'indice
      while (currentArray.length <= index) {
        currentArray.push('');
      }
      
      currentArray[index] = value;
      newSelections[category] = currentArray;
      
      return newSelections;
    });
  };

  // Otteniamo i dati IRO predefiniti per questo tema, se disponibili
  const iroData = predefinedIROData[issue.id] || {
    impacts: [],
    risks: [],
    opportunities: [],
    actions: []
  };

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
            {/* Sezione Impatti */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Impatti</h3>
              <p className="text-sm text-gray-500">Seleziona gli impatti rilevanti per questo tema materiale</p>
              
              {[0, 1, 2, 3].map((index) => (
                <div key={`impact-${index}`} className="mb-2">
                  <Select 
                    value={selections.selectedImpacts[index] || ''} 
                    onValueChange={(value) => handleSelectionChange('selectedImpacts', index, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleziona un impatto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nessuna selezione</SelectItem>
                      {iroData.impacts.map((impact, i) => (
                        <SelectItem key={`impact-option-${i}`} value={impact}>
                          {impact}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
            
            {/* Sezione Rischi */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Rischi</h3>
              <p className="text-sm text-gray-500">Seleziona i rischi rilevanti per questo tema materiale</p>
              
              {[0, 1, 2, 3].map((index) => (
                <div key={`risk-${index}`} className="mb-2">
                  <Select 
                    value={selections.selectedRisks[index] || ''} 
                    onValueChange={(value) => handleSelectionChange('selectedRisks', index, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleziona un rischio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nessuna selezione</SelectItem>
                      {iroData.risks.map((risk, i) => (
                        <SelectItem key={`risk-option-${i}`} value={risk}>
                          {risk}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sezione Opportunità */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Opportunità</h3>
              <p className="text-sm text-gray-500">Seleziona le opportunità rilevanti per questo tema materiale</p>
              
              {[0, 1, 2, 3].map((index) => (
                <div key={`opportunity-${index}`} className="mb-2">
                  <Select 
                    value={selections.selectedOpportunities[index] || ''} 
                    onValueChange={(value) => handleSelectionChange('selectedOpportunities', index, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleziona un'opportunità" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nessuna selezione</SelectItem>
                      {iroData.opportunities.map((opportunity, i) => (
                        <SelectItem key={`opportunity-option-${i}`} value={opportunity}>
                          {opportunity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
            
            {/* Sezione Azioni */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Azioni</h3>
              <p className="text-sm text-gray-500">Seleziona le azioni rilevanti per questo tema materiale</p>
              
              {[0, 1, 2, 3].map((index) => (
                <div key={`action-${index}`} className="mb-2">
                  <Select 
                    value={selections.selectedActions[index] || ''} 
                    onValueChange={(value) => handleSelectionChange('selectedActions', index, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleziona un'azione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nessuna selezione</SelectItem>
                      {iroData.actions.map((action, i) => (
                        <SelectItem key={`action-option-${i}`} value={action}>
                          {action}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
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
