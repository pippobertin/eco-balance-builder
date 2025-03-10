
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Target, Users } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import MaterialityIssuesTab from './materiality/MaterialityIssuesTab';
import StakeholdersTab from './materiality/StakeholdersTab';
import SurveyDialog from './materiality/SurveyDialog';
import { MaterialityIssue, Stakeholder, SurveyTemplate } from './materiality/types';

interface MaterialityAnalysisProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

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

const MaterialityAnalysis: React.FC<MaterialityAnalysisProps> = ({ 
  formValues, 
  setFormValues 
}) => {
  const { toast } = useToast();
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
  
  const [activeTab, setActiveTab] = useState('issues');
  const [surveyTemplate, setSurveyTemplate] = useState<SurveyTemplate>({
    title: 'Analisi di Materialità - Valutazione degli Stakeholder',
    description: 'Vi chiediamo di valutare l\'importanza delle seguenti questioni di sostenibilità per la nostra organizzazione',
    issues: [],
    additionalComments: true
  });
  const [surveyDialogOpen, setSurveyDialogOpen] = useState(false);
  const [selectedStakeholders, setSelectedStakeholders] = useState<string[]>([]);

  // Update formValues whenever issues change
  useEffect(() => {
    setFormValues(prev => ({
      ...prev,
      materialityAnalysis: {
        ...prev.materialityAnalysis,
        issues
      }
    }));
  }, [issues, setFormValues]);
  
  // Update formValues whenever stakeholders change
  useEffect(() => {
    setFormValues(prev => ({
      ...prev,
      materialityAnalysis: {
        ...prev.materialityAnalysis,
        stakeholders
      }
    }));
  }, [stakeholders, setFormValues]);

  // Update survey template issues whenever material issues change
  useEffect(() => {
    setSurveyTemplate(prev => ({
      ...prev,
      issues: issues.filter(issue => issue.isMaterial)
    }));
  }, [issues]);

  const handleIssueChange = (id: string, field: keyof MaterialityIssue, value: any) => {
    setIssues(prevIssues => 
      prevIssues.map(issue => 
        issue.id === id ? { ...issue, [field]: value } : issue
      )
    );
  };

  const addCustomIssue = (name: string, description: string) => {
    const id = `custom-${Date.now()}`;
    setIssues([
      ...issues,
      {
        id,
        name,
        description,
        impactRelevance: 50,
        financialRelevance: 50,
        isMaterial: false
      }
    ]);
  };

  const removeIssue = (id: string) => {
    setIssues(issues.filter(issue => issue.id !== id));
  };
  
  const addStakeholder = (newStakeholderData: Omit<Stakeholder, 'id' | 'priority' | 'surveyStatus'>) => {
    const id = `stakeholder-${Date.now()}`;
    const priority = calculatePriority(newStakeholderData.influence, newStakeholderData.interest);
    
    setStakeholders([
      ...stakeholders,
      {
        ...newStakeholderData,
        id,
        priority,
        surveyStatus: 'pending'
      }
    ]);
    
    toast({
      title: "Stakeholder aggiunto",
      description: `${newStakeholderData.name} è stato aggiunto alla mappatura degli stakeholder.`
    });
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
  
  const openSurveyDialog = () => {
    const materialIssues = issues.filter(i => i.isMaterial);
    
    if (materialIssues.length === 0) {
      toast({
        title: "Nessuna questione materiale",
        description: "Devi identificare almeno una questione materiale prima di creare un sondaggio.",
        variant: "destructive"
      });
      return;
    }
    
    if (stakeholders.length === 0) {
      toast({
        title: "Nessuno stakeholder",
        description: "Devi aggiungere almeno uno stakeholder prima di creare un sondaggio.",
        variant: "destructive"
      });
      return;
    }
    
    setSurveyDialogOpen(true);
    setSelectedStakeholders([]);
  };
  
  const sendSurveys = () => {
    if (selectedStakeholders.length === 0) {
      toast({
        title: "Nessuno stakeholder selezionato",
        description: "Seleziona almeno uno stakeholder a cui inviare il sondaggio.",
        variant: "destructive"
      });
      return;
    }
    
    // Update stakeholder survey status
    const updatedStakeholders = stakeholders.map(stakeholder => {
      if (selectedStakeholders.includes(stakeholder.id)) {
        return { ...stakeholder, surveyStatus: 'sent' as const };
      }
      return stakeholder;
    });
    
    setStakeholders(updatedStakeholders);
    
    // In a real application, here you would make an API call to send emails
    console.log("Sending survey to stakeholders:", selectedStakeholders);
    console.log("Survey template:", surveyTemplate);
    
    // Toast notification will be shown by the SurveyDialog component
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
  
  const getSurveyStatusColor = (status?: string): string => {
    switch (status) {
      case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };
  
  const getSurveyStatusText = (status?: string): string => {
    switch (status) {
      case 'sent': return 'Inviato';
      case 'completed': return 'Completato';
      default: return 'In attesa';
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
        <MaterialityIssuesTab 
          issues={issues}
          predefinedIssues={predefinedIssues}
          onIssueChange={handleIssueChange}
          onAddCustomIssue={addCustomIssue}
          onRemoveIssue={removeIssue}
        />
      )}
      
      {activeTab === 'stakeholders' && (
        <StakeholdersTab 
          stakeholders={stakeholders}
          materialIssues={issues.filter(issue => issue.isMaterial)}
          stakeholderCategories={stakeholderCategories}
          onStakeholderChange={handleStakeholderChange}
          onAddStakeholder={addStakeholder}
          onRemoveStakeholder={removeStakeholder}
          onOpenSurveyDialog={openSurveyDialog}
          getStakeholderPriorityColor={getStakeholderPriorityColor}
          getSurveyStatusColor={getSurveyStatusColor}
          getSurveyStatusText={getSurveyStatusText}
        />
      )}

      <SurveyDialog 
        open={surveyDialogOpen}
        onOpenChange={setSurveyDialogOpen}
        stakeholders={stakeholders}
        surveyTemplate={surveyTemplate}
        setSurveyTemplate={setSurveyTemplate}
        selectedStakeholders={selectedStakeholders}
        setSelectedStakeholders={setSelectedStakeholders}
        getStakeholderPriorityColor={getStakeholderPriorityColor}
        onSendSurveys={sendSurveys}
      />
    </div>
  );
};

export default MaterialityAnalysis;
