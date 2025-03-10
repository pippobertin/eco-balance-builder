
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Check, PlusCircle, Trash2, Target, FileText, Users, Send } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { motion } from 'framer-motion';
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface Stakeholder {
  id: string;
  name: string;
  category: string;
  influence: number;
  interest: number;
  contactInfo: string;
  notes: string;
  priority: string;
}

const stakeholderCategories = [
  "Dipendenti",
  "Clienti",
  "Fornitori",
  "Azionisti/Investitori",
  "Comunità locale",
  "Organizzazioni non governative",
  "Autorità pubbliche",
  "Media",
  "Sindacati",
  "Partner commerciali",
  "Altro"
];

const predefinedIssues = [
  { id: 'climate', name: 'Cambiamento climatico', description: 'Gestione delle emissioni di gas serra e degli impatti sul clima' },
  { id: 'pollution', name: 'Inquinamento', description: 'Prevenzione e controllo dell\'inquinamento di aria, acqua e suolo' },
  { id: 'resources', name: 'Uso delle risorse', description: 'Efficienza nell\'uso delle risorse e principi di economia circolare' },
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
  
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(
    formValues.materialityAnalysis?.stakeholders || []
  );
  
  const [newIssue, setNewIssue] = useState({ name: '', description: '' });
  const [newStakeholder, setNewStakeholder] = useState<Stakeholder>({
    id: '',
    name: '',
    category: '',
    influence: 50,
    interest: 50,
    contactInfo: '',
    notes: '',
    priority: 'Media'
  });
  
  const [activeTab, setActiveTab] = useState('issues');

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
  
  // Update formValues whenever stakeholders change
  React.useEffect(() => {
    setFormValues(prev => ({
      ...prev,
      materialityAnalysis: {
        ...prev.materialityAnalysis,
        stakeholders
      }
    }));
  }, [stakeholders, setFormValues]);

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
  
  const addStakeholder = () => {
    if (newStakeholder.name.trim() && newStakeholder.category) {
      const id = `stakeholder-${Date.now()}`;
      const priority = calculatePriority(newStakeholder.influence, newStakeholder.interest);
      
      setStakeholders([
        ...stakeholders,
        {
          ...newStakeholder,
          id,
          priority
        }
      ]);
      
      setNewStakeholder({
        id: '',
        name: '',
        category: '',
        influence: 50,
        interest: 50,
        contactInfo: '',
        notes: '',
        priority: 'Media'
      });
    }
  };
  
  const removeStakeholder = (id: string) => {
    setStakeholders(stakeholders.filter(stakeholder => stakeholder.id !== id));
  };
  
  const handleStakeholderChange = (id: string, field: keyof Stakeholder, value: any) => {
    setStakeholders(prevStakeholders => 
      prevStakeholders.map(stakeholder => {
        if (stakeholder.id === id) {
          const updatedStakeholder = { ...stakeholder, [field]: value };
          
          // Update priority if influence or interest changes
          if (field === 'influence' || field === 'interest') {
            updatedStakeholder.priority = calculatePriority(
              field === 'influence' ? value : stakeholder.influence,
              field === 'interest' ? value : stakeholder.interest
            );
          }
          
          return updatedStakeholder;
        }
        return stakeholder;
      })
    );
  };
  
  const calculatePriority = (influence: number, interest: number): string => {
    if (influence >= 70 && interest >= 70) return 'Alta';
    if (influence >= 70 || interest >= 70) return 'Media-alta';
    if (influence <= 30 && interest <= 30) return 'Bassa';
    return 'Media';
  };
  
  const createStakeholderSurvey = () => {
    // Logic to create and send surveys to stakeholders based on material issues
    // This would typically involve generating a survey link or email template
    console.log("Creating stakeholder surveys for material issues:", issues.filter(i => i.isMaterial));
    console.log("Target stakeholders:", stakeholders);
  };

  const determineQuadrant = (impactRelevance: number, financialRelevance: number) => {
    const threshold = 70;
    if (impactRelevance >= threshold && financialRelevance >= threshold) return "Alto impatto, Alta rilevanza finanziaria";
    if (impactRelevance >= threshold) return "Alto impatto, Bassa rilevanza finanziaria";
    if (financialRelevance >= threshold) return "Basso impatto, Alta rilevanza finanziaria";
    return "Basso impatto, Bassa rilevanza finanziaria";
  };
  
  const getStakeholderPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'Alta': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'Media-alta': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'Media': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Bassa': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Analisi di Materialità</h2>
      
      <div className="flex space-x-2 mb-6">
        <Button 
          variant={activeTab === 'issues' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('issues')}
        >
          <Target className="mr-2 h-5 w-5" />
          Questioni di Materialità
        </Button>
        <Button 
          variant={activeTab === 'stakeholders' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('stakeholders')}
        >
          <Users className="mr-2 h-5 w-5" />
          Mappatura Stakeholder
        </Button>
      </div>
      
      {activeTab === 'issues' && (
        <>
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
        </>
      )}
      
      {activeTab === 'stakeholders' && (
        <>
          <GlassmorphicCard>
            <div className="flex items-center mb-4">
              <Users className="mr-2 h-5 w-5 text-blue-500" />
              <h3 className="text-xl font-semibold">Mappatura degli Stakeholder</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                La mappatura degli stakeholder è un processo cruciale per identificare e valutare gli individui, i gruppi e le organizzazioni 
                che possono influenzare o essere influenzati dalle attività dell'impresa. Gli stakeholder prioritari dovrebbero essere 
                coinvolti nel processo di analisi di materialità attraverso sondaggi, interviste o focus group.
              </p>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <p className="text-sm font-medium mb-2">Come utilizzare questo strumento:</p>
                <ol className="text-sm space-y-1 list-decimal pl-4">
                  <li>Identifica e aggiungi gli stakeholder rilevanti per la tua organizzazione</li>
                  <li>Valuta il loro livello di influenza sull'organizzazione e il loro interesse verso le questioni di sostenibilità</li>
                  <li>La priorità sarà calcolata automaticamente in base a influenza e interesse</li>
                  <li>Utilizza questa mappatura per decidere quali stakeholder coinvolgere nell'analisi di materialità</li>
                </ol>
              </div>
            </div>
            
            <div className="space-y-6">
              {stakeholders.length > 0 ? (
                <div className="space-y-4">
                  {stakeholders.map((stakeholder) => (
                    <div key={stakeholder.id} className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{stakeholder.name}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStakeholderPriorityColor(stakeholder.priority)}`}>
                              Priorità: {stakeholder.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Categoria: {stakeholder.category}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeStakeholder(stakeholder.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label>Livello di influenza: {stakeholder.influence}%</Label>
                          </div>
                          <Slider
                            value={[stakeholder.influence]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(value) => handleStakeholderChange(stakeholder.id, 'influence', value[0])}
                            className="mb-4"
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label>Livello di interesse: {stakeholder.interest}%</Label>
                          </div>
                          <Slider
                            value={[stakeholder.interest]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(value) => handleStakeholderChange(stakeholder.id, 'interest', value[0])}
                            className="mb-4"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <Label>Informazioni di contatto</Label>
                          <Input
                            value={stakeholder.contactInfo}
                            onChange={(e) => handleStakeholderChange(stakeholder.id, 'contactInfo', e.target.value)}
                            placeholder="Email, telefono, ecc."
                          />
                        </div>
                        
                        <div>
                          <Label>Note</Label>
                          <Input
                            value={stakeholder.notes}
                            onChange={(e) => handleStakeholderChange(stakeholder.id, 'notes', e.target.value)}
                            placeholder="Note aggiuntive"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">Nessuno stakeholder aggiunto</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Inizia aggiungendo gli stakeholder rilevanti per la tua organizzazione utilizzando il modulo sottostante.
                  </p>
                </div>
              )}
              
              <GlassmorphicCard className="bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center mb-4">
                  <PlusCircle className="mr-2 h-5 w-5 text-blue-500" />
                  <h4 className="text-lg font-medium">Aggiungi un nuovo stakeholder</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="stakeholderName">Nome dello stakeholder</Label>
                      <Input
                        id="stakeholderName"
                        value={newStakeholder.name}
                        onChange={(e) => setNewStakeholder({...newStakeholder, name: e.target.value})}
                        placeholder="Es. Associazione Consumatori Italiani"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="stakeholderCategory">Categoria</Label>
                      <Select
                        value={newStakeholder.category}
                        onValueChange={(value) => setNewStakeholder({...newStakeholder, category: value})}
                      >
                        <SelectTrigger id="stakeholderCategory">
                          <SelectValue placeholder="Seleziona una categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {stakeholderCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Livello di influenza: {newStakeholder.influence}%</Label>
                      <Slider
                        value={[newStakeholder.influence]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) => setNewStakeholder({...newStakeholder, influence: value[0]})}
                        className="mb-4"
                      />
                      <p className="text-xs text-gray-500">
                        Quanto lo stakeholder può influenzare le decisioni e le attività dell'organizzazione
                      </p>
                    </div>
                    
                    <div>
                      <Label>Livello di interesse: {newStakeholder.interest}%</Label>
                      <Slider
                        value={[newStakeholder.interest]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) => setNewStakeholder({...newStakeholder, interest: value[0]})}
                        className="mb-4"
                      />
                      <p className="text-xs text-gray-500">
                        Quanto lo stakeholder è interessato alle questioni di sostenibilità dell'organizzazione
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="stakeholderContact">Informazioni di contatto</Label>
                      <Input
                        id="stakeholderContact"
                        value={newStakeholder.contactInfo}
                        onChange={(e) => setNewStakeholder({...newStakeholder, contactInfo: e.target.value})}
                        placeholder="Email, telefono, ecc."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="stakeholderNotes">Note</Label>
                      <Input
                        id="stakeholderNotes"
                        value={newStakeholder.notes}
                        onChange={(e) => setNewStakeholder({...newStakeholder, notes: e.target.value})}
                        placeholder="Note aggiuntive"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={addStakeholder}
                    className="w-full"
                    disabled={!newStakeholder.name.trim() || !newStakeholder.category}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Aggiungi stakeholder
                  </Button>
                </div>
              </GlassmorphicCard>
              
              {stakeholders.length > 0 && issues.filter(issue => issue.isMaterial).length > 0 && (
                <GlassmorphicCard className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/50">
                  <div className="flex items-center mb-4">
                    <Send className="mr-2 h-5 w-5 text-green-600" />
                    <h4 className="text-lg font-medium">Coinvolgimento degli Stakeholder</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-sm">
                      Hai identificato {issues.filter(issue => issue.isMaterial).length} questioni materiali e {stakeholders.length} stakeholder. 
                      Ora puoi creare un sondaggio per coinvolgere gli stakeholder nella valutazione di materialità.
                    </p>
                    
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-md">
                      <h5 className="text-sm font-medium mb-2">Questioni materiali identificate:</h5>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {issues.filter(issue => issue.isMaterial).map(issue => (
                          <li key={issue.id}>{issue.name}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      onClick={createStakeholderSurvey}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Crea sondaggio per stakeholder
                    </Button>
                    
                    <p className="text-xs text-gray-500 text-center">
                      Il sondaggio includerà le questioni materiali identificate e consentirà agli stakeholder di 
                      esprimere la loro valutazione sulla rilevanza di ciascuna questione.
                    </p>
                  </div>
                </GlassmorphicCard>
              )}
            </div>
          </GlassmorphicCard>
        </>
      )}
    </div>
  );
};

export default MaterialityAnalysis;
