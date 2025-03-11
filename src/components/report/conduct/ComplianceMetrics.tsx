
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShieldAlert, Info } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';

type ComplianceMetricsProps = {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const ComplianceMetrics = React.forwardRef<HTMLDivElement, ComplianceMetricsProps>(
  ({ formValues, handleChange }, ref) => {
    return (
      <GlassmorphicCard>
        <div className="flex items-center mb-4" ref={ref}>
          <ShieldAlert className="mr-2 h-5 w-5 text-yellow-500" />
          <h3 className="text-xl font-semibold">Compliance con standard di condotta</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 rounded-md mb-4 bg-blue-100">
            <div className="flex items-start">
              <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
              <p className="text-sm text-slate-600">
                Fornire informazioni sull'allineamento con principi e standard internazionali di condotta 
                delle imprese.
              </p>
            </div>
          </div>
          
          <div>
            <Label htmlFor="complianceStandards">Standard di compliance adottati</Label>
            <Textarea 
              id="complianceStandards" 
              name="complianceStandards" 
              placeholder="Indica se l'impresa aderisce a standard come le Linee guida dell'OCSE per le imprese multinazionali o i Principi guida delle Nazioni Unite su imprese e diritti umani." 
              value={formValues.conductMetrics?.complianceStandards || ""} 
              onChange={handleChange} 
              className="min-h-[120px]" 
            />
          </div>
          
          <div>
            <Label htmlFor="complianceMonitoring">Processi di monitoraggio della compliance</Label>
            <Textarea 
              id="complianceMonitoring" 
              name="complianceMonitoring" 
              placeholder="Descrivi i processi in essere per monitorare la compliance e i meccanismi per gestire lamentele e reclami." 
              value={formValues.conductMetrics?.complianceMonitoring || ""} 
              onChange={handleChange} 
              className="min-h-[120px]" 
            />
          </div>
        </div>
      </GlassmorphicCard>
    );
  }
);

ComplianceMetrics.displayName = "ComplianceMetrics";

export default ComplianceMetrics;
