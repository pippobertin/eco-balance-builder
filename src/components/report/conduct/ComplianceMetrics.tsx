
import React, { useEffect, useState } from 'react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { useReport } from '@/hooks/use-report-context';
import ComplianceForm from './compliance/ComplianceForm';
import ComplianceHeader from './compliance/ComplianceHeader';
import AutoSaveIndicator from '@/components/report/AutoSaveIndicator';
import { Skeleton } from '@/components/ui/skeleton';
import SectionAutoSaveIndicator from '@/components/report/environmental/components/SectionAutoSaveIndicator';

interface ComplianceMetricsProps {
  formValues?: any;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ComplianceMetrics: React.FC<ComplianceMetricsProps> = ({ formValues, handleChange }) => {
  const { currentReport, needsSaving, lastSaved } = useReport();
  const reportId = currentReport?.id;
  const [localLastSaved, setLocalLastSaved] = useState<Date | null>(null);
  const [localNeedsSaving, setLocalNeedsSaving] = useState(false);

  // Use either context-provided values or local state for the save indicator
  const showNeedsSaving = handleChange ? needsSaving : localNeedsSaving;
  const showLastSaved = handleChange ? lastSaved : localLastSaved;

  return (
    <GlassmorphicCard>
      <div className="space-y-6">
        <ComplianceHeader />
        
        <SectionAutoSaveIndicator 
          lastSaved={showLastSaved} 
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
