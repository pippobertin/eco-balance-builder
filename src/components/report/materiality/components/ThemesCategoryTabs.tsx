
import React, { useState } from 'react';
import { Leaf, Users, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemesTabContent from './ThemesTabContent';
import { predefinedIssues } from '../utils/materialityUtils';
import { getIssuesByCategory } from '../utils/categorizePredefinedIssues';
import { MaterialityIssue } from '../types';

interface ThemesCategoryTabsProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  environmentalIssues?: MaterialityIssue[];
  socialIssues?: MaterialityIssue[];
  governanceIssues?: MaterialityIssue[];
  selectedIssueIds?: Set<string>;
  onIssueSelect?: (issue: MaterialityIssue) => void;
  onAddIssue?: (name: string, description: string) => void;
}

const ThemesCategoryTabs: React.FC<ThemesCategoryTabsProps> = ({
  activeTab: externalActiveTab,
  setActiveTab: externalSetActiveTab,
  environmentalIssues,
  socialIssues,
  governanceIssues,
  selectedIssueIds = new Set(),
  onIssueSelect,
  onAddIssue
}) => {
  // Use internal state if external control props are not provided
  const [internalActiveTab, setInternalActiveTab] = useState<string>('environmental');
  
  // Use either the external or internal state
  const activeTab = externalActiveTab || internalActiveTab;
  const setActiveTab = externalSetActiveTab || setInternalActiveTab;

  // If no specific issues are provided, use predefined issues
  const { environmental, social, governance } = React.useMemo(() => 
    getIssuesByCategory(), []);

  // Use provided issues or default to categorized predefined issues
  const envIssues = environmentalIssues || environmental;
  const socIssues = socialIssues || social;
  const govIssues = governanceIssues || governance;

  const handleIssueSelect = (issue: MaterialityIssue) => {
    if (onIssueSelect) {
      // CRITICAL CHANGE: Make sure isMaterial is set to true explicitly when selecting an issue
      // This ensures the issue will be recognized as a material issue
      const updatedIssue = {
        ...issue,
        isMaterial: true // Force this to be true when selecting
      };
      console.log("ThemesCategoryTabs explicitly setting isMaterial to true for issue:", updatedIssue.id);
      onIssueSelect(updatedIssue);
    }
  };

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
          issues={envIssues}
          selectedIssueIds={selectedIssueIds}
          onIssueSelect={handleIssueSelect}
          onAddIssue={onAddIssue}
        />
      </TabsContent>
      
      <TabsContent value="social" className="mt-4">
        <ThemesTabContent 
          issues={socIssues}
          selectedIssueIds={selectedIssueIds}
          onIssueSelect={handleIssueSelect}
          onAddIssue={onAddIssue}
        />
      </TabsContent>
      
      <TabsContent value="governance" className="mt-4">
        <ThemesTabContent 
          issues={govIssues}
          selectedIssueIds={selectedIssueIds}
          onIssueSelect={handleIssueSelect}
          onAddIssue={onAddIssue}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ThemesCategoryTabs;
