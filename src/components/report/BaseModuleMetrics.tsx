
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import ModuleTabs from './modules/ModuleTabs';
import InfoBanner from './modules/InfoBanner';
import ModuleContent from './modules/ModuleContent';
import NavigationButtons from './modules/NavigationButtons';

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
  const { toast } = useToast();
  const [activeSection, setActiveSection] = React.useState<'environmental' | 'social' | 'conduct' | 'narrative' | 'business-partners' | 'business-partners-alt'>('environmental');

  // Determine which modules to show based on the selected option
  const showNarrativeModule = selectedOption === 'B' || selectedOption === 'D';
  const showBusinessPartnersModule = selectedOption === 'C' || selectedOption === 'D';

  // Redirect business-partners to business-partners-alt
  React.useEffect(() => {
    if (activeSection === 'business-partners') {
      setActiveSection('business-partners-alt');
    }
  }, [activeSection]);

  // Reset to environmental if the active section isn't available for the selected option
  React.useEffect(() => {
    if (activeSection === 'narrative' && !showNarrativeModule || 
        (activeSection === 'business-partners' || activeSection === 'business-partners-alt') && !showBusinessPartnersModule) {
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
            setActiveSection('business-partners-alt');
          }
          break;
        case 'business-partners-alt':
          if (showBusinessPartnersModule) {
            setActiveSection('business-partners-alt');
          }
          break;
        default:
          break;
      }
    }
  }, [initialSection, showNarrativeModule, showBusinessPartnersModule]);

  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      variants={containerAnimation} 
      initial="hidden" 
      animate="visible" 
      className="space-y-6"
    >
      <InfoBanner selectedOption={selectedOption} />

      <ModuleTabs 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        showNarrativeModule={showNarrativeModule}
        showBusinessPartnersModule={showBusinessPartnersModule}
      />

      <ModuleContent 
        activeSection={activeSection}
        formValues={formValues}
        setFormValues={setFormValues}
        showNarrativeModule={showNarrativeModule}
        showBusinessPartnersModule={showBusinessPartnersModule}
        initialSection={initialSection}
        initialField={initialField}
      />

      <NavigationButtons onPrevious={onPrevious} onSave={onSave} />
    </motion.div>
  );
};

export default BaseModuleMetrics;
