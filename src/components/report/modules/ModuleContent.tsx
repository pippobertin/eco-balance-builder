
import React, { useState } from 'react';
import { useReport } from '@/context/ReportContext';

export interface ModuleContentProps {
  activeSection?: string;
  module?: string;
  formValues?: any;
  setFormValues?: React.Dispatch<React.SetStateAction<any>>;
  showNarrativeModule?: boolean;
  showBusinessPartnersModule?: boolean;
  initialSection?: string;
  initialField?: string;
}

const ModuleContent: React.FC<ModuleContentProps> = ({ 
  module,
  activeSection,
  formValues, 
  setFormValues,
  showNarrativeModule,
  showBusinessPartnersModule,
  initialSection,
  initialField
}) => {
  const { currentReport } = useReport();
  const [activeTab, setActiveTab] = useState('basic');

  // Placeholder for module content
  const renderContent = () => {
    if (!currentReport) {
      return <div className="p-6 text-center">Seleziona un report per visualizzarne il contenuto</div>;
    }

    return (
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">Modulo: {module || activeSection}</h3>
        
        <div className="bg-white p-4 rounded-lg border">
          <p>
            Contenuto del modulo {module || activeSection} qui. Tab attivo: {activeTab}
          </p>
          
          {formValues && (
            <div className="mt-4">
              <p>Form values disponibili: {Object.keys(formValues).join(', ')}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return renderContent();
};

export default ModuleContent;
