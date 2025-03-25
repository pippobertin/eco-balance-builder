
import React, { useEffect } from 'react';
import EnvironmentalMetrics from '../environmental/EnvironmentalMetrics';
import SocialMetrics from '../social/SocialMetrics';
import ConductMetrics from '../conduct/ConductMetrics';
import NarrativePATMetrics from '../narrative/NarrativePATMetrics';
import BusinessPartnersMetrics from '../business-partners/BusinessPartnersMetrics';

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
  // Determine which module to render based on the active section
  const renderModule = () => {
    switch (activeSection) {
      case 'environmental':
        return (
          <EnvironmentalMetrics 
            formValues={formValues} 
            setFormValues={setFormValues}
            initialField={initialSection === 'environmental' ? initialField : undefined}
          />
        );
      case 'social':
        return (
          <SocialMetrics 
            formValues={formValues} 
            setFormValues={setFormValues} 
            initialField={initialSection === 'social' ? initialField : undefined}
          />
        );
      case 'conduct':
        return (
          <ConductMetrics 
            formValues={formValues} 
            setFormValues={setFormValues}
            initialField={initialSection === 'conduct' ? initialField : undefined}
          />
        );
      case 'narrative':
        if (showNarrativeModule) {
          return (
            <NarrativePATMetrics 
              formValues={formValues} 
              setFormValues={setFormValues}
              initialField={initialSection === 'narrative' ? initialField : undefined}
            />
          );
        }
        return null;
      case 'business-partners':
        if (showBusinessPartnersModule) {
          return (
            <BusinessPartnersMetrics 
              initialField={initialSection === 'business-partners' ? initialField : undefined}
            />
          );
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border shadow-sm">
      {renderModule()}
    </div>
  );
};

export default ModuleContent;
