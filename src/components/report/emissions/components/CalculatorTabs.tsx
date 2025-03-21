
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CalculationTabsContent from './CalculationTabsContent';

interface CalculatorTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  inputs: any;
  updateInput: (key: string, value: any) => void;
}

const CalculatorTabs: React.FC<CalculatorTabsProps> = ({
  activeTab,
  setActiveTab,
  inputs,
  updateInput
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="scope1">Scope 1 - Emissioni Dirette</TabsTrigger>
        <TabsTrigger value="scope2">Scope 2 - Energia</TabsTrigger>
        <TabsTrigger value="scope3">Scope 3 - Altre Emissioni</TabsTrigger>
      </TabsList>
      
      <CalculationTabsContent 
        activeTab={activeTab}
        inputs={inputs}
        updateInput={updateInput}
      />
    </Tabs>
  );
};

export default CalculatorTabs;
