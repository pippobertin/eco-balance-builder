
import { useState, useCallback } from 'react';
import { ReportData, defaultReportData } from '../types';

export const useReportDataState = () => {
  const [reportData, setReportData] = useState<ReportData>(defaultReportData);
  const [needsSaving, setNeedsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Update report data
  const updateReportData = useCallback((newData: Partial<ReportData>) => {
    setReportData(prevData => {
      const updatedData = {
        ...prevData,
        ...newData,
        environmentalMetrics: {
          ...prevData.environmentalMetrics,
          ...(newData.environmentalMetrics || {})
        },
        socialMetrics: {
          ...prevData.socialMetrics,
          ...(newData.socialMetrics || {})
        },
        conductMetrics: {
          ...prevData.conductMetrics,
          ...(newData.conductMetrics || {})
        },
        materialityAnalysis: {
          ...prevData.materialityAnalysis,
          ...(newData.materialityAnalysis || {})
        },
        narrativePATMetrics: {
          ...prevData.narrativePATMetrics,
          ...(newData.narrativePATMetrics || {})
        }
      };
      
      console.log("Report data updated:", updatedData);
      return updatedData;
    });
    
    setNeedsSaving(true);
  }, []);

  // Reset report data
  const resetReportData = useCallback(() => {
    setReportData(defaultReportData);
    setNeedsSaving(false);
  }, []);

  return {
    reportData,
    setReportData,
    updateReportData,
    resetReportData,
    needsSaving,
    setNeedsSaving,
    lastSaved,
    setLastSaved
  };
};
