
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Leaf, Users, Building2, Briefcase, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EnvironmentalMetrics from './EnvironmentalMetrics';
import SocialMetrics from './SocialMetrics';
import ConductMetrics from './ConductMetrics';
import NarrativePATMetrics from './NarrativePATMetrics';
import BusinessPartnersMetrics from './BusinessPartnersMetrics';

interface BaseModuleMetricsProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
  onPrevious: () => void;
  onSave: () => void;
  selectedOption: string;
  initialSection?: string;
  initialField?: string;
}

const BaseModuleMetrics: React.FC<BaseModuleMetricsProps> = ({
  formValues,
  setFormValues,
  onPrevious,
  onSave,
  selectedOption,
  initialSection,
  initialField
}) => {
  const {
    toast
  } = useToast();
  const [activeSection, setActiveSection] = React.useState<'environmental' | 'social' | 'conduct' | 'narrative' | 'business-partners'>('environmental');

  // Determina quali moduli devono essere mostrati in base all'opzione selezionata
  const showNarrativeModule = selectedOption === 'B' || selectedOption === 'D';
  const showBusinessPartnersModule = selectedOption === 'C' || selectedOption === 'D';

  // Al cambio di opzione, se la sezione attiva non è disponibile, resetta alla sezione ambientale
  React.useEffect(() => {
    if (activeSection === 'narrative' && !showNarrativeModule || activeSection === 'business-partners' && !showBusinessPartnersModule) {
      setActiveSection('environmental');
    }
  }, [selectedOption, activeSection, showNarrativeModule, showBusinessPartnersModule]);

  // Set the initial active section based on the initialSection prop
  useEffect(() => {
    if (initialSection) {
      switch (initialSection) {
        case 'environmental':
          setActiveSection('environmental');
          break;
        case 'social':
          setActiveSection('social');
          break;
        case 'conduct':
          setActiveSection('conduct');
          break;
        case 'narrative':
          if (showNarrativeModule) {
            setActiveSection('narrative');
          }
          break;
        case 'business-partners':
          if (showBusinessPartnersModule) {
            setActiveSection('business-partners');
          }
          break;
        default:
          break;
      }
    }
  }, [initialSection, showNarrativeModule, showBusinessPartnersModule]);

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

  // Ottieni la descrizione dell'opzione selezionata
  const getOptionDescription = () => {
    switch (selectedOption) {
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

  return <motion.div variants={containerAnimation} initial="hidden" animate="visible" className="space-y-6">
      <div className="p-4 rounded-md mb-6 bg-gray-500">
        <div className="flex items-start">
          <Info className="mt-0.5 mr-2 h-5 w-5 text-white" />
          <div>
            <p className="text-sm font-medium text-white">{getOptionDescription()}</p>
            <p className="text-sm mt-1 text-white">
              Completa le sezioni seguenti in base all'opzione selezionata. Le metriche ambientali, sociali e di condotta sono obbligatorie per tutte le opzioni.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button variant={activeSection === 'environmental' ? 'default' : 'outline'} onClick={() => setActiveSection('environmental')} className="flex items-center">
          <Leaf className="mr-2 h-4 w-4" />
          Ambiente
        </Button>
        <Button variant={activeSection === 'social' ? 'default' : 'outline'} onClick={() => setActiveSection('social')} className="flex items-center">
          <Users className="mr-2 h-4 w-4" />
          Sociale
        </Button>
        <Button variant={activeSection === 'conduct' ? 'default' : 'outline'} onClick={() => setActiveSection('conduct')} className="flex items-center">
          <Building2 className="mr-2 h-4 w-4" />
          Condotta
        </Button>
        {showNarrativeModule && <Button variant={activeSection === 'narrative' ? 'default' : 'outline'} onClick={() => setActiveSection('narrative')} className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Narrativo-PAT
          </Button>}
        {showBusinessPartnersModule && <Button variant={activeSection === 'business-partners' ? 'default' : 'outline'} onClick={() => setActiveSection('business-partners')} className="flex items-center">
            <Briefcase className="mr-2 h-4 w-4" />
            Partner Commerciali
          </Button>}
      </div>

      {activeSection === 'environmental' && <EnvironmentalMetrics formValues={formValues} setFormValues={setFormValues} initialField={initialSection === 'environmental' ? initialField : undefined} />}
      
      {activeSection === 'social' && <SocialMetrics formValues={formValues} setFormValues={setFormValues} initialField={initialSection === 'social' ? initialField : undefined} />}
      
      {activeSection === 'conduct' && <ConductMetrics formValues={formValues} setFormValues={setFormValues} initialField={initialSection === 'conduct' ? initialField : undefined} />}
      
      {activeSection === 'narrative' && showNarrativeModule && <NarrativePATMetrics formValues={formValues} setFormValues={setFormValues} />}
      
      {activeSection === 'business-partners' && showBusinessPartnersModule && <BusinessPartnersMetrics formValues={formValues} setFormValues={setFormValues} />}

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna indietro
        </Button>
      </div>
    </motion.div>;
};

export default BaseModuleMetrics;
