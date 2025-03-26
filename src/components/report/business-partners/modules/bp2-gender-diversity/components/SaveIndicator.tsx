
import React, { useEffect, useState } from 'react';
import { Clock, Loader2, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

interface SaveIndicatorProps {
  isLoading: boolean;
  isSaving?: boolean;
  needsSaving: boolean;
  lastSaved: Date | null;
}

const SaveIndicator: React.FC<SaveIndicatorProps> = ({ 
  isLoading,
  isSaving = false,
  needsSaving,
  lastSaved 
}) => {
  console.log('SaveIndicator render:', { isLoading, isSaving, needsSaving, lastSaved: lastSaved ? lastSaved.toISOString() : null });
  
  // Local state to prevent flickering and maintain saved state
  const [displayState, setDisplayState] = useState({
    isLoading,
    isSaving,
    needsSaving,
    lastSaved
  });

  // Update local state only when props change significantly
  useEffect(() => {
    // When save operation completes (isSaving transitions from true to false)
    if (displayState.isSaving && !isSaving) {
      console.log('SaveIndicator: Save operation completed');
      setDisplayState({
        isLoading,
        isSaving,
        needsSaving: false, // Force needsSaving to false after saving
        lastSaved
      });
    } 
    // For other state transitions
    else if (
      displayState.isLoading !== isLoading ||
      displayState.isSaving !== isSaving ||
      // Only update if needsSaving becomes true or if lastSaved has changed
      (needsSaving && !displayState.needsSaving) ||
      (lastSaved && (!displayState.lastSaved || lastSaved.getTime() !== displayState.lastSaved.getTime()))
    ) {
      console.log('SaveIndicator: Updating display state due to prop changes');
      setDisplayState({ isLoading, isSaving, needsSaving, lastSaved });
    }
  }, [isLoading, isSaving, needsSaving, lastSaved]);
  
  // Format the time since last save
  const formatSaveTime = () => {
    if (!displayState.lastSaved) return "Non salvato";
    
    try {
      // Use formatDistanceToNow to show elapsed time in readable form
      return formatDistanceToNow(displayState.lastSaved, { addSuffix: true, locale: it });
    } catch (error) {
      console.error("Error formatting date:", error, displayState.lastSaved);
      return "Invalid date";
    }
  };
  
  // Base class for all indicator states
  const baseClasses = "flex items-center text-sm px-3 py-1.5 rounded-md";
  
  // Check loading or saving state
  if (displayState.isLoading || displayState.isSaving) {
    return (
      <div className={`${baseClasses} text-blue-600 bg-blue-50 border border-blue-200`} data-testid="save-indicator-loading">
        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
        <span>{displayState.isSaving ? "Salvataggio in corso..." : "Caricamento..."}</span>
      </div>
    );
  }
  
  // Check unsaved changes
  if (displayState.needsSaving) {
    return (
      <div className={`${baseClasses} text-amber-600 bg-amber-50 border border-amber-200`} data-testid="save-indicator-unsaved">
        <Clock className="h-4 w-4 mr-1" />
        <span>Modifiche non salvate</span>
      </div>
    );
  }
  
  // Check last saved
  if (displayState.lastSaved) {
    return (
      <div className={`${baseClasses} text-green-600 bg-green-50 border border-green-200`} data-testid="save-indicator-saved">
        <Check className="h-4 w-4 mr-1" />
        <span>Salvato {formatSaveTime()}</span>
      </div>
    );
  }
  
  // Default state
  return (
    <div className={`${baseClasses} text-gray-500 bg-gray-50 border border-gray-200`} data-testid="save-indicator-default">
      <Clock className="h-4 w-4 mr-1" />
      <span>Non ancora salvato</span>
    </div>
  );
};

export default SaveIndicator;
