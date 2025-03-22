
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { useReport } from '@/context/ReportContext';
import { ComplianceHeader, ComplianceForm, SaveButton } from './compliance';
import { useComplianceData, useComplianceLoad, useComplianceSave } from './compliance/hooks';

interface ComplianceMetricsProps {
  reportId: string;
}

const ComplianceMetrics: React.FC<ComplianceMetricsProps> = ({ reportId }) => {
  const { formData, setFormData, isLoading, setIsLoading } = useComplianceData(reportId);
  const { lastSaved } = useReport();
  const { saveData, isSaving } = useComplianceSave(reportId, formData);

  // Load data
  useComplianceLoad(reportId, setFormData, setIsLoading);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) {
    return <div className="text-center py-6">Caricamento dati in corso...</div>;
  }

  return (
    <GlassmorphicCard>
      <ComplianceHeader isSaving={isSaving} lastSaved={lastSaved} />
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="complianceStandards">Standard di condotta adottati</Label>
          <Textarea
            id="complianceStandards"
            name="complianceStandards"
            placeholder="Descrivi gli standard di condotta adottati dall'impresa (es. codice etico, politiche aziendali)"
            value={formData.complianceStandards}
            onChange={handleChange}
            className="min-h-[120px]"
          />
        </div>

        <div>
          <Label htmlFor="complianceMonitoring">Monitoraggio della compliance</Label>
          <Textarea
            id="complianceMonitoring"
            name="complianceMonitoring"
            placeholder="Descrivi come viene monitorato il rispetto degli standard di condotta (es. audit, whistleblowing, formazione)"
            value={formData.complianceMonitoring}
            onChange={handleChange}
            className="min-h-[120px]"
          />
        </div>

        <div className="flex justify-end">
          <SaveButton onClick={saveData} isLoading={isSaving} />
        </div>
      </div>
    </GlassmorphicCard>
  );
};

export default ComplianceMetrics;
