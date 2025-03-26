
import React from 'react';
import { Clock, Loader2, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

interface SectionAutoSaveIndicatorProps {
  isLoading?: boolean;
  needsSaving?: boolean;
  lastSaved: Date | null;
  className?: string;
}

const SectionAutoSaveIndicator: React.FC<SectionAutoSaveIndicatorProps> = ({ 
  isLoading = false,
  needsSaving = false,
  lastSaved,
  className = ''
}) => {
  // Function to format time since last saved
  const formatSaveTime = () => {
    if (!lastSaved) return "Non salvato";
    
    try {
      // Use formatDistanceToNow to show elapsed time in readable form
      return formatDistanceToNow(lastSaved, { addSuffix: true, locale: it });
    } catch (error) {
      console.error("Error formatting date:", error, lastSaved);
      return "Data non valida";
    }
  };
  
  // Base class for all indicator states
  const baseClasses = "flex items-center text-sm px-3 py-1.5 rounded-md";
  
  // Check loading or saving state
  if (isLoading) {
    return (
      <div className={`${baseClasses} text-blue-600 bg-blue-50 border border-blue-200 ${className}`}>
        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
        <span>Salvataggio in corso...</span>
      </div>
    );
  }
  
  // Check for unsaved changes
  if (needsSaving) {
    return (
      <div className={`${baseClasses} text-amber-600 bg-amber-50 border border-amber-200 ${className}`}>
        <Clock className="h-4 w-4 mr-1" />
        <span>Modifiche non salvate</span>
      </div>
    );
  }
  
  // Check last save time
  if (lastSaved) {
    return (
      <div className={`${baseClasses} text-green-600 bg-green-50 border border-green-200 ${className}`}>
        <Check className="h-4 w-4 mr-1" />
        <span>Salvato {formatSaveTime()}</span>
      </div>
    );
  }
  
  // Default state
  return (
    <div className={`${baseClasses} text-gray-500 bg-gray-50 border border-gray-200 ${className}`}>
      <Clock className="h-4 w-4 mr-1" />
      <span>Non ancora salvato</span>
    </div>
  );
};

export default SectionAutoSaveIndicator;
