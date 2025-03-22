
import React from 'react';
import EnvironmentalMetrics from '../EnvironmentalMetrics';
import SocialMetrics from '../SocialMetrics';
import ConductMetrics from '../ConductMetrics';
import NarrativePATMetrics from '../NarrativePATMetrics';
import BusinessPartnersMetrics from '../BusinessPartnersMetrics';

interface ModuleContentProps {
  activeSection: 'environmental' | 'social' | 'conduct' | 'narrative' | 'business-partners';
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
  showNarrativeModule: boolean;
  showBusinessPartnersModule: boolean;
  initialSection?: string;
  initialField?: string;
}

const ModuleContent: React.FC<ModuleContentProps> = ({
  activeSection,
  formValues,
  setFormValues,
  showNarrativeModule,
  showBusinessPartnersModule,
  initialSection,
  initialField
}) => {
  return (
    <>
      {activeSection === 'environmental' && (
        <EnvironmentalMetrics 
          formValues={formValues} 
          setFormValues={setFormValues} 
          initialField={initialSection === 'environmental' ? initialField : undefined} 
        />
      )}
      
      {activeSection === 'social' && (
        <SocialMetrics 
          formValues={formValues} 
          setFormValues={setFormValues} 
          initialField={initialSection === 'social' ? initialField : undefined} 
        />
      )}
      
      {activeSection === 'conduct' && (
        <ConductMetrics 
          formValues={formValues} 
          setFormValues={setFormValues} 
          initialField={initialSection === 'conduct' ? initialField : undefined} 
        />
      )}
      
      {activeSection === 'narrative' && showNarrativeModule && (
        <NarrativePATMetrics 
          formValues={formValues} 
          setFormValues={setFormValues} 
        />
      )}
      
      {activeSection === 'business-partners' && showBusinessPartnersModule && (
        <BusinessPartnersMetrics 
          formValues={formValues} 
          setFormValues={setFormValues} 
        />
      )}
    </>
  );
};

export default ModuleContent;
