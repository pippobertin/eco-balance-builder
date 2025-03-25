
import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { useReport } from '@/hooks/use-report-context';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

interface TabDefinition {
  id: string;
  name: string;
}

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
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Effetto per impostare la tab iniziale in base al campo attivo
  useEffect(() => {
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

  // Componente di navigazione tra le tab
  const TabNavigation = () => (
    <Tab.List className="flex space-x-1 overflow-x-auto p-1 bg-gray-100 rounded-xl mb-4">
      {tabs.map((tab, index) => (
        <Tab
          key={tab.id}
          className={({ selected }) =>
            `w-full py-2.5 text-sm font-medium leading-5 rounded-lg whitespace-nowrap px-3
             ${selected
              ? 'bg-white shadow text-blue-700'
              : 'text-gray-700 hover:bg-white/[0.12] hover:text-blue-600'
            }`
          }
        >
          {tab.name}
        </Tab>
      ))}
    </Tab.List>
  );

  // Pulsanti di navigazione
  const NavigationButtons = () => (
    <div className="flex justify-between mt-6">
      <Button
        variant="outline"
        onClick={goToPrevTab}
        disabled={selectedIndex === 0}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Precedente
      </Button>
      <Button
        variant="outline"
        onClick={goToNextTab}
        disabled={selectedIndex === tabs.length - 1}
      >
        Successivo
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="w-full">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <TabNavigation />
        
        <Tab.Panels className="mt-4">
          <Tab.Panel>
            <BP1RevenueSectors reportId={currentReport?.id || ''} />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP2GenderDiversity reportId={currentReport?.id || ''} />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP3GHGTargets reportId={currentReport?.id || ''} />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP4TransitionPlan reportId={currentReport?.id || ''} />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP5PhysicalRisks reportId={currentReport?.id || ''} />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP6HazardousWaste reportId={currentReport?.id || ''} />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP7PolicyAlignment reportId={currentReport?.id || ''} />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP8ComplianceProcesses reportId={currentReport?.id || ''} />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP9Violations reportId={currentReport?.id || ''} />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP10WorkLifeBalance reportId={currentReport?.id || ''} />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP11Apprentices reportId={currentReport?.id || ''} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      
      <NavigationButtons />
    </div>
  );
};

export default BusinessPartnersMetrics;
