
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EnvironmentalNavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const EnvironmentalNavigation: React.FC<EnvironmentalNavigationProps> = ({
  activeSection,
  setActiveSection
}) => {
  return (
    <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
      <TabsList className="grid grid-cols-5">
        <TabsTrigger value="energy" className="whitespace-nowrap">
          B1-B2. Energia
        </TabsTrigger>
        <TabsTrigger value="emissions" className="whitespace-nowrap">
          B3. Emissioni GHG
        </TabsTrigger>
        <TabsTrigger value="pollution" className="whitespace-nowrap">
          B4. Inquinamento
        </TabsTrigger>
        <TabsTrigger value="biodiversity" className="whitespace-nowrap">
          B5. Biodiversità
        </TabsTrigger>
        <TabsTrigger value="materials" className="whitespace-nowrap">
          B6-B7. Materiali
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default EnvironmentalNavigation;
