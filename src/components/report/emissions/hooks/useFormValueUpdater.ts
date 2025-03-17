
import React from 'react';
import { createSyntheticEvent } from '../utils/formUtils';

/**
 * Hook for updating form values in the parent component
 */
export const useFormValueUpdater = (
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void)
) => {
  // Emit value changes to parent component
  const updateFormValues = (name: string, value: any) => {
    if (typeof setFormValues === 'function') {
      if (setFormValues.length === 1) {
        // It's a location-specific metrics handler
        setFormValues(createSyntheticEvent(name, value));
      } else {
        // It's a global form handler (useState setter)
        (setFormValues as React.Dispatch<React.SetStateAction<any>>)((prev: any) => {
          return {
            ...prev,
            environmentalMetrics: {
              ...prev.environmentalMetrics,
              [name]: value
            }
          };
        });
      }
    }
  };

  return { updateFormValues };
};
