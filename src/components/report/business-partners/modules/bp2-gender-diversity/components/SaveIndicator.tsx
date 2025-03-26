
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
  
  // Create a simpler display state that doesn't try to be too clever with state transitions
  // This helps ensure we show the correct state without overthinking it
  const [showSaved, setShowSaved] = useState(false);
  
  useEffect(() => {
    // When we complete a save operation (isSaving changes from true to false)
    if (isSaving === false && lastSaved) {
      console.log('SaveIndicator: Save completed, showing saved state');
      setShowSaved(true);
      // Only reset to unsaved state when user actually makes changes
    } 
    
    // If needsSaving becomes true, we're no longer in saved state
    if (needsSaving) {
      console.log('SaveIndicator: Changes detected, resetting saved state');
      setShowSaved(false);
    }
  }, [isSaving, needsSaving, lastSaved]);
  
  // Format the time since last save
  const formatSaveTime = () => {
    if (!lastSaved) return "Non salvato";
    
    try {
      return formatDistanceToNow(lastSaved, { addSuffix: true, locale: it });
    } catch (error) {
      console.error("Error formatting date:", error, lastSaved);
      return "Invalid date";
    }
  };
  
  // Base class for all indicator states
  const baseClasses = "flex items-center text-sm px-3 py-1.5 rounded-md";
  
  // Check loading or saving state
  if (isLoading || isSaving) {
    return (
      <div className={`${baseClasses} text-blue-600 bg-blue-50 border border-blue-200`} data-testid="save-indicator-loading">
        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
        <span>{isSaving ? "Salvataggio in corso..." : "Caricamento..."}</span>
      </div>
    );
  }
  
  // If we're showing saved state and not in needsSaving state
  if (showSaved && !needsSaving && lastSaved) {
    return (
      <div className={`${baseClasses} text-green-600 bg-green-50 border border-green-200`} data-testid="save-indicator-saved">
        <Check className="h-4 w-4 mr-1" />
        <span>Salvato {formatSaveTime()}</span>
      </div>
    );
  }
  
  // Check unsaved changes
  if (needsSaving) {
    return (
      <div className={`${baseClasses} text-amber-600 bg-amber-50 border border-amber-200`} data-testid="save-indicator-unsaved">
        <Clock className="h-4 w-4 mr-1" />
        <span>Modifiche non salvate</span>
      </div>
    );
  }
  
  // If we have a last saved time but not showing saved state (fallback)
  if (lastSaved) {
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
