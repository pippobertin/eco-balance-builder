import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from 'react-router-dom';
import { useReport } from '@/hooks/use-report-context';
import { useBusinessPartnersData } from './hooks/useBusinessPartnersData';
import BP1RevenueSectors from './BP1RevenueSectors';

interface BusinessPartnersMetricsProps {
  formValues: any;
  setFormValues: (value: any) => void;
}

const BusinessPartnersMetrics: React.FC<BusinessPartnersMetricsProps> = ({ formValues, setFormValues }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("field") || "bp1";
  const [activeTab, setActiveTab] = useState(initialTab);
  const { currentReport } = useReport();
  
  const bpData = useBusinessPartnersData(currentReport?.id || '');
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    searchParams.set("field", value);
    setSearchParams(searchParams);
  };
  
  // Keep parent form values in sync
  useEffect(() => {
    setFormValues(prev => ({
      ...prev,
      businessPartnersMetrics: bpData.formData
    }));
  }, [bpData.formData, setFormValues]);
  
  const saveDataForModule = async (moduleKey: string) => {
    const needsSaving = { ...bpData.needsSaving };
    
    // Only mark the current module as needing saving
    Object.keys(needsSaving).forEach(key => {
      if (key !== moduleKey) {
        needsSaving[key] = false;
      }
    });
    
    bpData.setNeedsSaving(needsSaving);
    return await bpData.saveData();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Partner Commerciali</h1>
      
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 md:grid-cols-6 xl:grid-cols-11 h-auto">
          <TabsTrigger value="bp1">BP1</TabsTrigger>
          <TabsTrigger value="bp2">BP2</TabsTrigger>
          <TabsTrigger value="bp3">BP3</TabsTrigger>
          <TabsTrigger value="bp4">BP4</TabsTrigger>
          <TabsTrigger value="bp5">BP5</TabsTrigger>
          <TabsTrigger value="bp6">BP6</TabsTrigger>
          <TabsTrigger value="bp7">BP7</TabsTrigger>
          <TabsTrigger value="bp8">BP8</TabsTrigger>
          <TabsTrigger value="bp9">BP9</TabsTrigger>
          <TabsTrigger value="bp10">BP10</TabsTrigger>
          <TabsTrigger value="bp11">BP11</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="bp1">
            <BP1RevenueSectors 
              formData={bpData.formData}
              setFormData={bpData.setFormData}
              saveData={() => saveDataForModule('bp1')}
              isLoading={bpData.isLoading}
              lastSaved={bpData.lastSaved.bp1}
              needsSaving={bpData.needsSaving.bp1}
              bpKey="bp1"
            />
          </TabsContent>

          <TabsContent value="bp2">
            <div className="p-4 border rounded-md">
              <p>BP2 - Forthcoming implementation</p>
            </div>
          </TabsContent>
          
          <TabsContent value="bp3">
            <div className="p-4 border rounded-md">
              <p>BP3 - Forthcoming implementation</p>
            </div>
          </TabsContent>
          
          <TabsContent value="bp4">
            <div className="p-4 border rounded-md">
              <p>BP4 - Forthcoming implementation</p>
            </div>
          </TabsContent>
          
          <TabsContent value="bp5">
            <div className="p-4 border rounded-md">
              <p>BP5 - Forthcoming implementation</p>
            </div>
          </TabsContent>
          
          <TabsContent value="bp6">
            <div className="p-4 border rounded-md">
              <p>BP6 - Forthcoming implementation</p>
            </div>
          </TabsContent>
          
          <TabsContent value="bp7">
            <div className="p-4 border rounded-md">
              <p>BP7 - Forthcoming implementation</p>
            </div>
          </TabsContent>
          
          <TabsContent value="bp8">
            <div className="p-4 border rounded-md">
              <p>BP8 - Forthcoming implementation</p>
            </div>
          </TabsContent>
          
          <TabsContent value="bp9">
            <div className="p-4 border rounded-md">
              <p>BP9 - Forthcoming implementation</p>
            </div>
          </TabsContent>
          
          <TabsContent value="bp10">
            <div className="p-4 border rounded-md">
              <p>BP10 - Forthcoming implementation</p>
            </div>
          </TabsContent>
          
          <TabsContent value="bp11">
            <div className="p-4 border rounded-md">
              <p>BP11 - Forthcoming implementation</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default BusinessPartnersMetrics;
