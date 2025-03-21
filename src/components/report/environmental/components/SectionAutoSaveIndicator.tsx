
import React from 'react';
import { useReport } from '@/hooks/use-report-context';
import AutoSaveIndicator from '../../AutoSaveIndicator';

interface SectionAutoSaveIndicatorProps {
  className?: string;
}

const SectionAutoSaveIndicator: React.FC<SectionAutoSaveIndicatorProps> = ({ 
  className = ''
}) => {
  const { needsSaving, lastSaved } = useReport();
  
  return (
    <div className={`flex justify-end mb-4 ${className}`}>
      <AutoSaveIndicator 
        needsSaving={needsSaving} 
        lastSaved={lastSaved} 
      />
    </div>
  );
};

export default SectionAutoSaveIndicator;
