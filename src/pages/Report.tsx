import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { CheckCircle2, ClipboardList, Users, Building2, ArrowRight, Info, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BaseModuleMetrics from '@/components/report/BaseModuleMetrics';
import { useReport } from '@/context/ReportContext';
const Report = () => {
  const {
    toast
  } = useToast();
  const {
    reportData,
    updateReportData
  } = useReport();
  const [activeTab, setActiveTab] = useState('modulo-selection');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isConsolidated, setIsConsolidated] = useState<boolean>(false);
  const [subsidiaries, setSubsidiaries] = useState<{
    name: string;
    location: string;
  }[]>([]);
  const [newSubsidiary, setNewSubsidiary] = useState<{
    name: string;
    location: string;
  }>({
    name: '',
    location: ''
  });
  const [sustainabilityPractices, setSustainabilityPractices] = useState<string>('');
  const [formValues, setFormValues] = useState({
    environmentalMetrics: {},
    socialMetrics: {},
    conductMetrics: {},
    narrativePATMetrics: {},
    materialityAnalysis: {}
  });
  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };
  const handleAddSubsidiary = () => {
    if (newSubsidiary.name.trim() && newSubsidiary.location.trim()) {
      setSubsidiaries([...subsidiaries, {
        ...newSubsidiary
      }]);
      setNewSubsidiary({
        name: '',
        location: ''
      });
    } else {
      toast({
        title: "Informazione mancante",
        description: "Per favore inserisci sia il nome che la sede legale dell'impresa figlia.",
        variant: "destructive"
      });
    }
  };
  const removeSubsidiary = (index: number) => {
    const updatedSubsidiaries = [...subsidiaries];
    updatedSubsidiaries.splice(index, 1);
    setSubsidiaries(updatedSubsidiaries);
  };
  const handleContinue = () => {
    if (!selectedOption) {
      toast({
        title: "Selezione richiesta",
        description: "Per favore, seleziona un'opzione di rendicontazione prima di continuare.",
        variant: "destructive"
      });
      return;
    }
    if (isConsolidated && subsidiaries.length === 0) {
      toast({
        title: "Informazione mancante",
        description: "Hai selezionato la rendicontazione consolidata. Per favore, aggiungi almeno un'impresa figlia.",
        variant: "destructive"
      });
      return;
    }
    setActiveTab('basic-info');
    toast({
      title: "Configurazione salvata",
      description: `Hai selezionato l'opzione ${selectedOption} per la tua rendicontazione di sostenibilità.`
    });
  };
  const saveBasicInfo = () => {
    toast({
      title: "Informazioni salvate",
      description: "Le informazioni di base sono state salvate con successo."
    });
    setActiveTab('metrics');
  };
  const saveMetrics = () => {
    updateReportData(formValues);
    toast({
      title: "Report completato",
      description: "Il report V-SME è stato compilato e salvato con successo."
    });
  };
  const containerAnimation = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{
          opacity: 0,
          y: -20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Report V-SME</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Compila il tuo report di sostenibilità secondo lo standard V-SME
            </p>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="modulo-selection">Selezione Modulo</TabsTrigger>
              <TabsTrigger value="basic-info">Informazioni Base</TabsTrigger>
              <TabsTrigger value="metrics">Metriche Base</TabsTrigger>
            </TabsList>

            <TabsContent value="modulo-selection">
              <motion.div variants={containerAnimation} initial="hidden" animate="visible" className="space-y-6">
                <GlassmorphicCard>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <ClipboardList className="mr-2 h-5 w-5 text-blue-500" />
                    Seleziona l'opzione per la tua relazione sulla sostenibilità
                  </h2>
                  
                  <RadioGroup value={selectedOption} onValueChange={handleOptionChange} className="space-y-4">
                    <div className="flex items-start space-x-2 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                      <RadioGroupItem value="A" id="option-a" className="mt-1" />
                      <div className="grid gap-1.5">
                        <Label htmlFor="option-a" className="font-medium">OPZIONE A: Modulo Base</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Approccio mirato per le micro-imprese e requisito minimo per le altre imprese.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                      <RadioGroupItem value="B" id="option-b" className="mt-1" />
                      <div className="grid gap-1.5">
                        <Label htmlFor="option-b" className="font-medium">OPZIONE B: Modulo Base e Modulo Narrativo-PAT</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Include informazioni narrative relative a politiche, azioni e obiettivi in aggiunta al Modulo Base.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                      <RadioGroupItem value="C" id="option-c" className="mt-1" />
                      <div className="grid gap-1.5">
                        <Label htmlFor="option-c" className="font-medium">OPZIONE C: Modulo Base e Modulo Partner commerciali</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Include dati aggiuntivi che potrebbero essere richiesti da finanziatori, investitori e clienti.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                      <RadioGroupItem value="D" id="option-d" className="mt-1" />
                      <div className="grid gap-1.5">
                        <Label htmlFor="option-d" className="font-medium">OPZIONE D: Modulo Base, Modulo Narrativo-PAT e Modulo Partner commerciali</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Combinazione completa di tutti i moduli disponibili.
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </GlassmorphicCard>

                <GlassmorphicCard>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Building2 className="mr-2 h-5 w-5 text-blue-500" />
                    Tipo di rendicontazione
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="consolidated" checked={isConsolidated} onCheckedChange={checked => setIsConsolidated(checked === true)} />
                      <Label htmlFor="consolidated">Rendicontazione su base consolidata</Label>
                    </div>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {isConsolidated ? "La relazione includerà informazioni dell'impresa madre e delle sue figlie." : "La relazione sarà limitata solo alle informazioni dell'impresa principale."}
                    </p>
                    
                    {isConsolidated && <div className="space-y-4 mt-4 border-t pt-4">
                        <h3 className="text-md font-medium">Imprese figlie incluse nella relazione</h3>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {subsidiaries.map((subsidiary, index) => <div key={index} className="flex items-center bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
                              <span className="text-sm mr-2">{subsidiary.name} ({subsidiary.location})</span>
                              <button onClick={() => removeSubsidiary(index)} className="text-red-500 hover:text-red-700">
                                &times;
                              </button>
                            </div>)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input placeholder="Nome dell'impresa figlia" value={newSubsidiary.name} onChange={e => setNewSubsidiary({
                        ...newSubsidiary,
                        name: e.target.value
                      })} />
                          <Input placeholder="Sede legale" value={newSubsidiary.location} onChange={e => setNewSubsidiary({
                        ...newSubsidiary,
                        location: e.target.value
                      })} />
                        </div>
                        
                        <Button variant="outline" onClick={handleAddSubsidiary} className="mt-2">
                          Aggiungi impresa figlia
                        </Button>
                      </div>}
                  </div>
                </GlassmorphicCard>
                
                <div className="flex justify-end">
                  <Button onClick={handleContinue} className="bg-blue-500 hover:bg-blue-600">
                    Continua
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="basic-info">
              <motion.div variants={containerAnimation} initial="hidden" animate="visible" className="space-y-6">
                <GlassmorphicCard>
                  <div className="flex items-center mb-4">
                    <Info className="mr-2 h-5 w-5 text-blue-500" />
                    <h2 className="text-xl font-semibold">Informativa B 1 - Criteri per la redazione</h2>
                  </div>
                  
                  <div className="p-4 rounded-md mb-4 bg-sky-800">
                    <p className="text-sm text-slate-50">
                      Hai selezionato: <strong>{selectedOption === 'A' ? 'OPZIONE A: Modulo Base' : selectedOption === 'B' ? 'OPZIONE B: Modulo Base e Modulo Narrativo-PAT' : selectedOption === 'C' ? 'OPZIONE C: Modulo Base e Modulo Partner commerciali' : selectedOption === 'D' ? 'OPZIONE D: Modulo Base, Modulo Narrativo-PAT e Modulo Partner commerciali' : 'Nessuna opzione selezionata'}</strong>
                    </p>
                    <p className="text-sm mt-2 text-slate-50">
                      Tipo di relazione: <strong>{isConsolidated ? 'Consolidata' : 'Individuale'}</strong>
                    </p>
                    {isConsolidated && subsidiaries.length > 0 && <div className="mt-2">
                        <p className="text-sm font-medium">Imprese figlie incluse:</p>
                        <ul className="list-disc pl-5 text-sm">
                          {subsidiaries.map((subsidiary, index) => <li key={index}>{subsidiary.name} - {subsidiary.location}</li>)}
                        </ul>
                      </div>}
                  </div>
                </GlassmorphicCard>

                <GlassmorphicCard>
                  <div className="flex items-center mb-4">
                    <FileText className="mr-2 h-5 w-5 text-blue-500" />
                    <h2 className="text-xl font-semibold">Informativa B 2 - Pratiche per la transizione verso un'economia più sostenibile</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Descrivere brevemente le pratiche specifiche adottate dall'impresa per la transizione verso un'economia più sostenibile. 
                      Non includere attività filantropiche, ma piuttosto iniziative concrete per migliorare l'impatto ambientale e sociale dell'impresa.
                    </p>
                    
                    <textarea className="w-full min-h-[200px] p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Descrivi qui le pratiche adottate dalla tua impresa..." value={sustainabilityPractices} onChange={e => setSustainabilityPractices(e.target.value)} />
                  </div>
                </GlassmorphicCard>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab('modulo-selection')}>
                    Torna indietro
                  </Button>
                  <Button onClick={saveBasicInfo} className="bg-blue-500 hover:bg-blue-600">
                    Salva informazioni e continua
                    <CheckCircle2 className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="metrics">
              <BaseModuleMetrics formValues={formValues} setFormValues={setFormValues} onPrevious={() => setActiveTab('basic-info')} onSave={saveMetrics} selectedOption={selectedOption} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>;
};
export default Report;