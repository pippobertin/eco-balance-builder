
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useComplianceData } from './hooks';

interface ComplianceFormProps {
  reportId: string;
}

const ComplianceForm: React.FC<ComplianceFormProps> = ({ reportId }) => {
  const { 
    formData, 
    setFormData, 
    isLoading
  } = useComplianceData(reportId);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return <div className="text-center py-6">Caricamento dati in corso...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="complianceStandards">Standard di conformità</Label>
        <Textarea
          id="complianceStandards"
          name="complianceStandards"
          placeholder="Descrivere gli standard di conformità adottati..."
          value={formData.complianceStandards}
          onChange={handleChange}
          className="min-h-[150px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="complianceMonitoring">Monitoraggio della conformità</Label>
        <Textarea
          id="complianceMonitoring"
          name="complianceMonitoring"
          placeholder="Descrivere le modalità di monitoraggio della conformità..."
          value={formData.complianceMonitoring}
          onChange={handleChange}
          className="min-h-[150px]"
        />
      </div>
    </div>
  );
};

export default ComplianceForm;
