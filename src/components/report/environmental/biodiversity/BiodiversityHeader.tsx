
import React from 'react';
import { Leaf, Info } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import SectionAutoSaveIndicator from '../../environmental/components/SectionAutoSaveIndicator';

interface BiodiversityHeaderProps {
  reportId?: string;
  isSaving: boolean;
  lastSaved: Date | null;
}

const BiodiversityHeader: React.FC<BiodiversityHeaderProps> = ({ 
  reportId, 
  isSaving, 
  lastSaved 
}) => {
  return (
    <>
      <div className="flex items-center mb-4">
        <Leaf className="mr-2 h-5 w-5 text-emerald-500" />
        <h3 className="text-xl font-semibold">B5 - Biodiversità e ecosistemi</h3>
      </div>
      
      <div className="space-y-6">
        <div className="p-4 rounded-md mb-4 bg-emerald-100">
          <div className="flex items-start">
            <Info className="mt-0.5 mr-2 h-4 w-4 text-emerald-600" />
            <p className="text-sm text-slate-600">
              Indica i dati relativi agli impatti sulla biodiversità, sugli ecosistemi e sull'uso del suolo. I dati sono espressi in ettari (ha).
            </p>
          </div>
        </div>
        
        {!reportId && (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Per registrare i dati sulla biodiversità è necessario prima salvare il report.
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

export default BiodiversityHeader;
