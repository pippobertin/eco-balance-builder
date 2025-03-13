
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart2, List } from 'lucide-react';
import { MaterialityIssue } from '../../types';
import MaterialityMatrixChart from '../../MaterialityMatrixChart';

interface IssueTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
  issues: MaterialityIssue[];
}

const IssueTabs: React.FC<IssueTabsProps> = ({ 
  activeTab, 
  setActiveTab, 
  children,
  issues
}) => {
  return (
    <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="current" className="flex items-center">
          <List className="mr-2 h-4 w-4" />
          Temi Materialità
        </TabsTrigger>
        <TabsTrigger value="matrix" className="flex items-center">
          <BarChart2 className="mr-2 h-4 w-4" />
          Matrice di Materialità
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="current" className="space-y-4">
        {children}
      </TabsContent>
      
      <TabsContent value="matrix">
        <MaterialityMatrixChart issues={issues} />
      </TabsContent>
    </Tabs>
  );
};

export default IssueTabs;
