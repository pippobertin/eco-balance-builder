
import React, { useEffect, useState } from 'react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { useReport } from '@/hooks/use-report-context';
import ComplianceForm from './compliance/ComplianceForm';
import ComplianceHeader from './compliance/ComplianceHeader';
import { Skeleton } from '@/components/ui/skeleton';
import SectionAutoSaveIndicator from '@/components/report/environmental/components/SectionAutoSaveIndicator';

interface ComplianceMetricsProps {
  formValues?: any;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ComplianceMetrics: React.FC<ComplianceMetricsProps> = ({ formValues, handleChange }) => {
  const { currentReport } = useReport();
  const reportId = currentReport?.id;
  const [localLastSaved, setLocalLastSaved] = useState<Date | null>(null);
  const [localNeedsSaving, setLocalNeedsSaving] = useState(false);

  // Log any changes to report ID to help with debugging
  useEffect(() => {
    if (reportId) {
      console.log("ComplianceMetrics - reportId updated:", reportId);
    }
  }, [reportId]);

  return (
    <GlassmorphicCard>
      <div className="space-y-6">
        <ComplianceHeader />
        
        <SectionAutoSaveIndicator 
          lastSaved={localLastSaved} 
          className="mt-4"
        />
        
        {!reportId ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <ComplianceForm 
            reportId={reportId} 
            formValues={formValues?.conductMetrics || formValues}
            handleChange={handleChange}
            setLocalLastSaved={setLocalLastSaved}
            setLocalNeedsSaving={setLocalNeedsSaving}
          />
        )}
      </div>
    </GlassmorphicCard>
  );
};

export default ComplianceMetrics;
