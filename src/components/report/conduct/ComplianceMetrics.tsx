
import React from 'react';
import { ClipboardCheck } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { useReport } from '@/hooks/use-report-context';
import ComplianceForm from './compliance/ComplianceForm';
import ComplianceHeader from './compliance/ComplianceHeader';

interface ComplianceMetricsProps {
  formValues?: any;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ComplianceMetrics: React.FC<ComplianceMetricsProps> = ({ formValues, handleChange }) => {
  const { currentReport } = useReport();
  const reportId = currentReport?.id;

  return (
    <GlassmorphicCard>
      <div className="space-y-6">
        <ComplianceHeader />
        
        <ComplianceForm 
          reportId={reportId} 
          formValues={formValues}
          handleChange={handleChange}
        />
      </div>
    </GlassmorphicCard>
  );
};

export default ComplianceMetrics;
