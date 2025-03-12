
import React from 'react';
import { Leaf, Users, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemesTabContent from './ThemesTabContent';

interface ThemesCategoryTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  environmentalIssues: any[];
  socialIssues: any[];
  governanceIssues: any[];
  selectedIssueIds: Set<string>;
  onIssueSelect: (issue: any) => void;
}

const ThemesCategoryTabs: React.FC<ThemesCategoryTabsProps> = ({
  activeTab,
  setActiveTab,
  environmentalIssues,
  socialIssues,
  governanceIssues,
  selectedIssueIds,
  onIssueSelect
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="environmental" className="flex items-center gap-2">
          <Leaf className="h-4 w-4" />
          <span className="hidden sm:inline">Ambiente</span>
        </TabsTrigger>
        <TabsTrigger value="social" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Sociale</span>
        </TabsTrigger>
        <TabsTrigger value="governance" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">Governance</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="environmental" className="mt-4">
        <ThemesTabContent 
          issues={environmentalIssues}
          selectedIssueIds={selectedIssueIds}
          onIssueSelect={onIssueSelect}
        />
      </TabsContent>
      
      <TabsContent value="social" className="mt-4">
        <ThemesTabContent 
          issues={socialIssues}
          selectedIssueIds={selectedIssueIds}
          onIssueSelect={onIssueSelect}
        />
      </TabsContent>
      
      <TabsContent value="governance" className="mt-4">
        <ThemesTabContent 
          issues={governanceIssues}
          selectedIssueIds={selectedIssueIds}
          onIssueSelect={onIssueSelect}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ThemesCategoryTabs;
