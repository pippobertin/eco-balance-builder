
import React, { useEffect } from 'react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { useReport } from '@/hooks/use-report-context';
import ComplianceForm from './compliance/ComplianceForm';
import ComplianceHeader from './compliance/ComplianceHeader';
import AutoSaveIndicator from '@/components/report/AutoSaveIndicator';
import { useComplianceData } from './compliance/hooks';

interface ComplianceMetricsProps {
  formValues?: any;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ComplianceMetrics: React.FC<ComplianceMetricsProps> = ({ formValues, handleChange }) => {
  const { currentReport } = useReport();
  const reportId = currentReport?.id;
  const { lastSaved, isSaving, formData, loadData } = useComplianceData(reportId || '');

  // Load data when the component mounts or reportId changes
  useEffect(() => {
    if (reportId) {
      console.log("ComplianceMetrics - Loading data for reportId:", reportId);
      loadData();
    }
  }, [reportId, loadData]);

  // Check if there are existing values in the parent form or use local state
  const displayValues = formValues?.conductMetrics || formData;

  return (
    <GlassmorphicCard>
      <div className="space-y-6">
        <ComplianceHeader />
        <AutoSaveIndicator needsSaving={isSaving} lastSaved={lastSaved} />
        
        <ComplianceForm 
          reportId={reportId} 
          formValues={displayValues}
          handleChange={handleChange}
        />
      </div>
    </GlassmorphicCard>
  );
};

export default ComplianceMetrics;
