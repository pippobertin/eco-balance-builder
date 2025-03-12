
import { useEffect } from 'react';
import { useReport } from '@/context/ReportContext';

interface UseAutoSaveMaterialityProps {
  materialityData: any;
}

export const useAutoSaveMateriality = ({ materialityData }: UseAutoSaveMaterialityProps) => {
  const { updateReportData } = useReport();

  // Instead of auto-saving, just make sure the data is updated in the report context
  useEffect(() => {
    if (materialityData) {
      console.log("Materiality data changed, updating report context...", materialityData);
      updateReportData({ materialityAnalysis: materialityData });
    }
  }, [materialityData, updateReportData]);
};
