
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';

interface SectionAutoSaveIndicatorProps {
  lastSaved: Date | null;
  needsSaving: boolean;
  isAutoSaving?: boolean;
}

const SectionAutoSaveIndicator: React.FC<SectionAutoSaveIndicatorProps> = ({
  lastSaved,
  needsSaving,
  isAutoSaving = false,
}) => {
  return (
    <div className="text-sm text-gray-500">
      {isAutoSaving ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Salvataggio in corso...</span>
        </div>
      ) : needsSaving ? (
        <div className="text-amber-500">Modifiche non salvate</div>
      ) : lastSaved ? (
        <div>
          Ultimo salvataggio: {formatDistanceToNow(lastSaved, { addSuffix: true, locale: it })}
        </div>
      ) : (
        <div>Nessun salvataggio</div>
      )}
    </div>
  );
};

export default SectionAutoSaveIndicator;
