
import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionAutoSaveIndicatorProps {
  needsSaving: boolean;
  lastSaved: Date | null;
}

export const SectionAutoSaveIndicator: React.FC<SectionAutoSaveIndicatorProps> = ({
  needsSaving,
  lastSaved
}) => {
  return (
    <div 
      className={cn(
        "flex items-center text-xs gap-1 transition-all",
        needsSaving ? "text-amber-500" : "text-green-500"
      )}
    >
      {needsSaving ? (
        <>
          <Clock className="h-3 w-3" />
          <span>Modifiche non salvate</span>
        </>
      ) : (
        <>
          <CheckCircle className="h-3 w-3" />
          <span>
            {lastSaved 
              ? `Salvato ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
              : 'Nessuna modifica'}
          </span>
        </>
      )}
    </div>
  );
};
