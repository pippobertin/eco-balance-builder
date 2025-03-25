
import React from 'react';
import { Clock, Save } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

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
  // Format the last saved time
  const displayText = !lastSaved
    ? "Non salvato"
    : formatDistanceToNow(lastSaved, { addSuffix: true, locale: it });

  // Style based on save state
  const baseClasses = needsSaving
    ? 'flex items-center text-xs gap-1 px-2 py-1 rounded-md text-amber-600 bg-amber-50 border border-amber-200 font-medium'
    : 'flex items-center text-xs gap-1 px-2 py-1 rounded-md text-green-600 bg-green-50 border border-green-200 font-medium';

  return (
    <div className={`${baseClasses} ${className}`} style={{ minWidth: '200px' }}>
      {needsSaving ? (
        <>
          <Save className="h-3 w-3" />
          <span>Modifiche non salvate! Clicca su "Salva"</span>
        </>
      ) : (
        <>
          <Clock className="h-3 w-3" />
          <span>Salvato {displayText}</span>
        </>
      )}
    </div>
  );
};

export default SectionAutoSaveIndicator;
