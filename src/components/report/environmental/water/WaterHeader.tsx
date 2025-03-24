
import React from 'react';
import { Droplets, Info } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import SectionAutoSaveIndicator from '../../environmental/components/SectionAutoSaveIndicator';

interface WaterHeaderProps {
  reportId?: string;
  isSaving: boolean;
  lastSaved: Date | null;
}

const WaterHeader: React.FC<WaterHeaderProps> = ({ 
  reportId, 
  isSaving, 
  lastSaved 
}) => {
  return (
    <>
      <div className="flex items-center mb-4">
        <Droplets className="mr-2 h-5 w-5 text-blue-500" />
        <h3 className="text-xl font-semibold">B6 - Acqua</h3>
      </div>
      
      <div className="space-y-6">
        <div className="p-4 rounded-md mb-4 bg-blue-100">
          <div className="flex items-start">
            <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-600" />
            <p className="text-sm text-slate-600">
              Indica il prelievo idrico totale, e il consumo idrico (differenza tra prelievo e scarico). 
              I dati sono espressi in metri cubi (m³).
            </p>
          </div>
        </div>
        
        {!reportId && (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Per registrare i dati sulla gestione dell'acqua è necessario prima salvare il report.
            </AlertDescription>
          </Alert>
        )}

        <SectionAutoSaveIndicator 
          lastSaved={lastSaved} 
          needsSaving={Boolean(isSaving)} 
          className="mb-4" 
        />
      </div>
    </>
  );
};

export default WaterHeader;
