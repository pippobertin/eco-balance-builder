
import React from 'react';
import { useReport } from '@/hooks/use-report-context';
import AutoSaveIndicator from '../../AutoSaveIndicator';

interface SectionAutoSaveIndicatorProps {
  className?: string;
  lastSaved?: Date | null;
  needsSaving?: boolean; 
}

const SectionAutoSaveIndicator: React.FC<SectionAutoSaveIndicatorProps> = ({ 
  className = '',
  lastSaved,
  needsSaving: localNeedsSaving 
}) => {
  const { needsSaving: globalNeedsSaving } = useReport();
  
  // Use local needs saving state if provided, otherwise fall back to global state
  const needsSaving = localNeedsSaving !== undefined ? localNeedsSaving : globalNeedsSaving;
  
  return (
    <div className={`flex justify-end mb-4 ${className}`}>
      <AutoSaveIndicator 
        needsSaving={needsSaving} 
        lastSaved={lastSaved || null} 
        className="w-full"
      />
    </div>
  );
};

export default SectionAutoSaveIndicator;
