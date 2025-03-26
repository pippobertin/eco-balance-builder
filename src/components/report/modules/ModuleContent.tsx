
import React from 'react';
import { useReport } from '@/context/ReportContext';
import EnvironmentalMetrics from '../EnvironmentalMetrics';
import SocialMetrics from '../SocialMetrics'; 
import ConductMetrics from '../ConductMetrics';
import NarrativePATMetrics from '../NarrativePATMetrics';
import BusinessPartnersMetrics from '../business-partners/BusinessPartnersMetrics';
import EnvironmentalBusinessPartnersMetrics from '../EnvironmentalBusinessPartnersMetrics';

export interface ModuleContentProps {
  activeSection: 'environmental' | 'social' | 'conduct' | 'narrative' | 'business-partners' | 'business-partners-alt';
  module?: string;
  formValues?: any;
  setFormValues?: React.Dispatch<React.SetStateAction<any>>;
  showNarrativeModule?: boolean;
  showBusinessPartnersModule?: boolean;
  initialSection?: string;
  initialField?: string;
}

const ModuleContent: React.FC<ModuleContentProps> = ({ 
  activeSection,
  module,
  formValues, 
  setFormValues,
  showNarrativeModule,
  showBusinessPartnersModule,
  initialSection,
  initialField
}) => {
  const { currentReport } = useReport();

  // Placeholder for module content
  const renderContent = () => {
    if (!currentReport) {
      return <div className="p-6 text-center">Seleziona un report per visualizzarne il contenuto</div>;
    }

    // Render the appropriate component based on activeSection
    switch (activeSection) {
      case 'environmental':
        return <EnvironmentalMetrics 
          formValues={formValues} 
          setFormValues={setFormValues} 
          initialField={initialField}
        />;
      case 'social':
        return <SocialMetrics 
          formValues={formValues} 
          setFormValues={setFormValues} 
        />;
      case 'conduct':
        return <ConductMetrics 
          formValues={formValues} 
          setFormValues={setFormValues} 
        />;
      case 'narrative':
        if (showNarrativeModule) {
          return <NarrativePATMetrics />;
        }
        return <div className="p-6 text-center">Modulo narrativo non disponibile per questo tipo di report</div>;
      case 'business-partners':
        if (showBusinessPartnersModule) {
          return <BusinessPartnersMetrics 
            formValues={formValues} 
            setFormValues={setFormValues} 
          />;
        }
        return <div className="p-6 text-center">Modulo partner commerciali non disponibile per questo tipo di report</div>;
      case 'business-partners-alt':
        if (showBusinessPartnersModule) {
          return <EnvironmentalBusinessPartnersMetrics 
            formValues={formValues} 
            setFormValues={setFormValues}
            initialField={initialField}
          />;
        }
        return <div className="p-6 text-center">Modulo partner commerciali non disponibile per questo tipo di report</div>;
      default:
        return (
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Modulo: {module || activeSection}</h3>
            <div className="bg-white p-4 rounded-lg border">
              <p>Seleziona una sezione dal menu sopra per visualizzarne il contenuto</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      {renderContent()}
    </div>
  );
};

export default ModuleContent;
