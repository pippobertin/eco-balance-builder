
import React, { useState } from 'react';
import EnergyMetrics from './EnergyMetrics';
import EmissionsMetrics from './EmissionsMetrics';
import PollutionSection from './pollution/PollutionSection';
import BiodiversitySection from './BiodiversitySection';
import MaterialResourcesSection from './MaterialResourcesSection';
import EnvironmentalNavigation from './EnvironmentalNavigation';
import { useSearchParams } from 'react-router-dom';

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
        return <EnergyMetrics reportId={reportId} />;
      case 'emissions':
        return <EmissionsMetrics reportId={reportId} />;
      case 'pollution':
        return <PollutionSection reportId={reportId} />;
      case 'biodiversity':
        return <BiodiversitySection reportId={reportId} />;
      case 'materials':
        return <MaterialResourcesSection reportId={reportId} />;
      default:
        return <EnergyMetrics reportId={reportId} />;
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
