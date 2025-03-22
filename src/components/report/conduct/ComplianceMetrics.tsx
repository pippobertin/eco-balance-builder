
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ComplianceForm from './compliance/ComplianceForm';
import { SaveButton, ComplianceHeader } from './compliance';
import { useComplianceData, useComplianceLoad, useComplianceSave } from './compliance/hooks';
import AutoSaveIndicator from '@/components/report/AutoSaveIndicator';
import { useReport } from '@/context/ReportContext';

interface ComplianceMetricsProps {
  reportId: string;
}

const ComplianceMetrics: React.FC<ComplianceMetricsProps> = ({ reportId }) => {
  const { formData, setFormData, isLoading, setIsLoading } = useComplianceData(reportId);
  const { needsSaving, lastSaved } = useReport();
  const { saveData, isSaving } = useComplianceSave(reportId, formData);
  
  // Load data
  useComplianceLoad(reportId, setFormData, setIsLoading);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <ComplianceHeader />
        <AutoSaveIndicator needsSaving={needsSaving} lastSaved={lastSaved} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Standard di conformità e monitoraggio</CardTitle>
        </CardHeader>
        <CardContent>
          <ComplianceForm reportId={reportId} />
          <SaveButton onClick={saveData} isLoading={isSaving} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceMetrics;
