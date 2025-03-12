
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CompanyInformation from '../company-information';
import BasicInfoSection from '../BasicInfoSection';
import BaseModuleMetrics from '../BaseModuleMetrics';
import { Report } from '@/context/types';
import { useToast } from '@/hooks/use-toast';

interface ReportModuleTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
  isConsolidated: boolean;
  subsidiaries: any[];
  currentReport: Report | null;
  sustainabilityPractices: string;
  setSustainabilityPractices: React.Dispatch<React.SetStateAction<string>>;
  newSubsidiary: any;
  setNewSubsidiary: React.Dispatch<React.SetStateAction<any>>;
  handleAddSubsidiary: () => void;
  removeSubsidiary: (index: number) => void;
  saveBasicInfo: () => void;
  saveMetrics: () => void;
  initialSection?: string;
  initialField?: string;
}

const ReportModuleTabs: React.FC<ReportModuleTabsProps> = ({
  activeTab,
  onTabChange,
  formValues,
  setFormValues,
  isConsolidated,
  subsidiaries,
  currentReport,
  sustainabilityPractices,
  setSustainabilityPractices,
  newSubsidiary,
  setNewSubsidiary,
  handleAddSubsidiary,
  removeSubsidiary,
  saveBasicInfo,
  saveMetrics,
  initialSection,
  initialField
}) => {
  const { toast } = useToast();
  
  useEffect(() => {
    if (currentReport && !currentReport.company) {
      console.log("Report exists but company data is missing:", currentReport.id);
    }
  }, [currentReport]);

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="company-info">Informazioni Azienda</TabsTrigger>
        <TabsTrigger value="basic-info">Informazioni Base</TabsTrigger>
        <TabsTrigger value="metrics">Metriche Base</TabsTrigger>
      </TabsList>

      <TabsContent value="company-info">
        <CompanyInformation 
          currentCompany={currentReport?.company || null}
          onNext={() => onTabChange('basic-info')}
        />
      </TabsContent>

      <TabsContent value="basic-info">
        <BasicInfoSection 
          isConsolidated={isConsolidated}
          subsidiaries={subsidiaries}
          currentReport={currentReport}
          sustainabilityPractices={sustainabilityPractices}
          setSustainabilityPractices={setSustainabilityPractices}
          newSubsidiary={newSubsidiary}
          setNewSubsidiary={setNewSubsidiary}
          handleAddSubsidiary={handleAddSubsidiary}
          removeSubsidiary={removeSubsidiary}
          onContinue={saveBasicInfo}
        />
      </TabsContent>
      
      <TabsContent value="metrics">
        <BaseModuleMetrics 
          formValues={formValues} 
          setFormValues={setFormValues} 
          onPrevious={() => onTabChange('basic-info')} 
          onSave={saveMetrics}
          selectedOption={currentReport?.report_type || 'A'}
          initialSection={initialSection}
          initialField={initialField}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ReportModuleTabs;
