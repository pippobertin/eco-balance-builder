
import React from 'react';
import { Clock, Loader2, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

interface SaveIndicatorProps {
  isLoading: boolean;
  isSaving: boolean;
  needsSaving: boolean;
  lastSaved: Date | null;
}

const SaveIndicator: React.FC<SaveIndicatorProps> = ({ 
  isLoading,
  isSaving,
  needsSaving,
  lastSaved 
}) => {
  const formatSaveTime = () => {
    if (!lastSaved) return "Non salvato";
    return formatDistanceToNow(lastSaved, { addSuffix: true, locale: it });
  };
  
  if (isSaving) {
    return (
      <div className="flex items-center text-blue-600 text-sm">
        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
        <span>Salvataggio in corso...</span>
      </div>
    );
  }
  
  if (needsSaving) {
    return (
      <div className="flex items-center text-amber-600 text-sm">
        <Clock className="h-4 w-4 mr-1" />
        <span>Modifiche non salvate</span>
      </div>
    );
  }
  
  if (lastSaved) {
    return (
      <div className="flex items-center text-green-600 text-sm">
        <Check className="h-4 w-4 mr-1" />
        <span>Salvato {formatSaveTime()}</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center text-gray-500 text-sm">
      <Clock className="h-4 w-4 mr-1" />
      <span>Non ancora salvato</span>
    </div>
  );
};

export default SaveIndicator;
