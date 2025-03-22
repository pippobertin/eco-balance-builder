
import React from 'react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { useReport } from '@/hooks/use-report-context';
import ComplianceForm from './compliance/ComplianceForm';
import ComplianceHeader from './compliance/ComplianceHeader';
import AutoSaveIndicator from '@/components/report/AutoSaveIndicator';
import { Skeleton } from '@/components/ui/skeleton';

interface ComplianceMetricsProps {
  formValues?: any;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ComplianceMetrics: React.FC<ComplianceMetricsProps> = ({ formValues, handleChange }) => {
  const { currentReport, needsSaving, lastSaved } = useReport();
  const reportId = currentReport?.id;

  return (
    <GlassmorphicCard>
      <div className="space-y-6">
        <ComplianceHeader />
        
        {lastSaved && (
          <AutoSaveIndicator needsSaving={needsSaving} lastSaved={lastSaved} />
        )}
        
        {!reportId ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <ComplianceForm 
            reportId={reportId} 
            formValues={formValues}
            handleChange={handleChange}
          />
        )}
      </div>
    </GlassmorphicCard>
  );
};

export default ComplianceMetrics;
