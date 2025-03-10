
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  CheckCircle2, 
  Info, 
  FileText,
  Save,
  FileBarChart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BaseModuleMetrics from '@/components/report/BaseModuleMetrics';
import { useReport, Subsidiary } from '@/context/ReportContext';

const Report = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    reportData,
    updateReportData,
    currentCompany,
    currentReport,
    saveCurrentReport,
    saveSubsidiaries
  } = useReport();
  
  const [activeTab, setActiveTab] = useState('basic-info');
  const [isConsolidated, setIsConsolidated] = useState<boolean>(false);
  const [subsidiaries, setSubsidiaries] = useState<Subsidiary[]>([]);
  const [newSubsidiary, setNewSubsidiary] = useState<Subsidiary>({
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
  
  // Carica i dati del report corrente
  useEffect(() => {
    if (currentReport) {
      setIsConsolidated(currentReport.is_consolidated);
      
      // Carica i dati del form dal report
      setFormValues({
        environmentalMetrics: reportData.environmentalMetrics || {},
        socialMetrics: reportData.socialMetrics || {},
        conductMetrics: reportData.conductMetrics || {},
        narrativePATMetrics: reportData.narrativePATMetrics || {},
        materialityAnalysis: reportData.materialityAnalysis || {}
      });
      
      // Se non c'è un'azienda selezionata o un report, reindirizza alla pagina delle aziende
      if (!currentCompany) {
        toast({
          title: "Nessuna azienda selezionata",
          description: "Seleziona un'azienda e un report per continuare",
          variant: "destructive"
        });
        navigate('/companies');
      }
    } else {
      // Se non c'è un report attivo, reindirizza alla pagina delle aziende
      toast({
        title: "Nessun report attivo",
        description: "Seleziona o crea un report per continuare",
        variant: "destructive"
      });
      navigate('/companies');
    }
  }, [currentReport, currentCompany]);
  
  // Gestione del salvataggio manuale
  const handleSaveReport = async () => {
    await saveCurrentReport();
    
    if (currentReport && isConsolidated) {
      await saveSubsidiaries(subsidiaries, currentReport.id);
    }
    
    toast({
      title: "Report salvato",
      description: "Tutte le modifiche sono state salvate con successo"
    });
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
  
  const saveBasicInfo = () => {
    toast({
      title: "Informazioni salvate",
      description: "Le informazioni di base sono state salvate con successo."
    });
    setActiveTab('metrics');
  };
  
  const saveMetrics = async () => {
    updateReportData(formValues);
    
    await saveCurrentReport();
    
    if (currentReport && isConsolidated) {
      await saveSubsidiaries(subsidiaries, currentReport.id);
    }
    
    toast({
      title: "Report completato",
      description: "Il report V-SME è stato compilato e salvato con successo."
    });
  };
  
  const viewDashboard = () => {
    navigate('/dashboard');
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
            className="mb-4 flex flex-wrap items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-baseline gap-2">
                Report V-SME
                {currentCompany && <span className="text-emerald-500 text-3xl font-bold">{currentCompany.name}</span>}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Compila il tuo report di sostenibilità secondo lo standard V-SME
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleSaveReport}
              >
                <Save className="h-4 w-4" />
                Salva
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={viewDashboard}
              >
                <FileBarChart className="h-4 w-4" />
                Visualizza Dashboard
              </Button>
            </div>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="basic-info">Informazioni Base</TabsTrigger>
              <TabsTrigger value="metrics">Metriche Base</TabsTrigger>
            </TabsList>

            <TabsContent value="basic-info">
              <motion.div variants={containerAnimation} initial="hidden" animate="visible" className="space-y-6">
                <GlassmorphicCard>
                  <div className="flex items-center mb-4">
                    <Info className="mr-2 h-5 w-5 text-blue-500" />
                    <h2 className="text-xl font-semibold">Informativa B 1 - Criteri per la redazione</h2>
                  </div>
                  
                  <div className="p-4 rounded-md mb-4 bg-sky-800">
                    <p className="text-sm text-slate-50">
                      Hai selezionato: <strong>
                        {currentReport?.report_type === 'A' 
                          ? 'OPZIONE A: Modulo Base' 
                          : currentReport?.report_type === 'B' 
                            ? 'OPZIONE B: Modulo Base e Modulo Narrativo-PAT' 
                            : currentReport?.report_type === 'C' 
                              ? 'OPZIONE C: Modulo Base e Modulo Partner commerciali' 
                              : currentReport?.report_type === 'D' 
                                ? 'OPZIONE D: Modulo Base, Modulo Narrativo-PAT e Modulo Partner commerciali' 
                                : 'Nessuna opzione selezionata'
                        }
                      </strong>
                    </p>
                    <p className="text-sm mt-2 text-slate-50">
                      Tipo di relazione: <strong>{isConsolidated ? 'Consolidata' : 'Individuale'}</strong>
                    </p>
                    {isConsolidated && subsidiaries.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-white">Imprese figlie incluse:</p>
                        <ul className="list-disc pl-5 text-sm text-white">
                          {subsidiaries.map((subsidiary, index) => (
                            <li key={index}>{subsidiary.name} - {subsidiary.location}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {isConsolidated && (
                    <div className="space-y-4 mt-4 border-t pt-4">
                      <h3 className="text-md font-medium">Imprese figlie incluse nella relazione</h3>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {subsidiaries.map((subsidiary, index) => (
                          <div key={index} className="flex items-center bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
                            <span className="text-sm mr-2">{subsidiary.name} ({subsidiary.location})</span>
                            <button 
                              onClick={() => removeSubsidiary(index)} 
                              className="text-red-500 hover:text-red-700"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                          placeholder="Nome dell'impresa figlia" 
                          value={newSubsidiary.name} 
                          onChange={e => setNewSubsidiary({
                            ...newSubsidiary,
                            name: e.target.value
                          })} 
                        />
                        <Input 
                          placeholder="Sede legale" 
                          value={newSubsidiary.location} 
                          onChange={e => setNewSubsidiary({
                            ...newSubsidiary,
                            location: e.target.value
                          })} 
                        />
                      </div>
                      
                      <Button variant="outline" onClick={handleAddSubsidiary} className="mt-2">
                        Aggiungi impresa figlia
                      </Button>
                    </div>
                  )}
                </GlassmorphicCard>

                <GlassmorphicCard>
                  <div className="flex items-center mb-4">
                    <FileText className="mr-2 h-5 w-5 text-blue-500" />
                    <h2 className="text-xl font-semibold">Informativa B 2 - Pratiche per la transizione verso un'economia più sostenibile</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Descrivi brevemente le pratiche specifiche adottate dall'impresa per la transizione verso un'economia più sostenibile. 
                      Non includere attività filantropiche, ma piuttosto iniziative concrete per migliorare l'impatto ambientale e sociale dell'impresa.
                    </p>
                    
                    <textarea 
                      className="w-full min-h-[200px] p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Descrivi qui le pratiche adottate dalla tua impresa..." 
                      value={sustainabilityPractices} 
                      onChange={e => setSustainabilityPractices(e.target.value)} 
                    />
                  </div>
                </GlassmorphicCard>
                
                <div className="flex justify-end">
                  <Button onClick={saveBasicInfo} className="bg-blue-500 hover:bg-blue-600">
                    Salva informazioni e continua
                    <CheckCircle2 className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="metrics">
              <BaseModuleMetrics 
                formValues={formValues} 
                setFormValues={setFormValues} 
                onPrevious={() => setActiveTab('basic-info')} 
                onSave={saveMetrics} 
                selectedOption={currentReport?.report_type || 'A'} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Report;
