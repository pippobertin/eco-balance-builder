
import React, { useState } from 'react';
import { Check, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { motion } from 'framer-motion';
import { Alert, AlertCircle, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MaterialityIssue, Stakeholder, SurveyTemplate } from './types';

interface SurveyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stakeholders: Stakeholder[];
  surveyTemplate: SurveyTemplate;
  setSurveyTemplate: React.Dispatch<React.SetStateAction<SurveyTemplate>>;
  selectedStakeholders: string[];
  setSelectedStakeholders: React.Dispatch<React.SetStateAction<string[]>>;
  getStakeholderPriorityColor: (priority: string) => string;
  onSendSurveys: () => void;
}

const SurveyDialog: React.FC<SurveyDialogProps> = ({
  open,
  onOpenChange,
  stakeholders,
  surveyTemplate,
  setSurveyTemplate,
  selectedStakeholders,
  setSelectedStakeholders,
  getStakeholderPriorityColor,
  onSendSurveys
}) => {
  const [surveyPreviewMode, setSurveyPreviewMode] = useState(false);
  const [showSurveySuccess, setShowSurveySuccess] = useState(false);

  const toggleSelectAllStakeholders = () => {
    if (selectedStakeholders.length === stakeholders.length) {
      setSelectedStakeholders([]);
    } else {
      setSelectedStakeholders(stakeholders.map(s => s.id));
    }
  };

  const handleStakeholderSelection = (id: string) => {
    setSelectedStakeholders(prev => 
      prev.includes(id) 
        ? prev.filter(s => s !== id) 
        : [...prev, id]
    );
  };

  const toggleSurveyPreviewMode = () => {
    setSurveyPreviewMode(!surveyPreviewMode);
  };

  const handleSendSurveys = () => {
    onSendSurveys();
    setShowSurveySuccess(true);
    
    // Close dialog after a delay
    setTimeout(() => {
      onOpenChange(false);
      setShowSurveySuccess(false);
    }, 3000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {surveyPreviewMode 
              ? "Anteprima del sondaggio di materialità" 
              : "Crea e invia sondaggio agli stakeholder"}
          </DialogTitle>
          <DialogDescription>
            {surveyPreviewMode 
              ? "Questa è un'anteprima di come apparirà il sondaggio agli stakeholder."
              : "Seleziona gli stakeholder a cui inviare il sondaggio di materialità."
            }
          </DialogDescription>
        </DialogHeader>

        {showSurveySuccess ? (
          <div className="py-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-green-100 dark:bg-green-900/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4"
            >
              <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
            </motion.div>
            <h3 className="text-xl font-medium mb-2">Sondaggi inviati con successo!</h3>
            <p className="text-gray-500 dark:text-gray-400">
              I sondaggi sono stati inviati a {selectedStakeholders.length} stakeholder selezionati.
            </p>
          </div>
        ) : surveyPreviewMode ? (
          <div className="space-y-6 py-4">
            <div className="border rounded-md p-6 bg-white dark:bg-gray-800">
              <h3 className="text-xl font-bold mb-4">{surveyTemplate.title}</h3>
              <p className="mb-6">{surveyTemplate.description}</p>
              
              <div className="space-y-8">
                {surveyTemplate.issues.map((issue) => (
                  <div key={issue.id} className="space-y-3">
                    <h4 className="font-medium">{issue.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{issue.description}</p>
                    
                    <div className="pt-2">
                      <Label className="mb-2 block">
                        Quanto ritieni rilevante questa questione per la nostra organizzazione?
                      </Label>
                      <div className="flex flex-col space-y-2">
                        {[
                          { value: '5', label: 'Estremamente rilevante' },
                          { value: '4', label: 'Molto rilevante' },
                          { value: '3', label: 'Moderatamente rilevante' },
                          { value: '2', label: 'Poco rilevante' },
                          { value: '1', label: 'Non rilevante' }
                        ].map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              name={`relevance-${issue.id}`} 
                              id={`relevance-${issue.id}-${option.value}`}
                              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                              disabled
                            />
                            <Label 
                              htmlFor={`relevance-${issue.id}-${option.value}`}
                              className="text-sm"
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <Label htmlFor={`comments-${issue.id}`} className="mb-2 block">
                        Commenti o suggerimenti su questa questione (opzionale)
                      </Label>
                      <Textarea 
                        id={`comments-${issue.id}`}
                        placeholder="Inserisci qui i tuoi commenti..."
                        disabled
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {surveyTemplate.additionalComments && (
                <div className="mt-8 space-y-3">
                  <h4 className="font-medium">Altri temi rilevanti</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Ci sono altre questioni di sostenibilità che ritieni rilevanti e che non sono state incluse in questo sondaggio?
                  </p>
                  <Textarea 
                    placeholder="Inserisci qui le tue osservazioni..."
                    disabled
                  />
                </div>
              )}
              
              <div className="mt-8 pt-6 border-t">
                <Button disabled className="w-full">Invia le tue risposte</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Seleziona gli stakeholder</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={toggleSelectAllStakeholders}
                >
                  {selectedStakeholders.length === stakeholders.length 
                    ? "Deseleziona tutti" 
                    : "Seleziona tutti"}
                </Button>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <div className="max-h-64 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Seleziona
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Nome
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Categoria
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Priorità
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Email
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                      {stakeholders.map((stakeholder) => (
                        <tr key={stakeholder.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Checkbox 
                              checked={selectedStakeholders.includes(stakeholder.id)} 
                              onCheckedChange={() => handleStakeholderSelection(stakeholder.id)}
                              id={`select-${stakeholder.id}`}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Label 
                              htmlFor={`select-${stakeholder.id}`}
                              className="font-medium text-gray-900 dark:text-gray-100"
                            >
                              {stakeholder.name}
                            </Label>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {stakeholder.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStakeholderPriorityColor(stakeholder.priority)}`}>
                              {stakeholder.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {stakeholder.email}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Nota</AlertTitle>
                <AlertDescription>
                  Solo gli stakeholder selezionati riceveranno il sondaggio via email.
                </AlertDescription>
              </Alert>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personalizza il sondaggio</h3>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="surveyTitle">Titolo del sondaggio</Label>
                  <Input 
                    id="surveyTitle"
                    value={surveyTemplate.title}
                    onChange={(e) => setSurveyTemplate({...surveyTemplate, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="surveyDescription">Descrizione</Label>
                  <Textarea 
                    id="surveyDescription"
                    value={surveyTemplate.description}
                    onChange={(e) => setSurveyTemplate({...surveyTemplate, description: e.target.value})}
                    className="min-h-20"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="additionalComments" 
                    checked={surveyTemplate.additionalComments}
                    onCheckedChange={(checked) => 
                      setSurveyTemplate({...surveyTemplate, additionalComments: checked === true})
                    }
                  />
                  <Label htmlFor="additionalComments">
                    Includere una sezione per commenti addizionali e altre questioni
                  </Label>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter className="flex justify-between items-center space-x-2">
          {surveyPreviewMode ? (
            <>
              <Button 
                variant="outline" 
                onClick={toggleSurveyPreviewMode}
              >
                Torna alle impostazioni
              </Button>
              <Button 
                onClick={handleSendSurveys}
                disabled={selectedStakeholders.length === 0}
              >
                <Send className="mr-2 h-4 w-4" />
                Invia sondaggio a {selectedStakeholders.length} stakeholder
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Annulla
              </Button>
              <div className="flex space-x-2">
                <Button 
                  variant="secondary" 
                  onClick={toggleSurveyPreviewMode}
                >
                  Anteprima sondaggio
                </Button>
                <Button 
                  onClick={handleSendSurveys}
                  disabled={selectedStakeholders.length === 0}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Invia sondaggio
                </Button>
              </div>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SurveyDialog;
