
import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Briefcase, 
  Users, 
  BarChart3, 
  Leaf, 
  Shield, 
  AlertTriangle, 
  Recycle, 
  FileText, 
  BadgeCheck, 
  Lightbulb,
  LifeBuoy 
} from 'lucide-react';

interface BPNavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BPNavigationTabs: React.FC<BPNavigationTabsProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  const tabs = [
    { id: 'bp1', label: 'BP1 - Ricavi settori', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'bp2', label: 'BP2 - Diversità genere', icon: <Users className="h-4 w-4" /> },
    { id: 'bp3', label: 'BP3 - Obiettivi GHG', icon: <Leaf className="h-4 w-4" /> },
    { id: 'bp4', label: 'BP4 - Piano climatico', icon: <Lightbulb className="h-4 w-4" /> },
    { id: 'bp5', label: 'BP5 - Rischi climatici', icon: <AlertTriangle className="h-4 w-4" /> },
    { id: 'bp6', label: 'BP6 - Rifiuti pericolosi', icon: <Recycle className="h-4 w-4" /> },
    { id: 'bp7', label: 'BP7 - Allineamento', icon: <Shield className="h-4 w-4" /> },
    { id: 'bp8', label: 'BP8 - Conformità', icon: <BadgeCheck className="h-4 w-4" /> },
    { id: 'bp9', label: 'BP9 - Violazioni', icon: <FileText className="h-4 w-4" /> },
    { id: 'bp10', label: 'BP10 - Equilibrio vita-lavoro', icon: <Briefcase className="h-4 w-4" /> },
    { id: 'bp11', label: 'BP11 - Apprendisti', icon: <LifeBuoy className="h-4 w-4" /> },
  ];

  return (
    <div className="bg-white rounded-md border shadow-sm p-1 mb-6">
      <ScrollArea className="w-full" orientation="horizontal">
        <div className="flex space-x-1 p-1 min-w-max">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className="flex items-center whitespace-nowrap"
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default BPNavigationTabs;
