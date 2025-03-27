
import React from 'react';
import { useReport } from '@/hooks/use-report-context';
import AutoSaveIndicator from './AutoSaveIndicator';

interface SectionAutoSaveIndicatorProps {
  className?: string;
  lastSaved?: Date | null;
  needsSaving?: boolean; 
  isLoading?: boolean;
}

const SectionAutoSaveIndicator: React.FC<SectionAutoSaveIndicatorProps> = ({ 
  className = '',
  lastSaved: localLastSaved,
  needsSaving: localNeedsSaving,
  isLoading: localIsLoading
}) => {
  const { needsSaving: globalNeedsSaving, lastSaved: globalLastSaved } = useReport();
  
  // Use local needs saving state if provided, otherwise fall back to global state
  const needsSaving = localNeedsSaving !== undefined ? localNeedsSaving : globalNeedsSaving;
  const lastSaved = localLastSaved || globalLastSaved;
  
  return (
    <div className={`flex justify-end mb-4 ${className}`}>
      <AutoSaveIndicator 
        needsSaving={needsSaving} 
        lastSaved={lastSaved} 
        className="w-full"
        isLoading={localIsLoading}
      />
    </div>
  );
};

export default SectionAutoSaveIndicator;
