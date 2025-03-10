
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Check, PlusCircle, Trash2, Target, FileText } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { motion } from 'framer-motion';

interface MaterialityAnalysisProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

interface MaterialityIssue {
  id: string;
  name: string;
  description: string;
  impactRelevance: number;
  financialRelevance: number;
  isMaterial: boolean;
}

const predefinedIssues = [
  { id: 'climate', name: 'Cambiamento climatico', description: 'Gestione delle emissioni di gas serra e degli impatti sul clima' },
  { id: 'pollution', name: 'Inquinamento', description: 'Prevenzione e controllo dell'inquinamento di aria, acqua e suolo' },
  { id: 'resources', name: 'Uso delle risorse', description: 'Efficienza nell'uso delle risorse e principi di economia circolare' },
  { id: 'biodiversity', name: 'Biodiversità', description: 'Protezione e ripristino della biodiversità e degli ecosistemi' },
  { id: 'water', name: 'Gestione delle risorse idriche', description: 'Uso sostenibile e protezione delle risorse idriche' },
  { id: 'labor', name: 'Condizioni di lavoro', description: 'Condizioni di lavoro dignitose, inclusi salari, orari e diritti dei lavoratori' },
  { id: 'equality', name: 'Uguaglianza e non discriminazione', description: 'Promozione della parità di trattamento e opportunità' },
  { id: 'health', name: 'Salute e sicurezza', description: 'Protezione della salute e sicurezza dei lavoratori e consumatori' },
  { id: 'community', name: 'Impatti sulla comunità', description: 'Gestione degli impatti sulle comunità locali e relazioni con stakeholder' },
  { id: 'conduct', name: 'Etica aziendale', description: 'Prevenzione della corruzione, pratiche anti-concorrenziali e fiscalità' }
];

const MaterialityAnalysis: React.FC<MaterialityAnalysisProps> = ({ 
  formValues, 
  setFormValues 
}) => {
  const [issues, setIssues] = useState<MaterialityIssue[]>(
    formValues.materialityAnalysis?.issues || 
    predefinedIssues.map(issue => ({
      ...issue,
      impactRelevance: 50,
      financialRelevance: 50,
      isMaterial: false
    }))
  );
  
  const [newIssue, setNewIssue] = useState({ name: '', description: '' });

  // Update formValues whenever issues change
  React.useEffect(() => {
    setFormValues(prev => ({
      ...prev,
      materialityAnalysis: {
        ...prev.materialityAnalysis,
        issues
      }
    }));
  }, [issues, setFormValues]);

  const handleIssueChange = (id: string, field: keyof MaterialityIssue, value: any) => {
    setIssues(prevIssues => 
      prevIssues.map(issue => 
        issue.id === id ? { ...issue, [field]: value } : issue
      )
    );
  };

  const addCustomIssue = () => {
    if (newIssue.name.trim() && newIssue.description.trim()) {
      const id = `custom-${Date.now()}`;
      setIssues([
        ...issues,
        {
          id,
          name: newIssue.name,
          description: newIssue.description,
          impactRelevance: 50,
          financialRelevance: 50,
          isMaterial: false
        }
      ]);
      setNewIssue({ name: '', description: '' });
    }
  };

  const removeIssue = (id: string) => {
    setIssues(issues.filter(issue => issue.id !== id));
  };

  const determineQuadrant = (impactRelevance: number, financialRelevance: number) => {
    const threshold = 70;
    if (impactRelevance >= threshold && financialRelevance >= threshold) return "Alto impatto, Alta rilevanza finanziaria";
    if (impactRelevance >= threshold) return "Alto impatto, Bassa rilevanza finanziaria";
    if (financialRelevance >= threshold) return "Basso impatto, Alta rilevanza finanziaria";
    return "Basso impatto, Bassa rilevanza finanziaria";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Analisi di Materialità</h2>
      
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <Target className="mr-2 h-5 w-5 text-green-500" />
          <h3 className="text-xl font-semibold">Valutazione della Doppia Materialità</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            L'analisi di materialità valuta la rilevanza delle questioni di sostenibilità considerando due dimensioni:
            <br />- <strong>Rilevanza dell'impatto:</strong> impatti effettivi o potenziali sulle persone o sull'ambiente
            <br />- <strong>Rilevanza finanziaria:</strong> rischi e opportunità finanziarie che derivano dalle questioni di sostenibilità
          </p>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <p className="text-sm font-medium mb-2">Come utilizzare questo strumento:</p>
            <ol className="text-sm space-y-1 list-decimal pl-4">
              <li>Valuta la rilevanza dell'impatto per ciascuna questione spostando il primo slider</li>
              <li>Valuta la rilevanza finanziaria spostando il secondo slider</li>
              <li>Contrassegna come "materiale" le questioni che consideri rilevanti</li>
              <li>Aggiungi questioni personalizzate se necessario</li>
            </ol>
          </div>
        </div>

        <div className="space-y-8">
          {issues.map((issue) => (
            <div key={issue.id} className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{issue.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{issue.description}</p>
                </div>
                {!predefinedIssues.some(predefined => predefined.id === issue.id) && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeIssue(issue.id)}
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
                    onValueChange={(value) => handleIssueChange(issue.id, 'impactRelevance', value[0])}
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
                    onValueChange={(value) => handleIssueChange(issue.id, 'financialRelevance', value[0])}
                    className="mb-4"
                  />
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id={`material-${issue.id}`} 
                    checked={issue.isMaterial}
                    onCheckedChange={(checked) => handleIssueChange(issue.id, 'isMaterial', checked === true)}
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
          ))}
          
          <GlassmorphicCard className="bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center mb-4">
              <PlusCircle className="mr-2 h-5 w-5 text-blue-500" />
              <h4 className="text-lg font-medium">Aggiungi una questione personalizzata</h4>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="newIssueName">Nome della questione</Label>
                <Input
                  id="newIssueName"
                  value={newIssue.name}
                  onChange={(e) => setNewIssue({...newIssue, name: e.target.value})}
                  placeholder="Es. Gestione dei rifiuti"
                />
              </div>
              
              <div>
                <Label htmlFor="newIssueDescription">Descrizione</Label>
                <Input
                  id="newIssueDescription"
                  value={newIssue.description}
                  onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                  placeholder="Breve descrizione della questione di sostenibilità"
                />
              </div>
              
              <Button 
                onClick={addCustomIssue}
                className="w-full"
                disabled={!newIssue.name.trim() || !newIssue.description.trim()}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Aggiungi questione
              </Button>
            </div>
          </GlassmorphicCard>
        </div>
      </GlassmorphicCard>
      
      <GlassmorphicCard>
        <div className="flex items-center mb-4">
          <FileText className="mr-2 h-5 w-5 text-green-500" />
          <h3 className="text-xl font-semibold">Rapporto di Materialità</h3>
        </div>
        
        <div className="space-y-4">
          {issues.filter(issue => issue.isMaterial).length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nessuna questione è stata contrassegnata come materiale. 
              Utilizza i controlli sopra per valutare e selezionare le questioni materiali per la tua organizzazione.
            </p>
          ) : (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Le seguenti questioni sono state identificate come materiali per la tua organizzazione:
              </p>
              
              <div className="space-y-3">
                {issues
                  .filter(issue => issue.isMaterial)
                  .map((issue) => (
                    <motion.div 
                      key={issue.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start space-x-2 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900"
                    >
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">{issue.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{issue.description}</p>
                        <p className="text-xs mt-1">
                          <span className="font-medium">Rilevanza dell'impatto:</span> {issue.impactRelevance}% | 
                          <span className="font-medium ml-2">Rilevanza finanziaria:</span> {issue.financialRelevance}%
                        </p>
                      </div>
                    </motion.div>
                  ))
                }
              </div>
            </>
          )}
        </div>
      </GlassmorphicCard>
    </div>
  );
};

export default MaterialityAnalysis;
