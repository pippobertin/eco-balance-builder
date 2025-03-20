
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BasicInfoSection from '../BasicInfoSection';
import BaseModuleMetrics from '../BaseModuleMetrics';
import { Report } from '@/context/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
  // Add more specific debugging
  useEffect(() => {
    if (currentReport) {
      if (!currentReport.company || !currentReport.company_id) {
        console.log("Report exists but company data is completely missing:", currentReport.id);
      } else if (!currentReport.company.name) {
        console.log("Report has company_id but missing company details:", currentReport.company_id);
      } else {
        console.log("Report has complete company data:", currentReport.company.name);
      }
    } else {
      console.log("No current report loaded");
    }
  }, [currentReport]);

  if (!currentReport) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        <p className="text-gray-500">Caricamento report in corso...</p>
      </div>
    );
  }

  // Check if report has company data
  const missingCompanyData = !currentReport.company || !currentReport.company.name;
  if (missingCompanyData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <AlertTriangle className="h-12 w-12 text-amber-500" />
        <h3 className="text-xl font-semibold text-center">Dati aziendali incompleti</h3>
        <p className="text-gray-600 text-center max-w-md">
          Non è stato possibile caricare i dati dell'azienda associata a questo report. 
          Si prega di tornare alla pagina aziende e selezionare nuovamente il report.
        </p>
        <Button onClick={() => navigate('/companies')}>
          Torna alla pagina aziende
        </Button>
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="basic-info">Informazioni Base</TabsTrigger>
        <TabsTrigger value="metrics">Metriche Base</TabsTrigger>
      </TabsList>

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
