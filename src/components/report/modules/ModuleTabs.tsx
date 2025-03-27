
import React from 'react';
import { Button } from "@/components/ui/button";
import { Leaf, Users, Building2, FileText, Layers } from 'lucide-react';

interface ModuleTabsProps {
  activeSection: 'environmental' | 'social' | 'conduct' | 'narrative' | 'business-partners' | 'business-partners-alt';
  setActiveSection: React.Dispatch<React.SetStateAction<'environmental' | 'social' | 'conduct' | 'narrative' | 'business-partners' | 'business-partners-alt'>>;
  showNarrativeModule: boolean;
  showBusinessPartnersModule: boolean;
}

const ModuleTabs: React.FC<ModuleTabsProps> = ({
  activeSection,
  setActiveSection,
  showNarrativeModule,
  showBusinessPartnersModule
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button 
        variant={activeSection === 'environmental' ? 'default' : 'outline'} 
        onClick={() => setActiveSection('environmental')} 
        className="flex items-center"
      >
        <Leaf className="mr-2 h-4 w-4" />
        Ambiente
      </Button>
      <Button 
        variant={activeSection === 'social' ? 'default' : 'outline'} 
        onClick={() => setActiveSection('social')} 
        className="flex items-center"
      >
        <Users className="mr-2 h-4 w-4" />
        Sociale
      </Button>
      <Button 
        variant={activeSection === 'conduct' ? 'default' : 'outline'} 
        onClick={() => setActiveSection('conduct')} 
        className="flex items-center"
      >
        <Building2 className="mr-2 h-4 w-4" />
        Condotta
      </Button>
      {showNarrativeModule && (
        <Button 
          variant={activeSection === 'narrative' ? 'default' : 'outline'} 
          onClick={() => setActiveSection('narrative')} 
          className="flex items-center"
        >
          <FileText className="mr-2 h-4 w-4" />
          Narrativo-PAT
        </Button>
      )}
      {/* Hide "Partner Commerciali" button but keep "Partner (Alt)" button */}
      {showBusinessPartnersModule && (
        <Button 
          variant={activeSection === 'business-partners-alt' ? 'default' : 'outline'} 
          onClick={() => setActiveSection('business-partners-alt')} 
          className="flex items-center"
        >
          <Layers className="mr-2 h-4 w-4" />
          Business Partner
        </Button>
      )}
    </div>
  );
};

export default ModuleTabs;
