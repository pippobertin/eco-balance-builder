
import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowLeft, FileText, Target, Leaf, Users, Building2, Briefcase, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EnvironmentalMetrics from './EnvironmentalMetrics';
import SocialMetrics from './SocialMetrics';
import ConductMetrics from './ConductMetrics';
import NarrativePATMetrics from './NarrativePATMetrics';
import MaterialityAnalysis from './MaterialityAnalysis';
import BusinessPartnersMetrics from './BusinessPartnersMetrics';

interface BaseModuleMetricsProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
  onPrevious: () => void;
  onSave: () => void;
  selectedOption: string;
}

const BaseModuleMetrics: React.FC<BaseModuleMetricsProps> = ({ 
  formValues, 
  setFormValues,
  onPrevious,
  onSave,
  selectedOption
}) => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = React.useState<'environmental' | 'social' | 'conduct' | 'narrative' | 'materiality' | 'business-partners'>('environmental');

  // Determina quali moduli devono essere mostrati in base all'opzione selezionata
  const showNarrativeModule = selectedOption === 'B' || selectedOption === 'D';
  const showBusinessPartnersModule = selectedOption === 'C' || selectedOption === 'D';
  const showMaterialityAnalysis = showNarrativeModule; // La materialità è necessaria per il modulo narrativo

  // Al cambio di opzione, se la sezione attiva non è disponibile, resetta alla sezione ambientale
  React.useEffect(() => {
    if ((activeSection === 'narrative' && !showNarrativeModule) || 
        (activeSection === 'materiality' && !showMaterialityAnalysis) ||
        (activeSection === 'business-partners' && !showBusinessPartnersModule)) {
      setActiveSection('environmental');
    }
  }, [selectedOption, activeSection, showNarrativeModule, showMaterialityAnalysis, showBusinessPartnersModule]);

  const handleSave = () => {
    toast({
      title: "Metriche salvate",
      description: "I dati del report sono stati salvati con successo.",
    });
    onSave();
  };

  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Ottieni la descrizione dell'opzione selezionata
  const getOptionDescription = () => {
    switch(selectedOption) {
      case 'A':
        return 'OPZIONE A: Modulo Base - Riporta solo gli indicatori ambientali, sociali e di condotta fondamentali.';
      case 'B':
        return 'OPZIONE B: Modulo Base e Modulo Narrativo-PAT - Include informazioni narrative relative a politiche, azioni e obiettivi oltre al Modulo Base.';
      case 'C':
        return 'OPZIONE C: Modulo Base e Modulo Partner commerciali - Include dati aggiuntivi richiesti da finanziatori, investitori e clienti.';
      case 'D':
        return 'OPZIONE D: Modulo Base, Modulo Narrativo-PAT e Modulo Partner commerciali - Combinazione completa di tutti i moduli disponibili.';
      default:
        return 'Seleziona un\'opzione per la tua relazione sulla sostenibilità';
    }
  };

  return (
    <motion.div
      variants={containerAnimation}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-6">
        <div className="flex items-start">
          <Info className="mt-0.5 mr-2 h-5 w-5 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">{getOptionDescription()}</p>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              Completa le sezioni seguenti in base all'opzione selezionata. Le metriche ambientali, sociali e di condotta sono obbligatorie per tutte le opzioni.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button 
          variant={activeSection === 'environmental' ? 'default' : 'outline'} 
          onClick={() => setActiveSection('environmental')}
          className="flex items-center"
        >
          <Leaf className="mr-2 h-4 w-4" />
          Ambiente
        </Button>
        <Button 
          variant={activeSection === 'social' ? 'default' : 'outline'} 
          onClick={() => setActiveSection('social')}
          className="flex items-center"
        >
          <Users className="mr-2 h-4 w-4" />
          Sociale
        </Button>
        <Button 
          variant={activeSection === 'conduct' ? 'default' : 'outline'} 
          onClick={() => setActiveSection('conduct')}
          className="flex items-center"
        >
          <Building2 className="mr-2 h-4 w-4" />
          Condotta
        </Button>
        {showMaterialityAnalysis && (
          <Button 
            variant={activeSection === 'materiality' ? 'default' : 'outline'} 
            onClick={() => setActiveSection('materiality')}
            className="flex items-center"
          >
            <Target className="mr-2 h-4 w-4" />
            Materialità
          </Button>
        )}
        {showNarrativeModule && (
          <Button 
            variant={activeSection === 'narrative' ? 'default' : 'outline'} 
            onClick={() => setActiveSection('narrative')}
            className="flex items-center"
          >
            <FileText className="mr-2 h-4 w-4" />
            Narrativo-PAT
          </Button>
        )}
        {showBusinessPartnersModule && (
          <Button 
            variant={activeSection === 'business-partners' ? 'default' : 'outline'} 
            onClick={() => setActiveSection('business-partners')}
            className="flex items-center"
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Partner Commerciali
          </Button>
        )}
      </div>

      {activeSection === 'environmental' && (
        <EnvironmentalMetrics formValues={formValues} setFormValues={setFormValues} />
      )}
      
      {activeSection === 'social' && (
        <SocialMetrics formValues={formValues} setFormValues={setFormValues} />
      )}
      
      {activeSection === 'conduct' && (
        <ConductMetrics formValues={formValues} setFormValues={setFormValues} />
      )}
      
      {activeSection === 'materiality' && showMaterialityAnalysis && (
        <MaterialityAnalysis formValues={formValues} setFormValues={setFormValues} />
      )}
      
      {activeSection === 'narrative' && showNarrativeModule && (
        <NarrativePATMetrics formValues={formValues} setFormValues={setFormValues} />
      )}
      
      {activeSection === 'business-partners' && showBusinessPartnersModule && (
        <BusinessPartnersMetrics formValues={formValues} setFormValues={setFormValues} />
      )}

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna indietro
        </Button>
        <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600">
          Salva report
          <CheckCircle2 className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default BaseModuleMetrics;
