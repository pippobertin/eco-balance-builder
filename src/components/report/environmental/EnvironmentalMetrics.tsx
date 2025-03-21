
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PollutionSection from './PollutionSection';
import BiodiversitySection from './BiodiversitySection';
import MaterialResourcesSection from './MaterialResourcesSection';
import EnvironmentalNavigation from './EnvironmentalNavigation';

interface EnvironmentalMetricsProps {
  reportId?: string;
}

const EnvironmentalMetrics: React.FC<EnvironmentalMetricsProps> = ({ reportId }) => {
  const [searchParams] = useSearchParams();
  const initialField = searchParams.get('field');
  
  const [activeSection, setActiveSection] = useState<string>(
    initialField && ['energy', 'emissions', 'pollution', 'biodiversity', 'materials'].includes(initialField)
      ? initialField
      : 'energy'
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'energy':
        return <div>Energy Metrics Component (In Development)</div>;
      case 'emissions':
        return <div>Emissions Metrics Component (In Development)</div>;
      case 'pollution':
        return <PollutionSection reportId={reportId} />;
      case 'biodiversity':
        return <BiodiversitySection reportId={reportId} />;
      case 'materials':
        return <MaterialResourcesSection reportId={reportId} />;
      default:
        return <div>Energy Metrics Component (In Development)</div>;
    }
  };

  return (
    <div className="space-y-6">
      <EnvironmentalNavigation 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />
      
      {renderActiveSection()}
    </div>
  );
};

export default EnvironmentalMetrics;
