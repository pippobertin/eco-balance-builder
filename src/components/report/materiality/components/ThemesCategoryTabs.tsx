import React, { useState, useEffect } from 'react';
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

  // Get all issues categorized by ESG type
  const { environmental, social, governance } = React.useMemo(() => 
    getIssuesByCategory(), []);

  // Use provided issues or default to categorized predefined issues
  const envIssues = environmentalIssues || environmental;
  const socIssues = socialIssues || social;
  const govIssues = governanceIssues || governance;

  // Keep track of all available issues across all tabs
  const allIssues = React.useMemo(() => [...envIssues, ...socIssues, ...govIssues], 
    [envIssues, socIssues, govIssues]);

  const handleIssueSelect = (issue: MaterialityIssue) => {
    if (onIssueSelect) {
      console.log("ThemesCategoryTabs handling issue selection:", issue.id);
      // Create a new copy of the issue to avoid reference issues
      const issueCopy = { ...issue };
      // Explicitly set isMaterial to true (boolean) when selecting an issue
      issueCopy.isMaterial = true;
      console.log("Setting issue as material:", issueCopy.id, issueCopy.isMaterial, typeof issueCopy.isMaterial);
      onIssueSelect(issueCopy);
    }
  };

  // Log the selected issue IDs whenever they change
  useEffect(() => {
    console.log("ThemesCategoryTabs - selected issue IDs:", Array.from(selectedIssueIds));
  }, [selectedIssueIds]);

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
          allAvailableIssues={allIssues}
        />
      </TabsContent>
      
      <TabsContent value="social" className="mt-4">
        <ThemesTabContent 
          issues={socIssues}
          selectedIssueIds={selectedIssueIds}
          onIssueSelect={handleIssueSelect}
          onAddIssue={onAddIssue}
          allAvailableIssues={allIssues}
        />
      </TabsContent>
      
      <TabsContent value="governance" className="mt-4">
        <ThemesTabContent 
          issues={govIssues}
          selectedIssueIds={selectedIssueIds}
          onIssueSelect={handleIssueSelect}
          onAddIssue={onAddIssue}
          allAvailableIssues={allIssues}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ThemesCategoryTabs;
