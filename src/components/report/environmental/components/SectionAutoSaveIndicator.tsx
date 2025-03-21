
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
        className="w-full bg-green-50 py-2 px-3 rounded-md"
      />
    </div>
  );
};

export default SectionAutoSaveIndicator;
