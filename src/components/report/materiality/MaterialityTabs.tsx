
import React from 'react';
import { Button } from "@/components/ui/button";
import { Target, Users } from 'lucide-react';

interface MaterialityTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MaterialityTabs: React.FC<MaterialityTabsProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  return (
    <div className="flex space-x-2 mb-6">
      <Button 
        variant={activeTab === 'issues' ? 'default' : 'outline'} 
        onClick={() => setActiveTab('issues')}
      >
        <Target className="mr-2 h-5 w-5" />
        Questioni di Materialità
      </Button>
      <Button 
        variant={activeTab === 'stakeholders' ? 'default' : 'outline'} 
        onClick={() => setActiveTab('stakeholders')}
      >
        <Users className="mr-2 h-5 w-5" />
        Mappatura Stakeholder
      </Button>
    </div>
  );
};

export default MaterialityTabs;
