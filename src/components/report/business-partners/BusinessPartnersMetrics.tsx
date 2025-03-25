
import React from 'react';
import { Tab } from '@headlessui/react';
import BP1RevenueSectors from './BP1RevenueSectors';
import BP2GenderDiversity from './BP2GenderDiversity';
import BP3GHGTargets from './BP3GHGTargets';
import BP4TransitionPlan from './BP4TransitionPlan';
import BP5PhysicalRisks from './BP5PhysicalRisks';
import BP6HazardousWaste from './BP6HazardousWaste';
import BP7PolicyAlignment from './BP7PolicyAlignment';
import BP8ComplianceProcesses from './BP8ComplianceProcesses';
import BP9Violations from './BP9Violations';
import BP10WorkLifeBalance from './BP10WorkLifeBalance';
import BP11Apprentices from './BP11Apprentices';
import { useReport } from '@/hooks/use-report-context';
import { useBusinessPartnersData } from './hooks';
import { TabNavigation, NavigationButtons, TabDefinition } from './components';

const tabs: TabDefinition[] = [
  { id: 'bp1', name: 'BP1 - Settori Specifici' },
  { id: 'bp2', name: 'BP2 - Diversità di Genere' },
  { id: 'bp3', name: 'BP3 - Obiettivi GHG' },
  { id: 'bp4', name: 'BP4 - Piano Transizione' },
  { id: 'bp5', name: 'BP5 - Rischi Fisici' },
  { id: 'bp6', name: 'BP6 - Rifiuti Pericolosi' },
  { id: 'bp7', name: 'BP7 - Allineamento Politiche' },
  { id: 'bp8', name: 'BP8 - Processi Compliance' },
  { id: 'bp9', name: 'BP9 - Violazioni' },
  { id: 'bp10', name: 'BP10 - Equilibrio Lavoro-Vita' },
  { id: 'bp11', name: 'BP11 - Apprendisti' }
];

interface BusinessPartnersMetricsProps {
  activeField?: string;
}

const BusinessPartnersMetrics: React.FC<BusinessPartnersMetricsProps> = ({ activeField }) => {
  const { currentReport } = useReport();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  
  const {
    formData,
    setFormData,
    isLoading,
    saveData,
    lastSaved,
    needsSaving
  } = useBusinessPartnersData(currentReport?.id || '');

  console.log('BusinessPartnersMetrics - needsSaving:', needsSaving);
  console.log('BusinessPartnersMetrics - lastSaved:', lastSaved);

  React.useEffect(() => {
    if (activeField) {
      const index = tabs.findIndex(tab => tab.id === activeField);
      if (index !== -1) {
        setSelectedIndex(index);
      }
    }
  }, [activeField]);

  const goToNextTab = () => {
    setSelectedIndex((prev) => Math.min(prev + 1, tabs.length - 1));
  };

  const goToPrevTab = () => {
    setSelectedIndex((prev) => Math.max(prev - 1, 0));
  };

  const updateFormSection = (section: string, data: any) => {
    console.log(`Updating form section ${section} with:`, data);
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const saveCurrentSection = async (): Promise<boolean> => {
    const currentTabId = tabs[selectedIndex].id;
    console.log(`Saving data for section: ${currentTabId}`);
    return await saveData();
  };

  return (
    <div className="w-full">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <TabNavigation 
          tabs={tabs} 
          selectedIndex={selectedIndex} 
          onChange={setSelectedIndex} 
        />
        
        <Tab.Panels className="mt-4">
          <Tab.Panel>
            <BP1RevenueSectors 
              formData={formData.bp1}
              setFormData={(data) => updateFormSection('bp1', data)}
              saveData={saveCurrentSection}
              isLoading={isLoading}
              lastSaved={lastSaved.bp1}
              needsSaving={needsSaving.bp1}
            />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP2GenderDiversity 
              formData={formData.bp2}
              setFormData={(data) => updateFormSection('bp2', data)}
              saveData={saveCurrentSection}
              isLoading={isLoading}
              lastSaved={lastSaved.bp2}
              needsSaving={needsSaving.bp2}
            />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP3GHGTargets 
              formData={formData.bp3}
              setFormData={(data) => updateFormSection('bp3', data)}
              saveData={saveCurrentSection}
              isLoading={isLoading}
              lastSaved={lastSaved.bp3}
              needsSaving={needsSaving.bp3}
            />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP4TransitionPlan 
              formData={formData.bp4}
              setFormData={(data) => updateFormSection('bp4', data)}
              saveData={saveCurrentSection}
              isLoading={isLoading}
              lastSaved={lastSaved.bp4}
              needsSaving={needsSaving.bp4}
            />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP5PhysicalRisks 
              formData={formData.bp5}
              setFormData={(data) => updateFormSection('bp5', data)}
              saveData={saveCurrentSection}
              isLoading={isLoading}
              lastSaved={lastSaved.bp5}
              needsSaving={needsSaving.bp5}
            />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP6HazardousWaste 
              formData={formData.bp6}
              setFormData={(data) => updateFormSection('bp6', data)}
              saveData={saveCurrentSection}
              isLoading={isLoading}
              lastSaved={lastSaved.bp6}
              needsSaving={needsSaving.bp6}
            />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP7PolicyAlignment 
              formData={formData.bp7}
              setFormData={(data) => updateFormSection('bp7', data)}
              saveData={saveCurrentSection}
              isLoading={isLoading}
              lastSaved={lastSaved.bp7}
              needsSaving={needsSaving.bp7}
            />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP8ComplianceProcesses 
              formData={formData.bp8}
              setFormData={(data) => updateFormSection('bp8', data)}
              saveData={saveCurrentSection}
              isLoading={isLoading}
              lastSaved={lastSaved.bp8}
              needsSaving={needsSaving.bp8}
            />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP9Violations 
              formData={formData.bp9}
              setFormData={(data) => updateFormSection('bp9', data)}
              saveData={saveCurrentSection}
              isLoading={isLoading}
              lastSaved={lastSaved.bp9}
              needsSaving={needsSaving.bp9}
            />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP10WorkLifeBalance 
              formData={formData.bp10}
              setFormData={(data) => updateFormSection('bp10', data)}
              saveData={saveCurrentSection}
              isLoading={isLoading}
              lastSaved={lastSaved.bp10}
              needsSaving={needsSaving.bp10}
            />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP11Apprentices 
              formData={formData.bp11}
              setFormData={(data) => updateFormSection('bp11', data)}
              saveData={saveCurrentSection}
              isLoading={isLoading}
              lastSaved={lastSaved.bp11}
              needsSaving={needsSaving.bp11}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      
      <NavigationButtons 
        goToPrevTab={goToPrevTab}
        goToNextTab={goToNextTab}
        isPrevDisabled={selectedIndex === 0}
        isNextDisabled={selectedIndex === tabs.length - 1}
      />
    </div>
  );
};

export default BusinessPartnersMetrics;
