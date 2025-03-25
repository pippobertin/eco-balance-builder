
import React from 'react';
import AutoSaveIndicator from '@/components/report/AutoSaveIndicator';

interface SectionAutoSaveIndicatorProps {
  needsSaving: boolean;
  lastSaved: Date | null;
  className?: string;
}

const SectionAutoSaveIndicator: React.FC<SectionAutoSaveIndicatorProps> = ({
  needsSaving,
  lastSaved,
  className = ''
}) => {
  return (
    <AutoSaveIndicator 
      needsSaving={needsSaving} 
      lastSaved={lastSaved} 
      className={className}
    />
  );
};

export default SectionAutoSaveIndicator;
