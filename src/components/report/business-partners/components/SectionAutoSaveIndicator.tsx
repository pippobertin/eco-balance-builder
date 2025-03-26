
import React from 'react';
import { Clock, Loader2, Check } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface SectionAutoSaveIndicatorProps {
  lastSaved: Date | null;
  needsSaving: boolean;
  isLoading?: boolean;
  className?: string;
}

const SectionAutoSaveIndicator: React.FC<SectionAutoSaveIndicatorProps> = ({ 
  lastSaved, 
  needsSaving,
  isLoading = false,
  className = ''
}) => {
  const formatTime = (date: Date) => {
    try {
      return format(date, 'dd/MM/yyyy HH:mm', { locale: it });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "data non valida";
    }
  };

  return (
    <div className={`flex items-center text-sm ${className}`}>
      {needsSaving ? (
        <div className="flex items-center text-amber-600">
          <Clock className="h-4 w-4 mr-1" />
          <span>Modifiche non salvate</span>
        </div>
      ) : isLoading ? (
        <div className="flex items-center text-blue-600">
          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          <span>Salvataggio in corso...</span>
        </div>
      ) : lastSaved ? (
        <div className="flex items-center text-green-600">
          <Check className="h-4 w-4 mr-1" />
          <span>Ultimo salvataggio: {formatTime(lastSaved)}</span>
        </div>
      ) : (
        <div className="flex items-center text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>Non ancora salvato</span>
        </div>
      )}
    </div>
  );
};

export default SectionAutoSaveIndicator;
