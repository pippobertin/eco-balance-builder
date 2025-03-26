
import React from 'react';
import AutoSaveIndicator from '../../AutoSaveIndicator';

interface SectionAutoSaveIndicatorProps {
  className?: string;
  lastSaved?: Date | null;
  needsSaving?: boolean; 
}

const SectionAutoSaveIndicator: React.FC<SectionAutoSaveIndicatorProps> = ({ 
  className = '',
  lastSaved = null,
  needsSaving = false 
}) => {
  return (
    <div className={`flex justify-end ${className}`}>
      <AutoSaveIndicator 
        needsSaving={needsSaving} 
        lastSaved={lastSaved} 
        className="w-full"
      />
    </div>
  );
};

export default SectionAutoSaveIndicator;
