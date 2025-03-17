import React from 'react';

// Helper to create a synthetic event for use with the setFormValues function
export const createSyntheticEvent = (name: string, value: any): React.ChangeEvent<HTMLInputElement> => {
  const event = {
    target: {
      name,
      value
    }
  } as React.ChangeEvent<HTMLInputElement>;
  return event;
};

// Helper to extract metrics data from form values
export const getMetricsData = (formValues: any) => {
  // If we're using location-specific metrics, we need to get the data from the specific location
  if (formValues.environmentalMetrics?.locationMetrics) {
    const locationMetrics = formValues.environmentalMetrics.locationMetrics;
    const currentMetricsObj = locationMetrics.find((lm: any) => lm.metrics);
    return currentMetricsObj?.metrics || {};
  }
  
  // Otherwise, use the global metrics
  return formValues.environmentalMetrics || {};
};
