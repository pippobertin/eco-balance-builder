
import React from 'react';
import { Clock } from 'lucide-react';

interface SectionAutoSaveIndicatorProps {
  lastSaved: Date | null;
  needsSaving: boolean;
}

const SectionAutoSaveIndicator: React.FC<SectionAutoSaveIndicatorProps> = ({ 
  lastSaved, 
  needsSaving 
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex items-center text-sm text-gray-500">
      <Clock className="h-4 w-4 mr-1" />
      {needsSaving ? (
        <span className="text-amber-600">Modifiche non salvate</span>
      ) : lastSaved ? (
        <span>Ultimo salvataggio: {formatTime(lastSaved)}</span>
      ) : (
        <span>Non ancora salvato</span>
      )}
    </div>
  );
};

export default SectionAutoSaveIndicator;
