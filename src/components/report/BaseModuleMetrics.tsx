
import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EnvironmentalMetrics from './EnvironmentalMetrics';
import SocialMetrics from './SocialMetrics';
import ConductMetrics from './ConductMetrics';

interface BaseModuleMetricsProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
  onPrevious: () => void;
  onSave: () => void;
}

const BaseModuleMetrics: React.FC<BaseModuleMetricsProps> = ({ 
  formValues, 
  setFormValues,
  onPrevious,
  onSave
}) => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = React.useState<'environmental' | 'social' | 'conduct'>('environmental');

  const handleSave = () => {
    toast({
      title: "Metriche salvate",
      description: "Le metriche del modulo base sono state salvate con successo.",
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

  return (
    <motion.div
      variants={containerAnimation}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex space-x-4 mb-6">
        <Button 
          variant={activeSection === 'environmental' ? 'default' : 'outline'} 
          onClick={() => setActiveSection('environmental')}
          className="flex-1"
        >
          Ambiente
        </Button>
        <Button 
          variant={activeSection === 'social' ? 'default' : 'outline'} 
          onClick={() => setActiveSection('social')}
          className="flex-1"
        >
          Sociale
        </Button>
        <Button 
          variant={activeSection === 'conduct' ? 'default' : 'outline'} 
          onClick={() => setActiveSection('conduct')}
          className="flex-1"
        >
          Condotta
        </Button>
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

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna indietro
        </Button>
        <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600">
          Salva metriche
          <CheckCircle2 className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default BaseModuleMetrics;
