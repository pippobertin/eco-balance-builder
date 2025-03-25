
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useReport } from '@/hooks/use-report-context';
import { useBusinessPartnersData } from './hooks';
import { 
  BP1RevenueSectors,
  BP2GenderDiversity,
  BP3GHGTargets,
  BP4TransitionPlan,
  BP5PhysicalRisks,
  BP6HazardousWaste,
  BP7PolicyAlignment,
  BP8ComplianceProcesses,
  BP9Violations,
  BP10WorkLifeBalance,
  BP11Apprentices
} from './';

interface BusinessPartnersMetricsProps {
  reportId: string;
  initialField?: string;
}

const BusinessPartnersMetrics: React.FC<BusinessPartnersMetricsProps> = ({
  reportId,
  initialField
}) => {
  // Get business partners data from custom hook
  const {
    formData,
    setFormData,
    isLoading,
    saveData,
    lastSaved,
    needsSaving
  } = useBusinessPartnersData(reportId);

  // Set default active tab based on initialField or use 'bp1'
  const [activeTab, setActiveTab] = React.useState<string>(initialField || 'bp1');

  // Update active tab when initialField changes
  useEffect(() => {
    if (initialField) {
      setActiveTab(initialField);
    }
  }, [initialField]);

  // Set up tabs with sections
  const tabs = [
    { id: 'bp1', label: 'BP1 - Settori Specifici' },
    { id: 'bp2', label: 'BP2 - Diversità di Genere' },
    { id: 'bp3', label: 'BP3 - Obiettivi GHG' },
    { id: 'bp4', label: 'BP4 - Piano di Transizione' },
    { id: 'bp5', label: 'BP5 - Rischi Fisici' },
    { id: 'bp6', label: 'BP6 - Rifiuti Pericolosi' },
    { id: 'bp7', label: 'BP7 - Allineamento Politiche' },
    { id: 'bp8', label: 'BP8 - Processi di Conformità' },
    { id: 'bp9', label: 'BP9 - Violazioni' },
    { id: 'bp10', label: 'BP10 - Equilibrio Lavoro-Vita' },
    { id: 'bp11', label: 'BP11 - Apprendisti' }
  ];

  // Save handler that updates the formData for a specific BP section
  const handleSaveSection = async (): Promise<boolean> => {
    console.log('Saving business partners data...');
    try {
      const result = await saveData();
      console.log('Save result:', result);
      return result;
    } catch (error) {
      console.error('Error saving business partners data:', error);
      return false;
    }
  };

  if (isLoading) {
    return <div className="py-8 text-center">Caricamento dati in corso...</div>;
  }

  return (
    <Card className="p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="bp1">
          <BP1RevenueSectors
            formData={formData.bp1}
            setFormData={(bp1Data) => setFormData({ ...formData, bp1: bp1Data })}
            saveData={handleSaveSection}
            isLoading={isLoading}
            lastSaved={lastSaved['bp1']}
            needsSaving={needsSaving['bp1']}
          />
        </TabsContent>

        <TabsContent value="bp2">
          <BP2GenderDiversity
            formData={formData.bp2}
            setFormData={(bp2Data) => setFormData({ ...formData, bp2: bp2Data })}
            saveData={handleSaveSection}
            isLoading={isLoading}
            lastSaved={lastSaved['bp2']}
            needsSaving={needsSaving['bp2']}
          />
        </TabsContent>

        <TabsContent value="bp3">
          <BP3GHGTargets
            formData={formData.bp3}
            setFormData={(bp3Data) => setFormData({ ...formData, bp3: bp3Data })}
            saveData={handleSaveSection}
            isLoading={isLoading}
            lastSaved={lastSaved['bp3']}
            needsSaving={needsSaving['bp3']}
          />
        </TabsContent>

        <TabsContent value="bp4">
          <BP4TransitionPlan
            formData={formData.bp4}
            setFormData={(bp4Data) => setFormData({ ...formData, bp4: bp4Data })}
            saveData={handleSaveSection}
            isLoading={isLoading}
            lastSaved={lastSaved['bp4']}
            needsSaving={needsSaving['bp4']}
          />
        </TabsContent>

        <TabsContent value="bp5">
          <BP5PhysicalRisks
            formData={formData.bp5}
            setFormData={(bp5Data) => setFormData({ ...formData, bp5: bp5Data })}
            saveData={handleSaveSection}
            isLoading={isLoading}
            lastSaved={lastSaved['bp5']}
            needsSaving={needsSaving['bp5']}
          />
        </TabsContent>

        <TabsContent value="bp6">
          <BP6HazardousWaste
            formData={formData.bp6}
            setFormData={(bp6Data) => setFormData({ ...formData, bp6: bp6Data })}
            saveData={handleSaveSection}
            isLoading={isLoading}
            lastSaved={lastSaved['bp6']}
            needsSaving={needsSaving['bp6']}
          />
        </TabsContent>

        <TabsContent value="bp7">
          <BP7PolicyAlignment
            formData={formData.bp7}
            setFormData={(bp7Data) => setFormData({ ...formData, bp7: bp7Data })}
            saveData={handleSaveSection}
            isLoading={isLoading}
            lastSaved={lastSaved['bp7']}
            needsSaving={needsSaving['bp7']}
          />
        </TabsContent>

        <TabsContent value="bp8">
          <BP8ComplianceProcesses
            formData={formData.bp8}
            setFormData={(bp8Data) => setFormData({ ...formData, bp8: bp8Data })}
            saveData={handleSaveSection}
            isLoading={isLoading}
            lastSaved={lastSaved['bp8']}
            needsSaving={needsSaving['bp8']}
          />
        </TabsContent>

        <TabsContent value="bp9">
          <BP9Violations
            formData={formData.bp9}
            setFormData={(bp9Data) => setFormData({ ...formData, bp9: bp9Data })}
            saveData={handleSaveSection}
            isLoading={isLoading}
            lastSaved={lastSaved['bp9']}
            needsSaving={needsSaving['bp9']}
          />
        </TabsContent>

        <TabsContent value="bp10">
          <BP10WorkLifeBalance
            formData={formData.bp10}
            setFormData={(bp10Data) => setFormData({ ...formData, bp10: bp10Data })}
            saveData={handleSaveSection}
            isLoading={isLoading}
            lastSaved={lastSaved['bp10']}
            needsSaving={needsSaving['bp10']}
          />
        </TabsContent>

        <TabsContent value="bp11">
          <BP11Apprentices
            formData={formData.bp11}
            setFormData={(bp11Data) => setFormData({ ...formData, bp11: bp11Data })}
            saveData={handleSaveSection}
            isLoading={isLoading}
            lastSaved={lastSaved['bp11']}
            needsSaving={needsSaving['bp11']}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default BusinessPartnersMetrics;
