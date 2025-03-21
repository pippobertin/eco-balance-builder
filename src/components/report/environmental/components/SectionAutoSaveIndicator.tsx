
import React from 'react';
import { useReport } from '@/hooks/use-report-context';
import AutoSaveIndicator from '../../AutoSaveIndicator';

interface SectionAutoSaveIndicatorProps {
  className?: string;
  lastSaved?: Date | null;
  needsSaving?: boolean; // Add this prop to match how we're using it
}

const SectionAutoSaveIndicator: React.FC<SectionAutoSaveIndicatorProps> = ({ 
  className = '',
  lastSaved,
  needsSaving: localNeedsSaving // Accept the prop
}) => {
  const { needsSaving: globalNeedsSaving } = useReport();
  
  // Use local needs saving state if provided, otherwise fall back to global state
  const needsSaving = localNeedsSaving !== undefined ? localNeedsSaving : globalNeedsSaving;
  
  return (
    <div className={`flex justify-end mb-4 ${className}`}>
      <AutoSaveIndicator 
        needsSaving={needsSaving} 
        lastSaved={lastSaved || null} 
        className="w-full bg-green-50 py-2 px-3 rounded-md"
      />
    </div>
  );
};

export default SectionAutoSaveIndicator;
