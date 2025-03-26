
import React from 'react';
import { format } from 'date-fns';
import { Loader2, Check } from 'lucide-react';
import { it } from 'date-fns/locale';

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
    <div className={`flex items-center text-sm ${className}`}>
      {needsSaving ? (
        <div className="flex items-center text-amber-500">
          <Loader2 className="animate-spin h-4 w-4 mr-1" />
          <span>Modifiche non salvate</span>
        </div>
      ) : lastSaved ? (
        <div className="flex items-center text-green-500">
          <Check className="h-4 w-4 mr-1" />
          <span>Salvato {format(lastSaved, 'dd/MM/yyyy HH:mm:ss', { locale: it })}</span>
        </div>
      ) : null}
    </div>
  );
};

export default SectionAutoSaveIndicator;
