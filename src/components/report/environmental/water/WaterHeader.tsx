
import React from 'react';
import { Droplets, Info } from 'lucide-react';
import SectionAutoSaveIndicator from '../components/SectionAutoSaveIndicator';

interface WaterHeaderProps {
  reportId: string | undefined;
  isSaving: boolean;
  lastSaved: Date | null;
}

const WaterHeader: React.FC<WaterHeaderProps> = ({ reportId, isSaving, lastSaved }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center mb-2">
        <Droplets className="mr-2 h-5 w-5 text-blue-500" />
        <h3 className="text-xl font-semibold">B6 - Acqua</h3>
      </div>
      
      <SectionAutoSaveIndicator className="mb-4" />
      
      <div className="p-4 rounded-md mb-4 bg-blue-100">
        <div className="flex items-start">
          <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
          <p className="text-sm text-slate-600">
            Indica la quantità di acqua prelevata e consumata, e la percentuale di attività situate in aree 
            soggette a stress idrico. Lo stress idrico si verifica quando la domanda di acqua supera la 
            disponibilità o quando la scarsa qualità limita l'uso.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WaterHeader;
